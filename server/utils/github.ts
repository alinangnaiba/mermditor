import { validateGitHubToken } from './validator'
import { logError } from '../../utils/logging'

export interface CreateIssueInput {
  title: string
  body: string
  labels: string[]
}

export interface CreatedIssue {
  htmlUrl: string
  number: number
}

/**
 * Build the public-safe GitHub issue body.
 *
 * The user's contact email is NEVER included here. When an email was provided
 * we only note that contact details were captured privately (via the
 * notification email), not the address itself.
 */
export const formatPublicIssueBody = (
  type: string,
  description: string,
  hasEmail: boolean,
  feedbackId: string
): string => {
  const timestamp = new Date().toISOString()

  return `## ${type.charAt(0).toUpperCase() + type.slice(1)}

**Description:**
${description}

${hasEmail ? '**Contact:** Provided privately\n' : ''}
---

**Submission Details:**
- **Submitted:** ${timestamp}
- **Source:** merMDitor Feedback Form
- **Type:** ${type}

*This issue was automatically created from the merMDitor suggestion form.*

<!-- feedbackId: ${feedbackId} -->`
}

/**
 * Create a GitHub issue using the configured credentials.
 *
 * Auth is intentionally isolated here: today it uses a PAT (GITHUB_TOKEN).
 * Swapping to a GitHub App installation token later only requires changing
 * how `authHeader` is produced.
 */
export const createGitHubIssue = async (input: CreateIssueInput): Promise<CreatedIssue> => {
  const GITHUB_OWNER = process.env.GITHUB_OWNER
  const GITHUB_REPO = process.env.GITHUB_REPO
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN
  const GITHUB_BASE_URL = process.env.GITHUB_BASE_URL ?? 'https://api.github.com'

  if (!GITHUB_TOKEN || !validateGitHubToken(GITHUB_TOKEN)) {
    logError('github.invalidTokenConfig', new Error('Invalid GitHub token configuration'))
    throw createError({
      statusCode: 500,
      statusMessage: 'Service temporarily unavailable',
    })
  }

  if (!GITHUB_OWNER || !GITHUB_REPO) {
    logError('github.missingRepoConfig', new Error('Missing GitHub owner or repo configuration'))
    throw createError({
      statusCode: 500,
      statusMessage: 'Service temporarily unavailable',
    })
  }

  const authHeader = `Bearer ${GITHUB_TOKEN}`
  const githubUrl = `${GITHUB_BASE_URL}/repos/${GITHUB_OWNER}/${GITHUB_REPO}/issues`

  const response = await fetch(githubUrl, {
    method: 'POST',
    headers: {
      Authorization: authHeader,
      Accept: 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
      'User-Agent': 'merMDitor-App/1.0',
    },
    body: JSON.stringify({
      title: input.title,
      body: input.body,
      labels: input.labels,
    }),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => undefined)
    logError('github.createIssue', new Error('GitHub API error'), {
      status: response.status,
      errorData,
    })
    throw createError({
      statusCode: response.status,
      statusMessage: 'Failed to create GitHub issue.',
    })
  }

  const issue = await response.json()

  return {
    htmlUrl: issue.html_url,
    number: issue.number,
  }
}
