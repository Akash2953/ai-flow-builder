// SettingsModal: Configuration dialog for API provider credentials and offline mock simulation mode
// Importers/Callers: src/App.tsx
// Affected API: useSettingsStore (apiKeys, mockMode, setApiKey, setMockMode)
// Data Schema: ApiKeys from src/store/useSettingsStore.ts
// User Instruction: "do 2" (Milestone 2 canvas & workspace UI components)

import React, { useState } from "react";
import {
  X,
  Key,
  Shield,
  Eye,
  EyeOff,
  Cpu,
  Zap,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import { useSettingsStore, ApiKeys } from "../../store/useSettingsStore";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ProviderFieldConfig {
  key: keyof ApiKeys;
  label: string;
  placeholder: string;
  docsUrl: string;
  isUrl?: boolean;
  description: string;
}

const PROVIDER_FIELDS: ProviderFieldConfig[] = [
  {
    key: "openai",
    label: "OpenAI API Key",
    placeholder: "sk-proj-...",
    docsUrl: "https://platform.openai.com/api-keys",
    description: "Used for GPT-4o, GPT-4o-mini, and o1 models.",
  },
  {
    key: "anthropic",
    label: "Anthropic API Key",
    placeholder: "sk-ant-api03-...",
    docsUrl: "https://console.anthropic.com/settings/keys",
    description: "Used for Claude 3.5 Sonnet and Claude 3.5 Haiku models.",
  },
  {
    key: "gemini",
    label: "Google Gemini API Key",
    placeholder: "AIzaSy...",
    docsUrl: "https://aistudio.google.com/app/apikey",
    description: "Used for Gemini 1.5 Pro and Gemini 1.5 Flash models.",
  },
  {
    key: "groq",
    label: "Groq API Key",
    placeholder: "gsk_...",
    docsUrl: "https://console.groq.com/keys",
    description: "Used for ultra-low latency Llama 3.3 70B inference.",
  },
  {
    key: "ollamaUrl",
    label: "Ollama Base URL",
    placeholder: "http://localhost:11434",
    docsUrl: "https://ollama.com",
    isUrl: true,
    description: "Used for local open-source models without cloud API keys.",
  },
];

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const apiKeys = useSettingsStore((state) => state.apiKeys);
  const setApiKey = useSettingsStore((state) => state.setApiKey);
  const mockMode = useSettingsStore((state) => state.mockMode);
  const setMockMode = useSettingsStore((state) => state.setMockMode);

  const [visibleKeys, setVisibleKeys] = useState<Record<string, boolean>>({});

  if (!isOpen) return null;

  const toggleVisibility = (key: string) => {
    setVisibleKeys((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-400">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-100">
                Engine & Provider Settings
              </h2>
              <p className="text-xs text-slate-400">
                Configure AI provider keys and execution modes
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 custom-scrollbar">
          {/* Mock Mode Section */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-200">
                  Offline Mock Simulation Mode
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-amber-950/80 text-amber-400 border border-amber-500/30">
                  Zero Cost
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                When enabled, workflows generate realistic simulated responses
                without hitting live provider endpoints or consuming API
                credits.
              </p>
            </div>

            <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
              <input
                type="checkbox"
                checked={mockMode}
                onChange={(e) => setMockMode(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky-600"></div>
            </label>
          </div>

          {/* Provider API Keys List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                API Provider Keys
              </h3>
              <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                <span>Stored locally in your browser</span>
              </div>
            </div>

            <div className="space-y-3">
              {PROVIDER_FIELDS.map((field) => {
                const value = apiKeys[field.key] || "";
                const isVisible = visibleKeys[field.key];

                return (
                  <div
                    key={field.key}
                    className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/80 space-y-2 hover:border-slate-700/80 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                        {field.isUrl ? (
                          <Cpu className="w-3.5 h-3.5 text-purple-400" />
                        ) : (
                          <Zap className="w-3.5 h-3.5 text-sky-400" />
                        )}
                        {field.label}
                      </label>
                      <a
                        href={field.docsUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] text-sky-400 hover:text-sky-300 flex items-center gap-1 transition-colors"
                      >
                        <span>Get key</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>

                    <div className="relative flex items-center">
                      <input
                        type={field.isUrl || isVisible ? "text" : "password"}
                        value={value}
                        onChange={(e) => setApiKey(field.key, e.target.value)}
                        placeholder={field.placeholder}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-100 placeholder-slate-600 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 pr-10"
                      />

                      {!field.isUrl && (
                        <button
                          type="button"
                          onClick={() => toggleVisibility(field.key)}
                          className="absolute right-2.5 p-1 text-slate-500 hover:text-slate-300 transition-colors"
                          title={isVisible ? "Hide Key" : "Show Key"}
                        >
                          {isVisible ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      )}
                    </div>

                    <p className="text-[11px] text-slate-500">{field.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
            <span>Changes auto-save instantly</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-sky-600 text-white hover:bg-sky-500 text-xs font-bold transition-all shadow-md shadow-sky-600/20"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
