/**
 * Core Types for CurrencyX.js
 * 
 * Based on existing currency provider structure
 */

// Currency codes based on ISO 4217
export type CurrencyCode = string

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
 * Provider health check result
 */
export interface HealthCheckResult {
  healthy: boolean
  latency?: number
  error?: string
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
export interface GoogleFinanceConfig {
  base?: CurrencyCode
  timeout?: number
}

export interface FixerConfig {
  accessKey: string
  base?: CurrencyCode
  timeout?: number
}



/**
 * Main currency configuration interface
 */
export interface CurrencyConfig<T extends Record<string, any> = Record<string, any>> {
  /** Default provider to use for currency operations */
  default: keyof T
  /** Available currency providers configuration */
  providers: T
}

/**
 * Infer available provider names from configuration
 */
export type InferProviders<T> = T extends CurrencyConfig<infer P> ? keyof P : never

/**
 * Infer default provider from configuration
 */
export type InferDefaultProvider<T extends CurrencyConfig> = T extends {
  default: infer D
} ? D : never

/**
 * Provider registry for type augmentation
 */
export interface CurrencyProviders {}

/**
 * Helper to get provider names with fallback
 */
export type GetProviderNames<T extends CurrencyConfig> =
  keyof CurrencyProviders extends never
    ? InferProviders<T>
    : keyof CurrencyProviders
