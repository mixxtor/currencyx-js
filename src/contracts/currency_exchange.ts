import type {
  CurrencyCode,
  ConversionResult,
  ExchangeRatesParams,
  ExchangeRatesResult,
  ConvertParams,
  CurrencyInfo,
  TRoundOptions,
} from '../types/index.js'

/**
 * Main contract that all currency exchanges must implement
 */
export interface CurrencyExchangeContract {
  /**
   * Base currency code. Default is 'USD'.
   */
  base: CurrencyCode

  /**
   * Get supported currencies
   */
  getList(): CurrencyInfo[]

  /**
   * Set base currency
   */
  setBase?(currency: CurrencyCode): this

  /**
   * Set API key (if required by exchange)
   */
  setKey?(key: string): this

  /**
   * Retrieves the latest currency conversion rates.
   *
   * @param {ExchangeRatesParams} params - The parameters for getting exchange rates.
   * @param {CurrencyCode} params.base - The base currency code to retrieve rates for.
   * @param {CurrencyCode[]} params.codes - The currency codes to retrieve rates for.
   */
  latestRates(params?: ExchangeRatesParams): Promise<ExchangeRatesResult>

  /**
   * Retrieves the currency conversion rate.
   *
   * @param {ConvertParams} params - The parameters for converting currency.
   * @param {number} params.amount - The amount to convert.
   * @param {CurrencyCode} params.from - The currency code to convert from.
   * @param {CurrencyCode} params.to - The currency code to convert to. Defaults to 'USD'.
   */
  convert(params: ConvertParams): Promise<ConversionResult>

  /**
   * Retrieves the currency conversion rate.
   *
   * @param {CurrencyCode} from - The currency code to convert from.
   * @param {CurrencyCode} to - The currency code to convert to. Defaults to 'USD'.
   */
  getConvertRate(from: CurrencyCode, to: CurrencyCode, currencyList?: Record<string, any>[]): Promise<number | undefined>

  /**
   * Round currency value
   *
   * @param {number} value - Currency value
   * @param {TRoundOptions} options
   * @param {number} options.precision - Decimal precision
   * @param {string} options.direction - Round direction
   */
  round(value: number, options?: TRoundOptions): number
}
