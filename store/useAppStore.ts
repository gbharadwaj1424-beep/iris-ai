import { create } from "zustand";

interface AppState {
  commandPaletteOpen: boolean;
  setCommandPaletteOpen: (open: boolean) => void;
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  reducedMotion: boolean;
  setReducedMotion: (v: boolean) => void;
  assistantOpen: boolean;
  setAssistantOpen: (v: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  commandPaletteOpen: false,
  setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),
  sidebarCollapsed: false,
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  reducedMotion: false,
  setReducedMotion: (v) => set({ reducedMotion: v }),
  assistantOpen: false,
  setAssistantOpen: (v) => set({ assistantOpen: v }),
}));
