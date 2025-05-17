import { ref, nextTick, type Ref } from 'vue';

// Helper function to check for potential URL-like strings
const isPotentiallyUrlLike = (text: string): boolean => {
  if (!text || text.trim() === '') return false;
  if (/\s/.test(text)) return false;

  if (/^https?:\/\//i.test(text)) {
    return true;
  }
  const domainStructureRegex = /^([a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
  return domainStructureRegex.test(text);
};

function toggleWrapper(
  value: string,
  start: number,
  end: number,
  prefix: string,
  suffix: string,
  placeholder: string
): { newTextValue: string; newSelectionStart: number; newSelectionEnd: number } {
  const selectedText = value.substring(start, end);
  const textBeforeSelection = value.substring(0, start);
  const textAfterSelection = value.substring(end);

  const isExactlyWrapped = selectedText.startsWith(prefix) &&
                           selectedText.endsWith(suffix) &&
                           selectedText.length >= prefix.length + suffix.length;
  
  const isEffectivelyWrapped = !isExactlyWrapped &&
                               textBeforeSelection.endsWith(prefix) &&
                               textAfterSelection.startsWith(suffix);

  let newTextValue: string;
  let newSelectionStart: number;
  let newSelectionEnd: number;

  if (isExactlyWrapped) {
    const unwrappedText = selectedText.substring(prefix.length, selectedText.length - suffix.length);
    newTextValue = textBeforeSelection + unwrappedText + textAfterSelection; // Corrected line
    newSelectionStart = start;
    newSelectionEnd = start + unwrappedText.length;
  } else if (isEffectivelyWrapped) {
    // Unwrap: ** selected text ** -> selected text (cursor was inside)
    const textBeforePrefix = textBeforeSelection.substring(0, textBeforeSelection.length - prefix.length);
    const textAfterSuffix = textAfterSelection.substring(suffix.length);
    newTextValue = textBeforePrefix + selectedText + textAfterSuffix;
    newSelectionStart = start - prefix.length;
    newSelectionEnd = end - prefix.length;
  } else {
    // Wrap: text -> **text** or **placeholder**
    const textToWrap = selectedText || placeholder;
    const wrappedText = `${prefix}${textToWrap}${suffix}`;
    newTextValue = textBeforeSelection + wrappedText + textAfterSelection;
    newSelectionStart = start + prefix.length;
    newSelectionEnd = start + prefix.length + textToWrap.length;
  }
  return { newTextValue, newSelectionStart, newSelectionEnd };
}

export function useKeyboardShortcuts(
  markdownText: Ref<string>,
  textareaRef: Ref<HTMLTextAreaElement | null>,
  autoResizeTextarea: () => Promise<void>
) {
  const handleKeyboardShortcut = (e: KeyboardEvent) => {
    if (!(e.ctrlKey || e.metaKey) || !textareaRef.value) return;

    const key = e.key.toLowerCase();
    const textarea = textareaRef.value;
    const { selectionStart: start, selectionEnd: end } = textarea;
    const value = textarea.value;
    // const selectedText = value.substring(start, end); // Moved inside toggleWrapper or specific handlers

    let newTextValue: string = value;
    let newSelectionStart: number = start;
    let newSelectionEnd: number = end;
    let textModified: boolean = false;
    let preventDefault = false;

    switch (key) {
      case 'b': // Bold
        {
          preventDefault = true;
          const result = toggleWrapper(value, start, end, '**', '**', 'bold text');
          newTextValue = result.newTextValue;
          newSelectionStart = result.newSelectionStart;
          newSelectionEnd = result.newSelectionEnd;
          textModified = true;
        }
        break;
      case 'i': // Italic
        {
          preventDefault = true;
          const result = toggleWrapper(value, start, end, '*', '*', 'italic text');
          newTextValue = result.newTextValue;
          newSelectionStart = result.newSelectionStart;
          newSelectionEnd = result.newSelectionEnd;
          textModified = true;
        }
        break;
      case 'k': // Link
        {
          preventDefault = true;
          const selectedText = value.substring(start, end);
          const linkTextPlaceholder = 'link text';
          const urlPlaceholder = 'url';
          const fullLinkRegex = /^\[(.*?)\]\((.*?)\)$/;
          const selectedAsFullLinkMatch = selectedText.match(fullLinkRegex);

          if (selectedAsFullLinkMatch) {
            const actualLinkText = selectedAsFullLinkMatch[1];
            newTextValue = value.substring(0, start) + actualLinkText + value.substring(end);
            newSelectionStart = start;
            newSelectionEnd = start + actualLinkText.length;
          } else {
            let textToWrap = selectedText || linkTextPlaceholder;
            let finalUrl = urlPlaceholder;

            if (selectedText && selectedText.trim() !== '') {
              if (isPotentiallyUrlLike(selectedText)) {
                textToWrap = selectedText;
                if (/^https?:\/\//i.test(selectedText)) {
                  finalUrl = selectedText;
                } else {
                  finalUrl = 'http://' + selectedText;
                }
              } 
            }
            const wrappedText = `[${textToWrap}](${finalUrl})`;
            newTextValue = value.substring(0, start) + wrappedText + value.substring(end);
            
            // Corrected selection to highlight the entire new link
            newSelectionStart = start;
            newSelectionEnd = start + wrappedText.length;
          }
          textModified = true;
        }
        break;
      case '1': // Heading 1
        if (e.shiftKey) {
          preventDefault = true;
          const lineStartPos = value.lastIndexOf('\n', start - 1) + 1;
          let actualLineEndPos = value.indexOf('\n', lineStartPos);
          if (actualLineEndPos === -1) {
              actualLineEndPos = value.length;
          }
          const currentLineContent = value.substring(lineStartPos, actualLineEndPos);

          if (currentLineContent.startsWith('# ')) {
            newTextValue = value.substring(0, lineStartPos) + currentLineContent.substring(2) + value.substring(actualLineEndPos);
            newSelectionStart = Math.max(lineStartPos, start - 2);
            newSelectionEnd = Math.max(lineStartPos, end - 2);
          } else {
            newTextValue = value.substring(0, lineStartPos) + '# ' + currentLineContent + value.substring(actualLineEndPos);
            if (start === end && start >= lineStartPos && start <= actualLineEndPos) {
              newSelectionStart = lineStartPos + 2;
              newSelectionEnd = lineStartPos + 2;
            } else {
              newSelectionStart = start + 2;
              newSelectionEnd = end + 2;
            }
          }
          textModified = true;
        } else {
          return; 
        }
        break;
      default:
        return;
    }

    if (preventDefault) {
      e.preventDefault();
    }

    if (textModified) {
      markdownText.value = newTextValue;
      nextTick(() => {
        if (textareaRef.value) {
          textareaRef.value.selectionStart = newSelectionStart;
          textareaRef.value.selectionEnd = newSelectionEnd;
          textareaRef.value.focus();
          autoResizeTextarea(); 
        }
      });
    }
  };

  return {
    handleKeyboardShortcut,
  };
}
