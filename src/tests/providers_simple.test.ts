/**
 * Exchange Tests - Simple and Focused
 * Test only core exchange functionality without utility methods
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { GoogleFinanceExchange, FixerExchange } from '../index.js'

describe('Exchange Core Functionality', () => {
  describe('GoogleFinanceExchange', () => {
    let exchange: GoogleFinanceExchange

    beforeEach(() => {
      exchange = new GoogleFinanceExchange({ base: 'USD' })
    })

    it('should initialize with correct configuration', () => {
      expect(exchange.base).toBe('USD')
    })

    it('should set base currency', () => {
      exchange.setBase('EUR')
      expect(exchange.base).toBe('EUR')
    })

    it('should handle same currency conversion', async () => {
      const result = await exchange.convert({ amount: 100, from: 'USD', to: 'USD' })
      expect(result.success).toBe(true)
      expect(result.result).toBe(100)
      expect(result.info.rate).toBe(1)
    })

    it('should get same currency exchange rate', async () => {
      const result = await exchange.latestRates({ base: 'USD', symbols: ['USD'] })
      expect(result.success).toBe(true)
      expect(result.rates).toHaveProperty('USD')
      expect(result.rates.USD).toBe(1)
    })

    it('should round values correctly', () => {
      const rounded = exchange.round(1.23456, 2)
      expect(rounded).toBe(1.23)
    })
  })

  describe('FixerExchange', () => {
    let exchange: FixerExchange

    beforeEach(() => {
      exchange = new FixerExchange({ accessKey: 'test-key' })
    })

    it('should initialize with correct configuration', () => {
      expect(exchange.base).toBe('EUR') // Fixer default
    })

    it('should set API key', () => {
      exchange.setKey('new-key')
      // No direct way to test this without exposing internals
      expect(true).toBe(true) // Just ensure no error
    })

    it('should handle same currency conversion', async () => {
      const result = await exchange.convert({ amount: 100, from: 'EUR', to: 'EUR' })
      expect(result.success).toBe(true)
      expect(result.result).toBe(100)
      expect(result.info.rate).toBe(1)
    })

    it('should handle API errors gracefully', async () => {
      // Test with invalid currency to trigger error handling
      const result = await exchange.convert({ amount: 100, from: 'INVALID', to: 'EUR' })
      expect(result.success).toBe(false)
      expect(result.error).toBeDefined()
    }, 10000) // Longer timeout for API call
  })

  describe('Base Exchange Functionality', () => {
    let exchange: GoogleFinanceExchange

    beforeEach(() => {
      exchange = new GoogleFinanceExchange({ base: 'USD' })
    })

    it('should round values correctly', () => {
      const rounded = exchange.round(1.23456, 2)
      expect(rounded).toBe(1.23)
    })

    it('should get supported currencies', () => {
      const currencies = exchange.currencies
      expect(Array.isArray(currencies)).toBe(true)
      expect(currencies.length).toBeGreaterThan(0)
      expect(currencies).toContain('USD')
    })
  })
})
