import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import MermaidRenderer from '../MermaidRenderer.vue';
import mermaid from 'mermaid';

vi.mock('mermaid', () => ({
  default: {
    initialize: vi.fn(),
    render: vi.fn(),
  },
}));

describe('MermaidRenderer.vue', () => {
  beforeEach(() => {
    vi.mocked(mermaid.render).mockClear();
    vi.mocked(mermaid.initialize).mockClear();
  });

  it('renders an empty container when no code is provided', async () => {
    const wrapper = mount(MermaidRenderer, { props: { code: '', idSuffix: 'empty-test' } });
    await wrapper.vm.$nextTick();
    await new Promise(resolve => setTimeout(resolve, 0));
    await wrapper.vm.$nextTick();

    expect(wrapper.find('.mermaid-diagram-container').html()).toContain('');
    expect(wrapper.find('.mermaid-loading').exists()).toBe(false);
    expect(mermaid.render).not.toHaveBeenCalled();
  });

  it('calls mermaid.render and displays its output when code is provided', async () => {
    const mermaidCode = 'graph TD; A-->B;';
    const mockSvg = '<svg id="mocked-svg">Mermaid Diagram</svg>';
    const mockRenderResult = { svg: mockSvg, bindFunctions: vi.fn(), diagramType: 'graph' as const };
    const testIdSuffix = 'test-graph-suffix';
    const expectedMermaidId = `mermaid-diagram-${testIdSuffix}`;

    vi.mocked(mermaid.render).mockResolvedValue(mockRenderResult);

    const wrapper = mount(MermaidRenderer, {
      props: { code: mermaidCode, idSuffix: testIdSuffix }
    });

    await wrapper.vm.$nextTick();
    await new Promise(resolve => setTimeout(resolve, 0));
    await wrapper.vm.$nextTick();

    expect(mermaid.render).toHaveBeenCalledTimes(1);
    expect(mermaid.render).toHaveBeenCalledWith(expectedMermaidId, mermaidCode);
    expect(wrapper.find('.mermaid-diagram-container').html()).toContain(mockSvg);
    expect(wrapper.find('.mermaid-loading').exists()).toBe(false);
  });

  it('displays an error message if mermaid.render fails', async () => {
    const mermaidCode = 'graph TD; A-->B;';
    const errorMessage = 'Mermaid rendering failed';
    const testIdSuffix = 'error-graph-suffix';
    const expectedMermaidId = `mermaid-diagram-${testIdSuffix}`;

    vi.mocked(mermaid.render).mockRejectedValue(new Error(errorMessage));

    const wrapper = mount(MermaidRenderer, {
      props: { code: mermaidCode, idSuffix: testIdSuffix }
    });

    await wrapper.vm.$nextTick();
    await new Promise(resolve => setTimeout(resolve, 0));
    await wrapper.vm.$nextTick();

    expect(mermaid.render).toHaveBeenCalledTimes(1);
    expect(mermaid.render).toHaveBeenCalledWith(expectedMermaidId, mermaidCode);
    expect(wrapper.find('.mermaid-error').exists()).toBe(true);
    expect(wrapper.text()).toContain(`Error rendering diagram: ${errorMessage}`);
  });

  it('re-renders when the code prop changes', async () => {
    const initialCode = 'graph LR; X--Y;';
    const updatedCode = 'graph TD; P-->Q;';
    const testIdSuffix = 'change-graph-suffix';
    const expectedMermaidId = `mermaid-diagram-${testIdSuffix}`;

    const mockSvgInitial = { svg: '<svg id="initial-svg">Initial Diagram</svg>', bindFunctions: vi.fn(), diagramType: 'graph' as const };
    const mockSvgUpdated = { svg: '<svg id="updated-svg">Updated Diagram</svg>', bindFunctions: vi.fn(), diagramType: 'graph' as const };

    vi.mocked(mermaid.render).mockResolvedValueOnce(mockSvgInitial);

    const wrapper = mount(MermaidRenderer, {
      props: { code: initialCode, idSuffix: testIdSuffix }
    });

    await wrapper.vm.$nextTick();
    await new Promise(resolve => setTimeout(resolve, 0));
    await wrapper.vm.$nextTick();

    expect(mermaid.render).toHaveBeenCalledWith(expectedMermaidId, initialCode);
    expect(wrapper.find('.mermaid-diagram-container').html()).toContain(mockSvgInitial.svg);

    vi.mocked(mermaid.render).mockResolvedValueOnce(mockSvgUpdated);
    await wrapper.setProps({ code: updatedCode });

    await wrapper.vm.$nextTick();
    await new Promise(resolve => setTimeout(resolve, 0));
    await wrapper.vm.$nextTick();

    expect(mermaid.render).toHaveBeenCalledTimes(2);
    expect(mermaid.render).toHaveBeenCalledWith(expectedMermaidId, updatedCode);
    expect(wrapper.find('.mermaid-diagram-container').html()).toContain(mockSvgUpdated.svg);
  });
});
