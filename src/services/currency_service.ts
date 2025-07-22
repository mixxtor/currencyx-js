/**
 * Currency Service
 *
 * Main service class with type-safe provider switching
 */

import type {
  CurrencyConfig,
  GetProviderNames,
  ConversionResult,
  ExchangeRatesResult,
  CurrencyCode,
  ConvertParams,
  ExchangeRatesParams,
  CurrencyProviders,
} from '../types/index.js'
import type { CurrencyProviderContract } from '../contracts/currency_provider.js'

// Removed CurrencyServiceAbstract - unnecessary abstraction with only one implementation

/**
 * Main Currency Service Implementation
 */
export class CurrencyService<
  T extends CurrencyConfig<CurrencyProviders> = CurrencyConfig<CurrencyProviders>,
> {
  #providers: Map<string, CurrencyProviderContract> = new Map()
  #currentProvider?: string
  #config: T

  constructor(config: T) {
    this.#config = config
    this.#initializeProviders()
    this.#currentProvider = String(config.default)
  }

  /**
   * Initialize providers based on configuration
   * Handles both provider instances and factory functions
   */
  #initializeProviders(): void {
    const providers = this.#config.providers

    for (const [name, provider] of Object.entries(providers)) {
      // Check if provider is a factory function
      if (typeof provider === 'function') {
        // Call factory function to get provider instance
        this.#providers.set(name, (provider as () => CurrencyProviderContract)())
      } else {
        // Provider is already an instance
        this.#providers.set(name, provider)
      }
    }
  }

  /**
   * Convert currency amount
   */
  async convert(params: ConvertParams): Promise<ConversionResult> {
    const provider = this.#getActiveProvider()
    return await provider.convert(params)
  }

  /**
   * Get exchange rates
   */
  async getExchangeRates(params?: ExchangeRatesParams): Promise<ExchangeRatesResult> {
    const provider = this.#getActiveProvider()

    // Set base currency if provided
    if (params?.base) {
      provider.setBase(params.base)
    }

    return await provider.latestRates(params)
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
   * Switch to a different provider (type-safe)
   */
  use<K extends keyof CurrencyProviders>(provider: K): CurrencyProviders[K] {
    const providerName = String(provider)
    if (!this.#providers.has(providerName)) {
      throw new Error(`Provider '${providerName}' is not configured`)
    }
    this.#currentProvider = providerName
    return this.#providers.get(providerName) as CurrencyProviders[K]
  }

  /**
   * Get current provider name
   */
  getCurrentProvider(): GetProviderNames<T> | undefined {
    return this.#currentProvider as GetProviderNames<T>
  }

  /**
   * Get list of available providers
   */
  getAvailableProviders(): GetProviderNames<T>[] {
    return Array.from(this.#providers.keys()) as GetProviderNames<T>[]
  }

  /**
   * Round currency value
   */
  round(value: number, precision: number = 2): number {
    const provider = this.#getActiveProvider()
    return provider.round(value, precision)
  }

  /**
   * Get active provider instance
   */
  #getActiveProvider(): CurrencyProviderContract {
    if (!this.#currentProvider) {
      throw new Error('No provider is currently selected')
    }

    const provider = this.#providers.get(this.#currentProvider)
    if (!provider) {
      throw new Error(`Provider '${this.#currentProvider}' is not available`)
    }

    return provider
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
   * Get supported currencies for current provider
   */
  async getSupportedCurrencies(provider?: GetProviderNames<T>): Promise<CurrencyCode[]> {
    const providerName = provider ? String(provider) : this.#currentProvider
    if (!providerName) {
      return []
    }

    const providerInstance = this.#providers.get(providerName)
    if (!providerInstance) {
      return []
    }

    if ('getSupportedCurrencies' in providerInstance && typeof providerInstance.getSupportedCurrencies === 'function') {
      return await providerInstance.getSupportedCurrencies()
    }

    // Fallback to base currencies
    return providerInstance.currencies || []
  }
}
