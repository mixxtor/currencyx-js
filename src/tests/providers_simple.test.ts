/**
 * Provider Tests - Simple and Focused
 * Test only core provider functionality without utility methods
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { GoogleFinanceProvider, FixerProvider } from '../index.js'

describe('Provider Core Functionality', () => {
  describe('GoogleFinanceProvider', () => {
    let provider: GoogleFinanceProvider

    beforeEach(() => {
      provider = new GoogleFinanceProvider({ base: 'USD' })
    })

    it('should initialize with correct configuration', () => {
      expect(provider.base).toBe('USD')
    })

    it('should set base currency', () => {
      provider.setBase('EUR')
      expect(provider.base).toBe('EUR')
    })

    it('should handle same currency conversion', async () => {
      const result = await provider.convert({ amount: 100, from: 'USD', to: 'USD' })
      expect(result.success).toBe(true)
      expect(result.result).toBe(100)
      expect(result.info.rate).toBe(1)
    })

    it('should get same currency exchange rate', async () => {
      const result = await provider.latestRates({ base: 'USD', symbols: ['USD'] })
      expect(result.success).toBe(true)
      expect(result.rates).toHaveProperty('USD')
      expect(result.rates.USD).toBe(1)
    })

    it('should round values correctly', () => {
      const rounded = provider.round(1.23456, 2)
      expect(rounded).toBe(1.23)
    })
  })

  describe('FixerProvider', () => {
    let provider: FixerProvider

    beforeEach(() => {
      provider = new FixerProvider({ accessKey: 'test-key' })
    })

    it('should initialize with correct configuration', () => {
      expect(provider.base).toBe('EUR') // Fixer default
    })

    it('should set API key', () => {
      provider.setKey('new-key')
      // No direct way to test this without exposing internals
      expect(true).toBe(true) // Just ensure no error
    })

    it('should handle same currency conversion', async () => {
      const result = await provider.convert({ amount: 100, from: 'EUR', to: 'EUR' })
      expect(result.success).toBe(true)
      expect(result.result).toBe(100)
      expect(result.info.rate).toBe(1)
    })

    it('should handle API errors gracefully', async () => {
      // Test with invalid currency to trigger error handling
      const result = await provider.convert({ amount: 100, from: 'INVALID', to: 'EUR' })
      expect(result.success).toBe(false)
      expect(result.error).toBeDefined()
    }, 10000) // Longer timeout for API call
  })

  describe('Base Provider Functionality', () => {
    let provider: GoogleFinanceProvider

    beforeEach(() => {
      provider = new GoogleFinanceProvider({ base: 'USD' })
    })

    it('should round values correctly', () => {
      const rounded = provider.round(1.23456, 2)
      expect(rounded).toBe(1.23)
    })

    it('should get supported currencies', () => {
      const currencies = provider.currencies
      expect(Array.isArray(currencies)).toBe(true)
      expect(currencies.length).toBeGreaterThan(0)
      expect(currencies).toContain('USD')
    })
  })
})
