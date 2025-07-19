# CurrencyX.js

Modern TypeScript currency converter with **type inference** and multiple providers.

## ✨ Features

- 🧠 **Type Inference**: Automatic provider validation at compile time
- 🌍 **Multiple Providers**: Google Finance, Fixer.io (no ApiLayer dependency)
- 🔷 **TypeScript First**: Full type safety with modern ES2022
- 🛠 **Framework Agnostic**: Independent package, works everywhere - Node.js, Express, and more
- ⚡ **Zero Config**: Works out of the box with sensible defaults
- 🧹 **Clean & Simple**: No caching, no logger dependencies - pure currency conversion
- 🔌 **Extensible**: Support for custom providers with contract-based architecture
- 📦 **Provider Configs**: Typed configuration helpers (like `exchanges.google()`, `exchanges.fixer()`)

## 🚀 Quick Start

```bash
npm install @mixxtor/currencyx-js
```

```typescript
import { createCurrency, defineConfig, exchanges } from '@mixxtor/currencyx-js'

// Define configuration with type inference and provider helpers
const config = defineConfig({
  default: 'google' as const,
  providers: {
    google: exchanges.google({ base: 'USD' }),
    fixer: exchanges.fixer({ accessKey: 'your-api-key' })
  }
})

const currency = createCurrency(config)

// Convert currency (new object-based API)
const result = await currency.convert({ amount: 100, from: 'USD', to: 'EUR' })
console.log(result.result) // 85.23

// Or use backward-compatible method
const result2 = await currency.convertAmount(100, 'USD', 'EUR')
console.log(result2.result) // 85.23

// Type-safe provider switching
currency.use('google')    // ✅ Valid
currency.use('fixer')     // ✅ Valid
// currency.use('invalid') // ❌ TypeScript error
```

## 🧠 Type Inference

```typescript
const config = defineConfig({
  default: 'google' as const,
  providers: {
    google: exchanges.google({ base: 'USD' }),
    fixer: exchanges.fixer({ accessKey: process.env.FIXER_API_KEY! })
  }
})

const currency = createCurrency(config)

// ✅ TypeScript knows these are valid
currency.use('google')
currency.use('fixer')

// ❌ TypeScript error - not configured!
// currency.use('invalid')
```

## 🌍 Providers

### Google Finance (Free)
```typescript
providers: {
  google: exchanges.google({
    base: 'USD',      // Optional: base currency
    timeout: 5000     // Optional: request timeout
  })
}
```

### Fixer.io (API Key Required)
```typescript
providers: {
  fixer: exchanges.fixer({
    accessKey: 'your-api-key',  // Required
    base: 'EUR',                // Optional: base currency
    timeout: 5000               // Optional: request timeout
  })
}
```


### Integration (Advanced)

### 1. Configuration
```typescript
// config/currency.ts
import { defineConfig, exchanges } from '@mixxtor/currencyx-js'

const currencyConfig = defineConfig({
  default: 'google' as const,
  providers: {
    google: exchanges.google({ base: 'USD' }),
    fixer: exchanges.fixer({ accessKey: process.env.get('FIXER_API_KEY') })
  }
})

export default currencyConfig

// Module augmentation for better IntelliSense
declare module '@mixxtor/currencyx-js' {
  interface CurrencyProviders extends InferProviders<typeof currencyConfig> {}
}
```

### 2. Usage
```typescript
import { createCurrency } from '@mixxtor/currencyx-js'
import currencyConfig from 'config/currency'

// In your controllers/services
const currency = createCurrency(currencyConfig)

// Type-safe provider switching
currency.use('google')   // ✅
currency.use('fixer')    // ✅
// currency.use('invalid') // ❌ TypeScript error

const result = await currency.convert({ amount: 100, from: 'USD', to: 'EUR' })
```

## 🔄 API Design

### Selective Object-based Parameters

CurrencyX.js uses object-based parameters for **core conversion methods** where it provides the most benefit:

```typescript
// ✅ Core methods use object parameters for clarity
await currency.convert({
  amount: 100,
  from: 'USD',
  to: 'EUR'
})

await currency.getExchangeRates({
  base: 'USD',
  symbols: ['EUR', 'GBP']
})

// ✅ Backward compatibility methods available
await currency.convertAmount(100, 'USD', 'EUR')
await currency.getRates('USD', ['EUR', 'GBP'])

// ✅ Simple methods keep positional parameters
currency.use('google')
currency.round(123.456, 2)
currency.formatCurrency(100, 'USD', 'en-US')
```

**Why selective approach:**
- **Core methods benefit most**: `convert()` and `getExchangeRates()` have multiple parameters
- **Simple methods stay simple**: Single-parameter methods don't need object wrapping
- **Consistent with ecosystem**: Follows patterns like `fetch()` API design
- **Easy migration**: Minimal breaking changes

## 📚 API Reference

### Core Methods

```typescript
// Core methods with object parameters
await currency.convert({ amount, from, to })
await currency.getExchangeRates({ base?, symbols? })

// Backward compatibility for core methods
await currency.convertAmount(amount, from, to)
await currency.getRates(base?, symbols?)

// Simple methods keep positional parameters
currency.use(provider)
currency.getCurrentProvider()
currency.getAvailableProviders()
await currency.isHealthy(provider?)
currency.round(value, precision?)
```

### Utility Methods

```typescript
// Format currency
currency.formatCurrency(amount, currencyCode, locale?)

// Convert and format in one step (uses new API internally)
await currency.convertAndFormat(amount, from, to, locale?)

// Get all providers health status
await currency.getProvidersHealth()
```

## 🔧 Advanced Usage

## 🔧 Custom Providers

You can create custom providers by extending `BaseCurrencyProvider`:

### Custom Provider
```typescript
import { BaseCurrencyProvider } from '@mixxtor/currencyx-js'
import type { CurrencyCode, ConversionResult, ExchangeRatesResult } from '@mixxtor/currencyx-js'

class MyCustomProvider extends BaseCurrencyProvider {
  readonly name = 'mycustom'

  constructor(config: { apiKey: string; baseUrl?: string }) {
    super()
    // Initialize your provider
  }

  async latestRates(symbols?: CurrencyCode[]): Promise<ExchangeRatesResult> {
    // Implement your logic to fetch exchange rates
    const rates = await this.fetchRatesFromAPI(symbols)
    return this.createExchangeRatesResult(this.base, rates)
  }

  async convert(amount: number, from: CurrencyCode, to: CurrencyCode): Promise<ConversionResult> {
    // Implement your conversion logic
    const rate = await this.getConvertRate(from, to)
    if (!rate) {
      return this.createConversionResult(amount, from, to, undefined, undefined, {
        info: 'Rate not found',
        type: 'RATE_NOT_FOUND'
      })
    }

    const result = amount * rate
    return this.createConversionResult(amount, from, to, result, rate)
  }

  async getConvertRate(from: CurrencyCode, to: CurrencyCode): Promise<number | undefined> {
    // Implement your rate fetching logic
    return 1.0 // placeholder
  }

  private async fetchRatesFromAPI(symbols?: CurrencyCode[]): Promise<Record<string, number>> {
    // Your API implementation
    return {}
  }
}

// Usage
const config = defineConfig({
  default: 'mycustom' as const,
  providers: {
    mycustom: new MyCustomProvider({ apiKey: 'your-key' })
  }
})
```

## 📄 License

MIT License - see LICENSE file for details.

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines.

---

**CurrencyX.js** - Simple, type-safe, and powerful currency conversion for modern TypeScript applications.
