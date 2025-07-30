import { describe, it, expect } from 'vitest'
import {
  validateCurrencyCode,
  validateAmount,
  validateConvertParams,
  validateExchangeRatesParams
} from '../utils/validation'
import { ValidationError, InvalidCurrencyError } from '../errors'

describe('Validation', () => {
  describe('validateCurrencyCode', () => {
    it('should pass for valid currency codes', () => {
      expect(() => validateCurrencyCode('USD')).not.toThrow()
      expect(() => validateCurrencyCode('EUR')).not.toThrow()
      expect(() => validateCurrencyCode('GBP')).not.toThrow()
    })

    it('should throw for invalid currency codes', () => {
      expect(() => validateCurrencyCode('INVALID')).toThrow(InvalidCurrencyError)
      expect(() => validateCurrencyCode('')).toThrow(ValidationError)
      expect(() => validateCurrencyCode('12345')).toThrow(InvalidCurrencyError)
    })
  })

  describe('validateAmount', () => {
    it('should pass for valid amounts', () => {
      expect(() => validateAmount(100)).not.toThrow()
      expect(() => validateAmount(0)).not.toThrow()
      expect(() => validateAmount(99.99)).not.toThrow()
    })

    it('should throw for invalid amounts', () => {
      expect(() => validateAmount(-100)).toThrow(ValidationError)
      expect(() => validateAmount(NaN)).toThrow(ValidationError)
    })
  })

  describe('validateConvertParams', () => {
    it('should pass for valid parameters', () => {
      expect(() => validateConvertParams({
        amount: 100,
        from: 'USD',
        to: 'EUR'
      })).not.toThrow()
    })

    it('should throw for invalid parameters', () => {
      expect(() => validateConvertParams({
        amount: -100,
        from: 'USD',
        to: 'EUR'
      })).toThrow(ValidationError)

      expect(() => validateConvertParams({
        amount: 100,
        from: 'INVALID',
        to: 'EUR'
      })).toThrow(InvalidCurrencyError)

      expect(() => validateConvertParams({
        amount: 100,
        from: 'USD',
        to: 'USD'
      })).toThrow(ValidationError)
    })
  })

  describe('validateExchangeRatesParams', () => {
    it('should pass for valid parameters', () => {
      expect(() => validateExchangeRatesParams({
        base: 'USD',
        codes: ['EUR', 'GBP']
      })).not.toThrow()

      expect(() => validateExchangeRatesParams()).not.toThrow()
    })

    it('should throw for invalid parameters', () => {
      expect(() => validateExchangeRatesParams({
        base: 'INVALID'
      })).toThrow(InvalidCurrencyError)

      expect(() => validateExchangeRatesParams({
        base: 'USD',
        codes: ['INVALID']
      })).toThrow(InvalidCurrencyError)
    })
  })
})
