import { z } from 'zod'

// Focus and Geographic enums
export const focusEnum = z.enum(['tech', 'business', 'entertainment', 'general', 'science', 'startup'])
export const geographicEnum = z.enum(['nationwide', 'regional', 'local', 'international'])
export const mediumEnum = z.enum(['print', 'digital', 'broadcast'])
export const regionEnum = z.enum(['west', 'midwest', 'northeast', 'south'])
export const campaignStatusEnum = z.enum(['draft', 'active', 'submitted', 'published'])
export const orderStatusEnum = z.enum(['pending', 'paid', 'failed', 'refunded'])

// Publication schemas
export const publicationSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  description: z.string().nullable(),
  audience: z.string().nullable(),
  focus: focusEnum,
  geographic: geographicEnum,
  region: z.string().nullable(),
  locality: z.string().nullable(),
  frequency: z.string().nullable(),
  medium: z.string().nullable(),
  circulation: z.number().int().min(0),
  publisher_cpm: z.number().min(0),
  sponsored_rate: z.number().nullable(),
  editorial_rate: z.number().nullable(),
  is_free: z.boolean().default(false),
  created_at: z.string().datetime().nullable(),
  updated_at: z.string().datetime().nullable(),
})

export const publicationTierSchema = z.object({
  id: z.string().uuid(),
  publication_id: z.string().uuid(),
  name: z.string().min(1),
  description: z.string().nullable(),
  publisher_rate: z.number().min(0),
  created_at: z.string().datetime().nullable(),
})

// Geographic targeting enums
export const geoCoverageEnum = z.enum(['international', 'national', 'regional', 'state', 'local'])

// Campaign schemas
export const createCampaignSchema = z.object({
  name: z.string().min(1, 'Campaign name is required').max(100, 'Name must be 100 characters or less'),
  target_audience: z.string().max(500).optional(),
  key_messages: z.string().max(2000).optional(),
  geo_coverage: geoCoverageEnum.optional(),
  geo_regions: z.array(z.string()).optional(), // ['west', 'midwest', etc.]
  geo_states: z.array(z.string()).optional(), // ['CA', 'NY', 'TX', etc.]
  geo_counties: z.array(z.string()).optional(), // ['los-angeles', 'san-francisco', etc.]
})

export const updateCampaignSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  target_audience: z.string().max(500).optional(),
  key_messages: z.string().max(2000).optional(),
  press_release_content: z.string().max(50000).optional(),
  video_script_content: z.string().max(50000).optional(),
  publish_to_newsroom: z.boolean().optional(),
  youtube_url: z.string().url().optional().or(z.literal('')),
  status: campaignStatusEnum.optional(),
})

export const campaignSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  name: z.string(),
  status: campaignStatusEnum,
  target_audience: z.string().nullable(),
  key_messages: z.string().nullable(),
  press_release_content: z.string().nullable(),
  video_script_content: z.string().nullable(),
  publish_to_newsroom: z.boolean().default(false),
  youtube_url: z.string().nullable(),
  total_cost: z.number().default(0),
  created_at: z.string().datetime().nullable(),
  updated_at: z.string().datetime().nullable(),
})

// Cart schemas
export const addToCartSchema = z.object({
  publication_id: z.string().uuid('Invalid publication ID'),
  tier_id: z.string().uuid('Invalid tier ID').optional(),
  price: z.number().min(0, 'Price must be positive'),
})

export const cartItemSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  publication_id: z.string().uuid(),
  tier_id: z.string().uuid().nullable(),
  price: z.number(),
  created_at: z.string().datetime().nullable(),
})

// Order schemas
export const createOrderSchema = z.object({
  campaign_id: z.string().uuid().optional(),
  total_amount: z.number().min(0),
})

// Newsroom schemas
export const createNewsroomPostSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  company_name: z.string().min(1, 'Company name is required').max(100),
  excerpt: z.string().max(500).optional(),
  content: z.string().min(1, 'Content is required').max(50000),
  youtube_url: z.string().url().optional().or(z.literal('')),
})

// AI Generation schemas
export const generatePressReleaseSchema = z.object({
  campaign_name: z.string().min(1),
  target_audience: z.string().optional(),
  key_messages: z.string().optional(),
})

export const generateVideoScriptSchema = z.object({
  campaign_name: z.string().min(1),
  press_release_content: z.string().optional(),
  target_audience: z.string().optional(),
})

// Filter schemas for publications
export const publicationFiltersSchema = z.object({
  search: z.string().optional(),
  focus: focusEnum.optional(),
  geographic: geographicEnum.optional(),
  region: regionEnum.optional(),
  locality: z.string().optional(),
})

// Types derived from schemas
export type Publication = z.infer<typeof publicationSchema>
export type PublicationTier = z.infer<typeof publicationTierSchema>
export type Campaign = z.infer<typeof campaignSchema>
export type CreateCampaignInput = z.infer<typeof createCampaignSchema>
export type UpdateCampaignInput = z.infer<typeof updateCampaignSchema>
export type AddToCartInput = z.infer<typeof addToCartSchema>
export type CartItem = z.infer<typeof cartItemSchema>
export type CreateOrderInput = z.infer<typeof createOrderSchema>
export type CreateNewsroomPostInput = z.infer<typeof createNewsroomPostSchema>
export type GeneratePressReleaseInput = z.infer<typeof generatePressReleaseSchema>
export type GenerateVideoScriptInput = z.infer<typeof generateVideoScriptSchema>
export type PublicationFilters = z.infer<typeof publicationFiltersSchema>
export type Focus = z.infer<typeof focusEnum>
export type Geographic = z.infer<typeof geographicEnum>
export type Region = z.infer<typeof regionEnum>
export type Medium = z.infer<typeof mediumEnum>
export type CampaignStatus = z.infer<typeof campaignStatusEnum>
export type OrderStatus = z.infer<typeof orderStatusEnum>
export type GeoCoverage = z.infer<typeof geoCoverageEnum>
