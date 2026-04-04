const COPY_RESET_DELAY_MS = 2000
const copyResetTimers = new WeakMap<HTMLButtonElement, number>()

const setButtonLabel = (button: HTMLButtonElement, text: string): void => {
  const label = button.querySelector('.code-block-button-label')
  if (label) {
    label.textContent = text
  }
}

const resetCopyButton = (button: HTMLButtonElement): void => {
  button.classList.remove('copied', 'copy-failed')
  button.setAttribute('aria-label', 'Copy code')
  button.setAttribute('title', 'Copy code')
  setButtonLabel(button, 'Copy')
}

const scheduleCopyReset = (button: HTMLButtonElement): void => {
  const existingTimer = copyResetTimers.get(button)
  if (existingTimer) {
    window.clearTimeout(existingTimer)
  }

  const timeoutId = window.setTimeout(() => {
    resetCopyButton(button)
    copyResetTimers.delete(button)
  }, COPY_RESET_DELAY_MS)

  copyResetTimers.set(button, timeoutId)
}

const copyText = async (text: string): Promise<void> => {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text)
    return
  }

  const textArea = document.createElement('textarea')
  textArea.value = text
  textArea.setAttribute('readonly', '')
  textArea.style.position = 'absolute'
  textArea.style.left = '-9999px'
  document.body.appendChild(textArea)
  textArea.select()
  document.execCommand('copy')
  document.body.removeChild(textArea)
}

export const attachCodeBlockInteractions = (container: HTMLElement): (() => void) => {
  const handleClick = async (event: MouseEvent): Promise<void> => {
    const target = event.target as Element

    const wrapButton = target.closest('.code-block-wrap') as HTMLButtonElement | null
    if (wrapButton) {
      const block = wrapButton.closest('.code-block-container')
      if (!block) return

      const isWrapped = block.classList.toggle('is-wrapped')
      wrapButton.classList.toggle('active', isWrapped)
      wrapButton.setAttribute('aria-pressed', isWrapped ? 'true' : 'false')
      setButtonLabel(wrapButton, isWrapped ? 'Unwrap' : 'Wrap')
      return
    }

    const copyButton = target.closest('.code-block-copy') as HTMLButtonElement | null
    if (!copyButton) return

    const pre = copyButton.closest('.code-block-container')?.querySelector('pre')
    if (!pre) return

    const text = pre.textContent ?? ''

    try {
      await copyText(text)
      copyButton.classList.remove('copy-failed')
      copyButton.classList.add('copied')
      copyButton.setAttribute('aria-label', 'Code copied')
      copyButton.setAttribute('title', 'Code copied')
      setButtonLabel(copyButton, 'Copied')
      scheduleCopyReset(copyButton)
    } catch (error) {
      console.warn('Failed to copy code block:', error)
      copyButton.classList.remove('copied')
      copyButton.classList.add('copy-failed')
      copyButton.setAttribute('aria-label', 'Copy failed')
      copyButton.setAttribute('title', 'Copy failed')
      setButtonLabel(copyButton, 'Retry')
      scheduleCopyReset(copyButton)
    }
  }

  container.addEventListener('click', handleClick)

  return () => {
    container.removeEventListener('click', handleClick)
  }
}
