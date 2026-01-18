import { validateFeedback, sanitizeInput, validateGitHubToken } from '../utils/validator'
import rateLimit from '../middleware/rateLimit'

export default defineEventHandler(async (event) => {
  await rateLimit(event)
  try {
    const body = await readBody(event)

    // Validate input
    const { valid, errors } = validateFeedback(body)
    if (!valid) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Validation failed: ' + errors.join(', '),
      })
    }

    // Sanitize inputs
    const sanitizedTitle = sanitizeInput(body.title)
    const sanitizedDescription = sanitizeInput(body.description)
    const sanitizedType = sanitizeInput(body.type)
    const sanitizedEmail = body.email ? sanitizeInput(body.email) : undefined

    const GITHUB_OWNER = process.env.GITHUB_OWNER
    const GITHUB_REPO = process.env.GITHUB_REPO
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN
    const GITHUB_BASE_URL = process.env.GITHUB_BASE_URL

    // Validate GitHub configuration
    if (!GITHUB_TOKEN || !validateGitHubToken(GITHUB_TOKEN)) {
      console.error('Invalid GitHub token configuration')
      throw createError({
        statusCode: 500,
        statusMessage: 'Service temporarily unavailable',
      })
    }

    if (!GITHUB_OWNER || !GITHUB_REPO) {
      console.error('Missing GitHub owner or repo configuration')
      throw createError({
        statusCode: 500,
        statusMessage: 'Service temporarily unavailable',
      })
    }

    const issueTitle = `[${sanitizedType.toUpperCase()}] ${sanitizedTitle}`
    const issueBody = formatIssueBody(sanitizedType, sanitizedDescription, sanitizedEmail)
    const issueLabels = [sanitizedType.toLowerCase(), 'user-feedback']

    const githubUrl = `${GITHUB_BASE_URL}/repos/${GITHUB_OWNER}/${GITHUB_REPO}/issues`

    const response = await fetch(githubUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
        'User-Agent': 'merMDitor-App/1.0',
      },
      body: JSON.stringify({
        title: issueTitle,
        body: issueBody,
        labels: issueLabels,
      }),
    })

    // Handle GitHub API response
    if (!response.ok) {
      const errorData = await response.json()
      console.error('GitHub API error:', errorData)
      throw createError({
        statusCode: response.status,
        statusMessage: 'Failed to submit suggestion. Please try again later.',
      })
    }

    const issue = await response.json()

    return {
      success: true,
      issueUrl: issue.html_url,
      issueNumber: issue.number,
      message: 'Suggestion submitted successfully!',
    }
  } catch (error) {
    if (typeof error === 'object' && error !== null && 'statusCode' in error) {
      throw error
    }

    console.error('Internal server error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'An unexpected error occurred. Please try again later.',
    })
  }
})

/**
 * Format the GitHub issue body with user submission details
 */
function formatIssueBody(type: string, description: string, email?: string): string {
  const timestamp = new Date().toISOString()

  return `## ${type.charAt(0).toUpperCase() + type.slice(1)}

**Description:**
${description}

${email ? `**Contact Email:** ${email}\n` : ''}

---

**Submission Details:**
- **Submitted:** ${timestamp}
- **Source:** merMDitor Feedback Form
- **Type:** ${type}

*This issue was automatically created from the merMDitor suggestion form.*`
}
