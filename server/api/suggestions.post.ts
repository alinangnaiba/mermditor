export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)

    if (!body.title || !body.description || !body.type) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Missing required fields: title, description, and type are required'
      })
    }

    const { title, description, type, email } = body

    const GITHUB_OWNER = process.env.GITHUB_OWNER
    const GITHUB_REPO = process.env.GITHUB_REPO  
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN
    const GITHUB_BASE_URL = process.env.GITHUB_BASE_URL

    // Validate GitHub configuration
    if (!GITHUB_TOKEN) {
      throw createError({
        statusCode: 500,
        statusMessage: 'GitHub integration not configured - missing GITHUB_TOKEN'
      })
    }

    if (!GITHUB_OWNER || !GITHUB_REPO) {
      throw createError({
        statusCode: 500,
        statusMessage: 'GitHub integration not configured - missing GITHUB_OWNER or GITHUB_REPO'
      })
    }

    const issueTitle = `[${type.toUpperCase()}] ${title}`
    const issueBody = formatIssueBody(type, description, email)
    const issueLabels = [type.toLowerCase(), 'user-feedback']

    const githubUrl = `${GITHUB_BASE_URL}/repos/${GITHUB_OWNER}/${GITHUB_REPO}/issues`
    
    const response = await fetch(githubUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
        'User-Agent': 'merMDitor-App/1.0'
      },
      body: JSON.stringify({
        title: issueTitle,
        body: issueBody,
        labels: issueLabels
      })
    })

    // Handle GitHub API response
    if (!response.ok) {
      const errorData = await response.json()
      throw createError({
        statusCode: response.status,
        statusMessage: `GitHub API error: ${errorData.message || response.statusText}`
      })
    }

    const issue = await response.json()

    return {
      success: true,
      issueUrl: issue.html_url,
      issueNumber: issue.number,
      message: 'Suggestion submitted successfully!'
    }

  } catch (error) {
    if (typeof error === 'object' && error !== null && 'statusCode' in error) {
      throw error
    }
    
    let errorMessage = 'Unknown error';
    if (typeof error === 'object' && error !== null && 'message' in error) {
      errorMessage = String((error as { message?: unknown }).message);
    }
    throw createError({
      statusCode: 500,
      statusMessage: `Internal server error: ${errorMessage}`
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
