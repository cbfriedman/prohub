'use server'

import { generateText } from 'ai'
import { z } from 'zod'

// Schemas
const generatePressReleaseSchema = z.object({
  campaign_name: z.string().min(1, 'Campaign name is required'),
  target_audience: z.string().optional(),
  key_messages: z.string().optional(),
  website_content: z.string().optional(),
})

const generateVideoScriptSchema = z.object({
  campaign_name: z.string().min(1, 'Campaign name is required'),
  press_release_content: z.string().optional(),
  target_audience: z.string().optional(),
})

const scanWebsiteSchema = z.object({
  url: z.string().url('Please enter a valid URL'),
})

export type GeneratePressReleaseInput = z.infer<typeof generatePressReleaseSchema>
export type GenerateVideoScriptInput = z.infer<typeof generateVideoScriptSchema>
export type ScanWebsiteInput = z.infer<typeof scanWebsiteSchema>

// Scan a website and extract key information for press release
export async function scanWebsite(
  input: ScanWebsiteInput
): Promise<{ success: boolean; content?: string; error?: string }> {
  const validatedData = scanWebsiteSchema.safeParse(input)
  if (!validatedData.success) {
    return { success: false, error: validatedData.error.errors[0].message }
  }

  const { url } = validatedData.data

  try {
    // Fetch the website content
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; PRHub/1.0; +https://prhub.com)',
      },
    })

    if (!response.ok) {
      return { success: false, error: `Failed to fetch website: ${response.status}` }
    }

    const html = await response.text()

    // Use AI to extract key information from the HTML
    const result = await generateText({
      model: 'openai/gpt-4o-mini',
      system: `You are a content analyst. Extract key information from website HTML for creating a press release. Focus on:
- Company/Product name
- Main value proposition
- Key features or benefits
- Target audience indicators
- Notable achievements or milestones
- Contact information if available

Return a structured summary that can be used to create a press release.`,
      prompt: `Analyze this website content and extract key information for a press release:\n\n${html.substring(0, 15000)}`,
    })

    return { success: true, content: result.text }
  } catch (error) {
    console.error('Error scanning website:', error)
    return { success: false, error: 'Failed to scan website. Please check the URL and try again.' }
  }
}

// Generate a press release using AI
export async function generatePressRelease(
  input: GeneratePressReleaseInput
): Promise<{ success: boolean; content?: string; error?: string }> {
  const validatedData = generatePressReleaseSchema.safeParse(input)
  if (!validatedData.success) {
    return { success: false, error: validatedData.error.errors[0].message }
  }

  const { campaign_name, target_audience, key_messages, website_content } = validatedData.data

  try {
    const result = await generateText({
      model: 'openai/gpt-4o-mini',
      system: `You are a professional PR writer with years of experience crafting compelling press releases for major publications. Generate newsworthy press releases that follow standard PR format and best practices.

Always include:
- FOR IMMEDIATE RELEASE header
- [CITY, STATE] - [DATE] placeholder
- Compelling, attention-grabbing headline (max 10 words)
- Strong subheadline expanding on the main point
- Opening paragraph with the 5 Ws (Who, What, When, Where, Why)
- 2-3 supporting paragraphs with key details and benefits
- At least one quote from a company spokesperson (use placeholder name like [CEO NAME])
- Bullet points for key features/benefits if appropriate
- Boilerplate "About [Company]" section
- Media contact information placeholders
- ### end marker

Write in a professional, newsworthy tone. Avoid marketing language and focus on facts and impact.`,
      prompt: `Generate a professional press release for: "${campaign_name}"

${website_content ? `Website Analysis:\n${website_content}\n` : ''}
${target_audience ? `Target Audience: ${target_audience}\n` : ''}
${key_messages ? `Key Messages to incorporate:\n${key_messages}\n` : ''}

Write a complete, publication-ready press release.`,
    })

    return { success: true, content: result.text }
  } catch (error) {
    console.error('Error generating press release:', error)
    return { success: false, error: 'Failed to generate press release. Please try again.' }
  }
}

// Generate a video script from press release content
export async function generateVideoScript(
  input: GenerateVideoScriptInput
): Promise<{ success: boolean; content?: string; error?: string }> {
  const validatedData = generateVideoScriptSchema.safeParse(input)
  if (!validatedData.success) {
    return { success: false, error: validatedData.error.errors[0].message }
  }

  const { campaign_name, press_release_content, target_audience } = validatedData.data

  try {
    const result = await generateText({
      model: 'openai/gpt-4o-mini',
      system: `You are a professional video script writer. Generate engaging video scripts that work well for promotional content. Include:
- Scene descriptions in brackets [VISUAL: ...]
- Narrator voice-over text
- Clear scene transitions
- Timecode markers (e.g., 0:00-0:15)
- Call to action
- Total runtime estimate (aim for 60-90 seconds)

Format the script professionally with clear scene breaks and directions.`,
      prompt: `Generate a video script for a campaign called "${campaign_name}".
${target_audience ? `Target Audience: ${target_audience}` : ''}
${press_release_content ? `Based on this press release:\n${press_release_content.substring(0, 2000)}` : ''}

Write the complete video script with scene descriptions, narration, and timing.`,
    })

    return { success: true, content: result.text }
  } catch (error) {
    console.error('Error generating video script:', error)
    return { success: false, error: 'Failed to generate video script. Please try again.' }
  }
}
