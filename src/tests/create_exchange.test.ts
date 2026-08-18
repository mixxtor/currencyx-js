/**
 * Spec-based exchange authoring.
 *
 * Every case below is work the generated class does on the spec's behalf — rebasing, filtering,
 * cross rates, error mapping — i.e. the code each hand-written exchange used to repeat.
 */

import { describe, it, expect, vi, afterEach } from 'vitest'
import { createExchange, createCurrency, CurrencyError, ConfigurationError } from '../index.js'
import type { CurrencyCode } from '../types/index.js'

type TestConfig = { accessKey?: string; base?: CurrencyCode; timeout?: number }

/** EUR table, the shape a fixed-base upstream answers with. */
const EUR_TABLE = { EUR: 1, USD: 1.1, GBP: 0.85, VND: 30000 }

afterEach(() => vi.restoreAllMocks())

describe('createExchange — table mode', () => {
  const Exchange = createExchange<TestConfig>({
    name: 'table',
    defaults: { base: 'EUR' as CurrencyCode },
    upstream: { base: 'EUR', supportsCodes: false },
    async fetchRates() {
      return { ...EUR_TABLE }
    },
  })

  it('returns the upstream table untouched when the base matches', async () => {
    const result = await new Exchange().latestRates()

    expect(result.success).toBe(true)
    expect(result.base).toBe('EUR')
    expect(result.rates).toEqual(EUR_TABLE)
  })

  it('rebases locally when the caller asks for another base', async () => {
    const result = await new Exchange().latestRates({ base: 'USD' })

    expect(result.base).toBe('USD')
    expect(result.rates.USD).toBe(1)
    expect(result.rates.EUR).toBeCloseTo(1 / 1.1, 10)
    expect(result.rates.VND).toBeCloseTo(30000 / 1.1, 6)
  })

  it('filters to the requested codes when the upstream cannot', async () => {
    const result = await new Exchange().latestRates({ codes: ['USD', 'GBP'] })

    expect(Object.keys(result.rates).sort()).toEqual(['GBP', 'USD'])
  })

  it('reports a base the upstream does not quote', async () => {
    const result = await new Exchange().latestRates({ base: 'JPY' })

    expect(result.success).toBe(false)
    expect(result.error?.type).toBe('UNSUPPORTED_CURRENCY')
  })

  it('derives a cross rate from one request', async () => {
    const fetchRates = vi.fn(async () => ({ ...EUR_TABLE }))
    const Cross = createExchange<TestConfig>({
      name: 'cross',
      defaults: { base: 'EUR' as CurrencyCode },
      upstream: { base: 'EUR' },
      fetchRates,
    })

    const rate = await new Cross().getConvertRate('USD', 'GBP')

    expect(rate).toBeCloseTo(0.85 / 1.1, 10)
    expect(fetchRates).toHaveBeenCalledTimes(1)
  })

  it('converts through the derived rate when the spec has no convert endpoint', async () => {
    const result = await new Exchange().convert({
      amount: 200,
      from: 'USD',
      to: 'GBP',
    })

    expect(result.success).toBe(true)
    expect(result.result).toBeCloseTo(200 * (0.85 / 1.1), 8)
  })
})

describe('createExchange — pair mode', () => {
  const fetchRate = vi.fn(async ({ from, to }: { from: CurrencyCode; to: CurrencyCode }) =>
    from === 'USD' && to === 'GBP' ? 0.77 : undefined,
  )
  const Exchange = createExchange<TestConfig>({
    name: 'pair',
    defaults: { base: 'USD' as CurrencyCode },
    fetchRate,
  })

  it('short-circuits the base without calling the spec', async () => {
    fetchRate.mockClear()
    const result = await new Exchange().latestRates({ codes: ['USD'] })

    expect(result.rates.USD).toBe(1)
    expect(fetchRate).not.toHaveBeenCalled()
  })

  it('walks the requested codes and drops the ones with no rate', async () => {
    const result = await new Exchange().latestRates({
      codes: ['USD', 'GBP', 'JPY'],
    })

    expect(result.rates).toEqual({ USD: 1, GBP: 0.77 })
  })

  it('asks the spec directly for a conversion rate', async () => {
    expect(await new Exchange().getConvertRate('USD', 'GBP')).toBe(0.77)
    expect(await new Exchange().getConvertRate('EUR', 'EUR')).toBe(1)
  })

  it('reports a missing rate as RATE_NOT_FOUND', async () => {
    const result = await new Exchange().convert({
      amount: 10,
      from: 'USD',
      to: 'JPY',
    })

    expect(result.success).toBe(false)
    expect(result.error?.type).toBe('RATE_NOT_FOUND')
  })
})

describe('createExchange — spec plumbing', () => {
  it('maps a thrown CurrencyError to the result error, and anything else to FETCH_ERROR', async () => {
    const Typed = createExchange<TestConfig>({
      name: 'typed',
      async fetchRates() {
        throw new CurrencyError('Unauthorized', 401, 'INVALID_ACCESS_KEY')
      },
    })
    const Untyped = createExchange<TestConfig>({
      name: 'untyped',
      async fetchRates() {
        throw new Error('socket hang up')
      },
    })

    const typed = await new Typed().latestRates()
    expect(typed.error).toEqual({
      code: 401,
      info: 'Unauthorized',
      type: 'INVALID_ACCESS_KEY',
    })

    const untyped = await new Untyped().latestRates()
    expect(untyped.error).toEqual({
      info: 'socket hang up',
      type: 'FETCH_ERROR',
    })
  })

  it('runs validate on construction and applies setKey', async () => {
    const Exchange = createExchange<TestConfig>({
      name: 'validated',
      validate: (config) => {
        if (!config.accessKey) throw new ConfigurationError('validated exchange requires an accessKey')
      },
      setKey: (config, key) => {
        config.accessKey = key
      },
      async fetchRates({ config }) {
        return { KEY: config.accessKey === 'rotated' ? 1 : 0 }
      },
    })

    expect(() => new Exchange()).toThrow('validated exchange requires an accessKey')

    const exchange = new Exchange({ accessKey: 'initial' })
    exchange.setKey('rotated')

    expect((await exchange.latestRates()).rates.KEY).toBe(1)
  })

  it('hands the spec a signal bound to config.timeout', async () => {
    let seen: AbortSignal | undefined
    const Exchange = createExchange<TestConfig>({
      name: 'timeout',
      defaults: { timeout: 20 },
      async fetchRates({ signal }) {
        seen = signal
        return { USD: 1 }
      },
    })

    await new Exchange().latestRates()
    expect(seen).toBeInstanceOf(AbortSignal)
    expect(seen!.aborted).toBe(false)

    await new Promise((resolve) => setTimeout(resolve, 40))
    expect(seen!.aborted).toBe(true)
  })

  it('refuses a spec that declares neither fetchRates nor fetchRate', () => {
    expect(() => createExchange({ name: 'empty' } as never)).toThrow(/must declare fetchRates or fetchRate/)
  })

  it('produces a class the manager and the base helpers accept', async () => {
    class Custom extends createExchange<TestConfig>({
      name: 'custom',
      defaults: { base: 'EUR' as CurrencyCode },
      upstream: { base: 'EUR' },
      async fetchRates() {
        return { ...EUR_TABLE }
      },
    }) {}

    const exchange = new Custom()
    const currency = createCurrency({
      default: 'custom',
      exchanges: { custom: exchange },
    })

    expect(exchange.name).toBe('custom')
    expect(currency.use('custom')).toBe(exchange)
    expect(exchange.getByCode('USD')?.name).toBe('United States dollar')
    expect(exchange.round(1.23456, { precision: 2 })).toBe(1.23)
    expect((await currency.latestRates({ base: 'USD' })).base).toBe('USD')
  })
})
