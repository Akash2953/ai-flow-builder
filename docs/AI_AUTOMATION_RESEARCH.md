# AI Automation Research — Project Shortlist

> Research conducted 2026-09-20 across 4 domains: Enterprise/Ops, Browser/RPA, Knowledge/Content, DevOps (pending).

---

## Quick Comparison Matrix

| # | Project | Domain | Weekly Hours Saved | Build Complexity | Time to MVP |
|---|---------|--------|--------------------|------------------|-------------|
| 1 | **DocSentinel** | Knowledge / DevRel | 15 hrs | Low | 2–3 weeks |
| 2 | **VendorShield** | Enterprise / SecOps | 20–30 hrs | Low-Med | 2–3 weeks |
| 3 | **IntelRadar** | Market Intelligence | 20 hrs | Medium | 3–4 weeks |
| 4 | **PortaFlow** | Browser / RPA | 30–40 hrs | Medium | 3–4 weeks |
| 5 | **GridMind** | Data / Spreadsheet | 20+ hrs | Med-High | 3–4 weeks |
| 6 | **ReconAI** | Finance / AP | 45–60 hrs | Medium | 3–4 weeks |
| 7 | **OmniPublish** | Marketing / DevRel | 25–35 hrs | Medium | 3–4 weeks |
| 8 | **ActionDesk** | Support / RevOps | 35–50 hrs | High | 3–4 weeks |
| 9 | **FormSentinel** | Compliance / RPA | varies | High | 4–6 weeks |

---

## Top Picks (best ROI x lowest risk)

### 1. DocSentinel — Code-to-Doc Drift Auditor
**One-liner:** CI/CD bot that detects when code changes break documentation and auto-opens fix PRs.

- Plugs into GitHub Actions; runs Tree-sitter AST diff against Markdown/OpenAPI docs
- Flags stale examples, renamed params, removed endpoints
- Opens targeted PRs: `"docs: update /auth signature to v2.4.0 change"`
- MVP: TypeScript + Python repo support, comment-level PR suggestions
- **Why build it:** Every engineering team wastes hours chasing doc rot; zero risk of corrupting live systems (read-only analysis -> PR)

### 2. VendorShield — SOC 2 Vendor Risk Reviewer
**One-liner:** Upload a vendor's SOC 2 PDF; get back filled questionnaire + risk brief in minutes.

- Multi-stage RAG over audit documents (chunked by Trust Services Criteria)
- Extracts auditor exceptions, subservice carve-outs, security posture
- Fills standard Excel questionnaires with verbatim citations
- MVP: Single PDF upload -> 50-question Excel export with page references
- **Why build it:** Pure read/analyze loop — no dangerous API mutations, fastest path to working demo

### 3. IntelRadar — Competitive Intelligence Monitor
**One-liner:** Headless agent that silently tracks competitor sites for pricing, feature, and hiring changes; delivers weekly digest.

- DOM/Markdown diff engine ignores noise (session tokens, ads)
- Classifies deltas: "Pricing Shift", "New Feature", "Key Hire", "API Deprecation"
- Cross-references job postings to infer stealth product bets
- Weekly Slack/email digest with source-grounded evidence
- MVP: 10 competitor domains, daily crawl, emailed summary report

### 4. PortaFlow — Self-Healing Portal Automation
**One-liner:** Logs into fragile vendor portals, downloads invoices/reports, and self-heals when UIs change.

- Explores portal once with LLM, compiles to fast Playwright script
- Only re-invokes LLM on DOM drift / error — 90%+ cost reduction vs live LLM-per-step
- Structured extraction from downloaded files -> ERP webhook
- MVP: 5 portals (AWS Billing, Stripe, Gusto), 2FA via Slack OTP prompt

### 5. ReconAI — 3-Way Invoice Reconciliation
**One-liner:** Ingests invoices via email/upload, matches against ERP POs, auto-approves or flags variances to Slack.

- VLM extraction -> Pydantic schema validation -> deterministic matcher
- NetSuite/QuickBooks API integration
- Straight-through processing for 75-85% of invoices
- MVP: Email + drag-drop ingestion, 2-way PO match, Slack approval cards

### 6. GridMind — Agentic Spreadsheet Enrichment
**One-liner:** Upload a CSV with company names; get back tech stack, CEO, ARR bracket — with source citations per cell.

- Parallel web research agents per row (Exa.ai / Tavily)
- DuckDB/Polars local processing for normalization
- Hover-to-verify source citations in UI
- MVP: 50k-row support, 5 concurrent enrichment queries, formula NL generator

---

## Recommendation

**Fastest to build + zero state-mutation risk:** DocSentinel or VendorShield — working demo in ~2 weeks.
**Best viral/PLG demo:** GridMind — anyone with a messy lead list immediately gets it.
**Highest enterprise ROI:** ReconAI — targets high-cost, high-volume accounting labor.

---

*Research sources: Enterprise/Ops, Browser/Web, Knowledge/Content domain agents (2026-09-20)*
