/**
 * Google Finance Exchange
 */

import axios from 'axios'
import type {
  CurrencyCode,
  ConversionResult,
  ExchangeRatesResult,
  GoogleFinanceConfig,
  ExchangeRatesParams,
  ConvertParams,
} from '../types/index.js'
import { BaseCurrencyExchange } from './base_exchange.js'
import * as cheerio from 'cheerio'

export class GoogleFinanceExchange extends BaseCurrencyExchange {
  readonly name = 'google'

  private baseUrl = 'https://www.google.com/finance'
  private timeout: number

  constructor(config: GoogleFinanceConfig = {}) {
    super()
    this.base = config.base || 'USD'
    this.timeout = config.timeout || 5000
  }

  /**
   * Get latest exchange rates
   */
  async latestRates(params?: ExchangeRatesParams): Promise<ExchangeRatesResult> {
    const rates: Record<string, number> = {}
    const currenciesToFetch = params?.codes || this.currencies

    try {
      for (const code of currenciesToFetch) {
        if (code === this.base) {
          rates[code] = 1.0
          continue
        }

        const rate = await this.#getRate(this.base, code)
        if (rate) {
          rates[code] = rate
        }
      }

      return this.createExchangeRatesResult(this.base, rates)
    } catch (error) {
      return this.createExchangeRatesResult(
        this.base,
        {},
        {
          info: error instanceof Error ? error.message : 'Failed to fetch exchange rates',
          type: 'FETCH_ERROR',
        }
      )
    }
  }

  /**
   * Convert currency amount
   */
  async convert(params: ConvertParams): Promise<ConversionResult> {
    const { amount, from, to } = params
    try {
      if (from === to) {
        return this.createConversionResult(amount, from, to, amount, 1.0)
      }

      const rate = await this.#getRate(from, to)
      if (!rate) {
        return this.createConversionResult(amount, from, to, undefined, undefined, {
          info: `Failed to get exchange rate for ${from}-${to}`,
          type: 'RATE_NOT_FOUND',
        })
      }

      const result = rate * amount
      return this.createConversionResult(amount, from, to, result, rate)
    } catch (error) {
      return this.createConversionResult(amount, from, to, undefined, undefined, {
        info: error instanceof Error ? error.message : 'Conversion failed',
        type: 'CONVERSION_ERROR',
      })
    }
  }

  /**
   * Get conversion rate between two currencies
   */
  async getConvertRate(from: CurrencyCode, to: CurrencyCode): Promise<number | undefined> {
    return await this.#getRate(from, to)
  }

  /**
   * Get exchange rate from Google Finance
   */
  async #getRate(from: CurrencyCode, to: CurrencyCode): Promise<number | undefined> {
    try {
      const url = `${this.baseUrl}/quote/${from}-${to}`
      const timeout = 2000
      const userAgent =
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36'

      const response = await axios.get(url, {
        headers: { 'User-Agent': userAgent },
        timeout: timeout,
      })

      const $ = cheerio.load(response.data)
      const block = $(`div[data-source="${from}"][data-target="${to}"]`)
      const rateString = block.children().first().text()
      const stringWithoutCommas = rateString.replace(/,/g, '') // remove commas from the string
      const rate = Number.parseFloat(stringWithoutCommas)
      if (rate && !isNaN(rate)) {
        return rate
      } else {
        console.error(`Google Finance: Failed to get ${from}-${to} rate.`)
      }
    } catch (error) {
      console.error(error)
    }
  }

  /**
   * Parse exchange rate from Google Finance HTML
   */
  #parseRateFromHtml(html: string, from: CurrencyCode, to: CurrencyCode): number | undefined {
    try {
      // Look for the rate in various possible formats
      const patterns = [
        // Pattern for data-source and data-target attributes
        new RegExp(`data-source="${from}"[^>]*data-target="${to}"[^>]*>([^<]*<[^>]*>)*([0-9,]+\\.?[0-9]*)`, 'i'),
        // Pattern for currency pair in title or aria-label
        new RegExp(`${from}\\s*-\\s*${to}[^0-9]*([0-9,]+\\.?[0-9]*)`, 'i'),
        // Pattern for rate value in common Google Finance structure
        new RegExp(`"${from}-${to}"[^}]*"price"[^:]*:[^"]*"([0-9,]+\\.?[0-9]*)"`, 'i'),
        // Fallback pattern for any number after currency pair
        new RegExp(`${from}/${to}[^0-9]*([0-9,]+\\.?[0-9]*)`, 'i'),
      ]

      for (const pattern of patterns) {
        const match = html.match(pattern)
        if (match && match[2]) {
          const rateString = match[2].replace(/,/g, '') // Remove commas
          const rate = parseFloat(rateString)
          if (!isNaN(rate) && rate > 0) {
            return rate
          }
        }
      }

      return undefined
    } catch (error) {
      console.error('Error parsing rate from HTML:', error)
      return undefined
    }
  }
}
