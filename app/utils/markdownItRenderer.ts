import MarkdownIt from 'markdown-it'
import type StateCore from 'markdown-it/lib/rules_core/state_core.mjs'
import { emojiMapping } from './emojiMapping'
import { mathPlugin } from './markdownItMathPlugin'
import { logError } from '../../utils/logging'

let mdInstance: MarkdownIt | null = null

type MarkdownItPlugin = (md: MarkdownIt, options?: unknown) => void

type MarkdownItPluginModule =
  | MarkdownItPlugin
  | {
      default?: unknown
      plugin?: unknown
      markdownItPlugin?: unknown
      full?: unknown
    }

const resolveMarkdownItPlugin = (pluginModule: unknown): MarkdownItPlugin | null => {
  let pluginCandidate: unknown = pluginModule

  if (
    typeof pluginCandidate === 'object' &&
    pluginCandidate !== null &&
    'default' in pluginCandidate &&
    pluginCandidate.default !== undefined
  ) {
    pluginCandidate = pluginCandidate.default
  }

  if (typeof pluginCandidate === 'object' && pluginCandidate !== null) {
    if ('plugin' in pluginCandidate && typeof pluginCandidate.plugin === 'function') {
      return pluginCandidate.plugin as MarkdownItPlugin
    }

    if (
      'markdownItPlugin' in pluginCandidate &&
      typeof pluginCandidate.markdownItPlugin === 'function'
    ) {
      return pluginCandidate.markdownItPlugin as MarkdownItPlugin
    }

    if ('default' in pluginCandidate && typeof pluginCandidate.default === 'function') {
      return pluginCandidate.default as MarkdownItPlugin
    }
  }

  return typeof pluginCandidate === 'function' ? (pluginCandidate as MarkdownItPlugin) : null
}

export const createMarkdownItInstance = async (): Promise<MarkdownIt> => {
  if (mdInstance) {
    return mdInstance
  }

  const md = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true,
    breaks: false,
  })

  // Register math plugin before other plugins to protect math content
  md.use(mathPlugin)

  try {
    // Dynamically import plugins to handle ESM/CommonJS issues
    const plugins = await Promise.all([
      import('markdown-it-emoji').then((mod) => mod.full || mod.default || mod),
      import('markdown-it-footnote'),
      import('markdown-it-mark'),
      import('markdown-it-sub'),
      import('markdown-it-sup'),
      import('markdown-it-task-lists'),
      import('markdown-it-deflist'),
    ])

    // Helper function to safely use plugins
    const safeUsePlugin = (
      pluginModule: MarkdownItPluginModule,
      options: Record<string, unknown> = {},
      name: string = 'unknown'
    ) => {
      try {
        const plugin = resolveMarkdownItPlugin(pluginModule)

        if (typeof plugin === 'function') {
          md.use(plugin, options)
        } else {
          console.warn(`Plugin ${name} is not a function:`, typeof plugin, plugin)
          if (name === 'emoji') {
            console.warn(
              'Emoji module structure:',
              typeof pluginModule === 'object' && pluginModule !== null ? Object.keys(pluginModule) : []
            )
            console.warn('Continuing without emoji plugin')
          }
        }
      } catch (error) {
        console.warn(`Failed to load plugin ${name}:`, error)
      }
    }

    // Configure plugins with safe loading
    const [
      emojiModule,
      footnoteModule,
      markModule,
      subModule,
      supModule,
      taskListsModule,
      deflistModule,
    ] = plugins

    safeUsePlugin(emojiModule, {}, 'emoji') // Use default emojis first, then extend if needed
    safeUsePlugin(footnoteModule, {}, 'footnote')
    safeUsePlugin(markModule, {}, 'mark')
    safeUsePlugin(subModule, {}, 'sub')
    safeUsePlugin(supModule, {}, 'sup')
    safeUsePlugin(taskListsModule, { enabled: true, label: true, labelAfter: true }, 'task-lists')
    safeUsePlugin(deflistModule, {}, 'deflist')
  } catch (error) {
    console.warn('Some markdown-it plugins failed to load:', error)
  }

  // Custom renderer for task lists to match the active editor theme
  md.renderer.rules.list_item_open = function (tokens, idx, options, env: StateCore, renderer) {
    const token = tokens[idx]
    if (!token) {
      return renderer.renderToken(tokens, idx, options)
    }
    const isTaskList = token.attrGet('class')?.includes('task-list-item')

    if (isTaskList) {
      return '<li class="md-task-list-item">'
    }

    return renderer.renderToken(tokens, idx, options)
  }

  // Custom renderer for checkboxes in task lists
  md.renderer.rules.html_inline = function (tokens, idx) {
    const token = tokens[idx]
    if (!token) {
      return ''
    }
    const content = token.content

    if (content.includes('type="checkbox"')) {
      const isChecked = content.includes('checked')
      const disabled = content.includes('disabled') ? 'disabled' : ''

      return `<input type="checkbox" ${isChecked ? 'checked' : ''} ${disabled} class="md-task-checkbox">`
    }

    return content
  }

  mdInstance = md
  return md
}

export const renderMarkdown = async (content: string): Promise<string> => {
  if (!content) return ''

  try {
    const md = await createMarkdownItInstance()
    let html = md.render(content)

    // Emojis should be handled by markdown-it-emoji plugin

    // Add language labels to code blocks
    html = html.replace(
      /<pre><code class="language-(\w+)">([\s\S]*?)<\/code><\/pre>/g,
      (match: string, lang: string, code: string) => {
        // Skip wrapping for mermaid diagrams as they are handled by a separate processor
        if (lang === 'mermaid') {
          return match
        }

        const languageNames: Record<string, string> = {
          js: 'JavaScript',
          ts: 'TypeScript',
          javascript: 'JavaScript',
          typescript: 'TypeScript',
          python: 'Python',
          py: 'Python',
          java: 'Java',
          cpp: 'C++',
          c: 'C',
          cs: 'C#',
          csharp: 'C#',
          css: 'CSS',
          html: 'HTML',
          json: 'JSON',
          xml: 'XML',
          yaml: 'YAML',
          yml: 'YAML',
          bash: 'Bash',
          sh: 'Shell',
          sql: 'SQL',
          php: 'PHP',
          ruby: 'Ruby',
          go: 'Go',
          rust: 'Rust',
        }

        const isKnown = lang in languageNames
        const displayName = isKnown ? languageNames[lang] : lang
        const langClass = isKnown ? 'code-block-language' : 'code-block-language lang-unknown'

        return `<div class="code-block-container">
          <div class="code-block-header">
            <span class="${langClass}">${displayName}</span>
            <div class="code-block-actions">
              <button class="code-block-wrap" type="button" title="Toggle line wrap" aria-label="Toggle line wrap" aria-pressed="false">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M3 6h14a4 4 0 1 1 0 8H9"></path>
                  <path d="m13 10-4 4 4 4"></path>
                  <path d="M3 18h7"></path>
                </svg>
                <span class="code-block-button-label">Wrap</span>
              </button>
              <button class="code-block-copy" type="button" title="Copy code" aria-label="Copy code">
                <svg class="code-block-icon code-block-copy-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
                <svg class="code-block-icon code-block-success-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="M20 6 9 17l-5-5"></path>
                </svg>
                <span class="code-block-button-label">Copy</span>
              </button>
            </div>
          </div>
          <div class="code-block-body">
            <pre><code class="language-${lang}">${code}</code></pre>
          </div>
        </div>`
      }
    )

    return html
  } catch (error) {
    logError('markdown.renderRaw', error, {
      contentPreview: content.slice(0, 160),
    })
    return '<p class="render-error">Error rendering markdown</p>'
  }
}
