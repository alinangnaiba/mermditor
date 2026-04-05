export default defineEventHandler(() => {
  // The CSRF middleware handles token generation for GET /api/* requests.
  // This endpoint exists solely to trigger that middleware so the client
  // can obtain a valid csrf-token cookie before submitting the form.
  return { ok: true }
})
