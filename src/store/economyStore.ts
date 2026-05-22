import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface EconomyStore {
  mossCoins: number;
  seasonPassActive: boolean;
  transactions: { amount: number; reason: string; createdAt: Date }[];

  addCoins: (amount: number, reason: string) => void;
  spendCoins: (amount: number, reason: string) => boolean; // returns false if insufficient
  setSeasonPassActive: (active: boolean) => void;
}

export const useEconomyStore = create<EconomyStore>()(
  persist(
    (set, get) => ({
      mossCoins: 0,
      seasonPassActive: false,
      transactions: [],

      addCoins: (amount, reason) =>
        set(state => ({
          mossCoins: state.mossCoins + amount,
          transactions: [...state.transactions, { amount, reason, createdAt: new Date() }],
        })),

      spendCoins: (amount, reason) => {
        if (get().mossCoins < amount) return false;
        set(state => ({
          mossCoins: state.mossCoins - amount,
          transactions: [...state.transactions, { amount: -amount, reason, createdAt: new Date() }],
        }));
        return true;
      },

      setSeasonPassActive: (active) => set({ seasonPassActive: active }),
    }),
    {
      name: 'economy-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
