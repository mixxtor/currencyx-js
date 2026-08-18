import type {
  CurrencyConfig,
  ConversionResult,
  ExchangeRatesResult,
  CurrencyCode,
  ConvertParams,
  ExchangeRatesParams,
  TRoundOptions,
} from '../types/index.js'
import { BaseCurrencyExchange } from '../exchanges/base_exchange.js'
import type { CurrencyExchangeContract } from '../contracts/currency_exchange.js'

/**
 * Main Currency Service Implementation
 */
export class CurrencyService<KnownExchanges extends Record<string, BaseCurrencyExchange> = Record<string, BaseCurrencyExchange>>
  extends BaseCurrencyExchange
  implements CurrencyExchangeContract
{
  #exchanges: Map<keyof KnownExchanges, KnownExchanges[keyof KnownExchanges]> = new Map()
  #currentExchangeName: keyof KnownExchanges
  #config: CurrencyConfig<KnownExchanges>
  base: CurrencyCode
  name: string = null as unknown as string

  constructor(config: CurrencyConfig<KnownExchanges>) {
    super()
    this.#config = config
    this.#initializeExchanges()
    this.#currentExchangeName = config.default

    const exchange = this.#exchanges.get(this.#currentExchangeName)
    this.base = exchange?.base || 'USD'
    this.name = exchange?.name || (null as unknown as string)
  }

  /**
   * Initialize exchanges based on configuration
   * Handles both exchange instances and factory functions
   */
  #initializeExchanges(): void {
    const exchanges = this.#config.exchanges

    for (const [name, exchange] of Object.entries(exchanges)) {
      // Check if exchange is a factory function
      if (typeof exchange === 'function') {
        // Call factory function to get exchange instance
        this.#exchanges.set(name as keyof KnownExchanges, (exchange as () => KnownExchanges[keyof KnownExchanges])())
      } else {
        // Exchange is already an instance
        this.#exchanges.set(name as keyof KnownExchanges, exchange as KnownExchanges[keyof KnownExchanges])
      }
    }
  }

  getList() {
    const exchange = this.#getActiveExchange()
    return exchange.getList()
  }

  /**
   * Convert currency amount
   */
  async convert(params: ConvertParams): Promise<ConversionResult> {
    const exchange = this.#getActiveExchange()
    return await exchange.convert(params)
  }

  /**
   * Get exchange rates
   *
   * `params.base` is forwarded to the exchange and NOT written onto it. It used to call
   * `exchange.setBase(params.base)` first, which is a permanent assignment on an object the
   * manager keeps for the lifetime of the process: one `latestRates({ base: 'JPY' })` silently
   * turned every later base-less call — in any other request — into a JPY-based one. Exchanges
   * resolve the per-call base through `resolveBase(params)`; `setBase()` remains the way to change
   * an exchange's own default.
   */
  async getExchangeRates(params?: ExchangeRatesParams): Promise<ExchangeRatesResult> {
    return await this.#getActiveExchange().latestRates(params)
  }

  async latestRates(params?: ExchangeRatesParams): Promise<ExchangeRatesResult> {
    return this.getExchangeRates(params)
  }

  async getConvertRate(from: CurrencyCode, to: CurrencyCode): Promise<number | undefined> {
    return this.#getActiveExchange().getConvertRate(from, to)
  }

  /**
   * Switch to a different exchange (type-safe)
   */
  use<ExchangeName extends keyof KnownExchanges>(exchange: ExchangeName): KnownExchanges[ExchangeName] {
    const exchangeName = exchange
    if (!this.#exchanges.has(exchangeName as keyof KnownExchanges)) {
      throw new Error(`Exchange '${exchangeName?.toString()}' is not configured`)
    }
    this.#currentExchangeName = exchangeName
    return this.#exchanges.get(exchangeName as keyof KnownExchanges) as KnownExchanges[ExchangeName]
  }

  /**
   * Read a configured exchange **without** switching the active one.
   *
   * `use()` doubles as a setter — it reassigns the active exchange for every later call on the
   * service — which is the wrong tool for "just give me that exchange for a second".
   */
  get<ExchangeName extends keyof KnownExchanges>(exchange: ExchangeName): KnownExchanges[ExchangeName] {
    const instance = this.#exchanges.get(exchange)
    if (!instance) {
      throw new Error(`Exchange '${exchange?.toString()}' is not configured`)
    }

    return instance as KnownExchanges[ExchangeName]
  }

  /**
   * Whether an exchange name is configured. Pairs with `getAvailableExchanges()` for user-land code
   * that offers a choice of exchanges instead of hard-coding the list.
   */
  has(exchange: PropertyKey): exchange is keyof KnownExchanges {
    return this.#exchanges.has(exchange as keyof KnownExchanges)
  }

  /**
   * Get current exchange name
   */
  getCurrentExchange() {
    return this.#currentExchangeName
  }

  /**
   * Get list of available exchanges
   */
  getAvailableExchanges(): (keyof KnownExchanges)[] {
    return Array.from(this.#exchanges.keys()) as (keyof KnownExchanges)[]
  }

  /**
   * Round currency value
   */
  round(value: number, options: TRoundOptions = { precision: 2, direction: 'up' }): number {
    const exchange = this.#getActiveExchange()
    return exchange.round(value, options)
  }

  /**
   * Get active exchange instance
   */
  #getActiveExchange(): KnownExchanges[keyof KnownExchanges] {
    if (!this.#currentExchangeName) {
      throw new Error('No exchange is currently selected')
    }

    const exchange = this.#exchanges.get(this.#currentExchangeName)
    if (!exchange) {
      throw new Error(`Exchange '${this.#currentExchangeName?.toString()}' is not available`)
    }

    return exchange
  }

  /**
   * Format currency value with proper locale
   *
   * @param {number} params.amount - Currency amount
   * @param {CurrencyCode} params.code - Currency code
   * @param {string} params.locale - Locale to use for formatting
   */
  formatCurrency(params: { amount: number; code: CurrencyCode; locale?: string }): string {
    const { amount, code: currencyCode, locale = 'en-US' } = params
    try {
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currencyCode,
      }).format(amount)
    } catch {
      // Fallback formatting
      return `${currencyCode} ${amount.toFixed(2)}`
    }
  }

  /**
   * Get supported currencies for current exchange
   */
  async getSupportedCurrencies(exchangeName: keyof KnownExchanges = this.#currentExchangeName): Promise<CurrencyCode[]> {
    if (!exchangeName) {
      return []
    }

    const exchangeInstance = this.#exchanges.get(exchangeName) as BaseCurrencyExchange
    if (!exchangeInstance) {
      return []
    }

    if ('getSupportedCurrencies' in exchangeInstance && typeof exchangeInstance.getSupportedCurrencies === 'function') {
      return await exchangeInstance.getSupportedCurrencies()
    }

    // Fallback to base currencies
    return exchangeInstance.currencies || []
  }
}
