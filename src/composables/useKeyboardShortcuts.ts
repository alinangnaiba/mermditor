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
      case 'b': // Bold or Blockquote
        if (e.shiftKey) { // Blockquote: Ctrl+Shift+B or Cmd+Shift+B
          preventDefault = true;
          textModified = true;

          const lineStartIndex = value.lastIndexOf('\n', start - 1) + 1;
          // Find the end of the last selected line
          let currentLineEnd = value.indexOf('\n', end -1);
          if (currentLineEnd === -1 || currentLineEnd < end) { // If no newline after selection end, or selection spans to last line
            currentLineEnd = value.length;
          }
          // If the selection ends exactly at a newline, we want to include the line before it, not the line after
          if (end > 0 && value[end-1] === '\n' && lineStartIndex < end) {
             currentLineEnd = end -1;
          }
          // If selection is empty and at the start of a line, apply to that line
          if (start === end && (start === 0 || value[start-1] === '\n')){
            currentLineEnd = value.indexOf('\n', start);
            if (currentLineEnd === -1) currentLineEnd = value.length;
          }

          const affectedText = value.substring(lineStartIndex, currentLineEnd);
          const lines = affectedText.split('\n');
          const allLinesAreBlockquotes = lines.every(line => line.startsWith('> ') || line.trim() === '');

          let newLinesString = '';
          let selectionStartOffset = 0;
          let selectionEndOffset = 0;

          if (allLinesAreBlockquotes) {
            // Remove blockquote
            newLinesString = lines.map(line => {
              if (line.startsWith('> ')) {
                selectionEndOffset -= 2;
                if (lineStartIndex + newLinesString.length < start) selectionStartOffset -=2;
                return line.substring(2);
              } else if (line.startsWith('>')) { // Handle case >text without space
                selectionEndOffset -= 1;
                if (lineStartIndex + newLinesString.length < start) selectionStartOffset -=1;
                return line.substring(1);
              }
              return line;
            }).join('\n');
          } else {
            // Add blockquote
            newLinesString = lines.map(line => {
              // Only add blockquote to non-empty lines or if it's the only line
              if (line.trim() !== '' || lines.length === 1) {
                selectionEndOffset += 2;
                if (lineStartIndex + newLinesString.length < start) selectionStartOffset +=2;
                return '> ' + line;
              }
              return line;
            }).join('\n');
          }
          
          newTextValue = value.substring(0, lineStartIndex) + newLinesString + value.substring(currentLineEnd);
          newSelectionStart = Math.max(lineStartIndex, start + selectionStartOffset);
          newSelectionEnd = end + selectionEndOffset;
          
          // Adjust selection if it was empty and at the start of the line
          if (start === end && (start === 0 || value[start-1] === '\n')){
            if (!allLinesAreBlockquotes) { // if adding blockquote
                 newSelectionStart = start + 2;
                 newSelectionEnd = newSelectionStart;
            } else { // if removing blockquote
                const originalLine = value.substring(lineStartIndex, currentLineEnd);
                if (originalLine.startsWith('> ')) newSelectionStart = Math.max(lineStartIndex, start-2);
                else if (originalLine.startsWith('>')) newSelectionStart = Math.max(lineStartIndex, start-1);
                else newSelectionStart = start;
                newSelectionEnd = newSelectionStart;
            }
          }

        } else { // Bold: Ctrl+B or Cmd+B
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
      case '!': // Heading 1
        if (e.shiftKey) {
          preventDefault = true;
          const lineStartIndex = value.lastIndexOf('\\n', start - 1) + 1;
          const lineEndIndex = value.indexOf('\\n', end);
          const currentLineEnd = lineEndIndex === -1 ? value.length : lineEndIndex;
          const currentLine = value.substring(lineStartIndex, currentLineEnd);

          if (currentLine.startsWith('# ')) {
            // Remove H1
            newTextValue = value.substring(0, lineStartIndex) + currentLine.substring(2) + value.substring(currentLineEnd);
            newSelectionStart = start - 2 < lineStartIndex ? lineStartIndex : start - 2;
            newSelectionEnd = end - 2 < lineStartIndex ? lineStartIndex : end - 2;
          } else {
            // Add H1
            newTextValue = value.substring(0, lineStartIndex) + '# ' + currentLine + value.substring(currentLineEnd);
            newSelectionStart = start + 2;
            newSelectionEnd = end + 2;
          }
          textModified = true;
        }
        break;
      case 'x': // Strikethrough
        if (e.shiftKey) { // Assuming Ctrl+Shift+X or Cmd+Shift+X
          preventDefault = true;
          const result = toggleWrapper(value, start, end, '~~', '~~', 'strikethrough text');
          newTextValue = result.newTextValue;
          newSelectionStart = result.newSelectionStart;
          newSelectionEnd = result.newSelectionEnd;
          textModified = true;
        }
        break;
      case 'e': // Inline Code: Ctrl+E or Cmd+E
        preventDefault = true;
        {
          const result = toggleWrapper(value, start, end, '`', '`', 'code');
          newTextValue = result.newTextValue;
          newSelectionStart = result.newSelectionStart;
          newSelectionEnd = result.newSelectionEnd;
          textModified = true;
        }
        break;
      case 'c': // Fenced Code Block: Ctrl+Shift+C or Cmd+Shift+C
        if (e.shiftKey) {
          const currentSelectionText = value.substring(start, end);
          const textBeforeSelection = value.substring(0, start);
          const textAfterSelection = value.substring(end);
          const langPlaceholder = 'language';

          const fencedBlockRegex = /^(?:\r?\n)?```([^\r\n]*)\r?\n([\s\S]*?)\r?\n```(?:\r?\n)?$/;
          const match = currentSelectionText.match(fencedBlockRegex);

          if (match) {
            // Selection is a fenced block, so unwrap it
            preventDefault = true;
            textModified = true;
            let internalContent = match[2]; 

            if (internalContent === '\n') {
              internalContent = '';
            }

            newTextValue = textBeforeSelection + internalContent + textAfterSelection;
            newSelectionStart = start; 
            newSelectionEnd = start + internalContent.length; 
          } else {
            // Selection is NOT a recognized fenced block, so create one
            preventDefault = true;
            textModified = true;
            
            const contentToWrap = currentSelectionText;

            const needsNewlineBefore = start > 0 && value[start - 1] !== '\n';
            const needsNewlineAfter = end < value.length && value[end] !== '\n';

            let blockCoreContent: string;
            if (contentToWrap) {
              blockCoreContent = contentToWrap;
            } else {
              blockCoreContent = '\n'; // Placeholder for an empty block, cursor will be on this line
            }

            const coreFencedMd = `\`\`\`${langPlaceholder}\n${blockCoreContent}\n\`\`\``;
            const fullBlockToInsert = `${needsNewlineBefore ? '\n' : ''}${coreFencedMd}${needsNewlineAfter ? '\n' : ''}`;
            
            newTextValue = textBeforeSelection + fullBlockToInsert + textAfterSelection;
            
            newSelectionStart = start; 
            newSelectionEnd = start + fullBlockToInsert.length; 
          }
        }
        break;
    }

    if (preventDefault) {
      e.preventDefault();
      e.stopPropagation();

      markdownText.value = newTextValue;

      nextTick(() => {
        // Ensure the textarea element still exists
        // Vue might have already updated textareaRef.value.value due to markdownText.value change.
        // Setting it again here ensures the value is what we expect before setting selection.
        if (textareaRef.value) {
          textareaRef.value.value = newTextValue;
          
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
