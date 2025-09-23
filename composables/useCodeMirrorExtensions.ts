import { Extension } from '@codemirror/state';
import { EditorView, keymap } from '@codemirror/view';
import { markdown } from '@codemirror/lang-markdown';
import { oneDark } from '@codemirror/theme-one-dark';
import { lineNumbers } from '@codemirror/view';
import { search, searchKeymap } from '@codemirror/search';
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands';
import { texSyntax } from 'lang-tex';
import { indentWithTab } from '@codemirror/commands';
import { LanguageSupport } from '@codemirror/language';
import { parseMixed } from '@lezer/common';
import { parser as markdownParser } from '@lezer/markdown';

// Custom Mermaid language support for code blocks
const mermaidLanguage = new LanguageSupport(
  markdownParser.configure({
    props: []
  })
);

// Create mixed language parser for Markdown + LaTeX
const createMixedMarkdownParser = () => {
  const texLanguage = new LanguageSupport(texSyntax());

  return markdown({
    extensions: [
      // Handle LaTeX math blocks
      {
        defineNodes: [
          { name: 'MathBlock', block: true },
          { name: 'MathInline', inline: true }
        ],
        parseBlock: [{
          name: 'MathBlock',
          parse: (cx, line) => {
            if (line.text.startsWith('$$')) {
              const end = line.text.indexOf('$$', 2);
              if (end > 2) {
                return cx.addElement(cx.elt('MathBlock', cx.lineStart, cx.lineStart + end + 2));
              }
            }
            return false;
          }
        }],
        parseInline: [{
          name: 'MathInline',
          parse: (cx, next, pos) => {
            if (next === 36 /* $ */) {
              const match = /^\$([^$\n]+)\$/.exec(cx.text.slice(pos));
              if (match) {
                return cx.addElement(cx.elt('MathInline', pos, pos + match[0].length));
              }
            }
            return -1;
          }
        }]
      }
    ]
  });
};

// Create markdown formatting commands
const createMarkdownCommands = (
  markdownText: any,
  textareaRef: any,
  autoResizeTextarea: () => Promise<void>
) => {

  const toggleWrapper = (view: EditorView, prefix: string, suffix: string, placeholder: string) => {
    const { from, to } = view.state.selection.main;
    const selectedText = view.state.doc.sliceString(from, to);

    if (selectedText.startsWith(prefix) && selectedText.endsWith(suffix)) {
      // Remove wrapper
      const unwrapped = selectedText.slice(prefix.length, -suffix.length);
      view.dispatch({
        changes: { from, to, insert: unwrapped },
        selection: { anchor: from, head: from + unwrapped.length }
      });
    } else {
      // Add wrapper
      const textToWrap = selectedText || placeholder;
      const wrapped = `${prefix}${textToWrap}${suffix}`;
      view.dispatch({
        changes: { from, to, insert: wrapped },
        selection: {
          anchor: from + prefix.length,
          head: from + prefix.length + textToWrap.length
        }
      });
    }
    return true;
  };

  const insertHeading = (view: EditorView, level: number) => {
    const { from } = view.state.selection.main;
    const line = view.state.doc.lineAt(from);
    const lineText = line.text;

    const prefix = '#'.repeat(level) + ' ';
    const headingMatch = lineText.match(/^(#+) /);

    let newText: string;
    if (headingMatch) {
      const currentLevel = headingMatch[1].length;
      if (currentLevel === level) {
        // Remove heading
        newText = lineText.substring(prefix.length);
      } else {
        // Change heading level
        newText = prefix + lineText.substring(headingMatch[0].length);
      }
    } else {
      // Add heading
      newText = prefix + lineText;
    }

    view.dispatch({
      changes: { from: line.from, to: line.to, insert: newText },
      selection: { anchor: from + prefix.length }
    });
    return true;
  };

  return [
    // Bold: Ctrl+B
    {
      key: 'Ctrl-b',
      run: (view: EditorView) => toggleWrapper(view, '**', '**', 'bold text')
    },
    // Italic: Ctrl+I
    {
      key: 'Ctrl-i',
      run: (view: EditorView) => toggleWrapper(view, '*', '*', 'italic text')
    },
    // Inline code: Ctrl+E
    {
      key: 'Ctrl-e',
      run: (view: EditorView) => toggleWrapper(view, '`', '`', 'code')
    },
    // Link: Ctrl+K
    {
      key: 'Ctrl-k',
      run: (view: EditorView) => toggleWrapper(view, '[', '](url)', 'link text')
    },
    // Strikethrough: Ctrl+Shift+X
    {
      key: 'Ctrl-Shift-x',
      run: (view: EditorView) => toggleWrapper(view, '~~', '~~', 'strikethrough text')
    },
    // Code block: Ctrl+Shift+C
    {
      key: 'Ctrl-Shift-c',
      run: (view: EditorView) => {
        const { from, to } = view.state.selection.main;
        const selectedText = view.state.doc.sliceString(from, to);
        const codeBlock = selectedText ? `\`\`\`\n${selectedText}\n\`\`\`` : `\`\`\`language\n\n\`\`\``;

        view.dispatch({
          changes: { from, to, insert: codeBlock },
          selection: {
            anchor: from + 3,
            head: from + 3 + (selectedText ? 0 : 8) // Select "language" if no text selected
          }
        });
        return true;
      }
    },
    // Blockquote: Ctrl+Shift+B
    {
      key: 'Ctrl-Shift-b',
      run: (view: EditorView) => {
        const { from } = view.state.selection.main;
        const line = view.state.doc.lineAt(from);
        const lineText = line.text;

        let newText: string;
        if (lineText.startsWith('> ')) {
          newText = lineText.substring(2);
        } else {
          newText = '> ' + lineText;
        }

        view.dispatch({
          changes: { from: line.from, to: line.to, insert: newText }
        });
        return true;
      }
    },
    // Headings: Ctrl+Shift+1-6
    {
      key: 'Ctrl-Shift-1',
      run: (view: EditorView) => insertHeading(view, 1)
    },
    {
      key: 'Ctrl-Shift-2',
      run: (view: EditorView) => insertHeading(view, 2)
    },
    {
      key: 'Ctrl-Shift-3',
      run: (view: EditorView) => insertHeading(view, 3)
    },
    {
      key: 'Ctrl-Shift-4',
      run: (view: EditorView) => insertHeading(view, 4)
    },
    {
      key: 'Ctrl-Shift-5',
      run: (view: EditorView) => insertHeading(view, 5)
    },
    {
      key: 'Ctrl-Shift-6',
      run: (view: EditorView) => insertHeading(view, 6)
    }
  ];
};

export function useCodeMirrorExtensions(
  markdownText: any,
  textareaRef: any,
  autoResizeTextarea: () => Promise<void>,
  fileOperations?: {
    saveFile: () => Promise<void>;
    importFile: () => void;
  },
  findOperations?: {
    openFindPanel: () => void;
    openFindReplacePanel: () => void;
  }
) {

  const createExtensions = (): Extension[] => {
    // Create markdown commands
    const markdownCommands = createMarkdownCommands(markdownText, textareaRef, autoResizeTextarea);

    // Add file operation commands
    const fileCommands = [];
    if (fileOperations?.saveFile) {
      fileCommands.push({
        key: 'Ctrl-s',
        run: () => {
          fileOperations.saveFile();
          return true;
        }
      });
    }

    // Add find commands
    const findCommands = [];
    if (findOperations?.openFindPanel) {
      findCommands.push({
        key: 'Ctrl-Shift-f',
        run: () => {
          findOperations.openFindPanel();
          return true;
        }
      });
    }
    if (findOperations?.openFindReplacePanel) {
      findCommands.push({
        key: 'Ctrl-h',
        run: () => {
          findOperations.openFindReplacePanel();
          return true;
        }
      });
    }

    return [
      createMixedMarkdownParser(),
      oneDark,
      lineNumbers(),
      history(),
      search(),
      keymap.of([
        ...defaultKeymap,
        ...historyKeymap,
        ...searchKeymap,
        indentWithTab,
        ...markdownCommands,
        ...fileCommands,
        ...findCommands
      ]),
      EditorView.theme({
        '&': {
          height: '100%',
          fontSize: '14px',
          fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace'
        },
        '.cm-content': {
          padding: '1rem',
          minHeight: '100%',
          backgroundColor: 'transparent',
          lineHeight: '1.6'
        },
        '.cm-focused': {
          outline: 'none'
        },
        '.cm-editor': {
          height: '100%'
        },
        '.cm-scroller': {
          height: '100%'
        },
        '.cm-line': {
          lineHeight: '1.6'
        },
        // LaTeX math styling
        '.cm-math-inline': {
          color: '#a78bfa',
          backgroundColor: 'rgba(167, 139, 250, 0.1)',
          borderRadius: '3px',
          padding: '0 2px'
        },
        '.cm-math-block': {
          color: '#a78bfa',
          backgroundColor: 'rgba(167, 139, 250, 0.1)',
          borderRadius: '3px',
          padding: '4px',
          display: 'block'
        },
        // Mermaid code block styling
        '.cm-mermaid-block': {
          color: '#34d399',
          backgroundColor: 'rgba(52, 211, 153, 0.1)',
          borderRadius: '3px'
        }
      }),
      // Line wrapping
      EditorView.lineWrapping
    ];
  };

  return {
    createExtensions
  };
}