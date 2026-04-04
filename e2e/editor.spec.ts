import { expect, test } from '@playwright/test'

test.describe('merMDitor smoke coverage', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.clear()
      sessionStorage.clear()
    })
  })

  test('marketing routes render key content', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { name: /write markdown/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /open editor/i }).first()).toBeVisible()

    await page.goto('/guide')
    await expect(page.getByRole('heading', { name: /markdown reference/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /flowcharts/i })).toBeVisible()

    await page.goto('/feedback')
    await expect(page.getByRole('heading', { name: /help improve mermditor/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /send feedback/i })).toBeVisible()
  })

  test('editor updates preview and toggles theme', async ({ page }) => {
    await page.goto('/editor')
    await expect(page.locator('.workspace-pane-title')).toBeVisible()

    await page.locator('.cm-content').click()
    await page.keyboard.press(process.platform === 'darwin' ? 'Meta+A' : 'Control+A')
    await page.keyboard.type('# Smoke Heading\n\nPreview body text')

    await expect(page.locator('.editor-preview-inner')).toContainText('Smoke Heading')
    await expect(page.locator('.editor-preview-inner')).toContainText('Preview body')

    const themeToggle = page.getByRole('button', { name: /switch to light mode|switch to dark mode/i })
    await themeToggle.click()
    await expect(page.locator('html')).toHaveAttribute('data-editor-theme', /light|dark/)
  })

  test('workspace actions and emoji insertion work', async ({ page }) => {
    await page.goto('/editor')

    await page.getByTitle('New Folder').click()
    await page.locator('.workspace-inline-input').fill('Project Notes')
    await page.locator('.workspace-inline-input').press('Enter')
    await expect(page.getByRole('button', { name: /project notes/i })).toBeVisible()

    await page.getByTitle('New File').click()
    await page.locator('.workspace-inline-input').fill('todo')
    await page.locator('.workspace-inline-input').press('Enter')
    await expect(page.locator('.workspace-tree-row', { hasText: 'todo.md' }).first()).toBeVisible()

    await page.getByTitle('Insert Emoji').click()
    await page.getByPlaceholder('Search emojis...').fill('rocket')
    await page.getByRole('button', { name: 'rocket' }).first().click()
    await expect(page.locator('.cm-content')).toContainText(':rocket:')
  })

  test('print preview renders stored content', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem(
        'mermditor-print-content',
        '<h1>Printable Title</h1><p>PDF body</p><pre><code>const x = 1</code></pre>'
      )
    })

    await page.goto('/print-preview')
    await expect(page.getByRole('heading', { name: /print preview/i })).toBeVisible()
    await expect(page.locator('#print-content')).toContainText('Printable Title')
    await expect(page.locator('#print-content')).toContainText('PDF body')
  })
})
