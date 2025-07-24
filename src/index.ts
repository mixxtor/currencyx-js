/**
 * CurrencyX.js
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
  InferExchanges,
} from './types/index.js'

// Contracts
export type { CurrencyExchangeContract } from './contracts/currency_exchange.js'

// Exchanges
export { BaseCurrencyExchange, GoogleFinanceExchange, FixerExchange } from './exchanges/index.js'

// Services
export { CurrencyService } from './services/index.js'

// Configuration
export { defineConfig, exchanges } from './config/index.js'

// Factory
export { createCurrency } from './factory.js'

// Default export
export { CurrencyService as default } from './services/index.js'
