import { createCurrency, exchanges, CurrencyService, BaseCurrencyExchange } from '../src/index.js'
import { RateCache, RateLimiter } from '../src/utils/cache.js'

// Initialize cache and rate limiter
const cache = new RateCache(3600000) // 1 hour TTL
const limiter = new RateLimiter(60, 60000) // 60 requests per minute

// Define known exchanges type
type KnownExchanges = {
  google: BaseCurrencyExchange
  fixer?: BaseCurrencyExchange 
}

// Create currency service with Google Finance provider
const currency = createCurrency<KnownExchanges>({
  default: 'google',
  exchanges: {
    google: exchanges.google({
      base: 'USD',
      timeout: 5000
    })
  } as KnownExchanges
})

// Example 1: Basic conversion with error handling
async function basicConversion() {
  try {
    const result = await currency.convert({
      amount: 100,
      from: 'USD',
      to: 'EUR'
    })

    if (result.success) {
      console.log(`$100 USD = €${result.result} EUR`)
      console.log(`Rate: ${result.info.rate}`)
      console.log(`Date: ${result.date}`)
    } else {
      console.error(`Error: ${result.error?.info}`)
    }
  } catch (error) {
    console.error('Conversion failed:', error)
  }
}

// Example 2: Batch conversion with caching
async function batchConversion(amounts: number[], from: string, to: string) {
  const results: { amount: number; result: number | undefined; cached: boolean }[] = []

  for (const amount of amounts) {
    // Check rate limiter
    if (limiter.isLimited()) {
      console.log('Rate limit reached, waiting...')
      await new Promise(resolve => setTimeout(resolve, 1000))
    }

    // Check cache first
    const cachedRate = cache.get(from, to)
    if (cachedRate) {
      results.push({
        amount,
        result: amount * cachedRate,
        cached: true
      })
      continue
    }

    // Get fresh rate
    const result = await currency.convert({
      amount,
      from,
      to
    })

    if (result.success && result.info?.rate) {
      cache.set(from, to, result.info.rate)
      results.push({
        amount,
        result: result.result,
        cached: false
      })
    }
  }

  return results
}

// Example 3: Multiple provider usage
async function compareExchanges() {
  const amounts = [100, 200, 300]
  const currencies = ['EUR', 'GBP', 'JPY']

  // Using Google Finance
  currency.use('google')
  const googleResults = await Promise.all(
    currencies.map(to => currency.convert({
      amount: 100,
      from: 'USD',
      to
    }))
  )

  // Using Fixer (if configured)
  if (currency.getAvailableExchanges().includes('fixer')) {
    currency.use('fixer')
    const fixerResults = await Promise.all(
      currencies.map(to => currency.convert({
        amount: 100,
        from: 'USD',
        to
      }))
    )

    // Compare results
    currencies.forEach((curr, i) => {
      console.log(`\n${curr} comparison:`)
      console.log(`Google: ${googleResults[i].result}`)
      console.log(`Fixer: ${fixerResults[i].result}`)
      console.log(`Difference: ${Math.abs((googleResults[i].result || 0) - (fixerResults[i].result || 0))}`)
    })
  }
}

// Run examples
async function runExamples() {
  console.log('Basic Conversion Example:')
  await basicConversion()

  console.log('\nBatch Conversion Example:')
  const batchResults = await batchConversion([100, 200, 300], 'USD', 'EUR')
  console.log(batchResults)

  console.log('\nProvider Comparison Example:')
  await compareExchanges()
}

runExamples().catch(console.error)
