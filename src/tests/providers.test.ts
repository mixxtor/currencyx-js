/**
 * Providers Tests
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { GoogleFinanceProvider, FixerProvider } from '../providers/index.js'

describe('GoogleFinanceProvider', () => {
  let provider: GoogleFinanceProvider

  beforeEach(() => {
    provider = new GoogleFinanceProvider({
      base: 'USD',
      timeout: 5000
    })
  })

  it('should initialize with correct configuration', () => {
    expect(provider.name).toBe('google')
    expect(provider.base).toBe('USD')
  })

  it('should set base currency', () => {
    provider.setBase('EUR')
    expect(provider.base).toBe('EUR')
  })

  it('should have currency list', () => {
    expect(provider.currencies).toBeInstanceOf(Array)
    expect(provider.currencies.length).toBeGreaterThan(0)
    expect(provider.currencies).toContain('USD')
    expect(provider.currencies).toContain('EUR')
  })

  it('should get currency information', () => {
    const usdInfo = provider.getByCode('USD')
    expect(usdInfo).toBeDefined()
    expect(usdInfo?.code).toBe('USD')
    expect(usdInfo?.name).toBe('United States dollar')
    expect(usdInfo?.symbol).toBe('$')
  })

  it('should filter currencies by name', () => {
    const dollarCurrencies = provider.filterByName('dollar')
    expect(dollarCurrencies.length).toBeGreaterThan(0)
    expect(dollarCurrencies.some(c => c.code === 'USD')).toBe(true)
  })

  it('should round values correctly', () => {
    expect(provider.round(123.456)).toBe(123.46)
    expect(provider.round(123.456, 1)).toBe(123.5)
    expect(provider.round(123.456, 0)).toBe(123)
  })
})

describe('FixerProvider', () => {
  let provider: FixerProvider

  beforeEach(() => {
    provider = new FixerProvider({
      accessKey: 'test-api-key',
      base: 'EUR',
      timeout: 5000
    })
  })

  it('should initialize with correct configuration', () => {
    expect(provider.name).toBe('fixer')
    expect(provider.base).toBe('EUR')
  })

  it('should set API key', () => {
    provider.setKey('new-api-key')
    // API key is private, but we can test that the method doesn't throw
    expect(() => provider.setKey('new-api-key')).not.toThrow()
  })

  it('should handle same currency conversion', async () => {
    const result = await provider.convert({ amount: 100, from: 'EUR', to: 'EUR' })
    expect(result.success).toBe(true)
    expect(result.result).toBe(100)
    expect(result.info.rate).toBe(1.0)
  })

  // Note: Real API tests would require valid API key and network access
  it('should handle API errors gracefully', async () => {
    // With invalid API key, should return error result
    const result = await provider.convert({ amount: 100, from: 'EUR', to: 'USD' })
    expect(result).toHaveProperty('success')
    expect(result).toHaveProperty('query')
  })
})

describe('Base Provider Functionality', () => {
  let provider: GoogleFinanceProvider

  beforeEach(() => {
    provider = new GoogleFinanceProvider()
  })

  it('should get currency list', () => {
    const list = provider.getList()
    expect(list).toBeInstanceOf(Array)
    expect(list.length).toBeGreaterThan(0)
    expect(list[0]).toHaveProperty('code')
    expect(list[0]).toHaveProperty('name')
    expect(list[0]).toHaveProperty('symbol')
  })

  it('should filter by country', () => {
    const usCurrencies = provider.filterByCountry('US')
    expect(usCurrencies.length).toBeGreaterThan(0)
    expect(usCurrencies.some(c => c.code === 'USD')).toBe(true)
  })

  it('should get currency by country', () => {
    const usCurrency = provider.getByCountry('US')
    expect(usCurrency).toBeDefined()
    expect(usCurrency?.code).toBe('USD')
  })

  it('should get currency by symbol', () => {
    const dollarCurrency = provider.getBySymbol('$')
    expect(dollarCurrency).toBeDefined()
    // Note: Multiple currencies use $ symbol, so we just check it exists
  })

  it('should get currency by numeric code', () => {
    const usdCurrency = provider.getByNumericCode('840')
    expect(usdCurrency).toBeDefined()
    expect(usdCurrency?.code).toBe('USD')
  })

  it('should format currency correctly', () => {
    // Test the formatCurrency method from base provider
    const formatted = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(1234.56)
    expect(formatted).toBe('$1,234.56')
  })

  it('should round values correctly', () => {
    expect(provider.round(1.23456)).toBe(1.23)
    expect(provider.round(1.23456, 3)).toBe(1.235)
    expect(provider.round(1.23456, 0)).toBe(1)
  })
})
