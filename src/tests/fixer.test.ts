/**
 * Fixer.io exchange.
 *
 * Fixer's free plan only quotes EUR. The exchange used to forward the configured base, so
 * `exchanges.fixer({ base: 'USD' })` on a free key got `base_currency_access_restricted` and no
 * rates — and a caller that kept the EUR default and stored the table as USD got numbers ~15% off.
 */

import { describe, it, expect, vi, afterEach } from 'vitest'
import { FixerExchange } from '../exchanges/fixer.js'

/** What Fixer answers for `base=EUR&symbols=…`: EUR-quoted rates, its own base omitted. */
const EUR_RATES = { USD: 1.153909, BTC: 0.000015040743, VND: 29917.38605 }

function mockFetch(body: unknown) {
  return vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(JSON.stringify(body), { status: 200 }))
}

function requestedUrl(fetchSpy: ReturnType<typeof mockFetch>): URL {
  return new URL(String(fetchSpy.mock.calls[0][0]))
}

afterEach(() => vi.restoreAllMocks())

describe('FixerExchange', () => {
  it('always asks Fixer for EUR, whatever base is configured', async () => {
    const fetchSpy = mockFetch({ success: true, base: 'EUR', rates: EUR_RATES })

    await new FixerExchange({ accessKey: 'key', base: 'USD' }).latestRates()

    expect(requestedUrl(fetchSpy).searchParams.get('base')).toBe('EUR')
  })

  it('derives the configured base locally', async () => {
    mockFetch({ success: true, base: 'EUR', rates: EUR_RATES })

    const result = await new FixerExchange({ accessKey: 'key', base: 'USD' }).latestRates()

    expect(result.success).toBe(true)
    expect(result.base).toBe('USD')
    expect(result.rates.USD).toBe(1)
    expect(result.rates.EUR).toBeCloseTo(1 / 1.153909, 12)
    expect(result.rates.BTC).toBeCloseTo(0.000015040743 / 1.153909, 18)
    expect(result.rates.BTC).toBeGreaterThan(0)
  })

  it('returns the EUR table as-is when EUR is the base', async () => {
    mockFetch({ success: true, base: 'EUR', rates: EUR_RATES })

    const result = await new FixerExchange({ accessKey: 'key', base: 'EUR' }).latestRates()

    expect(result.base).toBe('EUR')
    expect(result.rates).toEqual({ EUR: 1, ...EUR_RATES })
  })

  it('adds the requested base to the symbols when a code filter is given', async () => {
    const fetchSpy = mockFetch({ success: true, base: 'EUR', rates: { BTC: EUR_RATES.BTC, USD: EUR_RATES.USD } })

    const result = await new FixerExchange({ accessKey: 'key', base: 'USD' }).latestRates({ codes: ['BTC'] })

    expect(requestedUrl(fetchSpy).searchParams.get('symbols')).toBe('BTC,USD')
    expect(Object.keys(result.rates)).toEqual(['BTC'])
  })

  it('surfaces a Fixer error answered with HTTP 200', async () => {
    mockFetch({ success: false, error: { code: 101, type: 'invalid_access_key', info: 'You have not supplied a valid API Access Key.' } })

    const result = await new FixerExchange({ accessKey: 'bad', base: 'USD' }).latestRates()

    expect(result.success).toBe(false)
    expect(result.rates).toEqual({})
    expect(result.error).toMatchObject({ code: 101, type: 'invalid_access_key' })
  })

  it('defaults to the plain-HTTP endpoint and honours a configured baseUrl', async () => {
    const plain = mockFetch({ success: true, base: 'EUR', rates: EUR_RATES })
    await new FixerExchange({ accessKey: 'key' }).latestRates()
    expect(requestedUrl(plain).origin + requestedUrl(plain).pathname).toBe('http://data.fixer.io/api/latest')

    vi.restoreAllMocks()
    const secure = mockFetch({ success: true, base: 'EUR', rates: EUR_RATES })
    await new FixerExchange({ accessKey: 'key', baseUrl: 'https://data.fixer.io/api/' }).latestRates()
    expect(requestedUrl(secure).origin + requestedUrl(secure).pathname).toBe('https://data.fixer.io/api/latest')
  })
})
