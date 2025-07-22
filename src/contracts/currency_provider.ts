import type {
  CurrencyCode,
  ConversionResult,
  ExchangeRatesResult,
  ConvertParams,
  ExchangeRatesParams,
} from '../types/index.js'

/**
 * Main contract that all currency providers must implement
 */
export interface CurrencyProviderContract {
  /**
   * Provider name for identification
   */
  readonly name: string

  /**
   * Base currency code. Default is 'USD'.
   */
  base: CurrencyCode

  /**
   * Set base currency
   */
  setBase(currency: CurrencyCode): this

  /**
   * Set API key (if required by provider)
   */
  setKey(key: string): this

  /**
   * Get latest exchange rates
   */
  latestRates(params?: ExchangeRatesParams): Promise<ExchangeRatesResult>

  /**
   * Convert currency amount
   */
  convert(params: ConvertParams): Promise<ConversionResult>

  /**
   * Get conversion rate between two currencies
   */
  getConvertRate(from: CurrencyCode, to: CurrencyCode, currencyList?: Record<string, any>[]): Promise<number | undefined>

  /**
   * Round currency value
   */
  round(value: number, precision?: number): number

  /**
   * Get supported currencies
   */
  currencies: CurrencyCode[]
}
