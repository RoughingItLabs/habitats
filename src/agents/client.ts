import Anthropic from '@anthropic-ai/sdk';

// In production, route through Supabase Edge Function — never expose key in bundle.
// For development, direct client calls are fine.
export const anthropic = new Anthropic({
  apiKey: process.env['ANTHROPIC_API_KEY'],
});
