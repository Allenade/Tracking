import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Language {
  code: string;
  name: string;
  flag: string;
}

export const languages: Language[] = [
  { code: "EN", name: "English", flag: "🇺🇸" },
  { code: "ES", name: "Español", flag: "🇪🇸" },
  { code: "FR", name: "Français", flag: "🇫🇷" },
  { code: "DE", name: "Deutsch", flag: "🇩🇪" },
  { code: "IT", name: "Italiano", flag: "🇮🇹" },
  { code: "PT", name: "Português", flag: "🇵🇹" },
  { code: "NL", name: "Nederlands", flag: "🇳🇱" },
  { code: "VI", name: "Tiếng Việt", flag: "🇻🇳" },
  { code: "ZH", name: "中文", flag: "🇨🇳" },
  { code: "JA", name: "日本語", flag: "🇯🇵" },
];

interface LanguageStore {
  currentLanguage: Language;
  setLanguage: (language: Language) => void;
  getLanguage: () => Language;
}

export const useLanguageStore = create<LanguageStore>()(
  persist(
    (set, get) => ({
      currentLanguage: languages[0], // Default to English
      setLanguage: (language: Language) => set({ currentLanguage: language }),
      getLanguage: () => get().currentLanguage,
    }),
    {
      name: "language-storage", // unique name for localStorage key
    }
  )
);
