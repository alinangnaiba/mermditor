import {
  cleanupMermaidControls,
  type MermaidRenderTheme,
  type PreviewSectionDescriptor,
} from './markdownItMermaid'

export interface PreviewSectionState {
  descriptor: PreviewSectionDescriptor
  element: HTMLElement
  themeKey: MermaidRenderTheme
}

interface UpdatePreviewSectionsOptions {
  contentRoot: HTMLElement
  nextSections: PreviewSectionDescriptor[]
  previousSections: PreviewSectionState[]
  themeKey: MermaidRenderTheme
  renderMarkdownSection: (source: string) => Promise<string>
  renderMermaidSection: (source: string, slot: string) => string
}

const canPreserveSection = (
  previousSection: PreviewSectionState | undefined,
  nextSection: PreviewSectionDescriptor,
  themeKey: MermaidRenderTheme
): previousSection is PreviewSectionState => {
  if (!previousSection) {
    return false
  }

  if (
    previousSection.descriptor.kind !== nextSection.kind ||
    previousSection.descriptor.key !== nextSection.key ||
    previousSection.descriptor.source !== nextSection.source
  ) {
    return false
  }

  return nextSection.kind !== 'mermaid' || previousSection.themeKey === themeKey
}

const createSectionElement = (
  descriptor: PreviewSectionDescriptor,
  html: string
): HTMLElement => {
  const element = document.createElement('div')
  element.setAttribute('data-preview-section-kind', descriptor.kind)
  element.setAttribute('data-preview-section-key', descriptor.key)
  element.innerHTML = html
  return element
}

export const updatePreviewSections = async ({
  contentRoot,
  nextSections,
  previousSections,
  themeKey,
  renderMarkdownSection,
  renderMermaidSection,
}: UpdatePreviewSectionsOptions): Promise<PreviewSectionState[]> => {
  const nextSectionStates: PreviewSectionState[] = []

  for (const [index, nextSection] of nextSections.entries()) {
    const previousSection = previousSections[index]
    if (canPreserveSection(previousSection, nextSection, themeKey)) {
      nextSectionStates.push(previousSection)
      continue
    }

    const html =
      nextSection.kind === 'markdown'
        ? await renderMarkdownSection(nextSection.source)
        : renderMermaidSection(nextSection.source, nextSection.mermaidSlot ?? String(index))

    nextSectionStates.push({
      descriptor: nextSection,
      element: createSectionElement(nextSection, html),
      themeKey,
    })
  }

  const nextElements = nextSectionStates.map((section) => section.element)
  const structureChanged =
    nextElements.length !== previousSections.length ||
    nextElements.some((element, index) => previousSections[index]?.element !== element)

  if (structureChanged) {
    const preservedElements = new Set(nextElements)
    for (const previousSection of previousSections) {
      if (
        previousSection.descriptor.kind === 'mermaid' &&
        !preservedElements.has(previousSection.element)
      ) {
        cleanupMermaidControls(previousSection.element)
      }
    }

    contentRoot.replaceChildren(...nextElements)
  }

  return nextSectionStates
}
