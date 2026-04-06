import { cleanupMermaidControls, type MermaidRenderTheme } from './markdownItMermaid'

const MERMAID_CONTAINER_SELECTOR = '.mermaid-container[data-mermaid-slot]'

const isMermaidContainerElement = (element: Element): element is HTMLElement =>
  element instanceof HTMLElement && element.matches(MERMAID_CONTAINER_SELECTOR)

const getMermaidContent = (container: Element): string =>
  container.querySelector('.mermaid')?.getAttribute('data-content')?.trim() || ''

const canPreserveMermaidContainer = (
  currentContainer: HTMLElement,
  nextContainer: HTMLElement,
  themeKey: MermaidRenderTheme
): boolean => {
  const currentMermaid = currentContainer.querySelector('.mermaid')
  const nextMermaid = nextContainer.querySelector('.mermaid')

  if (!currentMermaid || !nextMermaid) {
    return false
  }

  if (getMermaidContent(currentContainer) !== getMermaidContent(nextContainer)) {
    return false
  }

  if (currentMermaid.getAttribute('data-processed') !== 'true') {
    return true
  }

  return currentMermaid.getAttribute('data-theme-key') === themeKey
}

export const patchPreviewContent = (
  contentRoot: HTMLElement,
  nextHtml: string,
  themeKey: MermaidRenderTheme
): void => {
  const template = document.createElement('template')
  template.innerHTML = nextHtml

  const existingMermaidContainers = Array.from(
    contentRoot.querySelectorAll(MERMAID_CONTAINER_SELECTOR)
  ).filter(isMermaidContainerElement)
  const existingMermaidBySlot = new Map<string, HTMLElement>()
  const preservedMermaidContainers = new Set<HTMLElement>()

  for (const container of existingMermaidContainers) {
    const slot = container.getAttribute('data-mermaid-slot')
    if (slot) {
      existingMermaidBySlot.set(slot, container)
    }
  }

  const nextMermaidContainers = Array.from(
    template.content.querySelectorAll(MERMAID_CONTAINER_SELECTOR)
  ).filter(isMermaidContainerElement)

  for (const nextContainer of nextMermaidContainers) {
    const slot = nextContainer.getAttribute('data-mermaid-slot')
    if (!slot) {
      continue
    }

    const currentContainer = existingMermaidBySlot.get(slot)
    if (!currentContainer || !canPreserveMermaidContainer(currentContainer, nextContainer, themeKey)) {
      continue
    }

    nextContainer.replaceWith(currentContainer)
    preservedMermaidContainers.add(currentContainer)
  }

  for (const container of existingMermaidContainers) {
    if (!preservedMermaidContainers.has(container)) {
      cleanupMermaidControls(container)
    }
  }

  contentRoot.replaceChildren(template.content)
}
