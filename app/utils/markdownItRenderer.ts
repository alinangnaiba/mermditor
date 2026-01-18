import MarkdownIt from 'markdown-it'
import { emojiMapping } from './emojiMapping'
import { mathPlugin } from './markdownItMathPlugin'

let mdInstance: MarkdownIt | null = null

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
      import('markdown-it-emoji').then((mod) => mod.full || mod.default || mod), // Try different emoji imports
      import('markdown-it-footnote'),
      import('markdown-it-mark'),
      import('markdown-it-sub'),
      import('markdown-it-sup'),
      import('markdown-it-task-lists'),
      import('markdown-it-deflist'),
    ])

    // Helper function to safely use plugins
    const safeUsePlugin = (pluginModule: any, options: any = {}, name: string = 'unknown') => {
      try {
        let plugin = pluginModule.default || pluginModule

        // Special handling for different plugin export patterns
        if (typeof plugin === 'object' && plugin !== null) {
          // Try common export patterns
          if (plugin.plugin && typeof plugin.plugin === 'function') {
            plugin = plugin.plugin
          } else if (plugin.markdownItPlugin && typeof plugin.markdownItPlugin === 'function') {
            plugin = plugin.markdownItPlugin
          } else if (plugin.default && typeof plugin.default === 'function') {
            plugin = plugin.default
          }
        }

        if (typeof plugin === 'function') {
          md.use(plugin, options)
        } else {
          console.warn(`Plugin ${name} is not a function:`, typeof plugin, plugin)
          if (name === 'emoji') {
            console.warn('Emoji module structure:', Object.keys(pluginModule))
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

  // Custom renderer for task lists to match dark theme
  md.renderer.rules.list_item_open = function (tokens, idx, options, env, renderer) {
    const token = tokens[idx]
    if (!token) {
      return renderer.renderToken(tokens, idx, options)
    }
    const isTaskList = token.attrGet('class')?.includes('task-list-item')

    if (isTaskList) {
      return '<li class="flex items-start space-x-2 text-gray-200 list-none">'
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

      return `<input type="checkbox" ${isChecked ? 'checked' : ''} ${disabled} class="rounded bg-gray-700 border-gray-600 mt-1">`
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

        const displayName = languageNames[lang] || lang.toUpperCase()

        return `<div class="code-block-container">
          <div class="code-block-header">
            <span class="code-block-language">${displayName}</span>
          </div>
          <pre><code class="language-${lang}">${code}</code></pre>
        </div>`
      }
    )

    return html
  } catch (error) {
    console.error('Markdown rendering error:', error)
    return '<p class="text-red-400">Error rendering markdown</p>'
  }
}
