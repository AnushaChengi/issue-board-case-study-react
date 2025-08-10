import { create } from "zustand";

interface SettingsState {
  pollingInterval: number; // in milliseconds
  setPollingInterval: (ms: number) => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  pollingInterval: 10000, // default: 10 seconds
  setPollingInterval: (ms) => set({ pollingInterval: ms }),
}));
