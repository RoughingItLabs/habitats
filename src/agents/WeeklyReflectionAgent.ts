import { anthropic } from './client';
import { WeeklyReflectionContext } from './types';
import { WEEKLY_FALLBACKS } from './fallbacks';
import { supabase } from '../supabase/client';

const WEEKLY_REFLECTION_SYSTEM_PROMPT = `You are writing a brief weekly reflection from the perspective of a living island. Write 3-5 sentences (max 80 words) as if the island is gently observing the past week.

Rules:
- Write in second person ("your island", "you") but from the island's perspective
- Never mention numbers, scores, metrics, or streaks
- Celebrate consistency, not intensity — "gentle and steady" is as valid as "thriving"
- Acknowledge neglected areas with acceptance, never guilt
- Mention specific creature names if provided
- End with one quiet, forward-looking sentence about what the island is ready for
- Tone: like receiving a postcard from a place that knows you well`;

function getWeekStart(date: Date): string {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Monday
  d.setDate(diff);
  return d.toISOString().split('T')[0] as string;
}

export async function generateWeeklyReflection(
  context: WeeklyReflectionContext
): Promise<string> {
  const weekStart = getWeekStart(new Date());

  // Only generate once per week
  const { data } = await supabase
    .from('weekly_reflections')
    .select('reflection')
    .eq('user_id', context.userId)
    .eq('week_start', weekStart)
    .single();

  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  if (data?.reflection) return String(data.reflection);

  const fallbackPool = WEEKLY_FALLBACKS[context.season];

  try {
    const risingZones = context.weekSummary.filter(z => z.trend === 'rising');
    const fallingZones = context.weekSummary.filter(z => z.trend === 'falling');
    const allCreatureNames = context.weekSummary.flatMap(z => z.creatureNames);

    const prompt = [
      `Season: ${context.season}, island age: ${context.islandAge} days`,
      risingZones.length > 0 ? `Growing zones this week: ${risingZones.map(z => z.zoneName).join(', ')}` : '',
      fallingZones.length > 0 ? `Quieter zones this week: ${fallingZones.map(z => z.zoneName).join(', ')}` : '',
      allCreatureNames.length > 0 ? `Active creatures: ${allCreatureNames.join(', ')}` : '',
      context.newCreaturesThisWeek.length > 0 ? `Newly hatched: ${context.newCreaturesThisWeek.join(', ')}` : '',
      context.legendariesThisWeek.length > 0 ? `Reached legendary: ${context.legendariesThisWeek.join(', ')}` : '',
    ].filter(Boolean).join('\n');

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 200,
      system: WEEKLY_REFLECTION_SYSTEM_PROMPT,
      messages: [{ role: 'user', content: prompt }],
    });

    const reflection = message.content[0]?.type === 'text'
      ? message.content[0].text.trim()
      : fallbackPool[0] ?? '';

    await supabase.from('weekly_reflections').upsert({
      user_id: context.userId,
      week_start: weekStart,
      reflection,
    });

    return reflection;
  } catch {
    return fallbackPool[Math.floor(Math.random() * fallbackPool.length)] ?? '';
  }
}
