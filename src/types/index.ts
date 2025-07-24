import type { CurrencyExchangeContract } from '../contracts/currency_exchange'

// Currency codes based on ISO 4217
export type CurrencyCode = string

/**
 * Parameters for currency conversion
 */
export interface ConvertParams {
  amount: number
  from: CurrencyCode
  to: CurrencyCode
}

/**
 * Parameters for getting exchange rates
 */
export interface ExchangeRatesParams {
  base?: CurrencyCode
  symbols?: CurrencyCode[]
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
  query: {
    from: CurrencyCode
    to: CurrencyCode
    amount: number
  }
  info: {
    timestamp: number
    rate?: number
  }
  date: string
  result?: number
}

/**
 * Exchange rates result
 */
export interface ExchangeRatesResult extends BaseResult {
  timestamp: number
  date: string
  base: CurrencyCode
  rates: Record<string, number>
}

/**
 * Currency information from the currency list
 */
export interface CurrencyInfo {
  code: CurrencyCode
  numeric_code: string
  name: string
  symbol: string
  round: number
  decimal: number
  delimiter: string
  short_format: string
  explicit_format: string
  countries: string[]
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
 * Main currency configuration interface
 */
export interface CurrencyConfig<T extends CurrencyExchanges = CurrencyExchanges> {
  /** Default provider to use for currency operations */
  default: keyof T
  /** Available currency exchanges configuration */
  exchanges: T
}

/**
 * Infer available provider names from configuration
 */
export type InferExchanges<T> = T extends CurrencyConfig<infer P> ? keyof P : never

/**
 * Provider registry for type augmentation
 */
export interface CurrencyExchanges { [K: string]: CurrencyExchangeContract }

/**
 * Helper to get provider names with fallback
 */
export type GetExchangeNames<T extends CurrencyConfig> = keyof CurrencyExchanges extends never ? InferExchanges<T> : keyof CurrencyExchanges
