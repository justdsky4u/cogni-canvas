# Plan: "Data Brain" - AI-Driven Data Intelligence Platform

Building a futuristic, AI-driven data intelligence application that transforms raw data (CSV, JSON, etc.) into insights, strategy, and interactive visualizations.

## Scope Summary
- **Data Ingestion:** Upload and parse CSV, JSON, and Excel files.
- **AI Data Analysis:** Automated cleaning, pattern detection, and anomaly detection (simulated via sophisticated frontend logic and LLM-ready prompts).
- **Interactive Dashboards:** Dynamic charts (Recharts/Lucide) and strategic summaries.
- **Chat with Data:** Natural language interface for querying uploaded datasets.
- **Executive Strategy:** Automated generation of "Executive Summaries" and "Strategic Recommendations".
- **Visual Excellence:** Futuristic, dark-themed "Billion Dollar Startup" UI/UX.

**Note:** As per session constraints, no server-side database or remote Supabase backend will be used. Data persistence and state management will be handled client-side (localStorage/sessionState).

## Affected Areas
- **Frontend Components:** New layouts for "Data Brain" dashboard, chat interface, and upload zone.
- **State Management:** Complex React state to handle parsed data and AI-generated insights.
- **Data Processing:** Logic for cleaning, normalizing, and analyzing datasets in the browser.
- **UI/UX:** Implementation of a futuristic, high-end theme using Tailwind and Lucide icons.

## Phases

### Phase 1: Core Layout & Branding (frontend_engineer)
- Set up the main application shell with a futuristic, dark-mode aesthetic.
- Create the "Command Center" navigation (Upload, Dashboard, Strategy, Chat).
- Implement the "Data Brain" logo and branding elements.

### Phase 2: Data Ingestion & Transformation (frontend_engineer)
- Build the drag-and-drop upload zone.
- Implement client-side parsing for CSV (using `papaparse`) and JSON.
- Create a "Data Preview" and "Auto-Clean" interface where users see the AI "thinking" as it standardizes data.

### Phase 3: AI Intelligence Layer (frontend_engineer)
- Develop the logic to "analyze" the data (calculating trends, correlations, and anomalies).
- Create a "Chat with Data" interface (simulated or LLM-integrated if API keys provided, otherwise deterministic "smart" responses).
- Implement "Strategic Insights" cards based on data patterns.

### Phase 4: Dynamic Visualization & Dashboard (frontend_engineer)
- Build a dynamic dashboard that automatically selects the best charts for the uploaded data.
- Use `recharts` for interactive data visualization.
- Implement a "Storytelling" mode that walks users through the data.

### Phase 5: Polishing & Strategic Tools (quick_fix_engineer)
- Refine animations (Framer Motion) for a "premium" feel.
- Finalize executive summary templates.
- Add "Export to Slide Deck" (UI mock/PDF generation).

## Execution Handoff

**Plan status:** ready

**Dispatch order:**
1. frontend_engineer — Build the core futuristic shell and data ingestion pipeline.
2. quick_fix_engineer — Polish UI, adjust micro-interactions, and finalize text/copy.

**Per-agent instructions:**

### 1. frontend_engineer
- **Phases:** 1, 2, 3, 4
- **Scope:** 
    - Install `papaparse`, `recharts`, `framer-motion`, and `lucide-react`.
    - Create a main `Dashboard` layout with a sidebar.
    - Implement `DataProcessor` utility to handle file parsing and basic statistical analysis (mean, max, trends, anomalies).
    - Create components: `FileUpload`, `IntelligenceDashboard`, `DataChat`, and `StrategySummary`.
    - Use a high-contrast dark theme (e.g., deep purples, teals, and blacks) to match the "billion-dollar startup" vibe.
- **Files:** `src/App.tsx`, `src/components/DataBrain/*`, `src/lib/data-utils.ts`
- **Depends on:** none
- **Acceptance criteria:** Users can upload a CSV, see it parsed, view generated charts, and interact with a "data chat" sidebar.

### 2. quick_fix_engineer
- **Phases:** 5
- **Scope:** 
    - Refine CSS for the futuristic glow effects and glassmorphism.
    - Fix any alignment issues in the dashboard cards.
    - Ensure all buttons have consistent hover states and transitions.
    - Review and enhance the "Strategic Insights" copy for professional tone.
- **Files:** `src/index.css`, `src/components/ui/*`
- **Depends on:** Phase 4 completion
- **Acceptance criteria:** The UI feels fluid, high-end, and free of layout glitches.

**Do not dispatch:** supabase_engineer (No backend/database in scope).
