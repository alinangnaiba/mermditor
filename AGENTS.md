# Agent Instructions

<!-- lean-ctx -->
## lean-ctx

Prefer lean-ctx MCP tools over native equivalents for token savings.
Full rules: @LEAN-CTX.md
<!-- /lean-ctx -->

## Project Overview

MerMDitor is a modern, keyboard-friendly Markdown editor built with Nuxt 4, featuring real-time preview, Mermaid diagrams, LaTeX math rendering, and advanced editing features. The application uses CodeMirror 6 for the editor component and provides a split-pane interface with synchronized scrolling.

## Development Commands

### Core Development
```bash
# Development server (with hot reload)
pnpm dev

# Build for production
pnpm build

# Generate static site
pnpm generate

# Preview production build
pnpm preview

# Install dependencies
pnpm install
```

### Code Quality
```bash
# Run ESLint
pnpm lint

# Run ESLint with auto-fix
pnpm lint:fix

# Format code with Prettier
pnpm format

# Check formatting
pnpm format:check
```

## Architecture Overview

### Core Components Structure
- **Editor Page** (`app/pages/editor.vue`): Main editing interface with split-pane layout, toolbar, and modals
- **Markdown Renderer** (`app/composables/useMarkdownRenderer.ts`): Handles markdown-to-HTML conversion, Mermaid diagrams, LaTeX rendering, and syntax highlighting
- **Editor Actions** (`app/composables/useEditorActions.ts`): Provides formatting actions and file operations for the CodeMirror editor
- **Keyboard Shortcuts** (`app/composables/useKeyboardShortcuts.ts`): Comprehensive keyboard shortcuts for all editor actions

### Editor Implementation
- **CodeMirror 6**: Primary editor with markdown language support, dark theme, and custom extensions
- **Split Pane Layout**: Resizable editor/preview panes with synchronized scrolling
- **Real-time Rendering**: Content changes trigger immediate markdown processing and preview updates

### Rendering Pipeline
1. Raw markdown text → CodeMirror editor
2. Text changes → `useMarkdownRenderer.renderMarkdown()`
3. **Step 1**: markdown-it processing with plugins:
   - `markdown-it-emoji` for emoji support
   - `markdown-it-footnote` for footnotes
   - `markdown-it-mark` for highlight syntax (`==text==`)
   - `markdown-it-sub` for subscript (`~text~`)
   - `markdown-it-sup` for superscript (`^text^`)
   - `markdown-it-task-lists` for task lists
   - `markdown-it-deflist` for definition lists
4. **Step 2**: Mermaid diagram detection and placeholder injection
5. **Step 3**: LaTeX math processing with KaTeX
6. **Step 4**: Syntax highlighting with Prism.js
7. Final HTML output to preview pane

### State Management
- **Local Storage**: Autosave content, user preferences, pane dimensions
- **Vue Reactivity**: Content, UI state, and settings using refs and computed properties
- **No External Store**: Uses Vue's built-in reactivity system

## Key Features Implementation

### Extended Markdown Syntax (via markdown-it plugins)
- **Task Lists**: `- [ ]` and `- [x]` checkboxes (`markdown-it-task-lists`)
- **Footnotes**: `[^id]` references with `[^id]: definition` format (`markdown-it-footnote`)
- **Highlight**: `==text==` for highlighted text (`markdown-it-mark`)
- **Subscript**: `~text~` for subscript (`markdown-it-sub`)
- **Superscript**: `^text^` for superscript (`markdown-it-sup`)
- **Definition Lists**: `Term\n: Definition` format (`markdown-it-deflist`)
- **Emojis**: `:emoji_name:` syntax (`markdown-it-emoji`)

### Mermaid Diagrams
- **Interactive Controls**: Zoom, pan, reset, modal view
- **Caching System**: Rendered diagrams cached to improve performance
- **Error Handling**: Graceful degradation with error messages

### File Operations
- **Import**: Supports `.md`, `.markdown`, `.txt` files
- **Export**: Downloads as `.md` files with timestamp
- **Autosave**: Optional localStorage persistence with user confirmation

## Development Guidelines

### Editor Integration
- All editor actions must work through CodeMirror's dispatch system
- Use `EditorView.updateListener` for content change detection
- Maintain cursor position and selection state after actions

### Modular Architecture
The rendering system is split into separate utilities for maintainability:

**Core Utilities:**
- `utils/markdownItRenderer.ts`: Main markdown-it configuration and basic rendering
- `utils/markdownItMermaid.ts`: Mermaid diagram processing and interactive controls
- `utils/markdownItKatex.ts`: LaTeX math processing with KaTeX integration
- `utils/syntaxHighlighter.ts`: Prism.js code syntax highlighting

**Vue Components:**
- `components/MermaidRenderer.vue`: Standalone Mermaid diagram renderer
- `components/KatexRenderer.vue`: Standalone LaTeX math renderer

**Processing Order:**
1. markdown-it with plugins → basic HTML
2. Mermaid diagram placeholder injection
3. LaTeX math processing (preserving code blocks)
4. Syntax highlighting application

### Styling Approach
- **Tailwind CSS**: Utility-first styling throughout
- **Dark Theme**: Consistent dark color palette (`gray-800`, `gray-900` backgrounds)
- **Responsive Design**: Mobile-first with adaptive layouts and controls

### Storage and Persistence
- Use `mermditor-*` prefixes for all localStorage keys
- Always wrap localStorage operations in try-catch blocks
- Confirm destructive actions (clearing data, disabling autosave)

### Component Communication
- Use composables for shared logic and state
- Emit events for parent-child component communication
- Avoid prop drilling by using composables for cross-component state

## Testing and Quality Assurance

When making changes:
1. Test editor functionality with various markdown syntax
2. Verify Mermaid diagrams render correctly in preview
3. Test LaTeX math rendering (inline `$math$` and display `$$math$$`)
4. Check keyboard shortcuts work as expected
5. Validate responsive behavior on different screen sizes
6. Test autosave and localStorage functionality
7. Run linting and formatting commands before committing

## Common Development Tasks

### Adding New Markdown Extensions
1. Install appropriate `markdown-it` plugin via `pnpm add markdown-it-[plugin-name]`
2. Import and configure plugin in `utils/markdownItRenderer.ts`
3. Add corresponding action in `useEditorActions.ts` if needed
4. Include keyboard shortcut in `useKeyboardShortcuts.ts` if needed
5. Update toolbar if UI element needed

### Using Standalone Renderers
For guide examples or standalone rendering:
- Use `MermaidRenderer.vue` component for individual diagrams
- Use `KatexRenderer.vue` component for individual math expressions
- Import functions directly from utils for programmatic rendering

### Editor Customization
- Extend CodeMirror configuration in `initEditor()` function
- Add new extensions to the `extensions` array
- Use `EditorView.theme()` for styling customizations

### Modal and UI Components
- Follow existing pattern: overlay + content + close button
- Include keyboard escape handling and click-outside-to-close
- Use consistent styling classes for modals and buttons