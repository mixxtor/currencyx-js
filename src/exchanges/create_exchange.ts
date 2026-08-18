/**
 * Spec-based exchange authoring.
 *
 * Writing an exchange by subclassing `BaseCurrencyExchange` means implementing `latestRates`,
 * `convert` and `getConvertRate` — and the three are largely the same code in every exchange:
 * cross-rate arithmetic, rebasing when the upstream publishes a fixed base, filtering when it
 * ignores `symbols`, wrapping into result objects, mapping failures. Only the request and the
 * response shape genuinely differ.
 *
 * `createExchange()` takes that difference — one `fetchRates` (a table) or one `fetchRate` (a
 * pair) — and returns a class with the rest already implemented, identically for every exchange.
 * The result is an ordinary `BaseCurrencyExchange` subclass: `instanceof`, `setBase`, `round`,
 * `getByCode` and the rest behave exactly as a hand-written one, and an exchange that outgrows the
 * spec can still be written by hand.
 */

import type {
  BaseConfig,
  CurrencyExchangeInstance,
  ConversionResult,
  ConvertParams,
  CurrencyCode,
  ExchangeRatesParams,
  ExchangeRatesResult,
} from '../types/index.js'
import { CurrencyError } from '../errors.js'
import { BaseCurrencyExchange } from './base_exchange.js'

/**
 * What every spec callback receives: the resolved config (defaults merged in) and a signal already
 * wired to `config.timeout`, so a spec never re-implements timeout handling.
 */
export interface ExchangeCallContext<Config extends BaseConfig> {
  config: Config
  signal: AbortSignal
}

export interface FetchRatesContext<Config extends BaseConfig> extends ExchangeCallContext<Config> {
  /** Base to quote against — already resolved, and equal to `upstream.base` when one is declared. */
  base: CurrencyCode
  /** Codes the caller asked for, or `undefined` for "everything". */
  codes?: CurrencyCode[]
  /** Every code the library knows, for APIs that require an explicit symbol list. */
  currencies: CurrencyCode[]
}

export interface FetchRateContext<Config extends BaseConfig> extends ExchangeCallContext<Config> {
  from: CurrencyCode
  to: CurrencyCode
}

export interface ConvertContext<Config extends BaseConfig> extends FetchRateContext<Config> {
  amount: number
}

export interface ExchangeSpec<Config extends BaseConfig> {
  /** Exchange name, as it appears in results and in `currency.use(...)`. */
  name: string

  /** Merged under the config passed to the constructor. `base` here is the exchange's default. */
  defaults?: Partial<Config>

  /**
   * What the upstream API actually does, so the generated class can compensate.
   */
  upstream?: {
    /**
     * The only base the API publishes. Declare it and every other base is derived locally by
     * dividing through `rates[base]` — which is what stops an EUR table being labelled USD.
     * Leave unset for an API that honours the requested base.
     */
    base?: CurrencyCode
    /**
     * Whether the API can restrict its response to the requested codes. `false` makes the
     * generated class filter the table itself. Default `true`.
     */
    supportsCodes?: boolean
  }

  /** Throw here for a config that cannot work (a missing API key, say). */
  validate?: (config: Config) => void

  /** Apply `setKey()` to the config. Without it, `setKey()` is a no-op, as on the base class. */
  setKey?: (config: Config, key: string) => void

  /**
   * Table mode: return "units of X per 1 base". Throw a {@link CurrencyError} to surface a typed
   * failure; anything else thrown becomes a `FETCH_ERROR`.
   */
  fetchRates?: (context: FetchRatesContext<Config>) => Promise<Record<string, number>>

  /**
   * Pair mode, for APIs that only quote one pair at a time. `latestRates` walks the requested
   * codes with it; `getConvertRate` calls it directly, so no cross-rate arithmetic happens.
   */
  fetchRate?: (context: FetchRateContext<Config>) => Promise<number | undefined>

  /**
   * Optional native conversion endpoint. Without it, `convert()` is `amount × getConvertRate()`.
   */
  convert?: (context: ConvertContext<Config>) => Promise<{ result: number; rate?: number }>
}

/**
 * Instance type the class {@link createExchange} returns.
 *
 * It is a mapped type over `BaseCurrencyExchange` rather than the class type itself, for one
 * reason: mapping strips `abstract`, so `class MyExchange extends createExchange({...}) {}` is a
 * concrete class. Referencing the abstract class directly would make TypeScript demand
 * `latestRates`/`convert`/`getConvertRate` again in every subclass — the exact boilerplate this
 * helper removes. The trade-off is that the protected helpers (`createExchangeRatesResult`,
 * `resolveBase`, …) are not visible inside such a subclass body; a class that needs them wants
 * `extends BaseCurrencyExchange` instead, which stays fully supported.
 */
export type SpecExchange<Config extends BaseConfig> = CurrencyExchangeInstance & { readonly config: Config }

const DEFAULT_TIMEOUT = 5000

/**
 * Turn a spec into a `BaseCurrencyExchange` subclass.
 *
 * @example
 * ```ts
 * export class MxExchange extends createExchange<MxConfig>({
 *   name: 'mx',
 *   defaults: { base: 'EUR', timeout: 5000 },
 *   upstream: { base: 'EUR', supportsCodes: false }, // publishes EUR only, ignores `symbols`
 *   validate: (config) => {
 *     if (!config.accessKey) throw new ConfigurationError('Mx exchange requires an accessKey')
 *   },
 *   setKey: (config, key) => (config.accessKey = key),
 *   async fetchRates({ config, signal }) {
 *     const url = new URL(config.baseUrl ?? 'https://example.test')
 *     url.searchParams.set('access_key', config.accessKey)
 *
 *     const response = await fetch(url, { signal })
 *     const data = await response.json()
 *     if (!response.ok || !data.success) {
 *       throw new CurrencyError(data.error ?? `HTTP ${response.status}`, response.status, 'API_ERROR')
 *     }
 *
 *     return data.rates
 *   },
 * }) {}
 * ```
 */
export function createExchange<Config extends BaseConfig = BaseConfig>(
  spec: ExchangeSpec<Config>,
): new (config?: Config) => SpecExchange<Config> {
  if (!spec.fetchRates && !spec.fetchRate) {
    throw new CurrencyError(`Exchange '${spec.name}' must declare fetchRates or fetchRate`, 500, 'configuration_error')
  }

  return class SpecBasedExchange extends BaseCurrencyExchange {
    readonly name = spec.name
    readonly config: Config

    constructor(config: Config = {} as Config) {
      super()
      this.config = { ...(spec.defaults ?? {}), ...config } as Config
      this.base = (this.config.base ?? spec.defaults?.base ?? 'USD') as CurrencyCode
      spec.validate?.(this.config)
    }

    setKey(key: string): this {
      spec.setKey?.(this.config, key)
      return this
    }

    async latestRates(params?: ExchangeRatesParams): Promise<ExchangeRatesResult> {
      const base = this.resolveBase(params)

      try {
        const rates = spec.fetchRates ? await this.#tableRates(base, params?.codes) : await this.#pairRates(base, params?.codes)

        return this.createExchangeRatesResult(base, rates)
      } catch (error) {
        return this.createExchangeRatesResult(base, {}, this.#toError(error, 'FETCH_ERROR', 'Failed to fetch exchange rates'))
      }
    }

    async convert(params: ConvertParams): Promise<ConversionResult> {
      const { amount, from, to } = params

      if (from === to) {
        return this.createConversionResult(amount, from, to, amount, 1.0)
      }

      try {
        if (spec.convert) {
          const { result, rate } = await spec.convert({
            config: this.config,
            signal: this.#signal(),
            from,
            to,
            amount,
          })

          return this.createConversionResult(amount, from, to, result, rate)
        }

        const rate = await this.getConvertRate(from, to)
        if (rate === undefined) {
          return this.createConversionResult(amount, from, to, undefined, undefined, {
            info: `Failed to get exchange rate for ${from}-${to}`,
            type: 'RATE_NOT_FOUND',
          })
        }

        return this.createConversionResult(amount, from, to, amount * rate, rate)
      } catch (error) {
        return this.createConversionResult(
          amount,
          from,
          to,
          undefined,
          undefined,
          this.#toError(error, 'CONVERSION_ERROR', 'Conversion failed'),
        )
      }
    }

    async getConvertRate(from: CurrencyCode, to: CurrencyCode): Promise<number | undefined> {
      if (from === to) {
        return 1.0
      }

      try {
        if (spec.fetchRate) {
          return await spec.fetchRate({
            config: this.config,
            signal: this.#signal(),
            from,
            to,
          })
        }

        // Table mode: one request covers both legs, so a cross rate costs no more than a direct one.
        const rates = await this.#tableRates(spec.upstream?.base ?? this.base, undefined)
        const fromRate = from === (spec.upstream?.base ?? this.base) ? 1 : rates[from]
        const toRate = to === (spec.upstream?.base ?? this.base) ? 1 : rates[to]

        return fromRate && toRate ? toRate / fromRate : undefined
      } catch (error) {
        console.error(`${spec.name}: failed to get conversion rate for ${from}-${to}:`, error)
        return undefined
      }
    }

    /**
     * Table mode: fetch once in whatever base the API publishes, then rebase and filter locally as
     * the upstream declaration requires.
     */
    async #tableRates(base: CurrencyCode, codes?: CurrencyCode[]): Promise<Record<string, number>> {
      const upstreamBase = spec.upstream?.base ?? base
      const supportsCodes = spec.upstream?.supportsCodes ?? true

      const fetched = await spec.fetchRates!({
        config: this.config,
        signal: this.#signal(),
        base: upstreamBase,
        codes: supportsCodes ? codes : undefined,
        currencies: this.currencies,
      })

      let rates = fetched
      if (upstreamBase !== base) {
        const divisor = rates[base]
        if (!divisor) {
          throw new CurrencyError(`Unsupported base currency: ${base}`, 400, 'UNSUPPORTED_CURRENCY')
        }

        rates = Object.fromEntries(Object.entries(rates).map(([code, rate]) => [code, rate / divisor]))
      }

      if (codes?.length) {
        rates = Object.fromEntries(Object.entries(rates).filter(([code]) => codes.includes(code as CurrencyCode)))
      }

      return rates
    }

    /**
     * Pair mode: the API quotes one pair per request, so build the table by walking the codes.
     */
    async #pairRates(base: CurrencyCode, codes?: CurrencyCode[]): Promise<Record<string, number>> {
      const rates: Record<string, number> = {}

      for (const code of codes?.length ? codes : this.currencies) {
        if (code === base) {
          rates[code] = 1.0
          continue
        }

        const rate = await spec.fetchRate!({
          config: this.config,
          signal: this.#signal(),
          from: base,
          to: code,
        })
        if (rate) {
          rates[code] = rate
        }
      }

      return rates
    }

    #signal(): AbortSignal {
      return AbortSignal.timeout(this.config.timeout ?? DEFAULT_TIMEOUT)
    }

    #toError(error: unknown, fallbackType: string, fallbackInfo: string) {
      if (error instanceof CurrencyError) {
        return { code: error.code, info: error.message, type: error.type }
      }

      return {
        info: error instanceof Error ? error.message : fallbackInfo,
        type: fallbackType,
      }
    }
  } as unknown as new (config?: Config) => SpecExchange<Config>
}
