/**
 * Cache implementation for currency rates
 */
export class RateCache {
  private cache: Map<string, { value: number; expires: number }> = new Map()
  private readonly defaultTTL: number

  constructor(defaultTTL: number = 3600000) {
    // 1 hour default TTL
    this.defaultTTL = defaultTTL
  }

  /**
   * Generate cache key for rate pairs
   */
  private getCacheKey(from: string, to: string): string {
    return `${from}:${to}`
  }

  /**
   * Set a value in cache
   */
  set(from: string, to: string, value: number, ttl: number = this.defaultTTL): void {
    const key = this.getCacheKey(from, to)
    this.cache.set(key, {
      value,
      expires: Date.now() + ttl,
    })
  }

  /**
   * Get a value from cache
   */
  get(from: string, to: string): number | null {
    const key = this.getCacheKey(from, to)
    const item = this.cache.get(key)

    if (!item) {
      return null
    }

    if (Date.now() > item.expires) {
      this.cache.delete(key)
      return null
    }

    return item.value
  }

  /**
   * Clear expired entries
   */
  cleanup(): void {
    const now = Date.now()
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expires) {
        this.cache.delete(key)
      }
    }
  }
}

/**
 * Rate limiter implementation
 */
export class RateLimiter {
  private readonly limit: number
  private readonly interval: number
  private requests: number[] = []

  constructor(limit: number = 60, interval: number = 60000) {
    // 60 requests per minute default
    this.limit = limit
    this.interval = interval
  }

  /**
   * Check if rate limit is exceeded
   */
  isLimited(): boolean {
    const now = Date.now()
    this.requests = this.requests.filter((time) => now - time < this.interval)

    if (this.requests.length >= this.limit) {
      return true
    }

    this.requests.push(now)
    return false
  }

  /**
   * Get remaining requests in current window
   */
  remaining(): number {
    const now = Date.now()
    this.requests = this.requests.filter((time) => now - time < this.interval)
    return this.limit - this.requests.length
  }

  /**
   * Reset rate limiter
   */
  reset(): void {
    this.requests = []
  }
}

/**
 * Retry mechanism for API calls
 */
export class RetryMechanism {
  private readonly maxRetries: number
  private readonly baseDelay: number
  private readonly maxDelay: number

  constructor(maxRetries: number = 3, baseDelay: number = 1000, maxDelay: number = 5000) {
    this.maxRetries = maxRetries
    this.baseDelay = baseDelay
    this.maxDelay = maxDelay
  }

  /**
   * Execute function with retry
   */
  async execute<T>(fn: () => Promise<T>): Promise<T> {
    let lastError: Error

    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        return await fn()
      } catch (error) {
        lastError = error as Error

        if (attempt === this.maxRetries) {
          throw error
        }

        const delay = Math.min(this.baseDelay * Math.pow(2, attempt - 1), this.maxDelay)

        await new Promise((resolve) => setTimeout(resolve, delay))
      }
    }

    throw lastError!
  }
}
