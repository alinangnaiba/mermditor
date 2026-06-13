import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { upload } from '@vercel/blob/client'
import FeedbackForm from '../../app/components/FeedbackForm.vue'

vi.mock('@vercel/blob/client', () => ({
  upload: vi.fn(),
}))

const makeFile = (name: string, type = 'image/png', size = 1024): File => {
  const file = new File(['x'], name, { type })
  Object.defineProperty(file, 'size', { value: size })
  return file
}

const setInputFiles = async (input: HTMLInputElement, files: File[]) => {
  Object.defineProperty(input, 'files', {
    configurable: true,
    value: files,
  })
  input.dispatchEvent(new Event('change'))
  await Promise.resolve()
}

describe('FeedbackForm attachments', () => {
  beforeEach(() => {
    vi.stubGlobal('$fetch', vi.fn().mockResolvedValue({ ok: true }))
    vi.mocked(upload).mockReset()
  })

  it('appends newly chosen bug report attachments', async () => {
    const wrapper = mount(FeedbackForm)
    const input = wrapper.get<HTMLInputElement>('#ff-attachments').element

    await setInputFiles(input, [makeFile('one.png'), makeFile('two.png')])
    await setInputFiles(input, [makeFile('three.png')])

    expect(wrapper.text()).toContain('one.png')
    expect(wrapper.text()).toContain('two.png')
    expect(wrapper.text()).toContain('three.png')
  })

  it('shows attachments only for bug reports and clears them when changing type', async () => {
    const wrapper = mount(FeedbackForm)
    const input = wrapper.get<HTMLInputElement>('#ff-attachments').element

    await setInputFiles(input, [makeFile('bug.png')])
    expect(wrapper.text()).toContain('bug.png')

    await wrapper.findAll('.ff-type-btn')[1].trigger('click')

    expect(wrapper.find('#ff-attachments').exists()).toBe(false)
    expect(wrapper.text()).not.toContain('bug.png')
  })

  it('submits uploaded attachment URLs with the feedback payload', async () => {
    vi.mocked(upload).mockResolvedValue({
      url: 'https://example.public.blob.vercel-storage.com/feedback/fb/screenshot.png',
    } as Awaited<ReturnType<typeof upload>>)
    const fetchMock = vi.fn().mockResolvedValue({ ok: true })
    vi.stubGlobal('$fetch', fetchMock)
    const wrapper = mount(FeedbackForm)

    await wrapper.get('#ff-title').setValue('Screenshot missing')
    await wrapper.get('#ff-details').setValue('The rendered issue did not include my screenshot')
    await setInputFiles(wrapper.get<HTMLInputElement>('#ff-attachments').element, [
      makeFile('screenshot.png'),
    ])
    await wrapper.get('form').trigger('submit')

    const feedbackCall = fetchMock.mock.calls.find(([url]) => url === '/api/suggestions')
    expect(feedbackCall?.[1]).toMatchObject({
      body: {
        attachments: [
          {
            filename: 'screenshot.png',
            url: 'https://example.public.blob.vercel-storage.com/feedback/fb/screenshot.png',
            contentType: 'image/png',
            size: 1024,
          },
        ],
      },
    })
  })
})
