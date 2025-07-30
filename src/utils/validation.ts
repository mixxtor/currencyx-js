import { InvalidCurrencyError, ValidationError } from '../errors.js'
import type { CurrencyCode, ConvertParams, ExchangeRatesParams } from '../types/index.js'
import { CURRENCIES } from '../data/currencies.js'

/**
 * Validate currency code
 */
export function validateCurrencyCode(code: string): asserts code is CurrencyCode {
  if (typeof code !== 'string') {
    throw new ValidationError('Currency code must be a string')
  }

  if (!CURRENCIES.some(c => c.code === code.toUpperCase())) {
    throw new InvalidCurrencyError(code)
  }
}

/**
 * Validate amount
 */
export function validateAmount(amount: number): void {
  if (typeof amount !== 'number' || isNaN(amount)) {
    throw new ValidationError('Amount must be a valid number')
  }

  if (amount < 0) {
    throw new ValidationError('Amount cannot be negative')
  }
}

/**
 * Validate conversion parameters
 */
export function validateConvertParams(params: ConvertParams): void {
  if (!params || typeof params !== 'object') {
    throw new ValidationError('Convert parameters must be an object')
  }

  validateAmount(params.amount)
  validateCurrencyCode(params.from)
  validateCurrencyCode(params.to)

  if (params.from === params.to) {
    throw new ValidationError('Source and target currencies cannot be the same')
  }
}

/**
 * Validate exchange rates parameters
 */
export function validateExchangeRatesParams(params?: ExchangeRatesParams): void {
  if (!params) {
    return
  }

  if (params.base) {
    validateCurrencyCode(params.base)
  }

  if (params.codes) {
    if (!Array.isArray(params.codes)) {
      throw new ValidationError('Codes must be an array')
    }

    params.codes.forEach(validateCurrencyCode)
  }
}
