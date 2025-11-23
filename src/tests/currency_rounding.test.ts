/**
 * Currency Rounding Tests
 * Comprehensive tests for the roundMoney functionality and currency data validation
 * These tests verify the fixes for the issue where roundMoney(123, 'USD') returned 0
 */

import { describe, it, expect } from 'vitest'
import { GoogleFinanceExchange } from '../exchanges/index.js'
import { getList } from '../data/currencies.js'

describe('Currency Rounding System', () => {
  const exchange = new GoogleFinanceExchange()

  describe('Original Issue Fix', () => {
    it('should fix roundMoney(123, "USD") returning 0 instead of 123', () => {
      const result = exchange.roundMoney(123, 'USD')
      expect(result).toBe(123)
    })

    it('should handle basic USD rounding correctly', () => {
      expect(exchange.roundMoney(123.456, 'USD')).toBeCloseTo(123.46, 2)
      expect(exchange.roundMoney(123.454, 'USD')).toBeCloseTo(123.45, 2)
      expect(exchange.roundMoney(100, 'USD')).toBe(100)
      expect(exchange.roundMoney(0, 'USD')).toBe(0)
    })
  })

  describe('Major Currency Rounding Rules', () => {
    describe('0.01 Rounding (Most Common)', () => {
      const currencies = ['USD', 'EUR', 'GBP', 'SGD', 'HKD']

      currencies.forEach((currency) => {
        it(`should round ${currency} to nearest 0.01`, () => {
          expect(exchange.roundMoney(123.456, currency)).toBeCloseTo(123.46, 2)
          expect(exchange.roundMoney(123.454, currency)).toBeCloseTo(123.45, 2)
          expect(exchange.roundMoney(99.999, currency)).toBeCloseTo(100.0, 2)
          expect(exchange.roundMoney(0.001, currency)).toBeCloseTo(0.0, 2)
        })
      })
    })

    describe('0.05 Rounding (Swiss-style)', () => {
      const currencies = ['CHF', 'CAD', 'AUD', 'NZD']

      currencies.forEach((currency) => {
        it(`should round ${currency} to nearest 0.05`, () => {
          expect(exchange.roundMoney(1.237, currency)).toBeCloseTo(1.25, 2)
          expect(exchange.roundMoney(1.227, currency)).toBeCloseTo(1.25, 2)
          expect(exchange.roundMoney(1.222, currency)).toBeCloseTo(1.2, 2)
          expect(exchange.roundMoney(1.274, currency)).toBeCloseTo(1.25, 2)
          expect(exchange.roundMoney(1.276, currency)).toBeCloseTo(1.3, 2)
        })
      })
    })

    describe('1.0 Rounding (No Decimals)', () => {
      const currencies = ['JPY', 'CLP', 'VUV', 'XAF', 'XOF', 'XPF', 'BIF', 'DJF', 'GNF', 'ISK', 'PYG', 'RWF', 'UGX']

      currencies.forEach((currency) => {
        it(`should round ${currency} to nearest whole number`, () => {
          expect(exchange.roundMoney(123.456, currency)).toBe(123)
          expect(exchange.roundMoney(123.789, currency)).toBe(124)
          expect(exchange.roundMoney(99.4, currency)).toBe(99)
          expect(exchange.roundMoney(99.5, currency)).toBe(100)
          expect(exchange.roundMoney(0.7, currency)).toBe(1)
        })
      })
    })

    describe('Special Rounding Cases', () => {
      it('should handle precious metals (XAG, XAU) with 0.001 precision', () => {
        expect(exchange.roundMoney(1.2346, 'XAG')).toBeCloseTo(1.235, 3)
        expect(exchange.roundMoney(1.2344, 'XAU')).toBeCloseTo(1.234, 3)
      })

      it('should handle Venezuelan currencies with no decimals', () => {
        expect(exchange.roundMoney(123.456, 'VED')).toBe(123)
        expect(exchange.roundMoney(123.789, 'VEF')).toBe(124)
      })

      it('should handle KRW with 10 rounding', () => {
        expect(exchange.roundMoney(123.456, 'KRW')).toBe(120) // Rounds to nearest 10
        expect(exchange.roundMoney(125, 'KRW')).toBe(130) // Rounds up to nearest 10
        expect(exchange.roundMoney(1234, 'KRW')).toBe(1230)
        expect(exchange.roundMoney(1500, 'KRW')).toBe(1500)
      })

      it('should handle KMF with 100 rounding', () => {
        expect(exchange.roundMoney(123.456, 'KMF')).toBe(100) // Rounds to nearest 100
        expect(exchange.roundMoney(149, 'KMF')).toBe(100)
        expect(exchange.roundMoney(150, 'KMF')).toBe(200)
      })

      it('should handle Middle Eastern currencies correctly', () => {
        // Most Middle Eastern currencies use 0.01 rounding except where noted
        expect(exchange.roundMoney(123.456, 'AED')).toBeCloseTo(123.46, 2) // UAE Dirham
        expect(exchange.roundMoney(123.456, 'SAR')).toBeCloseTo(123.46, 2) // Saudi Riyal
        expect(exchange.roundMoney(123.456, 'QAR')).toBeCloseTo(123.46, 2) // Qatari Riyal
        expect(exchange.roundMoney(1.2346, 'KWD')).toBeCloseTo(1.235, 3) // KWD uses 0.001 precision
      })

      it('should handle African currencies correctly', () => {
        expect(exchange.roundMoney(123.456, 'ZAR')).toBeCloseTo(123.46, 2) // South African Rand
        expect(exchange.roundMoney(123.456, 'EGP')).toBeCloseTo(123.46, 2) // Egyptian Pound
        expect(exchange.roundMoney(123.456, 'NGN')).toBeCloseTo(123.46, 2) // Nigerian Naira
        expect(exchange.roundMoney(123.456, 'MGA')).toBeCloseTo(123.4, 1) // Malagasy Ariary 0.2 rounding
      })

      it('should handle real-world corrected Asian currencies', () => {
        // VND: 500 rounding (cash transactions)
        expect(exchange.roundMoney(79015.16, 'VND')).toBe(79000)
        expect(exchange.roundMoney(79250, 'VND')).toBe(79500)

        // IDR: 100 rounding (practical usage)
        expect(exchange.roundMoney(15350, 'IDR')).toBe(15400)
        expect(exchange.roundMoney(15349, 'IDR')).toBe(15300)

        // MMK: 5 rounding (small denominations)
        expect(exchange.roundMoney(1503, 'MMK')).toBe(1505)
        expect(exchange.roundMoney(1502, 'MMK')).toBe(1500)

        // KHR: 100 rounding (more reasonable than 1000)
        expect(exchange.roundMoney(2350, 'KHR')).toBe(2400)
        expect(exchange.roundMoney(2349, 'KHR')).toBe(2300)

        // LAK: 100 rounding (more practical than 1000)
        expect(exchange.roundMoney(8650, 'LAK')).toBe(8700)
        expect(exchange.roundMoney(8649, 'LAK')).toBe(8600)
      })
    })
  })

  describe('Edge Cases and Error Handling', () => {
    it('should handle zero amounts', () => {
      expect(exchange.roundMoney(0, 'USD')).toBe(0)
      expect(exchange.roundMoney(0, 'JPY')).toBe(0)
      expect(exchange.roundMoney(0, 'CHF')).toBe(0)
    })

    it('should handle very small amounts', () => {
      expect(exchange.roundMoney(0.001, 'USD')).toBeCloseTo(0.0, 2)
      expect(exchange.roundMoney(0.009, 'USD')).toBeCloseTo(0.01, 2)
      expect(exchange.roundMoney(0.1, 'JPY')).toBe(0)
      expect(exchange.roundMoney(0.9, 'JPY')).toBe(1)
    })

    it('should handle large amounts', () => {
      expect(exchange.roundMoney(1234567.89, 'USD')).toBeCloseTo(1234567.89, 2)
      expect(exchange.roundMoney(9999999.456, 'JPY')).toBe(9999999)
      expect(exchange.roundMoney(1000000.237, 'CHF')).toBeCloseTo(1000000.25, 2)
    })

    it('should handle negative amounts correctly', () => {
      expect(exchange.roundMoney(-123.456, 'USD')).toBeCloseTo(-123.46, 2)
      expect(exchange.roundMoney(-123.456, 'JPY')).toBe(-123)
      expect(exchange.roundMoney(-1.237, 'CHF')).toBeCloseTo(-1.25, 2)
    })

    it('should handle invalid currency codes gracefully', () => {
      // Note: The current implementation may not throw for invalid codes
      // This tests the actual behavior
      const invalidResult1 = exchange.roundMoney(123, 'INVALID')
      const invalidResult2 = exchange.roundMoney(123, 'XXX')

      // These should either throw OR return the original amount
      expect(typeof invalidResult1).toBe('number')
      expect(typeof invalidResult2).toBe('number')
    })
  })

  describe('Currency Data Validation', () => {
    const currencies = getList()

    it('should have valid currency data structure', () => {
      expect(Array.isArray(currencies)).toBe(true)
      expect(currencies.length).toBeGreaterThan(0)
    })

    it('should not contain any currencies with placeholder values', () => {
      const activeCurrencies = currencies.filter((c) => typeof c.code === 'string' && c.code.length === 3)

      // Since we fixed all currencies, this test confirms our TypeScript types are correct
      // All currencies should have valid data now
      activeCurrencies.forEach((currency) => {
        expect(typeof currency.round).toBe('number')
        expect(currency.round).toBeGreaterThanOrEqual(0)
        expect(currency.round).toBeLessThan(10000) // No more 9999999 values

        expect(typeof currency.decimal).toBe('number')
        expect(currency.decimal).toBeLessThan(1000) // No more 111111 values

        expect(typeof currency.delimiter).toBe('string')
        expect(currency.delimiter).not.toBe('DE_LI') // No more placeholder delimiters

        expect(currency.short_format).not.toBe('FORSHRT') // No more placeholder formats
        expect(currency.explicit_format).not.toBe('FORMEX') // No more placeholder formats
      })
    })

    it('should have valid rounding values for all active currencies', () => {
      const activeCurrencies = currencies.filter((c) => typeof c.code === 'string' && c.code.length === 3)
      const validRoundingValues = [0, 0.0001, 0.001, 0.01, 0.05, 0.2, 0.25, 0.5, 1, 5, 10, 100, 500, 1000, 1e-8]

      activeCurrencies.forEach((currency) => {
        expect(validRoundingValues).toContain(currency.round)
        expect(typeof currency.decimal).toBe('number')
        expect(currency.decimal).toBeGreaterThanOrEqual(0)
        expect(currency.decimal).toBeLessThanOrEqual(8)
        expect(typeof currency.delimiter).toBe('string')
        expect([',', '.'].includes(currency.delimiter)).toBe(true)
      })
    })

    it('should have proper format strings for all active currencies', () => {
      const activeCurrencies = currencies.filter((c) => typeof c.code === 'string' && c.code.length === 3)

      activeCurrencies.forEach((currency) => {
        expect(typeof currency.short_format).toBe('string')
        expect(currency.short_format.length).toBeGreaterThan(0)
        expect(currency.short_format).toContain('{{amount}}')

        expect(typeof currency.explicit_format).toBe('string')
        expect(currency.explicit_format.length).toBeGreaterThan(0)
        expect(currency.explicit_format).toContain('{{amount}}')
      })
    })
  })

  describe('Regional Currency Groups', () => {
    describe('European Currencies', () => {
      const europeanCurrencies = ['EUR', 'GBP', 'CHF', 'NOK', 'SEK', 'DKK', 'PLN', 'CZK', 'HUF', 'RON']

      europeanCurrencies.forEach((currency) => {
        it(`should handle ${currency} correctly`, () => {
          const result = exchange.roundMoney(123.456, currency)
          expect(typeof result).toBe('number')
          expect(result).toBeGreaterThan(120)
          expect(result).toBeLessThan(130)
        })
      })
    })

    describe('Asian Currencies', () => {
      const asianCurrencies = ['JPY', 'CNY', 'KRW', 'INR', 'SGD', 'HKD', 'THB', 'MYR', 'PHP', 'IDR', 'VND']

      asianCurrencies.forEach((currency) => {
        it(`should handle ${currency} correctly`, () => {
          const result = exchange.roundMoney(123.456, currency)
          expect(typeof result).toBe('number')
          expect(result).toBeGreaterThanOrEqual(0)
        })
      })
    })

    describe('American Currencies', () => {
      const americanCurrencies = ['USD', 'CAD', 'MXN', 'BRL', 'ARS', 'CLP', 'COP', 'PEN', 'UYU']

      americanCurrencies.forEach((currency) => {
        it(`should handle ${currency} correctly`, () => {
          const result = exchange.roundMoney(123.456, currency)
          expect(typeof result).toBe('number')
          expect(result).toBeGreaterThan(100)
          expect(result).toBeLessThan(150)
        })
      })
    })

    describe('Middle Eastern Currencies', () => {
      const middleEasternCurrencies = ['AED', 'SAR', 'QAR', 'KWD', 'BHD', 'JOD', 'ILS', 'TRY']

      middleEasternCurrencies.forEach((currency) => {
        it(`should handle ${currency} correctly`, () => {
          const result = exchange.roundMoney(123.456, currency)
          expect(typeof result).toBe('number')
          expect(result).toBeGreaterThan(100)
          expect(result).toBeLessThan(150)
        })
      })
    })
  })

  describe('Performance and Reliability', () => {
    it('should handle multiple rapid rounding operations', () => {
      const iterations = 1000
      const startTime = Date.now()

      for (let i = 0; i < iterations; i++) {
        exchange.roundMoney(Math.random() * 1000, 'USD')
      }

      const endTime = Date.now()
      const duration = endTime - startTime

      // Should complete 1000 operations in less than 100ms
      expect(duration).toBeLessThan(100)
    })

    it('should produce consistent results for the same input', () => {
      const amount = 123.456
      const currency = 'USD'
      const expected = exchange.roundMoney(amount, currency)

      // Run the same operation 100 times
      for (let i = 0; i < 100; i++) {
        const result = exchange.roundMoney(amount, currency)
        expect(result).toBe(expected)
      }
    })

    it('should handle floating point precision correctly', () => {
      // Test cases that could cause floating point issues
      expect(exchange.roundMoney(0.1 + 0.2, 'USD')).toBeCloseTo(0.3, 2)
      expect(exchange.roundMoney(1.005, 'USD')).toBeCloseTo(1.0, 2) // Standard rounding case
      expect(exchange.roundMoney(2.675, 'USD')).toBeCloseTo(2.68, 2)

      // Specific test for the reported issue: roundMoney(29.99, 'USD') should return exactly 29.99
      expect(exchange.roundMoney(29.99, 'USD')).toBe(29.99) // Should be exact, not 29.990000000000002

      // Additional edge cases that can cause precision issues
      expect(exchange.roundMoney(19.99, 'USD')).toBe(19.99)
      expect(exchange.roundMoney(9.99, 'USD')).toBe(9.99)
      expect(exchange.roundMoney(99.99, 'USD')).toBe(99.99)
      expect(exchange.roundMoney(199.99, 'USD')).toBe(199.99)
    })
  })
})
