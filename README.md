# ⚡ AI Flow Builder

A modern, visual node-based workflow builder and execution engine for orchestrating AI pipelines, data transformations, API requests, and conditional logic.

Built with **React 18**, **TypeScript**, **Vite**, **@xyflow/react (React Flow)**, **Zustand**, and **Tailwind CSS**.

---

## ✨ Features

- **Visual Canvas & DAG Orchestrator**: Drag-and-drop node graph builder with smooth bezier connections, minimap, background grid, and interactive controls.
- **Node Ecosystem**:
  - 🚀 **Trigger Node**: Entry point for workflows supporting manual execution, webhooks, and schedule triggers with customizable payload data.
  - 🤖 **LLM Node**: Multi-provider AI generation (OpenAI, Anthropic, Gemini, Groq, Ollama, Custom Open-AI compatible endpoints) with system prompts, temperature, streaming, and variable substitution.
  - 🔀 **Condition Node**: Branching logic with multiple rule operators (`equals`, `contains`, `greater_than`, `less_than`, `matches_regex`) for routing flows.
  - ⚡ **Transform Node**: Data manipulation and JSON transformation with custom JavaScript expression evaluation.
  - 🌐 **HTTP Request Node**: Outbound REST API calls (`GET`, `POST`, `PUT`, `DELETE`, `PATCH`) with custom headers, query params, and body parsing.
  - 📤 **Output Node**: Terminal sinks for formatting and rendering workflow results.
- **Template Library**: Pre-built workflow templates for common AI patterns (Sentiment Analysis Pipeline, RAG Q&A, Webhook Data Enricher, Multi-step Code Reviewer).
- **Execution Engine & Debugger**: Real-time step-by-step DAG runner with live node execution status, variable resolver (`{{nodeId.outputKey}}`), latency tracking, and execution drawer log viewer.
- **Client-Side Persistence & Export**: Save flows to local storage, import/export JSON workflows, and duplicate flows.

---

## 🚀 Tech Stack

- **Framework**: [React 18](https://react.dev/) + [Vite 6](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Node Graph UI**: [@xyflow/react (React Flow v12)](https://reactflow.dev/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + [Lucide Icons](https://lucide.dev/)

---

## 🛠️ Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/) / [yarn](https://yarnpkg.com/) / [pnpm](https://pnpm.io/)

### Installation

```bash
# Clone repository
git clone https://github.com/Akash2953/ai-flow-builder.git
cd ai-flow-builder

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Production Build

```bash
npm run build
npm run preview
```

---

## 📜 License

MIT
