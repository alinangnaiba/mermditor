import type MarkdownIt from 'markdown-it';

/**
 * Simple KaTeX markdown-it plugin that identifies math expressions
 * and marks them for client-side rendering
 */
export function markdownItKatex(md: MarkdownIt) {
  // Add block math rule
  md.block.ruler.before('fence', 'math_block', mathBlockRule, {
    alt: ['paragraph', 'reference', 'blockquote']
  });

  // Add inline math rule
  md.inline.ruler.after('escape', 'math_inline', mathInlineRule);

  // Add renderers
  md.renderer.rules.math_block = (tokens: any[], idx: number) => {
    const token = tokens[idx];
    const content = token.content.trim();
    return `<div class="math-block-container"><div class="math-block" data-math="${encodeURIComponent(content)}">${escapeHtml(content)}</div></div>`;
  };

  md.renderer.rules.math_inline = (tokens: any[], idx: number) => {
    const token = tokens[idx];
    const content = token.content.trim();
    return `<span class="math-inline" data-math="${encodeURIComponent(content)}">${escapeHtml(content)}</span>`;
  };
}

/**
 * Block math rule for $$...$$ blocks
 */
function mathBlockRule(state: any, start: number, end: number, silent: boolean) {
  const marker = '$$';
  let pos = state.bMarks[start] + state.tShift[start];
  let max = state.eMarks[start];

  // Check if line starts with $$
  if (pos + marker.length > max) return false;
  if (state.src.slice(pos, pos + marker.length) !== marker) return false;

  pos += marker.length;
  let firstLine = state.src.slice(pos, max).trim();

  // Single line case: $$math$$
  if (firstLine.endsWith(marker)) {
    const mathContent = firstLine.slice(0, -marker.length).trim();
    if (silent) return true;

    const token = state.push('math_block', 'div', 0);
    token.content = mathContent;
    token.map = [start, start + 1];
    state.line = start + 1;
    return true;
  }

  // Multi-line case
  let nextLine = start + 1;
  let found = false;

  while (nextLine < end) {
    pos = state.bMarks[nextLine] + state.tShift[nextLine];
    max = state.eMarks[nextLine];
    
    if (pos < max && state.sCount[nextLine] < state.blkIndent) {
      break;
    }

    const line = state.src.slice(pos, max).trim();
    if (line === marker) {
      found = true;
      break;
    }

    nextLine++;
  }

  if (!found) return false;
  if (silent) return true;

  // Collect content
  const lines = [];
  if (firstLine) lines.push(firstLine);
  
  for (let i = start + 1; i < nextLine; i++) {
    pos = state.bMarks[i] + state.tShift[i];
    max = state.eMarks[i];
    lines.push(state.src.slice(pos, max));
  }

  const token = state.push('math_block', 'div', 0);
  token.content = lines.join('\n').trim();
  token.map = [start, nextLine + 1];
  state.line = nextLine + 1;
  return true;
}

/**
 * Inline math rule for $...$ expressions
 */
function mathInlineRule(state: any, silent: boolean) {
  const start = state.pos;
  const marker = '$';

  if (state.src[start] !== marker) return false;
  if (start > 0 && state.src[start - 1] === marker) return false; // Avoid $$

  const max = state.posMax;
  let pos = start + 1;

  // Find closing marker
  while (pos < max) {
    if (state.src[pos] === marker) {
      // Check it's not $$
      if (pos + 1 < max && state.src[pos + 1] === marker) {
        pos += 2;
        continue;
      }
      
      const content = state.src.slice(start + 1, pos);
      if (content.trim() && !content.includes('\n')) {
        if (silent) return true;

        const token = state.push('math_inline', 'span', 0);
        token.content = content;
        state.pos = pos + 1;
        return true;
      }
      return false;
    }
    pos++;
  }

  return false;
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
