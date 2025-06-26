import type MarkdownIt from 'markdown-it';

/**
 * Simple KaTeX markdown-it plugin that identifies math expressions
 * and marks them for client-side rendering
 */
export function markdownItKatex(md: MarkdownIt) {
  // Add a custom rule for block math before other rules
  md.block.ruler.before('fence', 'block_math', blockMathRule);
  
  // Override the fence renderer to handle math blocks
  const originalFence = md.renderer.rules.fence?.bind(md.renderer.rules) || md.renderer.rules.fence;

  md.renderer.rules.fence = (tokens: any[], idx: number, options: any, env: any, self: any) => {
    const token = tokens[idx];
    const code = token.content.trim();
    
    if (token.info.trim() === 'math') {
      return `<div class="math-block-container"><div class="math-block" data-math="${encodeURIComponent(code)}">${escapeHtml(code)}</div></div>`;
    }
    
    return originalFence ? originalFence(tokens, idx, options, env, self) : '';
  };

  // Add renderer for block math
  md.renderer.rules.block_math = (tokens: any[], idx: number) => {
    const token = tokens[idx];
    const content = token.content.trim();
    return `<div class="math-block-container"><div class="math-block" data-math="${encodeURIComponent(content)}">${escapeHtml(content)}</div></div>`;
  };

  // Add inline math rule using a simpler approach
  const originalInline = md.renderer.rules.text || ((tokens, idx) => tokens[idx].content);
  
  md.renderer.rules.text = (tokens: any[], idx: number, options: any, env: any, self: any) => {
    const token = tokens[idx];
    let content = token.content;
    
    // Process inline math: $...$
    content = content.replace(/\$([^$\n]+?)\$/g, (match: string, math: string) => {
      return `<span class="math-inline" data-math="${encodeURIComponent(math)}">${escapeHtml(math)}</span>`;
    });
    
    return content;
  };
}

/**
 * Block rule for detecting $$...$$ math blocks
 */
function blockMathRule(state: any, start: number, end: number, silent: boolean) {
  const marker = '$$';
  let pos = state.bMarks[start] + state.tShift[start];
  let max = state.eMarks[start];

  // Check if line starts with $$
  if (pos + marker.length > max) return false;
  if (state.src.slice(pos, pos + marker.length) !== marker) return false;

  pos += marker.length;
  const firstLine = state.src.slice(pos, max).trim();

  // Check for single-line math block
  if (firstLine.endsWith(marker)) {
    // Single line: $$math$$
    const mathContent = firstLine.slice(0, -marker.length).trim();
    if (silent) return true;

    const token = state.push('block_math', 'div', 0);
    token.content = mathContent;
    token.map = [start, start + 1];
    state.line = start + 1;
    return true;
  }

  // Multi-line math block
  let nextLine = start + 1;
  let terminatorFound = false;

  while (nextLine < end) {
    pos = state.bMarks[nextLine] + state.tShift[nextLine];
    max = state.eMarks[nextLine];
    
    if (pos < max && state.sCount[nextLine] < state.blkIndent) {
      // non-empty line with negative indent should stop the block
      break;
    }

    if (state.src.slice(pos, max).trim() === marker) {
      terminatorFound = true;
      break;
    }

    nextLine++;
  }

  if (!terminatorFound) return false;
  if (silent) return true;

  // Extract math content between markers
  const lines = [];
  if (firstLine) lines.push(firstLine);
  
  for (let i = start + 1; i < nextLine; i++) {
    pos = state.bMarks[i] + state.tShift[i];
    max = state.eMarks[i];
    lines.push(state.src.slice(pos, max));
  }

  const token = state.push('block_math', 'div', 0);
  token.content = lines.join('\n').trim();
  token.map = [start, nextLine + 1];
  state.line = nextLine + 1;
  return true;
}

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
