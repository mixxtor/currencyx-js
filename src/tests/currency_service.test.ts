/**
 * Currency Service Tests
 * Test selective object-based API for core methods and simple positional parameters for others
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { createCurrency, exchanges } from '../index.js'

describe('CurrencyService API', () => {
  let currency: any

  beforeEach(() => {
    currency = createCurrency({
      default: 'google' as const,
      providers: {
        google: exchanges.google({ base: 'USD' }),
        fixer: exchanges.fixer({ accessKey: 'test-key' }),
      },
    })
  })

  describe('Core Methods with Object Parameters', () => {
    it('should convert using object parameters', async () => {
      // Mock the provider to avoid actual API calls
      const mockResult = {
        success: true,
        query: { from: 'USD', to: 'EUR', amount: 100 },
        info: { timestamp: Date.now(), rate: 0.85 },
        date: new Date().toISOString(),
        result: 85,
      }

      // Mock the provider's convert method
      const provider = currency.getActiveProvider()
      provider.convert = async () => mockResult

      const result = await currency.convert({ amount: 100, from: 'USD', to: 'EUR' })

      expect(result.success).toBe(true)
      expect(result.result).toBe(85)
      expect(result.query.amount).toBe(100)
      expect(result.query.from).toBe('USD')
      expect(result.query.to).toBe('EUR')
    })

    it('should get exchange rates using object parameters', async () => {
      // Mock the provider to avoid actual API calls
      const mockResult = {
        success: true,
        timestamp: Date.now(),
        date: new Date().toISOString(),
        base: 'USD',
        rates: { EUR: 0.85, GBP: 0.73 },
      }

      // Mock the provider's latestRates method
      const provider = currency.getActiveProvider()
      provider.latestRates = async () => mockResult

      const result = await currency.getExchangeRates({
        base: 'USD',
        symbols: ['EUR', 'GBP'],
      })

      expect(result.success).toBe(true)
      expect(result.base).toBe('USD')
      expect(result.rates.EUR).toBe(0.85)
      expect(result.rates.GBP).toBe(0.73)
    })
  })

  describe('Backward Compatibility for Core Methods', () => {
    it('should convert using positional parameters (backward compatibility)', async () => {
      // Mock the provider to avoid actual API calls
      const mockResult = {
        success: true,
        query: { from: 'USD', to: 'EUR', amount: 100 },
        info: { timestamp: Date.now(), rate: 0.85 },
        date: new Date().toISOString(),
        result: 85,
      }

      // Mock the provider's convert method
      const provider = currency.getActiveProvider()
      provider.convert = async () => mockResult

      const result = await currency.convertAmount(100, 'USD', 'EUR')

      expect(result.success).toBe(true)
      expect(result.result).toBe(85)
      expect(result.query.amount).toBe(100)
      expect(result.query.from).toBe('USD')
      expect(result.query.to).toBe('EUR')
    })

    it('should get exchange rates using positional parameters (backward compatibility)', async () => {
      // Mock the provider to avoid actual API calls
      const mockResult = {
        success: true,
        timestamp: Date.now(),
        date: new Date().toISOString(),
        base: 'USD',
        rates: { EUR: 0.85, GBP: 0.73 },
      }

      // Mock the provider's latestRates method
      const provider = currency.getActiveProvider()
      provider.latestRates = async () => mockResult

      const result = await currency.getRates('USD', ['EUR', 'GBP'])

      expect(result.success).toBe(true)
      expect(result.base).toBe('USD')
      expect(result.rates.EUR).toBe(0.85)
      expect(result.rates.GBP).toBe(0.73)
    })
  })

  describe('Simple Methods with Positional Parameters', () => {
    it('should use simple positional parameters for utility methods', () => {
      // Test that simple methods don't use object parameters
      expect(() => currency.use('google')).not.toThrow()
      expect(() => currency.round(123.456, 2)).not.toThrow()
      expect(currency.round(123.456, 2)).toBe(123.46)

      // Test provider switching
      currency.use('google')
      expect(currency.getCurrentProvider()).toBe('google')

      // Test available providers
      const providers = currency.getAvailableProviders()
      expect(providers).toContain('google')
      expect(providers).toContain('fixer')
    })

    it('should format currency with positional parameters', () => {
      const formatted = currency.formatCurrency(1234.56, 'USD', 'en-US')
      expect(formatted).toBe('$1,234.56')
    })
  })

  describe('API Consistency', () => {
    it('should return same result for both core method APIs', async () => {
      // Mock the provider to avoid actual API calls
      const mockResult = {
        success: true,
        query: { from: 'USD', to: 'EUR', amount: 100 },
        info: { timestamp: Date.now(), rate: 0.85 },
        date: new Date().toISOString(),
        result: 85,
      }

      // Mock the provider's convert method
      const provider = currency.getActiveProvider()
      provider.convert = async () => mockResult

      const objectResult = await currency.convert({ amount: 100, from: 'USD', to: 'EUR' })
      const positionalResult = await currency.convertAmount(100, 'USD', 'EUR')

      expect(objectResult).toEqual(positionalResult)
    })
  })
})
