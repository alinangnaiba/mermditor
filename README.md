# [merMDitor](https://www.mermditor.dev/)

[merMDitor](https://www.mermditor.dev/) is a modern, keyboard‑friendly, dark‑themed Markdown editor focused on a smooth writing + instant preview workflow with first‑class diagram and rich text support. It combines a distraction‑reduced editing surface with advanced utilities (find & replace, line numbering, live highlighting, autosave, export/import) while remaining lightweight and fast.

## What It Does

- Real‑time Markdown → HTML preview
- Inline Mermaid diagram authoring (flowcharts, sequence, class, etc.)
- Code block syntax highlighting
- (Optional) Mathematical / formula rendering (KaTeX)
- Accurate find / find & replace with live match highlighting
- VS Code–style line numbers (only real lines numbered; wrapped soft lines blank)
- Diff‑free editing overlay: selection & match highlighting rendered behind transparent text layer
- Responsive layout: dual‑pane (editor + preview) with draggable divider (auto hides on mobile)
- File operations: import (e.g. `.md`), save, clear, copy
- Autosave toggle & persisted UI preferences (line numbers, panel visibility)
- Mobile‑aware panels (adaptive Find/Replace UI)
- Accessible keyboard shortcuts for core actions
- Non‑destructive floating Find/Replace panel that stays until explicitly closed

## Core Technologies

| Domain              | Technology                                                        |
| ------------------- | ----------------------------------------------------------------- |
| Framework           | Nuxt 4 (Vue 3, Composition API, SFC)                              |
| Styling             | Tailwind CSS (utility‑first, dark palette)                        |
| Markdown Engine     | markdown-it + custom plugins (Mermaid, syntax highlight, math)    |
| Diagrams            | Mermaid                                                           |
| Syntax Highlighting | highlight.js (language auto‑detection fallback)                   |
| Math (optional)     | KaTeX                                                             |
| State & Reactivity  | Vue refs, computed, watchers, composables                         |
| Performance Aids    | Lazy resource marking, ResizeObserver, debounced search           |
| UX Enhancements     | Transition groups, floating overlay, precise cursor line tracking |

## Architectural Overview

- Single high‑level `MarkdownEditor.vue` orchestrates:
  - Editor pane (textarea + overlay highlight layer)
  - Preview pane (renders processed markdown)
  - Global menus (File / Edit) and feature toggles
  - Floating Find/Replace panel (separate component)
- Rendering Pipeline:
  1. Raw markdown (reactive `markdownText`)
  2. markdown-it parse & transform (plugins: Mermaid passthrough, code fence highlighting, math)
  3. Post‑processing (diagram initialization, code block enhancement)
- Highlight Layer:
  - Background “shadow” layer replicates text layout for match highlighting while keeping native textarea interactions
- Line Numbering:
  - Logical line split (`\n`) only; soft wraps intentionally not counted
  - Responsive suppression on mobile without mutating persisted preference
- Find & Replace:
  - Reactive search term processing (debounced)
  - Match index tracking & navigation
  - Case sensitive / whole word / regex modes
  - Emitted events update highlight overlay

## Performance Considerations

- Conditional initialization of heavy subsystems (Mermaid, KaTeX, highlighting)
- Resource “loaded” signaling used by a lightweight loading overlay to improve perceived startup
- Cached measurement & recalculation only on relevant dimension or content changes
- Avoids deep reactive structures for large text buffers (plain string ref)
- Pointer‑events isolation for overlay to keep native selection performance

## UX / Accessibility Notes

- Keyboard shortcuts for common actions (find, replace, save, navigation)
- Non‑intrusive floating utility panel
- Click‑outside only closes menus (not the active Find/Replace panel)
- High contrast highlight colors with minimal reliance on hue alone
- Touch gesture support for pane resizing (mobile friendliness in progress)

## Current Enhancements in Progress / Potential Refactors

- Component decomposition (toolbar, gutter, preview, drag handle) for improved maintainability
- Dedicated composables: `useEditorState`, `useSearch`, `useLineNumbers`
- Improved a11y (ARIA roles for menus & panel, focus trapping in overlays)
- More precise soft‑wrap visual line mapping if future features (e.g. minimap) require it
- Optional plugin system for custom markdown extensions
- Persistence layer abstraction (instead of direct `localStorage` usage)

## Key Design Principles

- Do not block typing fluidity (no heavy synchronous transforms in input handlers)
- Keep preview reactive but defer expensive post‑processing with microtask scheduling
- Preserve user intent (never silently mutate preferences on viewport change)
- Explicit close actions (no unexpected panel dismissal)

## Screens & States (Conceptual)

- Editor Only
- Preview Only
- Split View (resizable)
- Find Mode / Replace Mode (panel toggles)
- Loading Overlay (initial resource warm‑up)

---

MerMDitor aims to provide a fast authoring surface with diagram & advanced text tooling without sacrificing clarity or responsiveness. Further modularization and extensibility layers are planned while maintaining a minimal baseline footprint.
