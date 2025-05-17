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

interface ShortcutHandlerParams {
  value: string;
  start: number;
  end: number;
  shiftKey: boolean;
  altKey: boolean;
  // Add other relevant params like e.shiftKey if needed by specific handlers
}

interface ShortcutHandlerResult {
  newTextValue: string;
  newSelectionStart: number;
  newSelectionEnd: number;
  textModified: boolean;
  preventDefault: boolean; // Each handler can decide if it should prevent default
}

// --- Shortcut Handler Functions ---

function handleBlockquote(
  { value, start, end }: ShortcutHandlerParams
): ShortcutHandlerResult {
  const lineStartIndex = value.lastIndexOf('\n', start - 1) + 1;
  let currentLineEnd;

  if (start === end) { // Empty selection: operate on the current line
    currentLineEnd = value.indexOf('\n', start);
    if (currentLineEnd === -1) { // Cursor is on the last line
      currentLineEnd = value.length;
    }
  } else {
    currentLineEnd = value.indexOf('\n', end - 1);
    if (currentLineEnd === -1) { // Selection's last character is on the document's last line.
      currentLineEnd = value.length;
    }
  }

  const affectedText = value.substring(lineStartIndex, currentLineEnd);
  const lines = affectedText.split('\n');
  const allLinesAreBlockquotes = lines.every(line => line.startsWith('> ') || line.trim() === '');

  let newLinesString = '';
  if (allLinesAreBlockquotes) {
    newLinesString = lines.map(line => {
      if (line.startsWith('> ')) {
        return line.substring(2);
      } else if (line.startsWith('>')) { // Handle ">" without space, though less common
        return line.substring(1);
      }
      return line;
    }).join('\n');
  } else {
    newLinesString = lines.map(line => {
      if (line.trim() !== '' || lines.length === 1) {
        return '> ' + line;
      }
      return line;
    }).join('\n');
  }

  const textAfterAffectedBlock = value.substring(currentLineEnd);
  const newTextValue = value.substring(0, lineStartIndex) + newLinesString + textAfterAffectedBlock;

  let newSelectionStart: number;
  let newSelectionEnd: number;

  if (start === end) { // Empty selection: adjust cursor
    if (!allLinesAreBlockquotes) { // Added "> "
      newSelectionStart = start + 2;
      newSelectionEnd = newSelectionStart;
    } else { // Removed "> " or ">"
      const lineBeforeChange = value.substring(lineStartIndex, currentLineEnd);
      if (lineBeforeChange.startsWith('> ')) {
        newSelectionStart = Math.max(lineStartIndex, start - 2);
      } else if (lineBeforeChange.startsWith('>')) {
        newSelectionStart = Math.max(lineStartIndex, start - 1);
      } else {
        newSelectionStart = start; // Should not happen if allLinesAreBlockquotes was true for this line
      }
      newSelectionEnd = newSelectionStart;
    }
  } else { // Text was selected: select the modified block
    newSelectionStart = lineStartIndex;
    newSelectionEnd = lineStartIndex + newLinesString.length;
  }

  return { newTextValue, newSelectionStart, newSelectionEnd, textModified: true, preventDefault: true };
}

function handleBold(
  { value, start, end }: ShortcutHandlerParams
): ShortcutHandlerResult {
  const result = toggleWrapper(value, start, end, '**', '**', 'bold text');
  return { ...result, textModified: true, preventDefault: true };
}

function handleFencedCodeBlock(
  { value, start, end }: ShortcutHandlerParams
): ShortcutHandlerResult {
  const currentSelectionText = value.substring(start, end);
  const textBeforeSelection = value.substring(0, start);
  const textAfterSelection = value.substring(end);
  const langPlaceholder = 'language';
  const fencedBlockRegex = /^(?:\r?\n)?```([^\r\n]*)\r?\n([\s\S]*?)\r?\n```(?:\r?\n)?$/;
  const match = currentSelectionText.match(fencedBlockRegex);

  let newTextValue: string;
  let newSelectionStart: number;
  let newSelectionEnd: number;

  if (match) {
    let internalContent = match[2];
    if (internalContent === '\n') {
      internalContent = '';
    }
    newTextValue = textBeforeSelection + internalContent + textAfterSelection;
    newSelectionStart = start;
    newSelectionEnd = start + internalContent.length;
  } else {
    const contentToWrap = currentSelectionText;
    const needsNewlineBefore = start > 0 && value[start - 1] !== '\n';
    const needsNewlineAfter = end < value.length && value[end] !== '\n';
    let blockCoreContent: string;
    if (contentToWrap) {
      blockCoreContent = contentToWrap;
    } else {
      blockCoreContent = '\n';
    }
    const coreFencedMd = `\`\`\`${langPlaceholder}\n${blockCoreContent}\n\`\`\``;
    const fullBlockToInsert = `${needsNewlineBefore ? '\n' : ''}${coreFencedMd}${needsNewlineAfter ? '\n' : ''}`;
    newTextValue = textBeforeSelection + fullBlockToInsert + textAfterSelection;
    newSelectionStart = start;
    newSelectionEnd = start + fullBlockToInsert.length;
  }
  return { newTextValue, newSelectionStart, newSelectionEnd, textModified: true, preventDefault: true };
}

function handleHeading(
  params: ShortcutHandlerParams,
  level: number
): ShortcutHandlerResult {
  const { value, start, end } = params;
  const lineStartIndex = value.lastIndexOf('\n', start - 1) + 1;
  const lineEndIndex = value.indexOf('\n', end);
  const currentLineEnd = lineEndIndex === -1 ? value.length : lineEndIndex;
  const currentLine = value.substring(lineStartIndex, currentLineEnd);

  let newTextValue: string;
  let newSelectionStart: number;
  let newSelectionEnd: number;

  const prefix = '#'.repeat(level) + ' ';

  // Check if current line already starts with any heading prefix
  const headingMatch = currentLine.match(/^(#+) /);
  if (headingMatch) {
    const currentLevel = headingMatch[1].length;
    if (currentLevel === level) {
      // Remove current level heading
      newTextValue = value.substring(0, lineStartIndex) + currentLine.substring(prefix.length) + value.substring(currentLineEnd);
      newSelectionStart = start - prefix.length < lineStartIndex ? lineStartIndex : start - prefix.length;
      newSelectionEnd = end - prefix.length < lineStartIndex ? lineStartIndex : end - prefix.length;
    } else {
      // Change to new level heading
      const oldPrefixLength = currentLevel + 1; // # + space
      newTextValue = value.substring(0, lineStartIndex) + prefix + currentLine.substring(oldPrefixLength) + value.substring(currentLineEnd);
      const diff = prefix.length - oldPrefixLength;
      newSelectionStart = start + diff;
      newSelectionEnd = end + diff;
    }
  } else {
    // Add new heading
    newTextValue = value.substring(0, lineStartIndex) + prefix + currentLine + value.substring(currentLineEnd);
    newSelectionStart = start + prefix.length;
    newSelectionEnd = end + prefix.length;
  }
  return { newTextValue, newSelectionStart, newSelectionEnd, textModified: true, preventDefault: true };
}

function handleHeading1(
  params: ShortcutHandlerParams
): ShortcutHandlerResult {
  return handleHeading(params, 1);
}

function handleHeading2(
  params: ShortcutHandlerParams
): ShortcutHandlerResult {
  return handleHeading(params, 2);
}

function handleHeading3(
  params: ShortcutHandlerParams
): ShortcutHandlerResult {
  return handleHeading(params, 3);
}

function handleHeading4(
  params: ShortcutHandlerParams
): ShortcutHandlerResult {
  return handleHeading(params, 4);
}

function handleHeading5(
  params: ShortcutHandlerParams
): ShortcutHandlerResult {
  return handleHeading(params, 5);
}

function handleHeading6(
  params: ShortcutHandlerParams
): ShortcutHandlerResult {
  return handleHeading(params, 6);
}

function handleInlineCode(
  { value, start, end }: ShortcutHandlerParams
): ShortcutHandlerResult {
  const result = toggleWrapper(value, start, end, '`', '`', 'code');
  return { ...result, textModified: true, preventDefault: true };
}

function handleItalic(
  { value, start, end }: ShortcutHandlerParams
): ShortcutHandlerResult {
  const result = toggleWrapper(value, start, end, '*', '*', 'italic text');
  return { ...result, textModified: true, preventDefault: true };
}

function handleLink(
  { value, start, end }: ShortcutHandlerParams
): ShortcutHandlerResult {
  const selectedText = value.substring(start, end);
  const linkTextPlaceholder = 'link text';
  const urlPlaceholder = 'url';
  const fullLinkRegex = /^\[(.*?)\]\((.*?)\)$/;
  const selectedAsFullLinkMatch = selectedText.match(fullLinkRegex);

  let newTextValue: string;
  let newSelectionStart: number;
  let newSelectionEnd: number;

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
    newSelectionStart = start;
    newSelectionEnd = start + wrappedText.length;
  }
  return { newTextValue, newSelectionStart, newSelectionEnd, textModified: true, preventDefault: true };
}

function handleStrikethrough(
  { value, start, end }: ShortcutHandlerParams
): ShortcutHandlerResult {
  const result = toggleWrapper(value, start, end, '~~', '~~', 'strikethrough text');
  return { ...result, textModified: true, preventDefault: true };
}


// --- Main Composable Function ---

export function useKeyboardShortcuts(
  markdownText: Ref<string>,
  textareaRef: Ref<HTMLTextAreaElement | null>,
  autoResizeTextarea: () => Promise<void>
) {
  const handleKeyboardShortcut = (e: KeyboardEvent) => {
    if (!(e.ctrlKey || e.metaKey) || !textareaRef.value) return;

    const key = e.key.toLowerCase();
    const textarea = textareaRef.value;
    const params: ShortcutHandlerParams = {
      value: textarea.value,
      start: textarea.selectionStart,
      end: textarea.selectionEnd,
      shiftKey: e.shiftKey,
      altKey: e.altKey,
    };

    let result: ShortcutHandlerResult | null = null;

    switch (key) {
      case 'b':
        result = e.shiftKey ? handleBlockquote(params) : handleBold(params);
        break;
      case 'i':
        result = handleItalic(params);
        break;
      case 'k':
        result = handleLink(params);
        break;
      case '!': // Heading 1 (Shift + 1)
        if (e.shiftKey) result = handleHeading1(params);
        break;
      case '@': // Heading 2 (Shift + 2)
        if (e.shiftKey) result = handleHeading2(params);
        break;
      case '#': // Heading 3 (Shift + 3)
        if (e.shiftKey) result = handleHeading3(params);
        break;
      case '$': // Heading 4 (Shift + 4)
        if (e.shiftKey) result = handleHeading4(params);
        break;
      case '%': // Heading 5 (Shift + 5)
        if (e.shiftKey) result = handleHeading5(params);
        break;
      case '^': // Heading 6 (Shift + 6)
        if (e.shiftKey) result = handleHeading6(params);
        break;
      case 'x': // Strikethrough (Shift + X)
        if (e.shiftKey) result = handleStrikethrough(params);
        break;
      case 'e': // Inline Code
        result = handleInlineCode(params);
        break;
      case 'c': // Fenced Code Block (Shift + C)
        if (e.shiftKey) result = handleFencedCodeBlock(params);
        break;
    }

    if (result && result.textModified) {
      markdownText.value = result.newTextValue;
      nextTick(() => {
        if (textareaRef.value) {
          textareaRef.value.value = result!.newTextValue;
          textareaRef.value.selectionStart = result!.newSelectionStart;
          textareaRef.value.selectionEnd = result!.newSelectionEnd;
          textareaRef.value.focus();
          autoResizeTextarea();
        }
      });
    }

    if (result && result.preventDefault) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  return {
    handleKeyboardShortcut,
  };
}
