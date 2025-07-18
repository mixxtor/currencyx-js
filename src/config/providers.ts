/**
 * Provider Configuration Exports
 * 
 * Similar to @adonisjs/drive services.fs() pattern
 * Provides typed configuration helpers for each provider
 */

import type { GoogleFinanceConfig, FixerConfig } from '../types/index.js'

/**
 * Google Finance provider configuration
 * 
 * @example
 * ```typescript
 * const config = defineConfig({
 *   defaultProvider: 'google',
 *   providers: {
 *     google: exchanges.google({ base: 'USD', timeout: 5000 })
 *   }
 * })
 * ```
 */
export function google(config: GoogleFinanceConfig = {}): GoogleFinanceConfig {
  return {
    base: config.base || 'USD',
    timeout: config.timeout || 5000,
    ...config
  }
}

/**
 * Fixer.io provider configuration
 * 
 * @example
 * ```typescript
 * const config = defineConfig({
 *   defaultProvider: 'fixer',
 *   providers: {
 *     fixer: exchanges.fixer({ 
 *       accessKey: env.get('FIXER_API_KEY'),
 *       base: 'EUR' 
 *     })
 *   }
 * })
 * ```
 */
export function fixer(config: FixerConfig): FixerConfig {
  if (!config.accessKey) {
    throw new Error('Fixer provider requires an accessKey')
  }

  return {
    base: config.base || 'EUR',
    timeout: config.timeout || 5000,
    ...config
  }
}



/**
 * Provider configuration helpers
 * Similar to @adonisjs/drive's services object
 */
export const exchanges = {
  google,
  fixer
} as const
