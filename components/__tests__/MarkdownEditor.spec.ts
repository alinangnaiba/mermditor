import { mount, flushPromises } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import MarkdownEditor from '../MarkdownEditor.vue';

vi.mock('@/plugins/mermaid', () => ({
  renderMermaid: vi.fn().mockResolvedValue('<svg>Mocked Mermaid Output</svg>'),
  setupMermaid: vi.fn(),
}));

describe('MarkdownEditor.vue', () => {
  beforeEach(() => {
    localStorage.removeItem('mermd-markdown-input');
    localStorage.removeItem('mermd-editor-width');
    vi.clearAllMocks(); 
    vi.mock('@/plugins/mermaid', () => ({
      renderMermaid: vi.fn().mockResolvedValue('<svg>Mocked Mermaid Output</svg>'),
      setupMermaid: vi.fn(),
    }));
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders the editor and preview panes', async () => {
    const wrapper = mount(MarkdownEditor, {
      props: {
        initialMarkdown: '# Hello World',
      },
    });
    await flushPromises(); 
    vi.runOnlyPendingTimers(); 
    await flushPromises();
    await wrapper.vm.$nextTick(); 

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

    await flushPromises();
    vi.runOnlyPendingTimers();
    await flushPromises();
    await wrapper.vm.$nextTick(); 

    const textarea = wrapper.find('.editor-pane textarea');
    expect((textarea.element as HTMLTextAreaElement).value).toBe(initialMarkdown);

    const preview = wrapper.find('.markdown-content');
    expect(preview.html()).toContain('<h2>Subtitle</h2>');
    expect(preview.html()).not.toContain('<h1>Markdown Editor with Mermaid</h1>');
  });

  it('updates the preview when markdown changes', async () => {
    const initialText = 'Initial text for update test';
    const wrapper = mount(MarkdownEditor, {
      props: { initialMarkdown: initialText },
    });

    await flushPromises();
    vi.runOnlyPendingTimers();
    await flushPromises();
    await wrapper.vm.$nextTick();

    const textarea = wrapper.find('.editor-pane textarea');
    expect((textarea.element as HTMLTextAreaElement).value).toBe(initialText);

    const newMarkdown = '# New Header After Update';
    await textarea.setValue(newMarkdown);

    await flushPromises();
    vi.runOnlyPendingTimers(); 
    await flushPromises();
    await wrapper.vm.$nextTick();

    const preview = wrapper.find('.markdown-content');
    expect(preview.html()).toContain('<h1>New Header After Update</h1>');
    expect(preview.html()).not.toContain(initialText);
    expect(preview.html()).not.toContain('<h1>Markdown Editor with Mermaid</h1>');
  });

  it('auto-resizes textarea and preview pane based on content', async () => {
    const wrapper = mount(MarkdownEditor, {
      props: {
        initialMarkdown: 'Short content',
      },
    });

    await flushPromises();
    vi.runAllTimers();
    await flushPromises();
    await wrapper.vm.$nextTick();

    const textarea = wrapper.find('textarea');
    const previewPane = wrapper.find('.preview-pane-content');
    
    expect(textarea.exists()).toBe(true);
    expect(previewPane.exists()).toBe(true);
    
    expect(wrapper.find('.markdown-content').html()).toContain('Short content');
    
    const longMarkdown = 'This is a much longer content.\n\nIt has multiple paragraphs.\n\n' + 
                         'And should theoretically cause the height to increase.';
    
    await textarea.setValue(longMarkdown);
    
    await flushPromises();
    vi.runAllTimers(); 
    await flushPromises();
    await wrapper.vm.$nextTick();
    
    const contentHtml = wrapper.find('.markdown-content').html();
    expect(contentHtml).toContain('This is a much longer content');
    expect(contentHtml).toContain('It has multiple paragraphs');
    
    expect((textarea.element as HTMLTextAreaElement).value).toBe(longMarkdown);
    
    wrapper.unmount();
  });

  it('resizes editor and preview panes when dragging the divider', async () => {
    const wrapper = mount(MarkdownEditor, {
      props: {
        initialMarkdown: 'Test',
      },
      attachTo: document.body,
    });

    await flushPromises();
    vi.runOnlyPendingTimers();
    await flushPromises();
    await wrapper.vm.$nextTick();
    
    const editorPane = wrapper.find('.editor-container').element as HTMLElement;
    const previewPane = wrapper.find('.preview-container').element as HTMLElement;
    const initialEditorWidth = editorPane.style.width;
    const initialPreviewWidth = previewPane.style.width;

    expect(initialEditorWidth).toBe('50%');
    expect(initialPreviewWidth).toBe('50%');

    const divider = wrapper.find('.divider');
    
    const mainScrollContainerElement = wrapper.find('.main-scroll-container').element as HTMLElement;
    const originalGetBoundingClientRect = mainScrollContainerElement.getBoundingClientRect;
    mainScrollContainerElement.getBoundingClientRect = vi.fn(() => ({
      left: 0,
      top: 0,
      width: 1000, 
      height: 500,
      right: 1000,
      bottom: 500,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    }));

    await divider.trigger('mousedown');
    
    const mouseMoveEvent = new MouseEvent('mousemove', { clientX: 250 }); 
    document.dispatchEvent(mouseMoveEvent);
    await wrapper.vm.$nextTick();

    expect(editorPane.style.width).toBe('25%');
    expect(previewPane.style.width).toBe('75%');

    const mouseUpEvent = new MouseEvent('mouseup');
    document.dispatchEvent(mouseUpEvent);
    await wrapper.vm.$nextTick();

    mainScrollContainerElement.getBoundingClientRect = originalGetBoundingClientRect;
    wrapper.unmount();
  });
});
