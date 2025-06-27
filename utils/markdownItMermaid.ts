import type MarkdownIt from 'markdown-it';

/**
 * Custom markdown-it plugin for mermaid diagram rendering
 * This plugin identifies mermaid code blocks and replaces them with placeholder divs
 * that will be processed by the MermaidRenderer component
 */
export function markdownItMermaid(md: MarkdownIt) {
  const originalFence = md.renderer.rules.fence!.bind(md.renderer.rules);

  // Use any type for parameters since markdown-it's typings are complex
  md.renderer.rules.fence = (tokens: any[], idx: number, options: any, env: any, self: any) => {
    const token = tokens[idx];
    const code = token.content.trim();
    
    if (token.info.trim() === 'mermaid') {
      if (!code || code.length === 0) {
        return `<div class="mermaid-error">Empty mermaid diagram</div>`;
      }
      
      const safeCode = encodeURIComponent(code);
      return `<div class="mermaid-placeholder" data-mermaid-code="${safeCode}"></div>`;
    }

    return originalFence(tokens, idx, options, env, self);
  };
}
