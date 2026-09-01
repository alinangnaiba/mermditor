import { mount } from '@vue/test-utils'
import { createSSRApp, h, nextTick } from 'vue'
import SafeHtml from '../../app/components/SafeHtml.vue'

describe('SafeHtml', () => {
  it('sanitizes unsafe html before rendering', () => {
    const wrapper = mount(SafeHtml, {
      props: {
        content: '<div onclick="alert(1)"><script>alert(1)</script><p>Safe</p></div>',
      },
    })

    expect(wrapper.html()).toContain('<p>Safe</p>')
    expect(wrapper.html()).not.toContain('<script>')
    expect(wrapper.html()).not.toContain('onclick=')
  })

  it('sanitizes svg payloads when requested', () => {
    const wrapper = mount(SafeHtml, {
      props: {
        kind: 'svg',
        content: '<svg><script>alert(1)</script><circle cx="8" cy="8" r="4"></circle></svg>',
      },
    })

    expect(wrapper.html()).toContain('<circle')
    expect(wrapper.html()).not.toContain('<script>')
  })

  it('sanitizes and injects content when hydrating empty server markup', async () => {
    // SSR cannot sanitize without a DOM, so the server emits an empty element.
    const container = document.createElement('div')
    container.innerHTML = '<div class="content"></div>'
    document.body.appendChild(container)

    const app = createSSRApp({
      render: () =>
        h(SafeHtml, {
          class: 'content',
          content: '<div onclick="alert(1)"><script>alert(1)</script><p>Safe</p></div>',
        }),
    })

    app.mount(container)
    await nextTick()

    expect(container.innerHTML).toContain('<p>Safe</p>')
    expect(container.innerHTML).not.toContain('<script>')
    expect(container.innerHTML).not.toContain('onclick=')

    app.unmount()
    container.remove()
  })
})
