/**
 * Base error class for currency operations
 */
export class CurrencyError extends Error {
  public code: number
  public type: string

  constructor(message: string, code: number = 500, type: string = 'general_error') {
    super(message)
    this.name = this.constructor.name
    this.code = code
    this.type = type
  }
}

/**
 * Error thrown when API requests fail
 */
export class ApiError extends CurrencyError {
  constructor(message: string, code: number = 503) {
    super(message, code, 'api_error')
  }
}

/**
 * Error thrown when rate limits are exceeded
 */
export class RateLimitError extends CurrencyError {
  constructor(message: string = 'Rate limit exceeded', code: number = 429) {
    super(message, code, 'rate_limit_error')
  }
}

/**
 * Error thrown when validation fails
 */
export class ValidationError extends CurrencyError {
  constructor(message: string, code: number = 400) {
    super(message, code, 'validation_error')
  }
}

/**
 * Error thrown when currency codes are invalid
 */
export class InvalidCurrencyError extends ValidationError {
  constructor(currency: string) {
    super(`Invalid currency code: ${currency}`, 400)
    this.type = 'invalid_currency_error'
  }
}

/**
 * Error thrown when required configuration is missing
 */
export class ConfigurationError extends CurrencyError {
  constructor(message: string) {
    super(message, 500, 'configuration_error')
  }
}

/**
 * Error thrown when network timeouts occur
 */
export class TimeoutError extends ApiError {
  constructor(message: string = 'Request timed out') {
    super(message, 504)
    this.type = 'timeout_error'
  }
}
