import type { BaseCurrencyExchange } from '../exchanges'

// Currency codes based on ISO 4217
import type { CountryCode, CurrencyCode, CurrencyInfo } from '../data/currencies'
export type { CountryCode, CurrencyCode, CurrencyInfo }

/**
 * Parameters for currency conversion
 * @param amount - The amount to convert
 * @param from - The source currency code (ISO 4217)
 * @param to - The target currency code (ISO 4217)
 */
export type ConvertParams = {
  amount: number
  from: CurrencyCode
  to: CurrencyCode
}

/**
 * Parameters for getting exchange rates
 */
export interface ExchangeRatesParams {
  base?: CurrencyCode
  codes?: CurrencyCode[]
}

/**
 * Base result interface for all operations
 */
export interface BaseResult {
  success: boolean
  error?: {
    code?: number
    info: string
    type?: string
  }
}

/**
 * Currency conversion result
 */
export interface ConversionResult extends BaseResult {
  query: ConvertParams
  info: {
    timestamp: number
    rate?: number
  }
  date: string
  result?: number
}

export type TRoundOptions = {
  precision: number;
  direction?: 'up' | 'down';
} & Record<string, number | string>;

/**
 * Exchange rates result
 */
export interface ExchangeRatesResult extends BaseResult {
  timestamp: number
  date: string
  base: CurrencyCode
  rates: Record<CurrencyCode, number>
}

/**
 * Provider configuration interfaces
 */
export interface BaseConfig extends Record<string, unknown> {
  base?: CurrencyCode
  timeout?: number
}

export interface GoogleFinanceConfig extends BaseConfig { }

export interface FixerConfig extends BaseConfig {
  accessKey: string
}

/**
 * A list of known currency exchanges inferred from the user config
 * This interface must be extended in user-land
 */
export interface CurrencyExchanges { }

/**
 * Main currency configuration interface
 */
export interface CurrencyConfig<KnownExchanges extends Record<keyof CurrencyExchanges, BaseCurrencyExchange>> {
  /** Default provider to use for currency operations */
  default: keyof KnownExchanges
  /** Available currency exchanges configuration */
  exchanges: KnownExchanges
}

/**
 * Infer available provider names from configuration
 */
export type InferExchanges<T> = T extends CurrencyConfig<infer P> ? keyof P : never
