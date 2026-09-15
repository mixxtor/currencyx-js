/**
 * Google Finance Exchange
 *
 * Written on `createExchange()` in **pair mode**: Google quotes one pair per page, so the only
 * thing this file describes is "fetch and scrape one rate". Walking the code list for
 * `latestRates`, short-circuiting `from === to`, and building results is the generated class's job.
 */

import type { CurrencyCode, GoogleFinanceConfig } from '../types/index.js'
import { createExchange } from './create_exchange.js'

const BASE_URL = 'https://www.google.com/finance'
const USER_AGENT =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36'

/**
 * Parse exchange rate from Google Finance HTML
 */
function parseRateFromHtml(html: string, from: CurrencyCode, to: CurrencyCode): number | undefined {
  try {
    const patterns = [
      // Pattern: data-source/data-target div with first child text content
      new RegExp(`data-source="${from}"[^>]*data-target="${to}"[^>]*>\\s*<[^>]*>([0-9][0-9,]*\\.?[0-9]*)`, 'i'),
      // Pattern for data-source and data-target attributes (deeper nesting)
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
      // Try the last captured group first (group 2 if exists, else group 1)
      const rateString = match?.[2] ?? match?.[1]
      if (rateString) {
        const cleaned = rateString.replace(/,/g, '')
        const rate = parseFloat(cleaned)
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

export class GoogleFinanceExchange extends createExchange<GoogleFinanceConfig>({
  name: 'google',
  defaults: { base: 'USD' as CurrencyCode, timeout: 5000 },

  /**
   * Scraping is best-effort: a miss returns `undefined` (the code drops out of the table) rather
   * than throwing, which is what keeps one unavailable pair from failing a whole `latestRates`.
   */
  async fetchRate({ from, to, signal }) {
    try {
      const response = await fetch(`${BASE_URL}/quote/${from}-${to}`, {
        headers: { 'User-Agent': USER_AGENT },
        signal,
      })

      if (!response.ok) {
        console.error(`Google Finance: HTTP ${response.status} for ${from}-${to}`)
        return undefined
      }

      const rate = parseRateFromHtml(await response.text(), from, to)
      if (rate && !isNaN(rate)) {
        return rate
      }

      console.error(`Google Finance: Failed to get ${from}-${to} rate.`)
      return undefined
    } catch (error) {
      console.error(error)
      return undefined
    }
  },
}) {}
