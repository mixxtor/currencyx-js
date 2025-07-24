/**
 * Factory Function
 *
 * Creates a typed currency service with exchange inference
 */

import type { CurrencyConfig } from './types/index.js'
import { CurrencyService } from './services/index.js'
import type { CurrencyExchangeContract } from './contracts/currency_exchange.js'

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
export function createCurrency<KnownExchanges extends Record<string, CurrencyExchangeContract>>(
  config: CurrencyConfig<KnownExchanges>
): CurrencyService<KnownExchanges> {
  return new CurrencyService<KnownExchanges>(config)
}
