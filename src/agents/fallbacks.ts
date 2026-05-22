import { CreatureSpecies } from '../types/creature';
import { TimeOfDay, Season } from '../types/island';

// Static fallback narrations — used if API unavailable
export const NARRATION_FALLBACKS: Record<TimeOfDay, string[]> = {
  dawn: [
    'The island is waking slowly, mist still curled around the lower stones.',
    'Something stirs in the eastern light. The grove has been quiet all night.',
  ],
  morning: [
    'A soft warmth is settling across the meadow. The creatures seem content.',
    'The island is calm this morning. Even the wind spire is still.',
  ],
  afternoon: [
    'The light is long and golden across the higher ground.',
    'Afternoon has brought a certain stillness. Something glints near the lagoon.',
  ],
  evening: [
    'The day is folding in at the edges. Shapes move between the trees.',
    'Evening is settling like a soft cloth over the whole island.',
  ],
  night: [
    'The moon grove is luminous tonight. Something small moves between the roots.',
    'Stars are out over the island. The tide is whispering at the shore.',
  ],
};

export const WEEKLY_FALLBACKS: Record<Season, string[]> = {
  spring: [
    'Your island has been quietly unfolding this week, like something remembering how to grow. The meadow held its colour through the grey days. A patient shimmer in the east suggests something new is considering arrival.',
  ],
  summer: [
    'The island has been warm and full this week. Even the quieter corners held their own kind of light. Something in the grove has been watching the horizon.',
  ],
  autumn: [
    'The week has turned like a slow page. Some parts of the island have grown amber and still. There is a particular beauty in the way things settle before they rest.',
  ],
  winter: [
    'The island has been holding itself carefully this week, the way things do in the cold. What remains is essential. The creatures have found their warmth.',
  ],
};

// Fallback name pools per species
export const NAME_POOLS: Record<CreatureSpecies, string[]> = {
  moon_fox:     ['Lunara', 'Nova', 'Sable', 'Dusk', 'Lyra', 'Mira', 'Soleil', 'Vespera'],
  dream_sprite: ['Wisp', 'Lumen', 'Aura', 'Nimble', 'Haze', 'Cirrus', 'Zephyr'],
  ember_wolf:   ['Vex', 'Cinder', 'Ash', 'Blaze', 'Sear', 'Flint', 'Roan', 'Char'],
  fire_hare:    ['Spark', 'Pip', 'Tinder', 'Glow', 'Flicker', 'Ember'],
  meadow_bunny: ['Clover', 'Fern', 'Pip', 'Briar', 'Moss', 'Wren', 'Sage', 'Rue'],
  forest_deer:  ['Briar', 'Fawn', 'Cedar', 'Elm', 'Reed', 'Birch', 'Hazel', 'Rowan'],
  tide_otter:   ['Ripple', 'Drift', 'Kelp', 'Bay', 'Coral', 'Foam', 'Cove', 'Inlet'],
  cloud_sprite: ['Mist', 'Cirrus', 'Wisp', 'Haze', 'Aura', 'Zephyr', 'Nimbus', 'Veil'],
  rock_sprite:  ['Slate', 'Flint', 'Gravel', 'Tuff', 'Basalt', 'Cairn', 'Shale', 'Grit'],
};
