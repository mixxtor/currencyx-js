import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GoogleFinanceExchange } from '../exchanges/google_finance.js'

describe('GoogleFinanceExchange', () => {
  let exchange: GoogleFinanceExchange

  beforeEach(() => {
    exchange = new GoogleFinanceExchange({ base: 'USD' })
    // Mock fetch
    global.fetch = vi.fn()
  })

  it('should convert currency successfully', async () => {
    // const mockResponse = {
    //   ok: true,
    //   json: () => Promise.resolve({ rate: 0.85 })
    // }
    // global.fetch = vi.fn().mockResolvedValue(mockResponse)

    const result = await exchange.convert({
      amount: 100,
      from: 'USD',
      to: 'EUR',
    })

    expect(result.success).toBe(true)
    expect(result.result).toBeLessThan(100)
    expect(result.info?.rate).toBeLessThan(100)
  })

  it('should handle API errors gracefully', async () => {
    // global.fetch = vi.fn().mockRejectedValue(new Error('API Error'))

    const result = await exchange.convert({
      amount: 100,
      from: 'USD',
      to: 'ABC',
    })

    expect(result.success).toBe(false)
    expect(result.error?.type).toBe('RATE_NOT_FOUND')
  })

  it('should get latest rates', async () => {
    // const mockResponse = {
    //   ok: true,
    //   json: () => Promise.resolve({
    //     rates: { EUR: 0.85, GBP: 0.73 }
    //   })
    // }
    // global.fetch = vi.fn().mockResolvedValue(mockResponse)

    const result = await exchange.latestRates({
      base: 'USD',
      codes: ['EUR', 'GBP'],
    })

    expect(result.success).toBe(true)
    expect(result.rates).toHaveProperty('EUR')
    expect(result.rates).toHaveProperty('GBP')
  })

  //   it('should handle network timeouts', async () => {
  //     global.fetch = vi.fn().mockRejectedValue(new Error('Timeout'))

  //     const result = await exchange.latestRates({
  //       base: 'USD',
  //       codes: ['EUR']
  //     })

  //     expect(result.success).toBe(false)
  //     expect(result.error?.type).toBe('timeout_error')
  //   })
})
