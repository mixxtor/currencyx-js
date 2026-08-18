# CurrencyX

> Modern TypeScript currency converter with type inference and multiple exchanges. Framework agnostic with clean architecture and minimal dependencies.

[![npm version](https://badge.fury.io/js/@mixxtor%2Fcurrencyx-js.svg)](https://badge.fury.io/js/@mixxtor%2Fcurrencyx-js)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## ✨ Features

- 🚀 **Modern TypeScript** - Full type safety with intelligent inference
- 🔄 **Multiple Exchanges** - Google Finance, Fixer.io, and extensible architecture
- 🎯 **Type Inference** - Smart exchange and configuration type inference
- 🧩 **Framework Agnostic** - Works with any JavaScript/TypeScript project
- 📦 **Minimal Dependencies** - Only axios and cheerio for web scraping
- 🔧 **Extensible** - Easy to add custom exchanges
- 🌐 **Clean APIs** - Intuitive object-based and positional parameter APIs
- ⚡ **High Performance** - Optimized for speed and memory efficiency

## 📦 Installation

```bash
npm install @mixxtor/currencyx-js
```

## 🚀 Quick Start

```typescript
import { createCurrency, exchanges } from '@mixxtor/currencyx-js'

// Create currency service with multiple exchanges
const currency = createCurrency({
  default: 'google',
  exchanges: {
    google: exchanges.google({ base: 'USD' }),
    fixer: exchanges.fixer({ accessKey: 'your-api-key' }),
  },
})

// Convert currency
const result = await currency.convert({
  amount: 100,
  from: 'USD',
  to: 'EUR',
})

if (result.success) {
  console.log(`$100 USD = €${result.result} EUR`)
  console.log(`Exchange rate: ${result.info.rate}`)
}
```

## 📚 API Reference

### Core Methods (Object Parameters)

#### `convert(params: ConvertParams)`

Convert currency with explicit object parameters:

```typescript
const result = await currency.convert({
  amount: 100,
  from: 'USD',
  to: 'EUR',
})

// Result structure
interface ConversionResult {
  success: boolean
  query: { amount: number; from: string; to: string }
  result?: number
  info?: { rate: number; timestamp: number }
  date: string
  error?: { info: string; type?: string }
}
```

#### `getExchangeRates(params: ExchangeRatesParams)`

Get exchange rates with object parameters:

```typescript
const rates = await currency.getExchangeRates({
  base: 'USD',
  codes: ['EUR', 'GBP', 'JPY'],
})

// Result structure
interface ExchangeRatesResult {
  success: boolean
  base: string
  rates: Record<string, number>
  timestamp: number
  date: string
  error?: { info: string; type?: string }
}
```

### Convenience Methods (Positional Parameters)

#### `latestRates({ base, codes })`

Shorthand for getting rates:

```typescript
const rates = await currency.latestRates({
  base: 'USD',
  codes: ['EUR', 'GBP'],
})
```

### Exchange Management

```typescript
// Switch exchanges — `use()` also returns the instance
currency.use('fixer')

// Read one without switching the active exchange
const fixer = currency.get('fixer')

// Get current exchange provider
const current = currency.getCurrentExchange() // 'fixer'

// List available exchanges
const exchanges = currency.getAvailableExchanges() // ['google', 'fixer']

// Narrow an unknown string to a configured exchange name
if (currency.has(name)) {
  currency.use(name)
}
```

> `latestRates({ base })` applies that base to the one call only. Exchange instances are shared, so
> to change an exchange's own default use `currency.get('fixer').setBase('EUR')`.

### Utility Methods

```typescript
// Format currency (object parameters)
const formatted = currency.formatCurrency({
  amount: 1234.56,
  code: 'USD',
  locale: 'en-US',
})
// Result: "$1,234.56"

// Round values
const rounded = currency.round(123.456789, { precision: 2, direction: 'up' })
// Result: 123.46

// Get supported currencies
const currencies = await currency.getSupportedCurrencies()
// Result: ['USD', 'EUR', 'GBP', 'JPY', ...]

// Get current exchange provider
const currentProvider = currency.getCurrentExchange()
// Result: 'google' | 'fixer' | etc.

// Get all available exchanges
const exchanges = currency.getAvailableExchanges()
// Result: ['google', 'fixer']

// Currency information utilities
const allCurrencies = currency.getList()
// Get all available currency information

const usdInfo = currency.getByCode('USD')
// Get currency info by ISO code

const dollarCurrencies = currency.getBySymbol('$')
// Get currency info by symbol

const usCurrency = currency.getByCountry('US')
// Get currency by country code

const euroCurrencies = currency.filterByName('Euro')
// Filter currencies by name

const usCurrencies = currency.filterByCountry('US')
// Filter currencies by country

// Round money according to currency rules
const rounded = currency.roundMoney(123.456, 'USD')
// Automatically rounds according to USD rounding rules
```

## 🔌 Exchanges

### Google Finance Exchange

Free provider, no API key required:

```typescript
const currency = createCurrency({
  default: 'google',
  exchanges: {
    google: exchanges.google({
      base: 'USD', // Base currency (default: 'USD')
      timeout: 5000, // Request timeout in ms (optional)
    }),
  },
})
```

### Fixer.io Exchange

Requires API key from [fixer.io](https://fixer.io):

```typescript
const currency = createCurrency({
  default: 'fixer',
  exchanges: {
    fixer: exchanges.fixer({
      accessKey: 'your-api-key', // Required: Your Fixer.io API key
      base: 'USD', // Base currency (default: 'USD' for this library, Fixer default: 'EUR')
      timeout: 10000, // Request timeout in ms (optional)
    }),
  },
})
```

## ⚙️ Configuration

### Multiple Exchanges Setup

Configure multiple exchanges and switch between them:

```typescript
const currency = createCurrency({
  default: 'google',
  exchanges: {
    google: exchanges.google({ base: 'USD' }),
    fixer: exchanges.fixer({ accessKey: 'your-key' }),
  },
})

// Use Google Finance
currency.use('google')
const googleResult = await currency.convert({
  amount: 100,
  from: 'USD',
  to: 'EUR',
})

// Switch to Fixer.io
currency.use('fixer')
const fixerResult = await currency.convert({
  amount: 100,
  from: 'USD',
  to: 'EUR',
})
```

### Type Safety

Full TypeScript support with intelligent type inference:

```typescript
// Exchange names are type-safe
const currency = createCurrency({
  default: 'google', // ✅ Type-safe
  exchanges: {
    google: exchanges.google({ base: 'USD' }),
    fixer: exchanges.fixer({ accessKey: 'key' }),
  },
})

// Only valid exchange names are allowed
currency.use('google') // ✅ Valid
currency.use('invalid') // ❌ TypeScript error
```

## 🛡️ Error Handling

All methods return result objects with success indicators:

```typescript
const result = await currency.convert({
  amount: 100,
  from: 'USD',
  to: 'EUR',
})

if (result.success) {
  console.log(`Converted: ${result.result}`)
  console.log(`Rate: ${result.info.rate}`)
  console.log(`Timestamp: ${result.info.timestamp}`)
} else {
  console.error(`Error: ${result.error?.info}`)
  console.error(`Type: ${result.error?.type}`)
}
```

## 🔧 Custom Exchanges

### `createExchange()` — describe the API, get the exchange

Most of an exchange is the same everywhere: cross rates, rebasing when the upstream publishes one
fixed base, filtering when it ignores `symbols`, building result objects, mapping failures. Only the
request and the response shape differ. `createExchange()` takes that difference and returns a
`BaseCurrencyExchange` subclass with the rest implemented — the bundled `fixer` and `google`
exchanges are written this way.

**Table mode** — the API answers with a rate table:

```typescript
import { createExchange, CurrencyError, ConfigurationError } from '@mixxtor/currencyx-js'

type MxConfig = { accessKey: string; base?: CurrencyCode; timeout?: number }

export class MxExchange extends createExchange<MxConfig>({
  name: 'mx',
  defaults: { base: 'EUR', timeout: 5000 },

  // Facts about the upstream, so the generated class can compensate:
  //   base          → the ONLY base it publishes; every other base is derived locally
  //   supportsCodes → false means it ignores `symbols`, so filtering happens here
  upstream: { base: 'EUR', supportsCodes: false },

  validate: (config) => {
    if (!config.accessKey) throw new ConfigurationError('Mx exchange requires an accessKey')
  },
  setKey: (config, key) => (config.accessKey = key),

  async fetchRates({ config, base, codes, currencies, signal }) {
    const url = new URL('https://currencyrates.example.dev')
    url.searchParams.set('access_key', config.accessKey)

    const response = await fetch(url, { signal }) // `signal` already honours config.timeout
    const data = await response.json()

    if (!response.ok || !data.success) {
      throw new CurrencyError(data.error ?? `HTTP ${response.status}`, response.status, 'INVALID_ACCESS_KEY')
    }

    return data.rates // just the table — "units of X per 1 base"
  },
}) {}
```

That is the whole exchange. `latestRates({ base, codes })`, `convert()`, `getConvertRate()`,
rebasing, filtering and error results all come from the generated class.

**Pair mode** — the API quotes one pair at a time (this is how `google` works):

```typescript
export class MyScraper extends createExchange({
  name: 'scraper',
  defaults: { base: 'USD' },
  async fetchRate({ from, to, signal }) {
    const response = await fetch(`https://example.test/${from}-${to}`, {
      signal,
    })
    return response.ok ? parseRate(await response.text()) : undefined // undefined → code drops out
  },
}) {}
```

**Optional pieces**

| Key                      | When to use it                                                                               |
| ------------------------ | -------------------------------------------------------------------------------------------- |
| `convert`                | The API has its own conversion endpoint (fixer does). Otherwise `amount × getConvertRate()`. |
| `upstream.base`          | The API publishes exactly one base. Omit it when it honours the base you send.               |
| `upstream.supportsCodes` | `false` when `symbols`/`codes` is ignored, so filtering happens locally.                     |
| `validate` / `setKey`    | Reject an unusable config at construction; support `setKey()` rotation.                      |

Throw any `CurrencyError` subclass from a spec callback (`ApiError`, `RateLimitError`,
`ConfigurationError`, …) and its `code`/`type`/message land on the result's `error`. Anything else
becomes a `FETCH_ERROR`.

### Extending `BaseCurrencyExchange` directly

Still fully supported, and the right choice for an API the spec cannot describe — several requests
to assemble one table, its own caching layer, a non-HTTP transport. You implement `latestRates`,
`convert` and `getConvertRate` yourself and get the protected helpers in return:

```typescript
import { BaseCurrencyExchange } from '@mixxtor/currencyx-js'
import type { ConvertParams, ExchangeRatesParams } from '@mixxtor/currencyx-js'

class CustomExchange extends BaseCurrencyExchange {
  readonly name = 'custom'

  constructor(config: { base: string; apiKey?: string }) {
    super()
    this.base = config.base || 'USD'
    // Initialize with your config
  }

  // Resolve the base per call — `this.base` is the instance default, `params.base` overrides it
  // for that call only. Never assign to `this.base` in a request path: the instance is shared.
  async latestRates(params?: ExchangeRatesParams) {
    const base = this.resolveBase(params)
    const rates = await this.fetchSomehow(base)

    return this.createExchangeRatesResult(base, rates)
  }

  async convert(params: ConvertParams) {
    const rate = await this.getConvertRate(params.from, params.to)

    return rate === undefined
      ? this.createConversionResult(params.amount, params.from, params.to, undefined, undefined, {
          info: `No rate for ${params.from}-${params.to}`,
          type: 'RATE_NOT_FOUND',
        })
      : this.createConversionResult(params.amount, params.from, params.to, params.amount * rate, rate)
  }

  async getConvertRate(from: CurrencyCode, to: CurrencyCode) {
    /* ... */
  }
}
```

Both routes produce the same thing — a `BaseCurrencyExchange` — so an exchange can start as a spec
and be rewritten by hand later without its callers noticing.

## 📖 Examples

Check the [examples](./examples) directory for more usage patterns:

- [Selective API Demo](./examples/selective-api-demo.ts) - Demonstrates the API design principles

## 🔄 Migration Guide

### From v0.x to v1.x

The API has been simplified and modernized:

```typescript
// Old API (v0.x)
const currency = new CurrencyService()
currency.addProvider('google', new GoogleProvider())
const result = await currency.convert(100, 'USD', 'EUR')

// New API (v1.x)
const currency = createCurrency({
  default: 'google',
  exchanges: {
    google: exchanges.google({ base: 'USD' }),
  },
})
const result = await currency.convert({ amount: 100, from: 'USD', to: 'EUR' })
```

## 📋 Requirements

- **Node.js** >= 18.0.0
- **TypeScript** >= 4.5.0 (for TypeScript projects)

## Dependencies

- **axios** - For HTTP requests to currency APIs
- **cheerio** - For HTML parsing (Google Finance web scraping)

## 🤝 Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

## 📄 License

MIT License - see [LICENSE](./LICENSE) file for details.

## 📝 Changelog

See [CHANGELOG.md](./CHANGELOG.md) for version history and changes.

---

<div align="center">

**[Documentation](https://github.com/mixxtor/currencyx-js#readme)** • **[Examples](./examples)** • **[Issues](https://github.com/mixxtor/currencyx-js/issues)** • **[Contributing](./CONTRIBUTING.md)**

</div>
