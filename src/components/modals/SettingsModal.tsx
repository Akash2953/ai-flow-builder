// SettingsModal: Configuration dialog for API provider credentials, offline mock simulation mode, and UI theme preferences
// Importers/Callers: src/App.tsx
// Affected API: useSettingsStore (apiKeys, mockMode, theme, setApiKey, setMockMode, setTheme)
// Data Schema: ApiKeys from src/store/useSettingsStore.ts
// Redesign: Taste-Skill premium developer tool aesthetics with Dual-Theme Tactile Soft-Clay Neumorphic Light & Linear Dark styling

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
  Lock,
  Sun,
  Moon,
  Palette,
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
  badge?: string;
  badgeColor?: string;
  lightBadgeColor?: string;
}

const PROVIDER_FIELDS: ProviderFieldConfig[] = [
  {
    key: "openai",
    label: "OpenAI API Key",
    placeholder: "sk-proj-...",
    docsUrl: "https://platform.openai.com/api-keys",
    description: "Powers GPT-4o, GPT-4o-mini, and reasoning models.",
    badge: "Cloud",
    badgeColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    lightBadgeColor: "text-emerald-700 bg-emerald-500/10 border-emerald-500/30",
  },
  {
    key: "anthropic",
    label: "Anthropic API Key",
    placeholder: "sk-ant-api03-...",
    docsUrl: "https://console.anthropic.com/settings/keys",
    description: "Powers Claude 3.5 Sonnet and Claude 3.5 Haiku models.",
    badge: "Cloud",
    badgeColor: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    lightBadgeColor: "text-amber-700 bg-amber-500/10 border-amber-500/30",
  },
  {
    key: "gemini",
    label: "Google Gemini API Key",
    placeholder: "AIzaSy...",
    docsUrl: "https://aistudio.google.com/app/apikey",
    description: "Powers Gemini 1.5 Pro and Gemini 1.5 Flash models.",
    badge: "Cloud",
    badgeColor: "text-sky-400 bg-sky-500/10 border-sky-500/20",
    lightBadgeColor: "text-sky-700 bg-sky-500/10 border-sky-500/30",
  },
  {
    key: "groq",
    label: "Groq API Key",
    placeholder: "gsk_...",
    docsUrl: "https://console.groq.com/keys",
    description: "Ultra-low latency Llama 3.3 70B & Mixtral execution.",
    badge: "Fast",
    badgeColor: "text-purple-400 bg-purple-500/10 border-purple-500/20",
    lightBadgeColor: "text-purple-700 bg-purple-500/10 border-purple-500/30",
  },
  {
    key: "ollamaUrl",
    label: "Ollama Base URL",
    placeholder: "http://localhost:11434",
    docsUrl: "https://ollama.com",
    isUrl: true,
    description: "Local open-source models without cloud keys or external data transfer.",
    badge: "Local",
    badgeColor: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
    lightBadgeColor: "text-cyan-700 bg-cyan-500/10 border-cyan-500/30",
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
  const theme = useSettingsStore((state) => state.theme);
  const setTheme = useSettingsStore((state) => state.setTheme);
  const isLight = theme === "light";

  const [visibleKeys, setVisibleKeys] = useState<Record<string, boolean>>({});

  if (!isOpen) return null;

  const toggleVisibility = (key: string) => {
    setVisibleKeys((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md animate-fadeIn select-none ${
        isLight ? "bg-[#2C2724]/40" : "bg-slate-950/85"
      }`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={`w-full max-w-xl rounded-2xl overflow-hidden flex flex-col max-h-[90vh] relative border transition-all duration-200 ${
          isLight
            ? "bg-[#FAF8F5] border-[#E7E2D8] text-[#2C2724] shadow-[0_20px_60px_rgba(180,165,145,0.3)]"
            : "bg-[#080d18] border-slate-800/90 text-slate-100 shadow-[0_20px_60px_rgba(0,0,0,0.8)]"
        }`}
      >
        {/* Top Specular Rim */}
        <div
          className={`absolute inset-x-0 top-0 h-[1px] pointer-events-none ${
            isLight
              ? "bg-gradient-to-r from-transparent via-amber-600/30 to-transparent"
              : "bg-gradient-to-r from-transparent via-sky-500/30 to-transparent"
          }`}
        />

        {/* Modal Header */}
        <div
          className={`px-6 py-4 border-b flex items-center justify-between backdrop-blur-sm ${
            isLight
              ? "bg-[#FAF8F5]/90 border-[#E7E2D8]"
              : "bg-[#080d18]/90 border-slate-800/70"
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center border shadow-sm ${
                isLight
                  ? "bg-amber-500/10 border-amber-500/25 text-amber-700"
                  : "bg-sky-500/10 border-sky-500/25 text-sky-400 shadow-[0_0_15px_rgba(56,189,248,0.15)]"
              }`}
            >
              <Key className="w-4 h-4" strokeWidth={2.2} />
            </div>
            <div>
              <h2
                className={`text-sm font-semibold flex items-center gap-2 ${
                  isLight ? "text-[#2C2724]" : "text-slate-100"
                }`}
              >
                Engine & Provider Settings
              </h2>
              <p
                className={`text-[11px] ${
                  isLight ? "text-[#7A7269]" : "text-slate-400"
                }`}
              >
                Configure AI credentials, simulation runtime, and workspace themes
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close Settings"
            className={`p-1.5 rounded-lg active:scale-95 transition-all ${
              isLight
                ? "text-[#7A7269] hover:text-[#2C2724] hover:bg-[#EBE6DD]"
                : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/80"
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 custom-scrollbar">
          {/* Theme Selector Control */}
          <div
            className={`p-4 rounded-xl border flex items-center justify-between gap-4 shadow-sm ${
              isLight
                ? "bg-[#F5F2EB] border-[#E7E2D8]"
                : "bg-gradient-to-br from-[#0c1220] to-[#080d18] border-slate-800/80"
            }`}
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Palette
                  className={`w-4 h-4 ${
                    isLight ? "text-amber-600" : "text-sky-400"
                  }`}
                />
                <span
                  className={`text-xs font-semibold ${
                    isLight ? "text-[#2C2724]" : "text-slate-200"
                  }`}
                >
                  Visual Workspace Theme
                </span>
              </div>
              <p
                className={`text-xs leading-relaxed max-w-sm ${
                  isLight ? "text-[#7A7269]" : "text-slate-400"
                }`}
              >
                Select between the Tactile Soft-Clay Neumorphic palette or Linear Midnight dark mode.
              </p>
            </div>

            {/* Theme Segmented Switch */}
            <div
              className={`flex items-center p-1 rounded-xl border ${
                isLight
                  ? "bg-[#FAF8F5] border-[#E7E2D8] shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)]"
                  : "bg-[#060a12] border-slate-800"
              }`}
            >
              <button
                type="button"
                onClick={() => setTheme("light")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isLight
                    ? "bg-[#EBE6DD] text-[#2C2724] border border-[#D4CEB8] shadow-sm font-semibold"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <Sun className="w-3.5 h-3.5 text-amber-600" />
                <span>Light</span>
              </button>
              <button
                type="button"
                onClick={() => setTheme("dark")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  !isLight
                    ? "bg-slate-800 text-slate-100 border border-slate-700/60 shadow-sm font-semibold"
                    : "text-[#7A7269] hover:text-[#2C2724]"
                }`}
              >
                <Moon className="w-3.5 h-3.5 text-indigo-400" />
                <span>Dark</span>
              </button>
            </div>
          </div>

          {/* Mock Simulation Toggle Box */}
          <div
            className={`p-4 rounded-xl border flex items-start justify-between gap-4 shadow-sm ${
              isLight
                ? "bg-[#F5F2EB] border-[#E7E2D8]"
                : "bg-gradient-to-br from-[#0c1220] to-[#080d18] border-slate-800/80"
            }`}
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs font-semibold ${
                    isLight ? "text-[#2C2724]" : "text-slate-200"
                  }`}
                >
                  Offline Mock Simulation Mode
                </span>
                <span
                  className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-medium border ${
                    isLight
                      ? "bg-amber-500/10 text-amber-700 border-amber-500/30"
                      : "bg-amber-500/10 text-amber-300 border-amber-500/25"
                  }`}
                >
                  Zero Cost
                </span>
              </div>
              <p
                className={`text-xs leading-relaxed max-w-sm ${
                  isLight ? "text-[#7A7269]" : "text-slate-400"
                }`}
              >
                Generates realistic AI and HTTP responses without invoking live provider APIs or consuming token credits.
              </p>
            </div>

            <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
              <input
                type="checkbox"
                checked={mockMode}
                onChange={(e) => setMockMode(e.target.checked)}
                className="sr-only peer"
              />
              <div
                className={`w-11 h-6 rounded-full peer peer-focus:outline-none peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all shadow-inner ${
                  isLight
                    ? "bg-[#E0DACF] peer-checked:bg-amber-600"
                    : "bg-slate-800/90 peer-checked:bg-sky-500"
                }`}
              ></div>
            </label>
          </div>

          {/* Provider API Keys List */}
          <div className="space-y-3.5">
            <div className="flex items-center justify-between">
              <h3
                className={`text-[11px] font-mono uppercase tracking-wider flex items-center gap-1.5 ${
                  isLight ? "text-[#7A7269]" : "text-slate-400"
                }`}
              >
                <Lock
                  className={`w-3 h-3 ${
                    isLight ? "text-[#9C9287]" : "text-slate-500"
                  }`}
                />
                API Provider Keys
              </h3>
              <div
                className={`flex items-center gap-1.5 text-[11px] font-mono ${
                  isLight ? "text-[#7A7269]" : "text-slate-500"
                }`}
              >
                <Shield
                  className={`w-3.5 h-3.5 ${
                    isLight ? "text-emerald-600" : "text-emerald-400"
                  }`}
                />
                <span>Encrypted in browser storage</span>
              </div>
            </div>

            <div className="space-y-2.5">
              {PROVIDER_FIELDS.map((field) => {
                const value = apiKeys[field.key] || "";
                const isVisible = visibleKeys[field.key];
                const isConfigured = Boolean(value.trim());

                return (
                  <div
                    key={field.key}
                    className={`p-3.5 rounded-xl border space-y-2 transition-all ${
                      isLight
                        ? "bg-[#F5F2EB] border-[#E7E2D8] hover:border-[#D4CEB8]"
                        : "bg-[#060a12]/80 border-slate-800/80 hover:border-slate-700/80"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <label
                        className={`text-xs font-medium flex items-center gap-2 ${
                          isLight ? "text-[#2C2724]" : "text-slate-200"
                        }`}
                      >
                        {field.isUrl ? (
                          <Cpu
                            className={`w-3.5 h-3.5 ${
                              isLight ? "text-purple-600" : "text-purple-400"
                            }`}
                          />
                        ) : (
                          <Zap
                            className={`w-3.5 h-3.5 ${
                              isLight ? "text-amber-600" : "text-sky-400"
                            }`}
                          />
                        )}
                        <span>{field.label}</span>
                        {field.badge && (
                          <span
                            className={`px-1.5 py-0.2 text-[9px] font-mono rounded border ${
                              isLight
                                ? field.lightBadgeColor || field.badgeColor
                                : field.badgeColor
                            }`}
                          >
                            {field.badge}
                          </span>
                        )}
                        {isConfigured && (
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isLight
                                ? "bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.5)]"
                                : "bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]"
                            }`}
                          />
                        )}
                      </label>
                      <a
                        href={field.docsUrl}
                        target="_blank"
                        rel="noreferrer"
                        className={`text-[11px] flex items-center gap-1 transition-colors font-medium ${
                          isLight
                            ? "text-amber-700 hover:text-amber-800"
                            : "text-sky-400 hover:text-sky-300"
                        }`}
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
                        className={`w-full rounded-lg px-3 py-1.5 text-xs font-mono pr-9 transition-all ${
                          isLight
                            ? "bg-[#FAF8F5] border border-[#E7E2D8] text-[#2C2724] placeholder-[#9C9287] focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30 shadow-inner"
                            : "bg-[#080d18] border border-slate-800 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-sky-500/80 focus:ring-1 focus:ring-sky-500/50"
                        }`}
                      />

                      {!field.isUrl && (
                        <button
                          type="button"
                          onClick={() => toggleVisibility(field.key)}
                          className={`absolute right-2.5 p-1 transition-colors ${
                            isLight
                              ? "text-[#9C9287] hover:text-[#443E3A]"
                              : "text-slate-500 hover:text-slate-300"
                          }`}
                          title={isVisible ? "Hide Key" : "Show Key"}
                          aria-label={isVisible ? "Hide Key" : "Show Key"}
                        >
                          {isVisible ? (
                            <EyeOff className="w-3.5 h-3.5" />
                          ) : (
                            <Eye className="w-3.5 h-3.5" />
                          )}
                        </button>
                      )}
                    </div>

                    <p
                      className={`text-[11px] leading-normal ${
                        isLight ? "text-[#7A7269]" : "text-slate-500"
                      }`}
                    >
                      {field.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div
          className={`px-6 py-3.5 border-t flex items-center justify-between ${
            isLight
              ? "bg-[#FAF8F5]/90 border-[#E7E2D8]"
              : "bg-[#080d18]/90 border-slate-800/80"
          }`}
        >
          <div
            className={`flex items-center gap-1.5 text-xs font-mono ${
              isLight ? "text-emerald-700" : "text-emerald-400"
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Settings synced locally</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold shadow-md active:scale-95 transition-all ${
              isLight
                ? "bg-[#2C2724] hover:bg-[#443E3A] text-[#FAF8F5]"
                : "bg-sky-500 hover:bg-sky-400 text-slate-950 shadow-sky-500/20"
            }`}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
