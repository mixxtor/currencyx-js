/**
 * Exchange Configuration Exports
 *
 * Exchanges typed configuration helpers for each exchange
 */

import { FixerExchange } from '../exchanges/fixer.js'
import { GoogleFinanceExchange } from '../exchanges/google_finance.js'
import type { GoogleFinanceConfig, FixerConfig } from '../types/index.js'

/**
 * Google Finance exchange configuration
 *
 * @example
 * ```typescript
 * const config = defineConfig({
 *   default: 'google',
 *   exchanges: {
 *     google: exchanges.google({ base: 'USD', timeout: 5000 })
 *   }
 * })
 * ```
 */
function google(config: GoogleFinanceConfig = {}): GoogleFinanceExchange {
  return new GoogleFinanceExchange({
    base: config.base || 'USD',
    timeout: config.timeout || 5000,
    ...config,
  })
}

/**
 * Fixer.io exchange configuration
 *
 * @example
 * ```typescript
 * const config = defineConfig({
 *   default: 'fixer',
 *   exchanges: {
 *     fixer: exchanges.fixer({
 *       accessKey: env.get('FIXER_API_KEY'),
 *       base: 'EUR'
 *     })
 *   }
 * })
 * ```
 */
function fixer(config: FixerConfig): FixerExchange {
  if (!config.accessKey) {
    throw new Error('Fixer exchange requires an accessKey')
  }

  return new FixerExchange({
    base: config.base || 'USD',
    timeout: config.timeout || 5000,
    ...config,
  })
}

/**
 * Exchange configuration helpers
 * Similar to @adonisjs/drive's services object
 */
export const exchanges = {
  google,
  fixer,
} as const
