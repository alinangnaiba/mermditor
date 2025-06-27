import type { App } from 'vue';

export interface RenderedComponent {
  app: App;
  container: HTMLElement;
  content: string;
}

export interface ComponentRenderer {
  name: string;
  selector: string;
  render: (element: Element, index: number) => void;
  strategy: 'immediate' | 'debounced';
  debounceMs?: number;
  cache?: Map<string, RenderedComponent>; // Optional cache for position-based caching
}

export interface MermaidChangeInfo {
  mermaidChanged: boolean;
  newMermaidBlocks: string[];
  unchangedPositions: Set<string>;
}
