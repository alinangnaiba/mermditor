declare global {
  interface Window {
    Prism: {
      highlightAll: () => void
      highlightElement: (element: Element) => void
    }
  }
}

export const highlightSyntax = (): void => {
  if (!import.meta.client || !window.Prism) return
  const codeBlocks = document.querySelectorAll('pre code:not(.prism-highlighted)')

  codeBlocks.forEach((block) => {
    block.classList.add('prism-highlighted')
    // Apply Prism highlighting
    window.Prism.highlightElement(block)
  })
}
