/**
 * CurrencyX.js
 * 
 * Modern TypeScript currency converter with type inference
 * Fresh, clean, and optimized implementation
 */

// Types
export type {
  CurrencyCode,
  ConversionResult,
  ExchangeRatesResult,
  HealthCheckResult,
  CurrencyInfo,
  GoogleFinanceConfig,
  FixerConfig,
  CurrencyConfig,
  InferProviders,
  InferDefaultProvider,
  GetProviderNames,
  CurrencyProviders
} from './types/index.js'

// Contracts
export type { CurrencyProviderContract, ExtendedCurrencyProvider } from './contracts/currency_provider.js'

// Providers
export {
  BaseCurrencyProvider,
  GoogleFinanceProvider,
  FixerProvider
} from './providers/index.js'

// Services
export { CurrencyService, CurrencyServiceAbstract } from './services/index.js'

// Configuration
export { defineConfig, exchanges, google, fixer } from './config/index.js'

// Factory
export { createCurrency } from './factory.js'

// Default export
export { CurrencyService as default } from './services/index.js'
