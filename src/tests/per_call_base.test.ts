/**
 * Per-call base handling.
 *
 * Exchanges are singletons owned by the manager, so `latestRates({ base })` must scope the base to
 * that one call. The service used to apply it with `exchange.setBase(params.base)` — a permanent
 * assignment that leaked into every later base-less call, across requests.
 */

import { describe, it, expect } from 'vitest'
import { createCurrency } from '../index.js'
import { BaseCurrencyExchange } from '../exchanges/base_exchange.js'
import type { ExchangeRatesParams, ExchangeRatesResult, ConversionResult, ConvertParams, CurrencyCode } from '../types/index.js'

/**
 * Records the base each call was made with, so the test asserts on what the exchange actually saw
 * rather than on the shape of the result.
 */
class SpyExchange extends BaseCurrencyExchange {
  readonly name = 'spy'
  seenBases: CurrencyCode[] = []

  constructor(base: CurrencyCode = 'USD') {
    super()
    this.base = base
  }

  async latestRates(params?: ExchangeRatesParams): Promise<ExchangeRatesResult> {
    const base = this.resolveBase(params)
    this.seenBases.push(base)

    return this.createExchangeRatesResult(base, { [base]: 1 })
  }

  async convert(params: ConvertParams): Promise<ConversionResult> {
    return this.createConversionResult(params.amount, params.from, params.to, params.amount, 1)
  }

  async getConvertRate(): Promise<number | undefined> {
    return 1
  }
}

describe('per-call base', () => {
  it('does not leak params.base into later calls', async () => {
    const spy = new SpyExchange('USD')
    const currency = createCurrency({ default: 'spy', exchanges: { spy } })

    await currency.latestRates()
    const scoped = await currency.latestRates({ base: 'JPY' })
    const after = await currency.latestRates()

    expect(scoped.base).toBe('JPY')
    expect(spy.seenBases).toEqual(['USD', 'JPY', 'USD'])
    expect(spy.base).toBe('USD')
    expect(after.base).toBe('USD')
  })

  it('setBase still changes the exchange default', async () => {
    const spy = new SpyExchange('USD')
    const currency = createCurrency({ default: 'spy', exchanges: { spy } })

    spy.setBase('EUR')
    const result = await currency.latestRates()

    expect(result.base).toBe('EUR')
    expect(spy.seenBases).toEqual(['EUR'])
  })

  it('exposes configured exchanges without switching the active one', async () => {
    const usd = new SpyExchange('USD')
    const eur = new SpyExchange('EUR')
    const currency = createCurrency({ default: 'usd', exchanges: { usd, eur } })

    expect(currency.has('eur')).toBe(true)
    expect(currency.has('nope')).toBe(false)
    expect(currency.getAvailableExchanges()).toEqual(['usd', 'eur'])

    expect(currency.get('eur')).toBe(eur)
    expect(currency.getCurrentExchange()).toBe('usd')

    currency.use('eur')
    expect(currency.getCurrentExchange()).toBe('eur')
  })
})
