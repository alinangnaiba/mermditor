# Codebase Analysis — MerMDitor

> Generated: 2026-04-05  
> Last updated: 2026-04-05

---

## Table of Contents

1. [Security Issues](#security-issues)
2. [Performance Issues](#performance-issues)
3. [Code Quality Issues](#code-quality-issues)
4. [Maintainability Issues](#maintainability-issues)
5. [Quick Wins](#quick-wins)

---

## Security Issues

### 1. XSS via `v-html` — Partially Resolved

**Severity:** Medium  
**Files:** `app/components/EditorSplitPane.vue:33`, `app/components/MermaidRenderer.vue:7`  
**Status:** `vue/no-v-html` ESLint rule upgraded from `'off'` to `'warn'` — new violations will now surface at lint time. The underlying `v-html` usages and missing component-level DOMPurify guard remain open.

Both components render raw HTML directly via `v-html`. While DOMPurify sanitization exists elsewhere in the pipeline, there is no secondary guard at the component level. Any new code path that skips `sanitizeHtml()` opens an XSS vector.

**Remaining work:**
- Add `DOMPurify.sanitize()` as a final pass at the component level before binding to `v-html`
- Add unit tests that assert sanitization is applied on every rendering path

---

### 2. `unsafe-eval` in Content Security Policy — Resolved

**Severity:** Medium  
**File:** `nuxt.config.ts`  
**Status:** ~~`'unsafe-eval'`~~ removed from `script-src`. If a library triggers a CSP violation at runtime, check the browser console to identify which dependency requires it and find a CSP-compatible build.

> **Note:** `'unsafe-inline'` in `script-src` remains. Long-term, replace with nonces for inline scripts.

---

### 3. Global Event Listener Leaks in Mermaid Controls

**Severity:** Medium-High  
**File:** `app/utils/markdownItMermaid.ts`  
**Status:** Open

`setupMermaidControls()` attaches `mousemove` and `mouseup` listeners directly to `document` on every Mermaid diagram render, with no corresponding cleanup. Each re-render of a diagram (e.g., on content change or theme toggle) stacks another pair of global listeners, which are never removed.

```typescript
// Accumulates on every render — never cleaned up
document.addEventListener('mousemove', (e: Event) => { ... })
document.addEventListener('mouseup', () => { ... })
```

**Consequences:**
- Memory leak: handlers are never garbage collected
- Performance degradation: every mouse move fires N handlers where N is the render count
- Potential interaction bugs from stale handlers firing out of context

**Recommendation:**
- Use named handler functions so they can be removed
- Return a `cleanup()` function from `setupMermaidControls()` and call it before re-rendering

```typescript
const handleMouseMove = (e: Event) => { ... }
const handleMouseUp = () => { ... }
document.addEventListener('mousemove', handleMouseMove)
document.addEventListener('mouseup', handleMouseUp)

return () => {
  document.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('mouseup', handleMouseUp)
}
```

---

### 4. Unvalidated `JSON.parse` from localStorage

**Severity:** Low-Medium  
**Files:** `app/composables/useEditorPersistence.ts:25`, `app/composables/useRecentEmojis.ts:17`  
**Status:** Open

Parsed localStorage values are immediately cast to typed interfaces without structural validation. Corrupted, tampered, or schema-migrated data silently bypasses the type system and can cause unexpected runtime failures.

```typescript
// Type assertion with no structural check
workspace: savedWorkspace ? (JSON.parse(savedWorkspace) as WorkspaceData) : null,
```

**Recommendation:**
- Add runtime schema validation after parsing using `zod` or `valibot`
- Return `null` or a safe default when validation fails, and clear the corrupted key

---

## Performance Issues

### 5. Unbounded Mermaid Diagram Cache — Partially Resolved

**Severity:** Medium  
**File:** `app/utils/markdownItMermaid.ts`  
**Status:** LRU-style eviction added — cache is now capped at `MERMAID_CACHE_MAX_SIZE = 50` entries, dropping the oldest on overflow.

**Remaining work:**
- Cache is not invalidated when the theme changes. All existing entries become stale on a theme switch, but are still served until they happen to be the oldest 50. Consider calling `clearMermaidCache()` on theme change.

---

### 6. Scroll Synchronization Jank Risk

**Severity:** Low-Medium  
**File:** `app/composables/useEditorPreview.ts:52-103`  
**Status:** Open

Scroll sync is triggered on every scroll event without debouncing, relying on `requestAnimationFrame` flags for mutual exclusion. Under rapid scrolling, these flags can get out of sync, causing feedback loops or missed sync updates.

**Recommendation:**
- Add passive event listeners (`{ passive: true }`) for scroll handlers
- Debounce the sync logic to reduce redundant calculations during fast scrolling

---

## Code Quality Issues

### 7. Overuse of `any` Type

**Severity:** Medium  
**Files:** `app/utils/markdownItRenderer.ts:35`, `app/utils/markdownItMermaid.ts:39`  
**Status:** Open

Key utility functions use `any` for plugin modules and option objects, bypassing TypeScript's type checking entirely.

```typescript
// markdownItRenderer.ts
const safeUsePlugin = (pluginModule: any, options: any = {}, name: string = 'unknown') => {
```

**Recommendation:**
- Replace `any` with `unknown` and add type narrowing before use
- Define a `MarkdownItPlugin` type for plugin modules

---

### 8. Magic Numbers Without Named Constants — Partially Resolved

**Severity:** Low  
**Files:** `app/utils/markdownItMermaid.ts`, `app/composables/useEditorPersistence.ts:73`  
**Status:** Mermaid zoom constants (`MERMAID_ZOOM_STEP`, `MERMAID_ZOOM_MIN`, `MERMAID_ZOOM_MAX`) extracted to module-level named constants. Autosave interval in `useEditorPersistence.ts` remains inline.

**Remaining work:**
- Extract the `10_000` ms autosave interval in `useEditorPersistence.ts` to a named constant (e.g., `AUTOSAVE_INTERVAL_MS`)

---

### 9. Missing TypeScript Strict Mode — Resolved

**Severity:** Medium  
**File:** `nuxt.config.ts`  
**Status:** `typescript: { strict: true }` added to `nuxt.config.ts`. Nuxt propagates this to all generated tsconfig files at build time.

---

### 10. Weak File Name Validation

**Severity:** Medium  
**File:** `app/utils/workspace.ts:45-54`  
**Status:** Open

`normalizeFileName()` only trims whitespace and appends `.md` — it does not guard against:
- Names exceeding filesystem limits (255 chars)
- Invalid characters (`<>:"|?*` etc.)
- Reserved Windows names (`CON`, `PRN`, `AUX`, `NUL`, `COM1`–`COM9`, `LPT1`–`LPT9`)

**Recommendation:**

```typescript
const MAX_FILENAME_LENGTH = 255
const RESERVED_NAMES = /^(CON|PRN|AUX|NUL|COM\d|LPT\d)$/i
const INVALID_CHARS = /[<>:"|?*\x00-\x1f]/g

export const normalizeFileName = (name: string): string => {
  let sanitized = name.trim().replace(INVALID_CHARS, '_')
  if (!sanitized) return 'untitled.md'
  if (RESERVED_NAMES.test(sanitized)) sanitized = `_${sanitized}`
  if (sanitized.length > MAX_FILENAME_LENGTH) sanitized = sanitized.substring(0, MAX_FILENAME_LENGTH)
  return sanitized.endsWith('.md') ? sanitized : `${sanitized}.md`
}
```

---

## Maintainability Issues

### 11. `useWorkspaceController.ts` is ~890 Lines

**Severity:** Medium  
**File:** `app/composables/useWorkspaceController.ts`  
**Status:** Open

This single composable manages too many responsibilities: workspace tree operations, drag-and-drop state, context menus, inline editing, search, and file I/O. It is difficult to test in isolation, reason about, and extend without risk of regression.

**Recommendation:** Split into focused composables:

| Composable | Responsibility |
|---|---|
| `useWorkspaceTree` | Tree traversal, node lookup, search |
| `useWorkspaceFileOps` | Create, rename, delete, move files/folders |
| `useWorkspaceDnd` | Drag-and-drop state and drop handling |
| `useWorkspaceContextMenu` | Context menu visibility and actions |
| `useWorkspaceInlineEdit` | Inline rename editing state |

---

### 12. No Structured Error Logging

**Severity:** Low-Medium  
**Files:** Multiple composables and utilities  
**Status:** Open

Error handling is inconsistent across the codebase — some catch blocks silently swallow errors, others only `console.error()`. There is no structured logging, no error context capture, and no telemetry for diagnosing production failures.

**Recommendation:**
- Define a shared `logError(context: string, error: unknown)` utility
- Include contextual metadata (composable name, operation, relevant state)
- Consider integrating an error tracking service (e.g., Sentry) for production

---

### 13. No E2E Test Coverage

**Severity:** Low  
**File:** `package.json`  
**Status:** Open

A `test:e2e` script referencing Playwright is defined in `package.json`, but no test files exist in the repository. Core user flows (editor typing, file save/load, Mermaid rendering, export) are entirely untested.

**Recommendation:**
- Add Playwright test files covering at minimum: editor input, markdown preview, file import/export, and keyboard shortcuts
- Integrate into CI pipeline

---

## Quick Wins

| # | Fix | File | Status |
|---|-----|------|--------|
| 1 | Remove `unsafe-eval` from CSP | `nuxt.config.ts` | Done |
| 2 | Re-enable `vue/no-v-html` ESLint rule | `eslint.config.mjs` | Done |
| 3 | Add `"strict": true` to tsconfig | `nuxt.config.ts` | Done |
| 4 | Extract Mermaid zoom constants to named variables | `app/utils/markdownItMermaid.ts` | Done |
| 5 | Cap Mermaid cache with a max size | `app/utils/markdownItMermaid.ts` | Done |
| 6 | Add cleanup return to `setupMermaidControls` | `app/utils/markdownItMermaid.ts` | **Open** |
| 7 | Add structural validation to `JSON.parse` calls | `useEditorPersistence.ts`, `useRecentEmojis.ts` | **Open** |
