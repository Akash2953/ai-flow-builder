import { create } from "zustand";

export interface ApiKeys {
  openai?: string;
  anthropic?: string;
  gemini?: string;
  groq?: string;
  ollamaUrl?: string;
}

interface SettingsState {
  apiKeys: ApiKeys;
  mockMode: boolean; // When true, simulates realistic AI responses without live API calls
  theme: "dark" | "light";
  setApiKey: (provider: keyof ApiKeys, key: string) => void;
  setMockMode: (enabled: boolean) => void;
  setTheme: (theme: "dark" | "light") => void;
}

const STORAGE_KEY = "ai_flow_builder_settings";

const loadInitialSettings = (): { apiKeys: ApiKeys; mockMode: boolean; theme: "dark" | "light" } => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error("Failed to load settings from localStorage", e);
  }
  return {
    apiKeys: {
      ollamaUrl: "http://localhost:11434",
    },
    mockMode: true, // Default to safe mock mode
    theme: "dark",
  };
};

export const useSettingsStore = create<SettingsState>((set, get) => {
  const initial = loadInitialSettings();

  const persist = (partial: Partial<SettingsState>) => {
    const current = get();
    const updated = {
      apiKeys: partial.apiKeys ?? current.apiKeys,
      mockMode: partial.mockMode !== undefined ? partial.mockMode : current.mockMode,
      theme: partial.theme ?? current.theme,
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error("Failed to persist settings", e);
    }
  };

  return {
    apiKeys: initial.apiKeys,
    mockMode: initial.mockMode,
    theme: initial.theme,

    setApiKey: (provider, key) => {
      set((state) => {
        const nextKeys = { ...state.apiKeys, [provider]: key };
        persist({ apiKeys: nextKeys });
        return { apiKeys: nextKeys };
      });
    },

    setMockMode: (enabled) => {
      set(() => {
        persist({ mockMode: enabled });
        return { mockMode: enabled };
      });
    },

    setTheme: (theme) => {
      set(() => {
        persist({ theme });
        return { theme };
      });
    },
  };
});
