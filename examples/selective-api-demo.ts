/**
 * CurrencyX.js Selective API Demo
 * 
 * Demonstrates the selective object-based parameter approach:
 * - Core methods (convert, getExchangeRates) use object parameters
 * - Simple methods keep positional parameters
 */

import { createCurrency, exchanges } from '../src/index.js'

async function main() {
  // Setup currency service
  const currency = createCurrency({
    default: 'google' as const,
    providers: {
      google: exchanges.google({ base: 'USD' }),
      fixer: exchanges.fixer({ accessKey: 'your-api-key' })
    }
  })

  console.log('🔄 CurrencyX.js Selective API Demo\n')

  // ✅ Core methods use object parameters for clarity
  console.log('📊 Core Methods with Object Parameters:')
  
  try {
    // Convert with object parameters - clear and explicit
    const conversion = await currency.convert({
      amount: 100,
      from: 'USD',
      to: 'EUR'
    })
    
    if (conversion.success) {
      console.log(`💱 Convert: $100 USD = €${conversion.result} EUR`)
      console.log(`📈 Rate: ${conversion.info.rate}`)
    }

    // Get exchange rates with object parameters
    const rates = await currency.getExchangeRates({
      base: 'USD',
      symbols: ['EUR', 'GBP', 'JPY']
    })
    
    if (rates.success) {
      console.log(`📊 Exchange rates from ${rates.base}:`)
      Object.entries(rates.rates).forEach(([code, rate]) => {
        console.log(`   ${code}: ${rate}`)
      })
    }
  } catch (error) {
    console.log('⚠️  API calls failed (expected in demo without real API keys)')
  }

  console.log('\n🔄 Backward Compatibility:')
  
  try {
    // Backward compatibility methods still available
    const legacyConversion = await currency.convertAmount(100, 'USD', 'EUR')
    const legacyRates = await currency.getRates('USD', ['EUR', 'GBP'])
    
    console.log('✅ Legacy methods work identically')
  } catch (error) {
    console.log('⚠️  Legacy API calls failed (expected in demo)')
  }

  // ✅ Simple methods keep positional parameters
  console.log('\n🎯 Simple Methods with Positional Parameters:')
  
  // Provider switching - simple and clear
  currency.use('google')
  console.log(`🔧 Current provider: ${currency.getCurrentProvider()}`)
  
  // Available providers
  const providers = currency.getAvailableProviders()
  console.log(`📋 Available providers: ${providers.join(', ')}`)
  
  // Utility methods
  const rounded = currency.round(123.456789, 2)
  console.log(`🔢 Rounded value: ${rounded}`)
  
  // Currency formatting
  const formatted = currency.formatCurrency(1234.56, 'USD', 'en-US')
  console.log(`💰 Formatted: ${formatted}`)

  console.log('\n✨ Benefits of Selective Approach:')
  console.log('   • Core methods are explicit and extensible')
  console.log('   • Simple methods stay simple')
  console.log('   • Minimal breaking changes')
  console.log('   • Follows ecosystem patterns')
  
  console.log('\n🎯 API Design Principles:')
  console.log('   • Object params for methods with 3+ parameters')
  console.log('   • Positional params for simple utility methods')
  console.log('   • Backward compatibility for core methods')
  console.log('   • Type safety throughout')
}

// Run demo
main().catch(console.error)
