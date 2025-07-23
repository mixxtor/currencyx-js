/**
 * Currency Data
 * 
 * Contains basic currency information for common currencies
 */

import type { CurrencyInfo } from '../types/index.js'

/**
 * Common currencies list - reduced from 2000+ to essential ones
 * Users can extend this if needed
 */
export const COMMON_CURRENCIES: CurrencyInfo[] = [
  {
    code: 'USD',
    numeric_code: '840',
    name: 'United States dollar',
    symbol: '$',
    round: 0.01,
    decimal: 2,
    delimiter: '.',
    short_format: '${{amount}}',
    explicit_format: '${{amount}} USD',
    countries: ['US'],
  },
  {
    code: 'EUR',
    numeric_code: '978',
    name: 'Euro',
    symbol: '€',
    round: 0.01,
    decimal: 2,
    delimiter: '.',
    short_format: '€{{amount}}',
    explicit_format: '€{{amount}} EUR',
    countries: ['AT', 'BE', 'CY', 'EE', 'FI', 'FR', 'DE', 'GR', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PT', 'SK', 'SI', 'ES'],
  },
  {
    code: 'GBP',
    numeric_code: '826',
    name: 'British pound',
    symbol: '£',
    round: 0.01,
    decimal: 2,
    delimiter: '.',
    short_format: '£{{amount}}',
    explicit_format: '£{{amount}} GBP',
    countries: ['GB'],
  },
  {
    code: 'JPY',
    numeric_code: '392',
    name: 'Japanese yen',
    symbol: '¥',
    round: 1,
    decimal: 0,
    delimiter: '',
    short_format: '¥{{amount}}',
    explicit_format: '¥{{amount}} JPY',
    countries: ['JP'],
  },
  {
    code: 'AUD',
    numeric_code: '036',
    name: 'Australian dollar',
    symbol: 'A$',
    round: 0.01,
    decimal: 2,
    delimiter: '.',
    short_format: 'A${{amount}}',
    explicit_format: 'A${{amount}} AUD',
    countries: ['AU'],
  },
  {
    code: 'CAD',
    numeric_code: '124',
    name: 'Canadian dollar',
    symbol: 'C$',
    round: 0.01,
    decimal: 2,
    delimiter: '.',
    short_format: 'C${{amount}}',
    explicit_format: 'C${{amount}} CAD',
    countries: ['CA'],
  },
  {
    code: 'CHF',
    numeric_code: '756',
    name: 'Swiss franc',
    symbol: 'CHF',
    round: 0.01,
    decimal: 2,
    delimiter: '.',
    short_format: 'CHF {{amount}}',
    explicit_format: 'CHF {{amount}} CHF',
    countries: ['CH', 'LI'],
  },
  {
    code: 'CNY',
    numeric_code: '156',
    name: 'Chinese yuan',
    symbol: '¥',
    round: 0.01,
    decimal: 2,
    delimiter: '.',
    short_format: '¥{{amount}}',
    explicit_format: '¥{{amount}} CNY',
    countries: ['CN'],
  },
  {
    code: 'SEK',
    numeric_code: '752',
    name: 'Swedish krona',
    symbol: 'kr',
    round: 0.01,
    decimal: 2,
    delimiter: '.',
    short_format: '{{amount}} kr',
    explicit_format: '{{amount}} kr SEK',
    countries: ['SE'],
  },
  {
    code: 'NZD',
    numeric_code: '554',
    name: 'New Zealand dollar',
    symbol: 'NZ$',
    round: 0.01,
    decimal: 2,
    delimiter: '.',
    short_format: 'NZ${{amount}}',
    explicit_format: 'NZ${{amount}} NZD',
    countries: ['NZ'],
  },
  {
    code: 'MXN',
    numeric_code: '484',
    name: 'Mexican peso',
    symbol: '$',
    round: 0.01,
    decimal: 2,
    delimiter: '.',
    short_format: '${{amount}}',
    explicit_format: '${{amount}} MXN',
    countries: ['MX'],
  },
  {
    code: 'SGD',
    numeric_code: '702',
    name: 'Singapore dollar',
    symbol: 'S$',
    round: 0.01,
    decimal: 2,
    delimiter: '.',
    short_format: 'S${{amount}}',
    explicit_format: 'S${{amount}} SGD',
    countries: ['SG'],
  },
  {
    code: 'HKD',
    numeric_code: '344',
    name: 'Hong Kong dollar',
    symbol: 'HK$',
    round: 0.01,
    decimal: 2,
    delimiter: '.',
    short_format: 'HK${{amount}}',
    explicit_format: 'HK${{amount}} HKD',
    countries: ['HK'],
  },
  {
    code: 'NOK',
    numeric_code: '578',
    name: 'Norwegian krone',
    symbol: 'kr',
    round: 0.01,
    decimal: 2,
    delimiter: '.',
    short_format: '{{amount}} kr',
    explicit_format: '{{amount}} kr NOK',
    countries: ['NO'],
  },
  {
    code: 'KRW',
    numeric_code: '410',
    name: 'South Korean won',
    symbol: '₩',
    round: 1,
    decimal: 0,
    delimiter: '',
    short_format: '₩{{amount}}',
    explicit_format: '₩{{amount}} KRW',
    countries: ['KR'],
  },
  {
    code: 'TRY',
    numeric_code: '949',
    name: 'Turkish lira',
    symbol: '₺',
    round: 0.01,
    decimal: 2,
    delimiter: '.',
    short_format: '₺{{amount}}',
    explicit_format: '₺{{amount}} TRY',
    countries: ['TR'],
  },
  {
    code: 'RUB',
    numeric_code: '643',
    name: 'Russian ruble',
    symbol: '₽',
    round: 0.01,
    decimal: 2,
    delimiter: '.',
    short_format: '₽{{amount}}',
    explicit_format: '₽{{amount}} RUB',
    countries: ['RU'],
  },
  {
    code: 'INR',
    numeric_code: '356',
    name: 'Indian rupee',
    symbol: '₹',
    round: 0.01,
    decimal: 2,
    delimiter: '.',
    short_format: '₹{{amount}}',
    explicit_format: '₹{{amount}} INR',
    countries: ['IN'],
  },
  {
    code: 'BRL',
    numeric_code: '986',
    name: 'Brazilian real',
    symbol: 'R$',
    round: 0.01,
    decimal: 2,
    delimiter: '.',
    short_format: 'R${{amount}}',
    explicit_format: 'R${{amount}} BRL',
    countries: ['BR'],
  },
  {
    code: 'ZAR',
    numeric_code: '710',
    name: 'South African rand',
    symbol: 'R',
    round: 0.01,
    decimal: 2,
    delimiter: '.',
    short_format: 'R{{amount}}',
    explicit_format: 'R{{amount}} ZAR',
    countries: ['ZA'],
  },
]

export function getCurrencyList() {
  return COMMON_CURRENCIES
}

/**
 * Get currency codes from the common currencies list
 */
export function getCommonCurrencyCodes(): string[] {
  return COMMON_CURRENCIES.map(c => c.code)
}

/**
 * Find currency info by code
 */
export function findCurrencyByCode(code: string): CurrencyInfo | undefined {
  return COMMON_CURRENCIES.find(c => c.code === code)
}

/**
 * Filter currencies by name
 */
export function filterCurrenciesByName(name: string): CurrencyInfo[] {
  return COMMON_CURRENCIES.filter(c =>
    c.name.toLowerCase().includes(name.toLowerCase())
  )
}

/**
 * Filter currencies by country
 */
export function filterCurrenciesByCountry(iso2: string): CurrencyInfo[] {
  return COMMON_CURRENCIES.filter(c =>
    c.countries.includes(iso2.toUpperCase())
  )
}

/**
 * Get all currencies
 */
export function getList() {
  return COMMON_CURRENCIES
}

/**
 * Filter currencies by name
 */
export function filterByName(name: string) {
  return COMMON_CURRENCIES.filter((c) => c.name.includes(name))
}

/**
 * Filter currencies by country
 */
export function filterByCountry(iso2: string) {
  return COMMON_CURRENCIES.filter((c) => c.countries.includes(iso2))
}

/**
 * Get currency info by country ISO2 code (e.g., 'US')
 */
export function getByCountry(iso2: string) {
  return COMMON_CURRENCIES.find((c) => c.countries.includes(iso2))
}

/**
 * Get currency info by ISO code (e.g., 'USD')
 */
export function getByCode(code: string) {
  return COMMON_CURRENCIES.find((c) => c.code === code)
}

/**
 * Get currency info by symbol (e.g., '$')
 */
export function getBySymbol(symbol: string) {
  return COMMON_CURRENCIES.find((c) => c.symbol === symbol)
}

/**
 * Get currency info by numeric code (e.g., '840')
 */
export function getByNumericCode(numCode: string) {
  return COMMON_CURRENCIES.find((c) => c.numeric_code === numCode)
}
