import { anthropic } from './client';
import { CreatureNamingContext } from './types';
import { NAME_POOLS } from './fallbacks';
import { CreatureSpecies } from '../types/creature';

const NAMING_SYSTEM_PROMPT = `You are naming a newly hatched creature in a magical island world. Generate exactly ONE name (single word or two short words) for this creature.

Rules:
- The name should feel soft, slightly magical, nature-inspired
- Draw from the creature's species, their zone's atmosphere, and the activity that powers their zone — but subtly, not literally (not "Runny" for a running creature)
- Avoid names that are already taken (listed in existing names)
- The name should feel like it fits this specific creature, not generic
- Good names: Lunara, Vex, Ripple, Fern, Cinder, Mist, Briar, Nova, Sable, Drift
- Bad names: Fluffy, Runner, Sleepy, Buddy, anything with numbers

Return ONLY the name, nothing else.`;

function isValidName(name: string, existing: string[]): boolean {
  const words = name.trim().split(' ');
  return (
    words.length <= 2 &&
    words.every(w => /^[A-Za-z]+$/.test(w)) &&
    !existing.map(n => n.toLowerCase()).includes(name.toLowerCase())
  );
}

function getFallbackName(species: CreatureSpecies, existing: string[]): string {
  const pool = NAME_POOLS[species];
  const available = pool.filter(n => !existing.includes(n));
  if (available.length > 0) {
    return available[Math.floor(Math.random() * available.length)] ?? pool[0] ?? 'Wanderer';
  }
  // All names taken — generate variation
  const base = pool[Math.floor(Math.random() * pool.length)] ?? 'Wanderer';
  return `${base} II`;
}

export async function generateCreatureName(
  context: CreatureNamingContext
): Promise<string> {
  try {
    const message = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 10,
      system: NAMING_SYSTEM_PROMPT,
      messages: [{
        role: 'user',
        content: [
          `Species: ${context.species}`,
          `Zone: ${context.zoneName} (${context.zoneActivity})`,
          `User's most active habits: ${context.dominantActivities.join(', ')}`,
          `Time of hatch: ${context.timeOfHatch}, ${context.season}`,
          `Names already taken: ${context.existingCreatureNames.join(', ') || 'none'}`,
          '',
          'Generate one name.',
        ].join('\n'),
      }],
    });

    const name = message.content[0]?.type === 'text'
      ? message.content[0].text.trim().split('\n')[0]?.trim() ?? null
      : null;

    if (name && isValidName(name, context.existingCreatureNames)) {
      return name;
    }
    return getFallbackName(context.species, context.existingCreatureNames);
  } catch {
    return getFallbackName(context.species, context.existingCreatureNames);
  }
}
