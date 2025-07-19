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
  CurrencyCode
} from '../types/index.js'
import type { CurrencyProviderContract } from '../contracts/currency_provider.js'
import { GoogleFinanceProvider } from '../providers/google_finance.js'
import { FixerProvider } from '../providers/fixer.js'

/**
 * Abstract Currency Service Interface
 */
export abstract class CurrencyServiceAbstract<T extends CurrencyConfig<Record<string, any>> = CurrencyConfig<Record<string, any>>> {
  abstract convert(amount: number, from: CurrencyCode, to: CurrencyCode): Promise<ConversionResult>
  abstract getExchangeRates(base?: CurrencyCode, symbols?: CurrencyCode[]): Promise<ExchangeRatesResult>
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
export class CurrencyService<T extends CurrencyConfig<Record<string, any>> = CurrencyConfig<Record<string, any>>>
  implements CurrencyServiceAbstract<T> {

  private providers: Map<string, CurrencyProviderContract> = new Map()
  private currentProvider?: string
  private config: T

  constructor(config: T) {
    this.config = config
    this.initializeProviders()
    this.currentProvider = String(config.default)
  }

  /**
   * Initialize providers based on configuration
   */
  private initializeProviders(): void {
    const providers = this.config.providers

    for (const [name, config] of Object.entries(providers)) {
      let provider: CurrencyProviderContract

      switch (name) {
        case 'google':
          provider = new GoogleFinanceProvider(config)
          break
        case 'fixer':
          provider = new FixerProvider(config)
          break
        default:
          // For custom providers, assume they are already instantiated
          if (config && typeof config === 'object' && 'name' in config) {
            provider = config as CurrencyProviderContract
          } else {
            throw new Error(`Unknown provider: ${name}`)
          }
      }

      this.providers.set(name, provider)
    }
  }

  /**
   * Convert currency amount
   */
  async convert(amount: number, from: CurrencyCode, to: CurrencyCode): Promise<ConversionResult> {
    const provider = this.getActiveProvider()
    return await provider.convert(amount, from, to)
  }

  /**
   * Get exchange rates
   */
  async getExchangeRates(base?: CurrencyCode, symbols?: CurrencyCode[]): Promise<ExchangeRatesResult> {
    const provider = this.getActiveProvider()

    // Set base currency if provided
    if (base) {
      provider.setBase(base)
    }

    return await provider.latestRates(symbols)
  }

  /**
   * Switch to a different provider (type-safe)
   */
  use(provider: GetProviderNames<T>): void {
    const providerName = String(provider)
    if (!this.providers.has(providerName)) {
      throw new Error(`Provider '${providerName}' is not configured`)
    }
    this.currentProvider = providerName
  }

  /**
   * Get current provider name
   */
  getCurrentProvider(): GetProviderNames<T> | undefined {
    return this.currentProvider as GetProviderNames<T>
  }

  /**
   * Get list of available providers
   */
  getAvailableProviders(): GetProviderNames<T>[] {
    return Array.from(this.providers.keys()) as GetProviderNames<T>[]
  }

  /**
   * Check if a provider is healthy
   */
  async isHealthy(provider?: GetProviderNames<T>): Promise<boolean> {
    const providerName = provider ? String(provider) : this.currentProvider
    if (!providerName) {
      return false
    }

    const providerInstance = this.providers.get(providerName)
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
    if (!this.currentProvider) {
      throw new Error('No provider is currently selected')
    }

    const provider = this.providers.get(this.currentProvider)
    if (!provider) {
      throw new Error(`Provider '${this.currentProvider}' is not available`)
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

    for (const [name, provider] of this.providers) {
      const healthy = await provider.isHealthy()
      results.push({
        name,
        healthy,
        current: name === this.currentProvider
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
    const result = await this.convert(amount, from, to)

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
    const providerName = provider ? String(provider) : this.currentProvider
    if (!providerName) {
      return { healthy: false, error: 'No provider selected' }
    }

    const providerInstance = this.providers.get(providerName)
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
    const providerName = provider ? String(provider) : this.currentProvider
    if (!providerName) {
      return []
    }

    const providerInstance = this.providers.get(providerName)
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
