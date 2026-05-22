import { anthropic } from './client';
import { NarrationContext } from './types';
import { NARRATION_FALLBACKS } from './fallbacks';
import { supabase } from '../supabase/client';

const NARRATION_SYSTEM_PROMPT = `You are the quiet narrator of a living island world called Habitats. The island grows with the user's real health habits. Your job is to write a single brief observation (1-2 sentences, max 30 words) about what the island feels like right now.

Rules:
- Never mention health metrics, goals, streaks, or numbers
- Never be prescriptive ("you should...") or clinical
- Write as if observing a real living world, not a game
- Tone: warm, slightly magical, like a nature documentary crossed with Studio Ghibli
- Reference specific creature names and zone names when available
- If zones are neglected, be honest but gentle — "quiet" not "failing"
- If something new is happening (egg, legendary), let it shimmer through naturally
- Never use the words: streak, goal, metric, data, health, wellness, app

Good examples:
- "The Moon Grove is unusually still tonight. Lunara has been curled near the old roots."
- "Something golden is moving through the Ember Trail — Vex seems restless today."
- "A new shimmer has appeared at the water's edge. The tide is bringing something."`;

function hashNarrationContext(ctx: NarrationContext): string {
  const key = JSON.stringify({
    zones: ctx.zones.map(z => ({ id: z.id, state: z.state, neglected: z.isNeglected })),
    timeOfDay: ctx.timeOfDay,
    season: ctx.season,
    hasNewEgg: ctx.hasNewEgg,
    hasNewLegendary: ctx.hasNewLegendary,
  });
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = ((hash << 5) - hash + key.charCodeAt(i)) | 0;
  }
  return hash.toString(36);
}

function buildNarrationPrompt(ctx: NarrationContext): string {
  const activeZones = ctx.zones.filter(z => z.state !== 'absent');
  const neglectedZones = ctx.zones.filter(z => z.isNeglected);
  const thrivingZones = ctx.zones.filter(z => z.state === 'thriving');

  return [
    `Island state: ${ctx.timeOfDay}, ${ctx.season}`,
    `Active zones: ${activeZones.map(z =>
      `${z.id} (${z.state}${z.creatures.length > 0 ? `, creatures: ${z.creatures.map(c => c.name).join(', ')}` : ''})`
    ).join(' | ')}`,
    neglectedZones.length > 0 ? `Quiet zones: ${neglectedZones.map(z => z.id).join(', ')}` : '',
    thrivingZones.length > 0 ? `Thriving: ${thrivingZones.map(z => z.id).join(', ')}` : '',
    `Recent activity feel: ${ctx.recentActivity.map(a => `${a.type}: ${a.quality}`).join(', ')}`,
    ctx.hasNewEgg ? 'A new egg has appeared on the beach.' : '',
    ctx.hasNewLegendary ? 'A creature has just reached legendary stage.' : '',
    '',
    'Write one observation about this island right now.',
  ].filter(Boolean).join('\n');
}

function getRandomFallback(ctx: NarrationContext): string {
  const pool = NARRATION_FALLBACKS[ctx.timeOfDay];
  return pool[Math.floor(Math.random() * pool.length)] ?? 'The island is quiet.';
}

export async function generateIslandNarration(
  userId: string,
  context: NarrationContext
): Promise<string> {
  const contextHash = hashNarrationContext(context);

  // Check Supabase cache first
  const { data } = await supabase
    .from('agent_narrations')
    .select('narration')
    .eq('user_id', userId)
    .eq('context_hash', contextHash)
    .single();

  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  if (data?.narration) return String(data.narration);

  try {
    const message = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 80,
      system: NARRATION_SYSTEM_PROMPT,
      messages: [{ role: 'user', content: buildNarrationPrompt(context) }],
    });

    const narration = message.content[0]?.type === 'text'
      ? message.content[0].text.trim()
      : getRandomFallback(context);

    await supabase.from('agent_narrations').upsert({
      user_id: userId,
      context_hash: contextHash,
      narration,
    });

    return narration;
  } catch {
    return getRandomFallback(context);
  }
}
