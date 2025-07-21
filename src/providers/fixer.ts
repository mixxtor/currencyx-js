/**
 * Fixer.io Provider
 *
 * Based on existing Fixer from providers/currency/services/fixer.ts
 */

import type {
  CurrencyCode,
  ConversionResult,
  ExchangeRatesResult,
  FixerConfig,
  ExchangeRatesParams,
  ConvertParams,
} from '../types/index.js'
import { BaseCurrencyProvider } from './base_provider.js'

interface FixerResponse {
  success: boolean
  timestamp?: number
  base?: string
  date?: string
  rates?: Record<string, number>
  error?: {
    code: number
    info: string
    type: string
  }
}

interface FixerConvertResponse {
  success: boolean
  query?: {
    from: string
    to: string
    amount: number
  }
  info?: {
    timestamp: number
    rate: number
  }
  date?: string
  result?: number
  error?: {
    code: number
    info: string
    type: string
  }
}

export class FixerProvider extends BaseCurrencyProvider {
  readonly name = 'fixer'

  private baseUrl = 'http://data.fixer.io/api'
  private accessKey: string
  private timeout: number

  constructor(config: FixerConfig) {
    super()
    this.accessKey = config.accessKey
    this.base = config.base || 'EUR' // Fixer.io default base is EUR
    this.timeout = config.timeout || 5000
  }

  /**
   * Set API key
   */
  setKey(key: string): this {
    this.accessKey = key
    return this
  }

  /**
   * Get latest exchange rates
   */
  async latestRates(params?: ExchangeRatesParams): Promise<ExchangeRatesResult> {
    const symbols = params?.symbols
    try {
      const url = new URL(`${this.baseUrl}/latest`)
      url.searchParams.set('access_key', this.accessKey)
      url.searchParams.set('base', this.base)

      if (symbols && symbols.length > 0) {
        url.searchParams.set('symbols', symbols.join(','))
      }

      const response = await fetch(url.toString(), {
        signal: AbortSignal.timeout(this.timeout),
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data: FixerResponse = await response.json()

      if (!data.success) {
        return this.createExchangeRatesResult(
          this.base,
          {},
          {
            code: data.error?.code,
            info: data.error?.info || 'Unknown error from Fixer.io',
            type: data.error?.type || 'API_ERROR',
          }
        )
      }

      return this.createExchangeRatesResult(this.base, data.rates || {})
    } catch (error) {
      return this.createExchangeRatesResult(
        this.base,
        {},
        {
          info: error instanceof Error ? error.message : 'Failed to fetch exchange rates',
          type: 'FETCH_ERROR',
        }
      )
    }
  }

  /**
   * Convert currency amount
   */
  async convert(params: ConvertParams): Promise<ConversionResult> {
    const { amount, from, to } = params
    try {
      if (from === to) {
        return this.createConversionResult(amount, from, to, amount, 1.0)
      }

      const url = new URL(`${this.baseUrl}/convert`)
      url.searchParams.set('access_key', this.accessKey)
      url.searchParams.set('from', from)
      url.searchParams.set('to', to)
      url.searchParams.set('amount', amount.toString())

      const response = await fetch(url.toString(), {
        signal: AbortSignal.timeout(this.timeout),
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data: FixerConvertResponse = await response.json()

      if (!data.success) {
        return this.createConversionResult(amount, from, to, undefined, undefined, {
          code: data.error?.code,
          info: data.error?.info || 'Unknown error from Fixer.io',
          type: data.error?.type || 'API_ERROR',
        })
      }

      return this.createConversionResult(amount, from, to, data.result, data.info?.rate)
    } catch (error) {
      return this.createConversionResult(amount, from, to, undefined, undefined, {
        info: error instanceof Error ? error.message : 'Conversion failed',
        type: 'CONVERSION_ERROR',
      })
    }
  }

  /**
   * Get conversion rate between two currencies
   */
  async getConvertRate(from: CurrencyCode, to: CurrencyCode): Promise<number | undefined> {
    try {
      if (from === to) {
        return 1.0
      }

      // If one of the currencies is the base currency, we can use latest rates
      if (from === this.base) {
        const rates = await this.latestRates({ symbols: [to] })
        return rates.rates[to]
      }

      if (to === this.base) {
        const rates = await this.latestRates({ symbols: [from] })
        const rate = rates.rates[from]
        return rate ? 1 / rate : undefined
      }

      // For cross-currency conversion, get both rates against base
      const rates = await this.latestRates({ symbols: [from, to] })
      const fromRate = rates.rates[from]
      const toRate = rates.rates[to]

      if (fromRate && toRate) {
        return toRate / fromRate
      }

      return undefined
    } catch (error) {
      console.error(`Fixer: Failed to get conversion rate for ${from}-${to}:`, error)
      return undefined
    }
  }

  /**
   * Health check specific to Fixer.io
   */
  async isHealthy(): Promise<boolean> {
    try {
      if (!this.accessKey) {
        return false
      }

      const url = new URL(`${this.baseUrl}/latest`)
      url.searchParams.set('access_key', this.accessKey)
      url.searchParams.set('base', 'EUR')
      url.searchParams.set('symbols', 'USD')

      const response = await fetch(url.toString(), {
        signal: AbortSignal.timeout(this.timeout),
      })

      if (!response.ok) {
        return false
      }

      const data: FixerResponse = await response.json()
      return data.success && !!data.rates?.USD
    } catch {
      return false
    }
  }
}
