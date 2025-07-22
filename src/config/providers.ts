/**
 * Provider Configuration Exports
 *
 * Similar to @adonisjs/drive services.fs() pattern
 * Provides typed configuration helpers for each provider
 */

import { FixerProvider } from '../providers/fixer.js'
import { GoogleFinanceProvider } from '../providers/google_finance.js'
import type { GoogleFinanceConfig, FixerConfig } from '../types/index.js'

/**
 * Google Finance provider configuration
 *
 * @example
 * ```typescript
 * const config = defineConfig({
 *   default: 'google',
 *   providers: {
 *     google: exchanges.google({ base: 'USD', timeout: 5000 })
 *   }
 * })
 * ```
 */
function google(config: GoogleFinanceConfig = {}): GoogleFinanceProvider {
  return new GoogleFinanceProvider({
    base: config.base || 'USD',
    timeout: config.timeout || 5000,
    ...config,
  })
}

/**
 * Fixer.io provider configuration
 *
 * @example
 * ```typescript
 * const config = defineConfig({
 *   default: 'fixer',
 *   providers: {
 *     fixer: exchanges.fixer({
 *       accessKey: env.get('FIXER_API_KEY'),
 *       base: 'EUR'
 *     })
 *   }
 * })
 * ```
 */
function fixer(config: FixerConfig): FixerProvider {
  if (!config.accessKey) {
    throw new Error('Fixer provider requires an accessKey')
  }

  return new FixerProvider({
    base: config.base || 'USD',
    timeout: config.timeout || 5000,
    ...config,
  })
}

/**
 * Provider configuration helpers
 * Similar to @adonisjs/drive's services object
 */
export const exchanges = {
  google,
  fixer,
} as const
