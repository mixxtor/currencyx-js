/**
 * Factory Function
 *
 * Creates a typed currency service with exchange inference
 */

import type { CurrencyConfig, CurrencyExchanges } from './types/index.js'
import { CurrencyService } from './services/index.js'

/**
 * Create a typed currency service with exchange inference
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
 *
 * const currency = createCurrency(config)
 *
 * // TypeScript knows these are valid
 * currency.use('google')  // ✅
 * currency.use('fixer')   // ✅
 * // currency.use('invalid') // ❌ TypeScript error
 * ```
 */
export function createCurrency<T extends CurrencyConfig<CurrencyExchanges> = CurrencyConfig<CurrencyExchanges>>(
  config: T
): CurrencyService<T> {
  return new CurrencyService<T>(config)
}
