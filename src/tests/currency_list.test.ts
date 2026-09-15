/**
 * The built-in currency list is shared by every caller in the process.
 *
 * `getList()` used to return the module's own array and the lookups its own objects, so a caller that
 * decorated an entry (`entry.rate = …`) or sorted the list in place changed what every later caller —
 * including other requests — got back.
 */

import { describe, it, expect } from 'vitest'
import { getByCode, getList } from '../data/currencies.js'
import { GoogleFinanceExchange } from '../exchanges/google_finance.js'

describe('currency list', () => {
  it('returns a new array on every call', () => {
    expect(getList()).not.toBe(getList())
    expect(getList()).toEqual(getList())
  })

  it('is not reordered by sorting a returned list in place', () => {
    const firstBefore = getList()[0].code

    getList().sort((a, b) => b.code.localeCompare(a.code))

    expect(getList()[0].code).toBe(firstBefore)
  })

  it('rejects writes onto a shared entry instead of leaking them to other callers', () => {
    const usd = getByCode('USD') as unknown as Record<string, unknown>

    expect(Object.isFrozen(usd)).toBe(true)
    expect(() => {
      usd.rate = 1
    }).toThrow(TypeError)
    expect(getByCode('USD')).not.toHaveProperty('rate')
  })

  it('freezes the nested countries array too', () => {
    const usd = getByCode('USD')!

    expect(() => (usd.countries as unknown as string[]).push('XX')).toThrow(TypeError)
  })

  it('applies to the lists exchanges hand out', () => {
    const exchange = new GoogleFinanceExchange({ base: 'USD' })
    const entry = exchange.getList().find((c) => c.code === 'EUR') as unknown as Record<string, unknown>

    expect(() => {
      entry.group = 'common'
    }).toThrow(TypeError)
  })
})
