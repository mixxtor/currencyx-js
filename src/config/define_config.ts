/**
 * Configuration Helper
 * 
 * Provides type-safe configuration definition similar to @adonisjs/drive
 */

import type { CurrencyConfig, CurrencyProviders } from '../types/index.js'

/**
 * Helper function to define currency configuration with type inference
 * 
 * @example
 * ```typescript
 * const config = defineConfig({
 *   default: 'google' as const,
 *   providers: {
 *     google: { base: 'USD' },
 *     fixer: { accessKey: 'your-key' }
 *   }
 * })
 * ```
 */
export function defineConfig<T extends CurrencyProviders>(config: CurrencyConfig<T>): CurrencyConfig<T> {
  return config
}
