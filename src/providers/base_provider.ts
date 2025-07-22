/**
 * Base Currency Provider
 *
 * Simplified abstract base class for all currency providers
 */

import type {
  CurrencyCode,
  ConversionResult,
  ExchangeRatesResult,
  ConvertParams,
  ExchangeRatesParams,
  CurrencyInfo,
} from '../types/index.js'
import type { CurrencyProviderContract } from '../contracts/currency_provider.js'
import { getCommonCurrencyCodes } from '../data/currencies.js'

export abstract class BaseCurrencyProvider implements CurrencyProviderContract {
  /**
   * Provider name - must be implemented by subclasses
   */
  abstract readonly name: string

  /**
   * Base currency code. Default is 'USD'.
   */
  public base: CurrencyCode = 'USD'

  /**
   * Get all supported currencies
   */
  public get currencies(): CurrencyCode[] {
    return getCommonCurrencyCodes()
  }

  /**
   * Set supported currencies (for testing/configuration)
   */
  public set currencies(_value: CurrencyCode[]) {
    // This setter is mainly for compatibility with tests
    // In practice, currencies are derived from COMMON_CURRENCIES
  }

  /**
   * Abstract methods that must be implemented by subclasses
   */
  abstract latestRates(params?: ExchangeRatesParams): Promise<ExchangeRatesResult>
  abstract convert(params: ConvertParams): Promise<ConversionResult>
  abstract getConvertRate(from: CurrencyCode, to: CurrencyCode, currencyList?: CurrencyInfo[]): Promise<number | undefined>

  /**
   * Set base currency
   */
  setBase(currency: CurrencyCode): this {
    this.base = currency
    return this
  }

  /**
   * Set API key (default implementation - can be overridden)
   * Default does implementation does nothing.
   * Providers that need API keys should override this
   */
  setKey(_key: string): this {
    return this
  }

  /**
   * Round currency value according to currency rules
   */
  round(value: number, precision?: number): number {
    if (precision !== undefined) {
      return Math.round(value * Math.pow(10, precision)) / Math.pow(10, precision)
    }

    // Use default precision of 2 decimal places
    return Math.round(value * 100) / 100
  }

  /**
   * Create standardized conversion result
   */
  protected createConversionResult(
    amount: number,
    from: CurrencyCode,
    to: CurrencyCode,
    result?: number,
    rate?: number,
    error?: { code?: number; info: string; type?: string }
  ): ConversionResult {
    return {
      success: !error && result !== undefined,
      query: { from, to, amount },
      info: { timestamp: Date.now(), rate },
      date: new Date().toISOString(),
      result,
      error,
    }
  }

  /**
   * Create standardized exchange rates result
   */
  protected createExchangeRatesResult(
    base: CurrencyCode,
    rates: Record<string, number>,
    error?: { code?: number; info: string; type?: string }
  ): ExchangeRatesResult {
    return {
      success: !error && Object.keys(rates).length > 0,
      timestamp: Date.now(),
      date: new Date().toISOString(),
      base,
      rates,
      error,
    }
  }


}
