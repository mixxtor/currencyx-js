import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { GoogleFinanceExchange } from '../exchanges/google_finance.js'

/**
 * Helper to build a minimal Google Finance HTML response
 */
function buildGoogleFinanceHtml(from: string, to: string, rate: number): string {
  return `<html><body><div data-source="${from}" data-target="${to}"><div>${rate}</div></div></body></html>`
}

describe('GoogleFinanceExchange', () => {
  let exchange: GoogleFinanceExchange
  const originalFetch = globalThis.fetch

  beforeEach(() => {
    exchange = new GoogleFinanceExchange({ base: 'USD' })
  })

  afterEach(() => {
    globalThis.fetch = originalFetch
    vi.restoreAllMocks()
  })

  it('should convert currency successfully', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      text: () => Promise.resolve(buildGoogleFinanceHtml('USD', 'EUR', 0.85)),
    })

    const result = await exchange.convert({
      amount: 100,
      from: 'USD',
      to: 'EUR',
    })

    expect(result.success).toBe(true)
    expect(result.result).toBeLessThan(100)
    expect(result.info?.rate).toBeLessThan(1)
  })

  it('should handle API errors gracefully', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
      statusText: 'Not Found',
    })

    const result = await exchange.convert({
      amount: 100,
      from: 'USD',
      to: 'ABC',
    })

    expect(result.success).toBe(false)
    expect(result.error?.type).toBe('RATE_NOT_FOUND')
  })

  it('should get latest rates', async () => {
    globalThis.fetch = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve(buildGoogleFinanceHtml('USD', 'EUR', 0.85)),
      })
      .mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve(buildGoogleFinanceHtml('USD', 'GBP', 0.73)),
      })

    const result = await exchange.latestRates({
      base: 'USD',
      codes: ['EUR', 'GBP'],
    })

    expect(result.success).toBe(true)
    expect(result.rates).toHaveProperty('EUR')
    expect(result.rates).toHaveProperty('GBP')
  })

  it('should handle network timeouts', async () => {
    globalThis.fetch = vi.fn().mockRejectedValue(new Error('The operation was aborted'))

    const result = await exchange.latestRates({
      base: 'USD',
      codes: ['EUR'],
    })

    expect(result.success).toBe(false)
  })

  it('should return same amount for same currency conversion', async () => {
    const result = await exchange.convert({
      amount: 100,
      from: 'USD',
      to: 'USD',
    })

    expect(result.success).toBe(true)
    expect(result.result).toBe(100)
    expect(result.info?.rate).toBe(1.0)
  })
})
