import { Redis } from '@upstash/redis'

export const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
})

// Cache keys
export const CACHE_KEYS = {
  publications: 'publications:all',
  publicationTiers: (pubId: string) => `publications:${pubId}:tiers`,
  userCart: (userId: string) => `cart:${userId}`,
  campaignDraft: (campaignId: string) => `campaign:${campaignId}:draft`,
} as const

// Cache TTLs (in seconds)
export const CACHE_TTL = {
  publications: 3600, // 1 hour
  tiers: 3600, // 1 hour
  cart: 86400, // 24 hours
  campaignDraft: 604800, // 7 days
} as const
