import mermaid from 'mermaid';

/**
 * Initialize mermaid configuration
 * Should be called once on app initialization
 */
export const setupMermaid = () => {
  mermaid.initialize({
    startOnLoad: false,
    theme: 'dark',
    securityLevel: 'strict',
  });
};
