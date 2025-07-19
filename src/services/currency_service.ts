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
  HealthCheckResult,
  CurrencyCode,
  ConvertParams,
  ExchangeRatesParams,
  CurrencyProviders
} from '../types/index.js'
import type { CurrencyProviderContract } from '../contracts/currency_provider.js'
import { GoogleFinanceProvider } from '../providers/google_finance.js'
import { FixerProvider } from '../providers/fixer.js'

/**
 * Abstract Currency Service Interface
 */
export abstract class CurrencyServiceAbstract<T extends CurrencyConfig<CurrencyProviders> = CurrencyConfig<CurrencyProviders>> {
  // Core methods with object parameters for clarity
  abstract convert(params: ConvertParams): Promise<ConversionResult>
  abstract getExchangeRates(params?: ExchangeRatesParams): Promise<ExchangeRatesResult>

  // Convenience methods for backward compatibility (only for core methods)
  async convertAmount(amount: number, from: CurrencyCode, to: CurrencyCode): Promise<ConversionResult> {
    return this.convert({ amount, from, to })
  }

  async getRates(base?: CurrencyCode, symbols?: CurrencyCode[]): Promise<ExchangeRatesResult> {
    return this.getExchangeRates({ base, symbols })
  }

  // Other methods keep simple positional parameters
  abstract use(provider: GetProviderNames<T>): void
  abstract getCurrentProvider(): GetProviderNames<T> | undefined
  abstract getAvailableProviders(): GetProviderNames<T>[]
  abstract isHealthy(provider?: GetProviderNames<T>): Promise<boolean>
  abstract round(value: number, precision?: number): number
  abstract formatCurrency(amount: number, currencyCode: CurrencyCode, locale?: string): string
  abstract convertAndFormat(amount: number, from: CurrencyCode, to: CurrencyCode, locale?: string): Promise<{
    original: string
    converted: string
    rate: number
  }>
  abstract getProvidersHealth(): Promise<Array<{
    name: string
    healthy: boolean
    current: boolean
  }>>
  abstract getProviderHealthInfo(provider?: GetProviderNames<T>): Promise<HealthCheckResult>
  abstract getSupportedCurrencies(provider?: GetProviderNames<T>): Promise<CurrencyCode[]>
}

/**
 * Main Currency Service Implementation
 */
export class CurrencyService<T extends CurrencyConfig<CurrencyProviders> = CurrencyConfig<CurrencyProviders>>
  extends CurrencyServiceAbstract<T> {

  #providers: Map<string, CurrencyProviderContract> = new Map()
  #currentProvider?: string
  #config: T

  constructor(config: T) {
    super()
    this.#config = config
    this.#initializeProviders()
    this.#currentProvider = String(config.default)
  }

  /**
   * Initialize providers based on configuration
   */
  #initializeProviders(): void {
    const providers = this.#config.providers

    for (const [name, config] of Object.entries(providers)) {
      let provider: CurrencyProviderContract

      switch (name) {
        case 'google':
          provider = new GoogleFinanceProvider(config)
          break
        case 'fixer':
          provider = new FixerProvider(config as any)
          break
        default:
          // For custom providers, assume they are already instantiated
          if (config && typeof config === 'object' && 'name' in config) {
            provider = config as CurrencyProviderContract
          } else {
            throw new Error(`Unknown provider: ${name}`)
          }
      }

      this.#providers.set(name, provider)
    }
  }

  /**
   * Convert currency amount
   */
  async convert(params: ConvertParams): Promise<ConversionResult> {
    const provider = this.getActiveProvider()
    return await provider.convert(params)
  }

  /**
   * Get exchange rates
   */
  async getExchangeRates(params?: ExchangeRatesParams): Promise<ExchangeRatesResult> {
    const provider = this.getActiveProvider()

    // Set base currency if provided
    if (params?.base) {
      provider.setBase(params.base)
    }

    return await provider.latestRates(params)
  }

  /**
   * Switch to a different provider (type-safe)
   */
  use(provider: GetProviderNames<T>): void {
    const providerName = String(provider)
    if (!this.#providers.has(providerName)) {
      throw new Error(`Provider '${providerName}' is not configured`)
    }
    this.#currentProvider = providerName
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
   * Check if a provider is healthy
   */
  async isHealthy(provider?: GetProviderNames<T>): Promise<boolean> {
    const providerName = provider ? String(provider) : this.#currentProvider
    if (!providerName) {
      return false
    }

    const providerInstance = this.#providers.get(providerName)
    if (!providerInstance) {
      return false
    }

    return await providerInstance.isHealthy()
  }

  /**
   * Round currency value
   */
  round(value: number, precision: number = 2): number {
    const provider = this.getActiveProvider()
    return provider.round(value, precision)
  }

  /**
   * Get active provider instance
   */
  private getActiveProvider(): CurrencyProviderContract {
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
   * Get all configured providers with their health status
   */
  async getProvidersHealth(): Promise<Array<{
    name: string
    healthy: boolean
    current: boolean
  }>> {
    const results = []

    for (const [name, provider] of this.#providers) {
      const healthy = await provider.isHealthy()
      results.push({
        name,
        healthy,
        current: name === this.#currentProvider
      })
    }

    return results
  }

  /**
   * Format currency value with proper locale
   */
  formatCurrency(amount: number, currencyCode: CurrencyCode, locale: string = 'en-US'): string {
    try {
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currencyCode
      }).format(amount)
    } catch {
      // Fallback formatting
      return `${currencyCode} ${amount.toFixed(2)}`
    }
  }

  /**
   * Convert and format in one step
   */
  async convertAndFormat(
    amount: number,
    from: CurrencyCode,
    to: CurrencyCode,
    locale: string = 'en-US'
  ): Promise<{
    original: string
    converted: string
    rate: number
  }> {
    const result = await this.convert({ amount, from, to })

    if (!result.success || result.result === undefined) {
      throw new Error(result.error?.info || 'Conversion failed')
    }

    return {
      original: this.formatCurrency(amount, from, locale),
      converted: this.formatCurrency(result.result, to, locale),
      rate: result.info.rate || 0
    }
  }

  /**
   * Get detailed health information for a provider
   */
  async getProviderHealthInfo(provider?: GetProviderNames<T>): Promise<HealthCheckResult> {
    const providerName = provider ? String(provider) : this.#currentProvider
    if (!providerName) {
      return { healthy: false, error: 'No provider selected' }
    }

    const providerInstance = this.#providers.get(providerName)
    if (!providerInstance) {
      return { healthy: false, error: 'Provider not found' }
    }

    if ('getHealthInfo' in providerInstance && typeof providerInstance.getHealthInfo === 'function') {
      return await providerInstance.getHealthInfo()
    }

    // Fallback to basic health check
    const healthy = await providerInstance.isHealthy()
    return { healthy }
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
