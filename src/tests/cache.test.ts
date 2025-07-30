import { describe, it, expect, beforeEach } from 'vitest'
import { RateCache, RateLimiter, RetryMechanism } from '../utils/cache'

describe('Cache and Rate Limiting', () => {
  describe('RateCache', () => {
    let cache: RateCache

    beforeEach(() => {
      cache = new RateCache(1000) // 1 second TTL for testing
    })

    it('should store and retrieve values', () => {
      cache.set('USD', 'EUR', 0.85)
      expect(cache.get('USD', 'EUR')).toBe(0.85)
    })

    it('should return null for expired values', async () => {
      cache.set('USD', 'EUR', 0.85, 100) // 100ms TTL
      await new Promise(resolve => setTimeout(resolve, 200))
      expect(cache.get('USD', 'EUR')).toBeNull()
    })

    it('should cleanup expired entries', async () => {
      cache.set('USD', 'EUR', 0.85, 100)
      cache.set('USD', 'GBP', 0.73, 500)
      await new Promise(resolve => setTimeout(resolve, 200))
      cache.cleanup()
      expect(cache.get('USD', 'EUR')).toBeNull()
      expect(cache.get('USD', 'GBP')).toBe(0.73)
    })
  })

  describe('RateLimiter', () => {
    let limiter: RateLimiter

    beforeEach(() => {
      limiter = new RateLimiter(3, 1000) // 3 requests per second
    })

    it('should allow requests within limit', () => {
      expect(limiter.isLimited()).toBe(false)
      expect(limiter.isLimited()).toBe(false)
      expect(limiter.isLimited()).toBe(false)
      expect(limiter.isLimited()).toBe(true)
    })

    it('should track remaining requests', () => {
      expect(limiter.remaining()).toBe(3)
      limiter.isLimited()
      expect(limiter.remaining()).toBe(2)
    })

    it('should reset counter', () => {
      limiter.isLimited()
      limiter.isLimited()
      expect(limiter.remaining()).toBe(1)
      limiter.reset()
      expect(limiter.remaining()).toBe(3)
    })
  })

  describe('RetryMechanism', () => {
    let retry: RetryMechanism

    beforeEach(() => {
      retry = new RetryMechanism(3, 100, 500)
    })

    it('should retry failed operations', async () => {
      let attempts = 0
      const operation = async () => {
        attempts++
        if (attempts < 3) {
          throw new Error('Temporary failure')
        }
        return 'success'
      }

      const result = await retry.execute(operation)
      expect(result).toBe('success')
      expect(attempts).toBe(3)
    })

    it('should throw after max retries', async () => {
      const operation = async () => {
        throw new Error('Permanent failure')
      }

      await expect(retry.execute(operation)).rejects.toThrow('Permanent failure')
    })
  })
})
