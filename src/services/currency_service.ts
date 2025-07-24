/**
 * Currency Service
 *
 * Main service class with type-safe exchange switching
 */

import type {
  CurrencyConfig,
  ConversionResult,
  ExchangeRatesResult,
  CurrencyCode,
  ConvertParams,
  ExchangeRatesParams,
} from '../types/index.js'
import type { CurrencyExchangeContract } from '../contracts/currency_exchange.js'

/**
 * Main Currency Service Implementation
 */
export class CurrencyService<KnownExchanges extends Record<string, CurrencyExchangeContract>> {
  #exchanges: Map<keyof KnownExchanges, KnownExchanges[keyof KnownExchanges]> = new Map()
  #currentExchange?: string
  #config: CurrencyConfig<KnownExchanges>

  constructor(config: CurrencyConfig<KnownExchanges>) {
    this.#config = config
    this.#initializeExchanges()
    this.#currentExchange = String(config.default)
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
        this.#exchanges.set(name, (exchange as () => KnownExchanges[keyof KnownExchanges])())
      } else {
        // Exchange is already an instance
        this.#exchanges.set(name, exchange as KnownExchanges[keyof KnownExchanges])
      }
    }
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
   */
  async getExchangeRates(params?: ExchangeRatesParams): Promise<ExchangeRatesResult> {
    const exchange = this.#getActiveExchange()

    // Set base currency if provided
    if (params?.base) {
      exchange.setBase(params.base)
    }

    return await exchange.latestRates(params)
  }

  /**
   * Convenience methods for backward compatibility
   */
  async convertAmount(amount: number, from: CurrencyCode, to: CurrencyCode): Promise<ConversionResult> {
    return this.convert({ amount, from, to })
  }

  async getRates(base?: CurrencyCode, symbols?: CurrencyCode[]): Promise<ExchangeRatesResult> {
    return this.getExchangeRates({ base, symbols })
  }

  /**
   * Switch to a different exchange (type-safe)
   */
  use<ExchangeName extends keyof KnownExchanges>(exchange: ExchangeName): KnownExchanges[ExchangeName] {
    const exchangeName = String(exchange)
    if (!this.#exchanges.has(exchangeName)) {
      throw new Error(`Exchange '${exchangeName}' is not configured`)
    }
    this.#currentExchange = exchangeName
    return this.#exchanges.get(exchangeName) as KnownExchanges[ExchangeName]
  }

  /**
   * Get current exchange name
   */
  getCurrentExchange() {
    return this.#currentExchange
  }

  /**
   * Get list of available exchanges
   */
  getAvailableExchanges() {
    return Array.from(this.#exchanges.keys())
  }

  /**
   * Round currency value
   */
  round(value: number, precision: number = 2): number {
    const exchange = this.#getActiveExchange()
    return exchange.round(value, precision)
  }

  /**
   * Get active exchange instance
   */
  #getActiveExchange(): CurrencyExchangeContract {
    if (!this.#currentExchange) {
      throw new Error('No exchange is currently selected')
    }

    const exchange = this.#exchanges.get(this.#currentExchange)
    if (!exchange) {
      throw new Error(`Exchange '${this.#currentExchange}' is not available`)
    }

    return exchange
  }

  /**
   * Format currency value with proper locale
   */
  formatCurrency(amount: number, currencyCode: CurrencyCode, locale: string = 'en-US'): string {
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
  async getSupportedCurrencies(exchange?: keyof KnownExchanges): Promise<CurrencyCode[]> {
    const exchangeName = exchange ? String(exchange) : this.#currentExchange
    if (!exchangeName) {
      return []
    }

    const exchangeInstance = this.#exchanges.get(exchangeName)
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
