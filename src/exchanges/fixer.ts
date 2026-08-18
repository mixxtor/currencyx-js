/**
 * Fixer.io Exchange
 *
 * Written on `createExchange()`: the request and the two response shapes below are all this file
 * needs to describe. Cross rates, base handling, code filtering, result objects and error mapping
 * come from the generated class.
 */

import type { CurrencyCode, FixerConfig } from '../types/index.js'
import { CurrencyError } from '../errors.js'
import { createExchange } from './create_exchange.js'

const BASE_URL = 'http://data.fixer.io/api'

interface FixerError {
  code: number
  info: string
  type: string
}

interface FixerResponse {
  success: boolean
  timestamp?: number
  base?: string
  date?: string
  rates?: Record<string, number>
  error?: FixerError
}

interface FixerConvertResponse {
  success: boolean
  query?: { from: string; to: string; amount: number }
  info?: { timestamp: number; rate: number }
  date?: string
  result?: number
  error?: FixerError
}

/**
 * Fixer answers a failure with HTTP 200 and `success: false`, so both paths have to be checked.
 */
function assertOk(response: Response, data: { success: boolean; error?: FixerError }): void {
  if (!response.ok) {
    throw new CurrencyError(`HTTP ${response.status}: ${response.statusText}`, response.status, 'API_ERROR')
  }

  if (!data.success) {
    throw new CurrencyError(
      data.error?.info || 'Unknown error from Fixer.io',
      data.error?.code ?? 500,
      data.error?.type || 'API_ERROR',
    )
  }
}

export class FixerExchange extends createExchange<FixerConfig>({
  name: 'fixer',
  // Fixer.io's own default base, kept as the class default for a bare `new FixerExchange(...)`.
  defaults: {
    base: 'EUR' as CurrencyCode,
    timeout: 5000,
  } as Partial<FixerConfig>,

  setKey: (config, key) => {
    config.accessKey = key
  },

  async fetchRates({ config, base, codes, currencies, signal }) {
    const url = new URL(`${BASE_URL}/latest`)
    url.searchParams.set('access_key', config.accessKey)
    url.searchParams.set('base', base)
    url.searchParams.set('symbols', (codes ?? currencies).join(','))

    const response = await fetch(url.toString(), { signal })
    const data = (await response.json()) as FixerResponse
    assertOk(response, data)

    return data.rates || {}
  },

  /** Fixer has a conversion endpoint, so a conversion is one request rather than a rate table. */
  async convert({ config, from, to, amount, signal }) {
    const url = new URL(`${BASE_URL}/convert`)
    url.searchParams.set('access_key', config.accessKey)
    url.searchParams.set('from', from)
    url.searchParams.set('to', to)
    url.searchParams.set('amount', amount.toString())

    const response = await fetch(url.toString(), { signal })
    const data = (await response.json()) as FixerConvertResponse
    assertOk(response, data)

    return { result: data.result as number, rate: data.info?.rate }
  },
}) {}
