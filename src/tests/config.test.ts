/**
 * Configuration Tests
 */

import { describe, it, expect } from 'vitest'
import { defineConfig, exchanges } from '../config/index.js'
import type { FixerConfig } from '../types/index.js'

describe('defineConfig', () => {
  it('should define configuration with type inference', () => {
    const config = defineConfig({
      default: 'google' as const,
      exchanges: {
        google: exchanges.google({ base: 'USD' }),
        fixer: exchanges.fixer({ accessKey: 'test-key' }),
      },
    })

    expect(config).toEqual({
      default: 'google',
      exchanges: {
        google: exchanges.google({ base: 'USD' }),
        fixer: exchanges.fixer({ accessKey: 'test-key' }),
      },
    })
  })

  it('should preserve exact configuration structure', () => {
    const originalConfig = {
      default: 'google' as const,
      exchanges: {
        google: exchanges.google({ base: 'USD', timeout: 5000 }),
      },
    }

    const config = defineConfig(originalConfig)
    expect(config).toBe(originalConfig)
  })
})

describe('Exchange Configuration Helpers', () => {
  describe('google', () => {
    it('should create Google Finance configuration with defaults', () => {
      const config = exchanges.google()

      expect(config.base).toBe('USD')
      expect(config.name).toBe('google')
      expect(config.currencies).toBeInstanceOf(Array)
    })

    it('should create Google Finance configuration with custom values', () => {
      const config = exchanges.google({
        base: 'EUR',
        timeout: 10000,
      })

      expect(config.base).toBe('EUR')
      expect(config.name).toBe('google')
      expect(config.currencies).toBeInstanceOf(Array)
    })

    it('should override defaults with provided values', () => {
      const config = exchanges.google({
        base: 'GBP',
        // timeout not provided, should use default
      })

      expect(config.base).toBe('GBP')
      expect(config.name).toBe('google')
      expect(config.currencies).toBeInstanceOf(Array)
    })
  })

  describe('fixer', () => {
    it('should create Fixer configuration with required accessKey', () => {
      const config = exchanges.fixer({
        accessKey: 'test-api-key',
      })

      expect(config.base).toBe('USD')
      expect(config.name).toBe('fixer')
      expect(config).toBeInstanceOf(Object)
    })

    it('should create Fixer configuration with custom values', () => {
      const config = exchanges.fixer({
        accessKey: 'test-api-key',
        base: 'USD',
        timeout: 10000,
      })

      expect(config.base).toBe('USD')
      expect(config.name).toBe('fixer')
      expect(config).toBeInstanceOf(Object)
    })

    it('should throw error when accessKey is missing', () => {
      expect(() => {
        exchanges.fixer({ base: 'EUR' } as FixerConfig)
      }).toThrow('Fixer exchange requires an accessKey')
    })

    it('should throw error when accessKey is empty', () => {
      expect(() => {
        exchanges.fixer({ accessKey: '' })
      }).toThrow('Fixer exchange requires an accessKey')
    })
  })

  describe('exchanges object', () => {
    it('should export all exchange helpers', () => {
      expect(exchanges).toHaveProperty('google')
      expect(exchanges).toHaveProperty('fixer')

      expect(typeof exchanges.google).toBe('function')
      expect(typeof exchanges.fixer).toBe('function')
    })

    it('should work with defineConfig', () => {
      const config = defineConfig({
        default: 'google' as const,
        exchanges: {
          google: exchanges.google({ base: 'USD' }),
          fixer: exchanges.fixer({ accessKey: 'test-key' }),
        },
      })

      expect(config.exchanges.google.base).toBe('USD')
      expect(config.exchanges.google.name).toBe('google')
      expect(config.exchanges.google.currencies).toBeInstanceOf(Array)
      expect(config.exchanges.google.currencies.length).toBeGreaterThan(0)

      expect(config.exchanges.fixer.base).toBe('USD')
      expect(config.exchanges.fixer.name).toBe('fixer')
      expect(config.exchanges.fixer).toBeInstanceOf(Object)
    })
  })
})

describe('Type Safety', () => {
  it('should infer exchange types correctly', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const config = defineConfig({
      default: 'google' as const,
      exchanges: {
        google: exchanges.google(),
        fixer: exchanges.fixer({ accessKey: 'test-key' }),
      },
    })

    type ExchangeNames = keyof typeof config.exchanges
    const validexchanges: ExchangeNames[] = ['google', 'fixer']
    expect(validexchanges).toEqual(['google', 'fixer'])
  })

  it('should enforce required configuration properties', () => {
    const validConfig = defineConfig({
      default: 'google' as const,
      exchanges: {
        google: exchanges.google(),
      },
    })

    expect(validConfig).toBeDefined()
  })
})
