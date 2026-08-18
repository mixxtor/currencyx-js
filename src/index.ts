/**
 * CurrencyX
 *
 * Modern TypeScript currency converter with type inference
 * Fresh, clean, and optimized implementation
 */

// Types
export type {
  CurrencyCode,
  ConvertParams,
  ExchangeRatesParams,
  ConversionResult,
  ExchangeRatesResult,
  CurrencyInfo,
  GoogleFinanceConfig,
  FixerConfig,
  CurrencyConfig,
  CurrencyExchanges,
  CurrencyExchangeInstance,
  InferExchanges,
} from './types/index.js'

// Contracts
export type { CurrencyExchangeContract } from './contracts/currency_exchange.js'

// Exchanges
export { BaseCurrencyExchange, GoogleFinanceExchange, FixerExchange, createExchange } from './exchanges/index.js'
export type {
  ExchangeSpec,
  SpecExchange,
  ExchangeCallContext,
  FetchRatesContext,
  FetchRateContext,
  ConvertContext,
} from './exchanges/index.js'

// Services
export { CurrencyService } from './services/index.js'

// Configuration
export { defineConfig, exchanges } from './config/index.js'

// Errors — throw these from a spec callback to surface a typed failure
export {
  CurrencyError,
  ApiError,
  RateLimitError,
  ValidationError,
  InvalidCurrencyError,
  ConfigurationError,
  TimeoutError,
} from './errors.js'

// Factory
export { createCurrency } from './factory.js'

// Default export
export { CurrencyService as default } from './services/index.js'
