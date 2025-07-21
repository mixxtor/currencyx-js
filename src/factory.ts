/**
 * Factory Function
 *
 * Creates a typed currency service with provider inference
 */

import type { CurrencyConfig, CurrencyProviders } from './types/index.js'
import { CurrencyService } from './services/index.js'

/**
 * Create a typed currency service with provider inference
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
 *
 * const currency = createCurrency(config)
 *
 * // TypeScript knows these are valid
 * currency.use('google')  // ✅
 * currency.use('fixer')   // ✅
 * // currency.use('invalid') // ❌ TypeScript error
 * ```
 */
export function createCurrency<T extends CurrencyConfig<CurrencyProviders> = CurrencyConfig<CurrencyProviders>>(
  config: T
): CurrencyService<T> {
  return new CurrencyService<T>(config)
}
