import type MarkdownIt from 'markdown-it';

/**
 * Simple function to escape HTML special characters
 */
function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

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
    
    // Check if this is a mermaid code block
    if (token.info.trim() === 'mermaid') {
      // Make sure the code is valid and complete
      if (!code || code.length === 0) {
        return `<div class="mermaid-error">Empty mermaid diagram</div>`;
      }
      
      // Create a safer version of the code for the data attribute
      // First escape any HTML in the code, then encodeURIComponent for the data attribute
      const safeCode = encodeURIComponent(code);
          // Return a div that will be processed by the MermaidRenderer component
      return `<div class="mermaid-placeholder" data-mermaid-code="${safeCode}"></div>`;
    }

    // Use the original renderer for all other code blocks
    return originalFence(tokens, idx, options, env, self);

    // Use the original renderer for all other code blocks
    return originalFence(tokens, idx, options, env, self);
  };
}
