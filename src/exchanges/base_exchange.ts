/**
 * Base Currency Exchange
 *
 * Simplified abstract base class for all currency exchanges
 */

import type {
  CurrencyCode,
  ConversionResult,
  ExchangeRatesResult,
  ConvertParams,
  ExchangeRatesParams,
  CurrencyInfo,
  CountryCode,
} from '../types/index.js'
import type { CurrencyExchangeContract } from '../contracts/currency_exchange.js'
import { getList } from '../data/currencies.js'

export abstract class BaseCurrencyExchange implements CurrencyExchangeContract {
  /**
   * Exchange name - must be implemented by subclasses
   */
  abstract readonly name: string

  /**
   * Base currency code. Default is 'USD'.
   */
  public base: CurrencyCode = 'USD'

  /**
   * Get all supported currencies
   */
  public get currencies() {
    return getList().map(c => c.code)
  }

  /**
   * Get all currencies
   */
  getList() {
    return getList()
  }

  /**
   * Filter currencies by name
   */
  filterByName(name: CurrencyInfo['name']): CurrencyInfo[]
  filterByName(name: string) {
    return this.getList().filter((c) => c.name.includes(name))
  }

  /**
   * Filter currencies by country
   */
  filterByCountry(iso2: CountryCode) {
    return this.getList().filter(c => c.countries.find(c => c === iso2.toUpperCase()))
  }

  /**
   * Get currency info by country ISO2 code (e.g., 'US')
   */
  getByCountry(iso2: CountryCode): CurrencyInfo | undefined
  getByCountry(iso2: string) {
    return this.getList().find((c) => c.countries.find(c => c === iso2.toUpperCase()))
  }

  /**
   * Get currency info by ISO code (e.g., 'USD')
   */
  getByCode(code: CurrencyCode): CurrencyInfo | undefined
  getByCode(code: string) {
    return this.getList().find((c) => c.code === code)
  }

  /**
   * Get currency info by symbol (e.g., '$')
   */
  getBySymbol(symbol: CurrencyInfo['symbol']): CurrencyInfo | undefined
  getBySymbol(symbol: string) {
    return this.getList().find((c) => c.symbol === symbol)
  }

  /**
   * Get currency info by numeric code (e.g., '840')
   */
  getByNumericCode(numCode: CurrencyInfo['numeric_code']): CurrencyInfo | undefined
  getByNumericCode(numCode: string) {
    return this.getList().find((c) => c.numeric_code === numCode)
  }

  /**
   * Abstract method that retrieves the latest currency conversion rates.
   *
   * @param symbols - The currency codes to retrieve rates for.
   */
  abstract latestRates(params?: ExchangeRatesParams): Promise<ExchangeRatesResult>

  /**
   * Abstract method that retrieves the currency conversion rate.
   *
   * @param amount - The amount to convert.
   * @param from - The currency code to convert from.
   * @param to - The currency code to convert to. Defaults to 'USD'.
   */
  abstract convert(params: ConvertParams): Promise<ConversionResult>

  /**
   * Abstract method that retrieves the currency conversion rate.
   *
   * @param from - The currency code to convert from.
   * @param to - The currency code to convert to. Defaults to 'USD'.
   */
  abstract getConvertRate(from: CurrencyCode, to: CurrencyCode, currencyList?: CurrencyInfo[]): Promise<number | undefined>

  /**
   * Set base currency
   */
  setBase(currency: string): this
  setBase(currency: CurrencyCode): this {
    this.base = currency || 'USD'
    return this
  }

  /**
   * Set API key (default implementation - can be overridden)
   * Default does implementation does nothing.
   * Exchanges that need API keys should override this
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
