# CurrencyX.js

> Modern TypeScript currency converter with type inference and multiple providers. Framework agnostic with clean architecture.

[![npm version](https://badge.fury.io/js/@mixxtor%2Fcurrencyx-js.svg)](https://badge.fury.io/js/@mixxtor%2Fcurrencyx-js)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## ✨ Features

- 🚀 **Modern TypeScript** - Full type safety with intelligent inference
- 🔄 **Multiple Providers** - Google Finance, Fixer.io, and extensible architecture  
- 🎯 **Type Inference** - Smart provider and configuration type inference
- 🧩 **Framework Agnostic** - Works with any JavaScript/TypeScript project
- 📦 **Zero Dependencies** - Lightweight and fast
- 🔧 **Extensible** - Easy to add custom providers
- 🌐 **Clean APIs** - Intuitive object-based and positional parameter APIs
- ⚡ **High Performance** - Optimized for speed and memory efficiency

## 📦 Installation

```bash
npm install @mixxtor/currencyx-js
```

## 🚀 Quick Start

```typescript
import { createCurrency, exchanges } from '@mixxtor/currencyx-js'

// Create currency service with multiple providers
const currency = createCurrency({
  default: 'google',
  providers: {
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
  symbols: ['EUR', 'GBP', 'JPY'],
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

#### `convertAmount(amount, from, to)`
Shorthand for simple conversions:

```typescript
const result = await currency.convertAmount(100, 'USD', 'EUR')
```

#### `getRates(base, symbols)`
Shorthand for getting rates:

```typescript
const rates = await currency.getRates('USD', ['EUR', 'GBP'])
```

### Provider Management

```typescript
// Switch providers
currency.use('fixer')

// Get current provider
const current = currency.getCurrentProvider() // 'fixer'

// List available providers
const providers = currency.getAvailableProviders() // ['google', 'fixer']
```

### Utility Methods

```typescript
// Format currency
const formatted = currency.formatCurrency(1234.56, 'USD', 'en-US')
// Result: "$1,234.56"

// Round values
const rounded = currency.round(123.456789, 2)
// Result: 123.46

// Get supported currencies
const currencies = await currency.getSupportedCurrencies()
// Result: ['USD', 'EUR', 'GBP', 'JPY', ...]
```

## 🔌 Providers

### Google Finance Provider
Free provider, no API key required:

```typescript
const currency = createCurrency({
  default: 'google',
  providers: {
    google: exchanges.google({
      base: 'USD',        // Base currency (default: 'USD')
      timeout: 5000,      // Request timeout in ms (optional)
    }),
  },
})
```

### Fixer.io Provider
Requires API key from [fixer.io](https://fixer.io):

```typescript
const currency = createCurrency({
  default: 'fixer',
  providers: {
    fixer: exchanges.fixer({
      accessKey: 'your-api-key',  // Required: Your Fixer.io API key
      base: 'EUR',                // Base currency (default: 'EUR')
      timeout: 10000,             // Request timeout in ms (optional)
    }),
  },
})
```

## ⚙️ Configuration

### Multiple Providers Setup
Configure multiple providers and switch between them:

```typescript
const currency = createCurrency({
  default: 'google',
  providers: {
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
// Provider names are type-safe
const currency = createCurrency({
  default: 'google', // ✅ Type-safe
  providers: {
    google: exchanges.google({ base: 'USD' }),
    fixer: exchanges.fixer({ accessKey: 'key' }),
  },
})

// Only valid provider names are allowed
currency.use('google')   // ✅ Valid
currency.use('invalid')  // ❌ TypeScript error
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

## 🔧 Custom Providers

Extend the system with custom providers:

```typescript
import { BaseCurrencyProvider } from '@mixxtor/currencyx-js'
import type { ConvertParams, ExchangeRatesParams } from '@mixxtor/currencyx-js'

class CustomProvider extends BaseCurrencyProvider {
  constructor(config: { base: string; apiKey?: string }) {
    super(config)
  }

  async convert(params: ConvertParams) {
    try {
      // Your custom conversion logic
      const rate = await this.getConvertRate(params.from, params.to)
      const result = params.amount * rate

      return {
        success: true,
        query: params,
        result,
        info: { rate, timestamp: Date.now() },
        date: new Date().toISOString(),
      }
    } catch (error) {
      return {
        success: false,
        query: params,
        date: new Date().toISOString(),
        error: { info: error.message, type: 'custom_error' },
      }
    }
  }

  async latestRates(params: ExchangeRatesParams) {
    try {
      // Your custom rates logic
      const rates = await this.fetchRatesFromAPI(params.base, params.symbols)

      return {
        success: true,
        base: params.base,
        rates,
        timestamp: Date.now(),
        date: new Date().toISOString(),
      }
    } catch (error) {
      return {
        success: false,
        base: params.base,
        rates: {},
        timestamp: Date.now(),
        date: new Date().toISOString(),
        error: { info: error.message, type: 'custom_error' },
      }
    }
  }

  protected async getConvertRate(from: string, to: string): Promise<number> {
    // Implement your rate fetching logic
    return 0.85 // Example rate
  }

  private async fetchRatesFromAPI(base: string, symbols: string[]) {
    // Implement your API call logic
    return { EUR: 0.85, GBP: 0.73 }
  }
}

// Use your custom provider
const currency = createCurrency({
  default: 'custom',
  providers: {
    custom: new CustomProvider({ base: 'USD', apiKey: 'your-key' }),
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
  providers: {
    google: exchanges.google({ base: 'USD' }),
  },
})
const result = await currency.convert({ amount: 100, from: 'USD', to: 'EUR' })
```

## 📋 Requirements

- **Node.js** >= 18.0.0
- **TypeScript** >= 4.5.0 (for TypeScript projects)

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
