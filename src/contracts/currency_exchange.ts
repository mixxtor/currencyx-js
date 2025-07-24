import type {
  CurrencyCode,
  ConversionResult,
  ExchangeRatesParams,
  ExchangeRatesResult,
  ConvertParams,
} from '../types/index.js'

/**
 * Main contract that all currency exchanges must implement
 */
export interface CurrencyExchangeContract {
  /**
   * Exchange name for identification
   */
  readonly name: string

  /**
   * Base currency code. Default is 'USD'.
   */
  base: CurrencyCode

  /**
   * Get supported currencies
   */
  currencies: CurrencyCode[]

  /**
   * Set base currency
   */
  setBase(currency: CurrencyCode): this

  /**
   * Set API key (if required by exchange)
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
}
