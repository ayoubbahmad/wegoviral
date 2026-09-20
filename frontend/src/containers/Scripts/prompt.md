# Prompt: Create the "Scripting" Section for ScriptWizard

You are an expert Frontend Engineer specialized in Next.js, Tailwind CSS, and Framer Motion. Your task is to implement the "Scripting" section for an application called **ScriptWizard**.

## Project Context & Architecture

We follow a **6-Layer Modular Architecture**:

1. **Route (App)**: `src/app/scripts/new/page.tsx` - Next.js entry point.
2. **View (Page)**: `src/views/ScriptCreation/index.tsx` - High-level composition.
3. **View (Container)**: `src/containers/Scripts/ScriptWizard/index.tsx` - The main smart feature module.
4. **Provider**: `src/providers/...` - Global context (Auth, etc.).
5. **Logic Layers**: `controller/`, `api/`, `forms/`, `slice/` within the Container.
6. **Components**: `src/components/...` - Reusable, atomic, presentation-only components.

**General Rules**:

- Use **Yarn** as the package manager.
- Use **Tailwind CSS** for styling + **Framer Motion** for animations.
- Use **Lucide React** for icons.
- Use **Tanstack Query** for data fetching and **Zustand** for state management.
- **Import Priority**: 1. External Modules, 2. Global/Shared Project Files, 3. Local Feature-specific Files.

---

## Feature: The Script Wizard (6-Step Flow)

The goal is a premium, AI-guided script creation experience. Every step should feel like a high-end tool.

### UI/UX Requirements:

- **Premium Aesthetics**: Use glassmorphism, subtle gradients, and micro-animations.
- **Sticky Jump Navigation**: A floating nav at the top to jump between steps (Topic, Research, Angle, Hook, Style, Script).
- **Responsive & Dynamic**: Use hover effects and transitions.

### Step 1: Write a Script Prompt

- **Input**: A large, clean textarea for 3-5 sentences.
- **Guidance**: Show info cards for "The Subject" vs "The Angle".
- **Character Counter**: Aim for 100-500 characters.
- **External Help**: Link to a guide "How to write the best prompt".

### Step 2: 360° Research (AI Generated)

- **Dashboard View**: After submitting the prompt, show a rich research report.
- **Executive Summary**: A high-level overview of the strategy.
- **Topic Potential**: A 0-10 score badge.
- **Key Facts**: Grid of facts, each with a "Shock Score / 10".
- **ELI5**: A "Explain Like I'm 5" section.
- **Common Misconceptions**: Myth vs. Reality comparison table.

### Step 3: Pick Angles

- **AI Recommendation**: Grid of up to 5 angles generated from the research.
- **Metric**: Prioritize and sort angles by "Shocking" potential.
- **UX**: Card-based selection with icons (e.g., Sparkles, Zap, Users).
- **Selection**: Allow picking one or multiple.

### Step 4: Pick Hooks

- **AI Recommendation**: Grid of hooks generated from the selected angles.
- **Templates**: Show a grid of hook templates (from my hooks library) (visual thumbnails in 9:16 aspect ratio).
- **AI Adaptation**: When a hook template is picked from the library, the AI adapts it to the selected Angle.
- **Selection**: Allow picking one or multiple.

### Step 5: Pick Style

- **AI Recommendation**: Grid of styles generated from the selected angles.
- **Templates**: Show a grid of style templates (from my style library) (visual thumbnails in 9:16 aspect ratio).
- **AI Adaptation**: When a style template is picked from the library, the AI adapts it to the selected Angle.
- **Selection**: only one style can be selected.

### Step 6: Final Scripts Generation

- **Main Editor**: A large, beautifully formatted text area with the generated script.
- **Metrics**: Real-time Word count and estimated Reading Duration (~160 WPM).
- **AI Refinement**: A "Quick Refinements" input for chat-like editing (e.g., "Make it funnier").
- **Version History**: A way to view and revert to previous script versions.
- **navigation**: left and right arrows to navigate between generated scripts.

---

## Technical Details for Implementation

1. **Controller**: Implement a `useScriptWizardController` hook to manage the state machine of the wizard.
2. **Forms**: Use `react-hook-form` + `zod` for the prompt and refinement inputs.
3. **Animations**: Use `AnimatePresence` for transitioning between "Processing" and "Result" states in Step 2.

**Goal**: Make the user feel empowered by the AI at every stage. The UI should "wow" them immediately.
