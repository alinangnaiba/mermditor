import type { MermaidChangeInfo } from '~/types/markdown-renderer';

export function extractMermaidBlocks(text: string): string[] {
  const mermaidRegex = /```mermaid\s*\n([\s\S]*?)\n```/g;
  const blocks: string[] = [];
  let match;
  while ((match = mermaidRegex.exec(text)) !== null) {
    blocks.push(match[1].trim());
  }
  return blocks;
}

export function getMermaidChangeInfo(newText: string, lastMermaidBlocks: string[]): MermaidChangeInfo {
  const newMermaidBlocks = extractMermaidBlocks(newText);
  const unchangedPositions = new Set<string>();
  
  // Compare each mermaid block to see which ones are unchanged
  newMermaidBlocks.forEach((block, index) => {
    const positionKey = `mermaid-${index}`;
    if (index < lastMermaidBlocks.length && lastMermaidBlocks[index] === block) {
      unchangedPositions.add(positionKey);
    }
  });
  
  const mermaidChanged = JSON.stringify(newMermaidBlocks) !== JSON.stringify(lastMermaidBlocks);
  
  return {
    mermaidChanged,
    newMermaidBlocks,
    unchangedPositions
  };
}
