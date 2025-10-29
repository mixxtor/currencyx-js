import { describe, expect, it } from 'vitest'
import { GoogleFinanceExchange } from '../exchanges/index.js'

describe('Real-world Currency Rounding Corrections', () => {
  const exchange = new GoogleFinanceExchange()
  describe('VND - Vietnamese Dong (500 rounding)', () => {
    it('should round to nearest 500 VND (cash transactions)', () => {
      // VND: smallest coin is 100, but cash transactions round to 500
      expect(exchange.roundMoney(79015.16, 'VND')).toBe(79000) // 79,015 → 79,000
      expect(exchange.roundMoney(79250, 'VND')).toBe(79500)    // 79,250 → 79,500 
      expect(exchange.roundMoney(79749, 'VND')).toBe(79500)    // 79,749 → 79,500
      expect(exchange.roundMoney(79750, 'VND')).toBe(80000)    // 79,750 → 80,000
      expect(exchange.roundMoney(24500, 'VND')).toBe(24500)    // Exact 500
      expect(exchange.roundMoney(24250, 'VND')).toBe(24500)    // Rounds up
      expect(exchange.roundMoney(24249, 'VND')).toBe(24000)    // Rounds down
    })
  })

  describe('KRW - South Korean Won (10 rounding)', () => {
    it('should round to nearest 10 KRW (cash transactions)', () => {
      // KRW is NOT a weak currency, just different denomination
      // Cash transactions typically round to 10 won
      expect(exchange.roundMoney(1234, 'KRW')).toBe(1230)      // 1,234 → 1,230
      expect(exchange.roundMoney(1235, 'KRW')).toBe(1240)      // 1,235 → 1,240 (rounds up)
      expect(exchange.roundMoney(1000, 'KRW')).toBe(1000)      // Exact 10
      expect(exchange.roundMoney(1005, 'KRW')).toBe(1010)      // 1,005 → 1,010
      expect(exchange.roundMoney(1004, 'KRW')).toBe(1000)      // 1,004 → 1,000
      expect(exchange.roundMoney(50000, 'KRW')).toBe(50000)    // Large amounts
    })
  })

  describe('IDR - Indonesian Rupiah (100 rounding)', () => {
    it('should round to nearest 100 IDR (practical usage)', () => {
      // IDR: smallest practical coin is 50-100, round to 100
      expect(exchange.roundMoney(15350, 'IDR')).toBe(15400)    // 15,350 → 15,400 (rounds up)
      expect(exchange.roundMoney(15349, 'IDR')).toBe(15300)    // 15,349 → 15,300 (rounds down)
      expect(exchange.roundMoney(15450, 'IDR')).toBe(15500)    // 15,450 → 15,500 (rounds up)
      expect(exchange.roundMoney(15050, 'IDR')).toBe(15100)    // 15,050 → 15,100
      expect(exchange.roundMoney(15049, 'IDR')).toBe(15000)    // 15,049 → 15,000
      expect(exchange.roundMoney(100000, 'IDR')).toBe(100000)  // Large notes
    })
  })

  describe('KHR - Cambodian Riel (100 rounding)', () => {
    it('should round to nearest 100 KHR (more reasonable than 1000)', () => {
      // KHR: USD is commonly used, but when using KHR, 100 is more practical
      expect(exchange.roundMoney(2350, 'KHR')).toBe(2400)      // 2,350 → 2,400
      expect(exchange.roundMoney(2349, 'KHR')).toBe(2300)      // 2,349 → 2,300
      expect(exchange.roundMoney(4050, 'KHR')).toBe(4100)      // 4,050 → 4,100
      expect(exchange.roundMoney(4000, 'KHR')).toBe(4000)      // Exact 100
    })
  })

  describe('LAK - Lao Kip (100 rounding)', () => {
    it('should round to nearest 100 LAK (more reasonable than 1000)', () => {
      // LAK: Very weak currency but 100 rounding is more practical
      expect(exchange.roundMoney(8650, 'LAK')).toBe(8700)      // 8,650 → 8,700
      expect(exchange.roundMoney(8649, 'LAK')).toBe(8600)      // 8,649 → 8,600
      expect(exchange.roundMoney(12050, 'LAK')).toBe(12100)    // 12,050 → 12,100
      expect(exchange.roundMoney(10000, 'LAK')).toBe(10000)    // Exact 100
    })
  })

  describe('MMK - Myanmar Kyat (5 rounding)', () => {
    it('should round to nearest 5 MMK (small denominations available)', () => {
      // MMK: Small denominations exist, 5 kyat is reasonable
      expect(exchange.roundMoney(1503, 'MMK')).toBe(1505)      // 1,503 → 1,505
      expect(exchange.roundMoney(1502, 'MMK')).toBe(1500)      // 1,502 → 1,500
      expect(exchange.roundMoney(2007, 'MMK')).toBe(2005)      // 2,007 → 2,005
      expect(exchange.roundMoney(2008, 'MMK')).toBe(2010)      // 2,008 → 2,010
      expect(exchange.roundMoney(1000, 'MMK')).toBe(1000)      // Exact 5
    })
  })

  describe('Real-world Examples', () => {
    it('should demonstrate practical usage scenarios', () => {
      // VND: Restaurant bill
      expect(exchange.roundMoney(79015.16, 'VND')).toBe(79000)  // Your original example
      
      // KRW: Coffee shop (KRW is strong, not weak!)
      expect(exchange.roundMoney(4500, 'KRW')).toBe(4500)       // Exact 10 won
      expect(exchange.roundMoney(4507, 'KRW')).toBe(4510)       // Rounds to 10
      
      // IDR: Market purchase
      expect(exchange.roundMoney(25750, 'IDR')).toBe(25800)     // Rounds to 100
      
      // Currency strength context
      // KRW ~1,300 per USD = not weak, just different scale
      // VND ~24,000 per USD = genuinely weak
      // JPY ~150 per USD = strong but no decimals used
    })
  })

  describe('Economic Context Validation', () => {
    it('should reflect real economic conditions', () => {
      // Strong currencies with appropriate rounding
      expect(exchange.roundMoney(1.234, 'USD')).toBe(1.23)      // 0.01 standard
      expect(exchange.roundMoney(1.234, 'EUR')).toBe(1.23)      // 0.01 standard
      expect(exchange.roundMoney(1.234, 'CHF')).toBe(1.25)      // 0.05 Swiss style
      
      // Weak currencies with larger rounding
      expect(exchange.roundMoney(79015, 'VND')).toBe(79000)     // 500 rounding
      expect(exchange.roundMoney(25750, 'IDR')).toBe(25800)     // 100 rounding
      
      // Stable but different scale
      expect(exchange.roundMoney(1507, 'KRW')).toBe(1510)       // 10 rounding (NOT weak!)
      expect(exchange.roundMoney(150.7, 'JPY')).toBe(151)       // 1 rounding (strong)
    })
  })
})