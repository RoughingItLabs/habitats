import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Creature, Egg } from '../types/creature';

interface CreatureStore {
  creatures: Creature[];
  eggs: Egg[];
  collection: Creature[]; // Graduated/legendary creatures

  addCreature: (creature: Creature) => void;
  updateCreature: (id: string, updates: Partial<Creature>) => void;
  addEgg: (egg: Egg) => void;
  updateEgg: (id: string, updates: Partial<Egg>) => void;
  removeEgg: (id: string) => void;
  graduateCreature: (id: string) => void;
}

export const useCreatureStore = create<CreatureStore>()(
  persist(
    (set, get) => ({
      creatures: [],
      eggs: [],
      collection: [],

      addCreature: (creature) =>
        set(state => ({ creatures: [...state.creatures, creature] })),

      updateCreature: (id, updates) =>
        set(state => ({
          creatures: state.creatures.map(c => c.id === id ? { ...c, ...updates } : c),
        })),

      addEgg: (egg) =>
        set(state => ({ eggs: [...state.eggs, egg] })),

      updateEgg: (id, updates) =>
        set(state => ({
          eggs: state.eggs.map(e => e.id === id ? { ...e, ...updates } : e),
        })),

      removeEgg: (id) =>
        set(state => ({ eggs: state.eggs.filter(e => e.id !== id) })),

      graduateCreature: (id) => {
        const creature = get().creatures.find(c => c.id === id);
        if (!creature) return;
        set(state => ({
          creatures: state.creatures.filter(c => c.id !== id),
          collection: [...state.collection, { ...creature, hasGraduated: true }],
        }));
      },
    }),
    {
      name: 'creature-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
