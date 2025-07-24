/**
 * Configuration Helper
 *
 * Provides type-safe configuration definition similar to @adonisjs/drive
 */

import type { CurrencyExchangeContract } from '../contracts/currency_exchange.js';
import type { CurrencyConfig } from '../types/index.js'

/**
 * Helper function to define currency configuration with type inference
 *
 * @example
 * ```typescript
 * const config = defineConfig({
 *   default: 'google' as const,
 *   exchanges: {
 *     google: exchanges.google({ base: 'USD' }),
 *     fixer: exchanges.fixer({ accessKey: 'your-key' })
 *   }
 * })
 * ```
 */
export function defineConfig<KnownExchanges extends Record<string, CurrencyExchangeContract>>(config: CurrencyConfig<KnownExchanges>): CurrencyConfig<KnownExchanges> {
  return config
}
