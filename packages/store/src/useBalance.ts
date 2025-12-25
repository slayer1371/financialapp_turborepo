import { create } from 'zustand';

interface BalanceStore {
    balance : number;
    setBalance: (value: number) => void;
}

export const useBalance = create<BalanceStore>((set) => ({
    balance: 0,
    setBalance: (value: number) => set({ balance: value }),
}));