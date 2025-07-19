/**
 * Factory Function
 * 
 * Creates a typed currency service with provider inference
 */

import type { CurrencyConfig } from './types/index.js'
import { CurrencyService, CurrencyServiceAbstract } from './services/index.js'

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
export function createCurrency<T extends CurrencyConfig<Record<string, any>> = CurrencyConfig<Record<string, any>>>(
  config: T
): CurrencyServiceAbstract<T> {
  return new CurrencyService<T>(config)
}
