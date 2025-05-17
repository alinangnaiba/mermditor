// c:\repositories\mdit\src\components\__tests__\MarkdownEditor.spec.ts
import { mount, flushPromises } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import MarkdownEditor from '../MarkdownEditor.vue';

// Mock the Mermaid plugin as it might involve complex rendering and async operations
vi.mock('@/plugins/mermaid', () => ({
  renderMermaid: vi.fn().mockResolvedValue('<svg>Mocked Mermaid Output</svg>'),
  setupMermaid: vi.fn(), // Add mock for setupMermaid
}));

describe('MarkdownEditor.vue', () => {
  beforeEach(() => {
    localStorage.removeItem('mermd-markdown-input');
    localStorage.removeItem('mermd-editor-width');
    // Ensure mocks are reset if they are stateful between tests, though vi.fn() usually resets calls.
    vi.clearAllMocks(); 

    // Re-mock with fresh functions if needed, especially if they accumulate calls
    // For simple mocks like above, clearAllMocks might be enough.
    // If setupMermaid was called in one test and you don't want that to affect another:
    vi.mock('@/plugins/mermaid', () => ({
      renderMermaid: vi.fn().mockResolvedValue('<svg>Mocked Mermaid Output</svg>'),
      setupMermaid: vi.fn(),
    }));
    vi.useFakeTimers(); // Use fake timers for debounce control
  });

  afterEach(() => {
    vi.useRealTimers(); // Restore real timers
  });

  it('renders the editor and preview panes', async () => {
    const wrapper = mount(MarkdownEditor, {
      props: {
        initialMarkdown: '# Hello World',
      },
    });
    await flushPromises(); // Wait for onMounted and initial render
    vi.runOnlyPendingTimers(); // Execute any debounced calls from onMounted
    await flushPromises();
    await wrapper.vm.$nextTick(); // Wait for DOM updates

    expect(wrapper.find('.editor-pane textarea').exists()).toBe(true);
    expect(wrapper.find('.markdown-content').exists()).toBe(true);
  });

  it('initializes with given markdown', async () => {
    const initialMarkdown = '## Subtitle';
    const wrapper = mount(MarkdownEditor, {
      props: {
        initialMarkdown,
      },
    });

    // Allow onMounted and its async operations/debounced calls to complete
    await flushPromises();
    vi.runOnlyPendingTimers();
    await flushPromises();
    await wrapper.vm.$nextTick(); // Ensure DOM is updated after onMounted logic

    const textarea = wrapper.find('.editor-pane textarea');
    expect((textarea.element as HTMLTextAreaElement).value).toBe(initialMarkdown);

    const preview = wrapper.find('.markdown-content');
    expect(preview.html()).toContain('<h2>Subtitle</h2>');
    // Ensure default content isn't present if specific markdown is provided
    expect(preview.html()).not.toContain('<h1>Markdown Editor with Mermaid</h1>');
  });

  it('updates the preview when markdown changes', async () => {
    const initialText = 'Initial text for update test';
    const wrapper = mount(MarkdownEditor, {
      props: { initialMarkdown: initialText },
    });

    // Initial render with prop
    await flushPromises();
    vi.runOnlyPendingTimers();
    await flushPromises();
    await wrapper.vm.$nextTick();

    // Verify initial state based on prop
    const textarea = wrapper.find('.editor-pane textarea');
    expect((textarea.element as HTMLTextAreaElement).value).toBe(initialText);
    // The preview should contain the rendered initialText. 
    // For simplicity, we'll check for a unique part of it or its rendered form.
    // If initialText is simple, it might just be <p>Initial text...</p>
    // For now, let's assume it renders and we check the next state.

    const newMarkdown = '# New Header After Update';
    await textarea.setValue(newMarkdown);

    // Wait for Vue reactivity, debounced watcher, and DOM updates
    await flushPromises();
    vi.runOnlyPendingTimers(); // Trigger debouncedRenderMarkdown from watch
    await flushPromises();
    await wrapper.vm.$nextTick();

    const preview = wrapper.find('.markdown-content');
    expect(preview.html()).toContain('<h1>New Header After Update</h1>');
    expect(preview.html()).not.toContain(initialText);
    expect(preview.html()).not.toContain('<h1>Markdown Editor with Mermaid</h1>'); // Ensure default content is not there
  });

  // Add more tests here, for example:
  // - Test auto-resize functionality (might require more complex DOM mocking or inspection)
  // - Test drag handle functionality
  // - Test Mermaid diagram rendering (ensure the mock is called)
  // - Test scroll synchronization (if feasible in unit test environment)
});
