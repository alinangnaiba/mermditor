import mermaid from 'mermaid';

export default defineNuxtPlugin({
  name: 'mermaid',
  parallel: true,
  setup() {
    // Only run on client-side
    if (import.meta.client) {
      mermaid.initialize({
        startOnLoad: false,
        theme: 'dark',
        securityLevel: 'strict',
      });
    }
  }
});
