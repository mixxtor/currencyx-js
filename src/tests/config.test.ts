/**
 * Configuration Tests
 */

import { describe, it, expect } from 'vitest'
import { defineConfig, exchanges, google, fixer } from '../config/index.js'

describe('defineConfig', () => {
  it('should define configuration with type inference', () => {
    const config = defineConfig({
      default: 'google' as const,
      providers: {
        google: { base: 'USD' },
        fixer: { accessKey: 'test-key' }
      }
    })

    expect(config).toEqual({
      default: 'google',
      providers: {
        google: { base: 'USD' },
        fixer: { accessKey: 'test-key' }
      }
    })
  })

  it('should preserve exact configuration structure', () => {
    const originalConfig = {
      default: 'database' as const,
      providers: {
        database: {
          model: () => ({}),
          columns: { code: 'currency_code', rate: 'exchange_rate' }
        }
      }
    }

    const config = defineConfig(originalConfig)
    expect(config).toBe(originalConfig)
  })
})

describe('Provider Configuration Helpers', () => {
  describe('google', () => {
    it('should create Google Finance configuration with defaults', () => {
      const config = google()

      expect(config).toEqual({
        base: 'USD',
        timeout: 5000
      })
    })

    it('should create Google Finance configuration with custom values', () => {
      const config = google({
        base: 'EUR',
        timeout: 10000
      })

      expect(config).toEqual({
        base: 'EUR',
        timeout: 10000
      })
    })

    it('should override defaults with provided values', () => {
      const config = google({
        base: 'GBP'
        // timeout not provided, should use default
      })

      expect(config).toEqual({
        base: 'GBP',
        timeout: 5000
      })
    })
  })

  describe('fixer', () => {
    it('should create Fixer configuration with required accessKey', () => {
      const config = fixer({
        accessKey: 'test-api-key'
      })

      expect(config).toEqual({
        accessKey: 'test-api-key',
        base: 'EUR',
        timeout: 5000
      })
    })

    it('should create Fixer configuration with custom values', () => {
      const config = fixer({
        accessKey: 'test-api-key',
        base: 'USD',
        timeout: 10000
      })

      expect(config).toEqual({
        accessKey: 'test-api-key',
        base: 'USD',
        timeout: 10000
      })
    })

    it('should throw error when accessKey is missing', () => {
      expect(() => {
        fixer({
          // @ts-expect-error - Testing missing accessKey
          base: 'EUR'
        } as any)
      }).toThrow('Fixer provider requires an accessKey')
    })

    it('should throw error when accessKey is empty', () => {
      expect(() => {
        fixer({
          accessKey: ''
        })
      }).toThrow('Fixer provider requires an accessKey')
    })
  })



  describe('exchanges object', () => {
    it('should export all provider helpers', () => {
      expect(exchanges).toHaveProperty('google')
      expect(exchanges).toHaveProperty('fixer')

      expect(typeof exchanges.google).toBe('function')
      expect(typeof exchanges.fixer).toBe('function')
    })

    it('should work with defineConfig', () => {
      const config = defineConfig({
        default: 'google' as const,
        providers: {
          google: exchanges.google({ base: 'USD' }),
          fixer: exchanges.fixer({ accessKey: 'test-key' })
        }
      })

      expect(config.providers.google).toEqual({
        base: 'USD',
        timeout: 5000
      })

      expect(config.providers.fixer).toEqual({
        accessKey: 'test-key',
        base: 'EUR',
        timeout: 5000
      })
    })
  })
})

describe('Type Safety', () => {
  it('should infer provider types correctly', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const config = defineConfig({
      default: 'google' as const,
      providers: {
        google: exchanges.google(),
        fixer: exchanges.fixer({ accessKey: 'test-key' })
      }
    })

    type ProviderNames = keyof typeof config.providers
    const validProviders: ProviderNames[] = ['google', 'fixer']
    expect(validProviders).toEqual(['google', 'fixer'])
  })

  it('should enforce required configuration properties', () => {
    const validConfig = defineConfig({
      default: 'google' as const,
      providers: {
        google: exchanges.google()
      }
    })

    expect(validConfig).toBeDefined()
  })
})
