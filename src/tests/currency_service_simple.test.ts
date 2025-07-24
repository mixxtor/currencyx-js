/**
 * Currency Service Tests - Simple and Focused
 * Test only core functionality without mocking implementation details
 */

import { describe, it, expect, beforeEach } from 'vitest'
import CurrencyService, { createCurrency, exchanges } from '../index.js'

describe('CurrencyService Core Functionality', () => {
  let currency: CurrencyService

  beforeEach(() => {
    currency = createCurrency({
      default: 'google',
      exchanges: {
        google: exchanges.google({ base: 'USD' }),
      },
    })
  })

  describe('Same Currency Conversion (Always Works)', () => {
    it('should convert same currency with object parameters', async () => {
      const result = await currency.convert({ amount: 100, from: 'USD', to: 'USD' })

      expect(result.success).toBe(true)
      expect(result.query.amount).toBe(100)
      expect(result.query.from).toBe('USD')
      expect(result.query.to).toBe('USD')
      expect(result.result).toBe(100)
      expect(result.info.rate).toBe(1)
    })

    it('should convert same currency with convenience method', async () => {
      const result = await currency.convertAmount(100, 'EUR', 'EUR')

      expect(result.success).toBe(true)
      expect(result.query.amount).toBe(100)
      expect(result.query.from).toBe('EUR')
      expect(result.query.to).toBe('EUR')
      expect(result.result).toBe(100)
      expect(result.info.rate).toBe(1)
    })
  })

  describe('Exchange Rates', () => {
    it('should get exchange rates with object parameters', async () => {
      const result = await currency.getExchangeRates({ base: 'USD', symbols: ['USD'] })

      expect(result.success).toBe(true)
      expect(result.base).toBe('USD')
      expect(result.rates).toHaveProperty('USD')
      expect(result.rates.USD).toBe(1)
    })

    it('should get exchange rates with convenience method', async () => {
      const result = await currency.getRates('EUR', ['EUR'])

      expect(result.success).toBe(true)
      expect(result.base).toBe('EUR')
      expect(result.rates).toHaveProperty('EUR')
      expect(result.rates.EUR).toBe(1)
    })
  })

  describe('Exchange Management', () => {
    it('should switch exchanges', () => {
      expect(() => currency.use('google')).not.toThrow()
    })

    it('should get current exchange name', () => {
      const exchangeName = currency.getCurrentExchange()
      expect(exchangeName).toBe('google')
    })

    it('should list available exchanges', () => {
      const exchanges = currency.getAvailableExchanges()
      expect(exchanges).toContain('google')
    })
  })

  describe('Utility Methods', () => {
    it('should format currency', () => {
      const formatted = currency.formatCurrency(1234.56, 'USD')
      expect(typeof formatted).toBe('string')
      expect(formatted).toContain('1,234.56')
    })

    it('should round values', () => {
      const rounded = currency.round(1.23456, 2)
      expect(rounded).toBe(1.23)
    })

    it('should get supported currencies', async () => {
      const currencies = await currency.getSupportedCurrencies()
      expect(Array.isArray(currencies)).toBe(true)
      expect(currencies.length).toBeGreaterThan(0)
      expect(currencies).toContain('USD')
    })
  })
})
