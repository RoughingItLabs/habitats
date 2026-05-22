import { anthropic } from './client';
import { LegendaryLoreContext, SeasonContext } from './types';
import { supabase } from '../supabase/client';
import { Creature } from '../types/creature';
import { ZONE_DEFINITIONS } from '../constants/zones';

const LEGENDARY_LORE_SYSTEM_PROMPT = `Write a short lore entry (3-4 sentences, max 60 words) for a creature that has just reached Legendary status on a living island. This is their permanent record.

Write as if recording the creature's history in a field guide or nature journal. Reference their name, their home zone, and what made them legendary. Tone: quiet, reverent, timeless. Like an entry in an ancient bestiary.`;

const SEASON_FLAVOR_SYSTEM_PROMPT = `Write flavor text for a seasonal event in a cozy wellness island game. Generate three pieces of text:
1. INTRO: 2 sentences introducing the season (max 40 words)
2. TAGLINE: One evocative line for the season pass card (max 12 words)
3. REWARD_DESC: One sentence describing the seasonal cosmetic rewards (max 25 words)

Tone: warm, slightly magical, inviting. Like the opening of a Ghibli film.
Format your response as JSON: { "intro": "...", "tagline": "...", "reward_desc": "..." }`;

export async function generateLegendaryLore(
  creature: Creature,
  daysOnIsland: number,
  season: string
): Promise<string> {
  const zoneDef = ZONE_DEFINITIONS[creature.zoneId];

  const context: LegendaryLoreContext = {
    creatureName: creature.name,
    species: creature.species,
    zoneName: zoneDef.name,
    zoneActivity: zoneDef.activityType,
    daysOnIsland,
    season: season as LegendaryLoreContext['season'],
  };

  // Check if lore already exists
  const { data } = await supabase
    .from('creature_lore')
    .select('lore_text')
    .eq('creature_id', creature.id)
    .single();

  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  if (data?.lore_text) return String(data.lore_text);

  const fallback = `${creature.name} arrived in the ${context.zoneName} quietly, and grew slowly, over many days. Now they move through their home like they have always belonged there.`;

  try {
    const message = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 150,
      system: LEGENDARY_LORE_SYSTEM_PROMPT,
      messages: [{
        role: 'user',
        content: `Creature: ${context.creatureName} (${context.species})\nZone: ${context.zoneName} (${context.zoneActivity})\nDays on island: ${context.daysOnIsland}\nSeason: ${context.season}\n\nWrite their lore entry.`,
      }],
    });

    const lore = message.content[0]?.type === 'text'
      ? message.content[0].text.trim()
      : fallback;

    await supabase.from('creature_lore').insert({
      creature_id: creature.id,
      lore_text: lore,
    });

    return lore;
  } catch {
    return fallback;
  }
}

export async function generateSeasonContent(context: SeasonContext): Promise<{
  intro: string;
  tagline: string;
  reward_desc: string;
} | null> {
  try {
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 300,
      system: SEASON_FLAVOR_SYSTEM_PROMPT,
      messages: [{
        role: 'user',
        content: `Season: ${context.seasonName}\nTheme tags: ${context.themeTags.join(', ')}\nFeatured zone: ${context.featuredZone}\nFeatured creature: ${context.featuredCreature}\n\nGenerate season content.`,
      }],
    });

    const text = message.content[0]?.type === 'text' ? message.content[0].text : null;
    if (!text) return null;

    return JSON.parse(text) as { intro: string; tagline: string; reward_desc: string };
  } catch {
    return null;
  }
}
