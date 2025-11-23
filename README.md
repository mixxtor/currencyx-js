# CurrencyX.js

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
const rates = await currency.latestRates({ base: 'USD', codes: ['EUR', 'GBP'] })
```

### Exchange Management

```typescript
// Switch exchanges
currency.use('fixer')

// Get current exchange provider
const current = currency.getCurrentExchange() // 'fixer'

// List available exchanges
const exchanges = currency.getAvailableExchanges() // ['google', 'fixer']
```

### Utility Methods

```typescript
// Format currency (object parameters)
const formatted = currency.formatCurrency({ amount: 1234.56, code: 'USD', locale: 'en-US' })
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
const googleResult = await currency.convert({ amount: 100, from: 'USD', to: 'EUR' })

// Switch to Fixer.io
currency.use('fixer')
const fixerResult = await currency.convert({ amount: 100, from: 'USD', to: 'EUR' })
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

Extend the system with custom exchanges:

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

  async convert(params: ConvertParams) {
    try {
      // Your custom conversion logic
      const rate = await this.getConvertRate(params.from, params.to)
      const result = params.amount * rate

      return this.createConversionResult(params.amount, params.from, params.to, result, rate)
    } catch (error) {
      return this.createConversionResult(params.amount, params.from, params.to, undefined, undefined, {
        info: error.message,
        type: 'custom_error',
      })
    }
  }

  async latestRates(params: ExchangeRatesParams) {
    try {
      // Your custom rates logic
      const rates = await this.fetchRatesFromAPI(params)

      return this.createExchangeRatesResult(params.base, rates)
    } catch (error) {
      return this.createExchangeRatesResult(params.base, {}, { info: error.message, type: 'custom_error' })
    }
  }

  async getConvertRate(from: string, to: string): Promise<number> {
    // Implement your rate fetching logic
    return 0.85 // Example rate
  }

  private async fetchRatesFromAPI(params: { base: string; codes?: string[] }) {
    // Implement your API call logic
    return { EUR: 0.85, GBP: 0.73 }
  }
}

// Use your custom exchange
const currency = createCurrency({
  default: 'custom',
  exchanges: {
    custom: new CustomExchange({ base: 'USD', apiKey: 'your-key' }),
  },
})
```

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

Made with ❤️ by [Mixxtor](https://github.com/mixxtor)

</div>
