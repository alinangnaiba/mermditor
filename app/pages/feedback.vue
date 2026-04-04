<template>
  <div class="fb-page">
    <!-- Nav -->
    <nav class="fb-nav">
      <NuxtLink to="/" class="fb-logo">
        <img src="../assets/images/logo.png" alt="merMDitor logo" />
        merMDitor
      </NuxtLink>
      <ul class="fb-nav-links">
        <li><NuxtLink to="/">Home</NuxtLink></li>
        <li><NuxtLink to="/guide">Guide</NuxtLink></li>
        <li><NuxtLink to="/feedback" class="router-link-active">Feedback</NuxtLink></li>
        <li><NuxtLink to="/editor" class="fb-nav-cta">Open Editor</NuxtLink></li>
      </ul>
    </nav>

    <!-- Main -->
    <main class="fb-main">
      <div class="fb-grid">
        <!-- Left column -->
        <div class="fb-left">
          <h1>Help improve merMDitor</h1>
          <p>Found a bug, have a feature request, or want to share how you're using it? All feedback shapes what gets built next.</p>

          <ul class="fb-guidelines">
            <li>
              <div class="g-title">Reporting a bug</div>
              <div class="g-desc">Include what you were doing, what you expected, and what happened. Your browser and OS are useful too.</div>
            </li>
            <li>
              <div class="g-title">Feature requests</div>
              <div class="g-desc">Describe the problem you're trying to solve. We care more about your workflow than any specific solution.</div>
            </li>
            <li>
              <div class="g-title">Anything else</div>
              <div class="g-desc">General praise, criticism, or thoughts about the editor — all of it is welcome.</div>
            </li>
          </ul>
        </div>

        <!-- Right column: form card -->
        <div class="fb-form-card">
          <div class="fb-form-header">
            <h2>Send Feedback</h2>
            <p>No account needed · Anonymous by default</p>
          </div>
          <div class="fb-form-body">
            <FeedbackForm />
          </div>
        </div>
      </div>
    </main>

    <AppFooter />
  </div>
</template>

<script setup lang="ts">
  useSeoMeta({
    title: 'Feedback & Support - merMDitor | Report Bugs & Suggest Features',
    description:
      'Share your feedback, report bugs, or suggest improvements for merMDitor. Help us make the best Markdown and Mermaid diagram editor.',
    ogTitle: 'Feedback & Support - merMDitor',
    ogDescription: 'Share your feedback, report bugs, or suggest improvements for merMDitor.',
    ogUrl: 'https://www.mermditor.dev/feedback',
    twitterTitle: 'Feedback & Support - merMDitor',
    twitterDescription: 'Share your feedback, report bugs, or suggest improvements for merMDitor.',
  })

  useHead({
    link: [{ rel: 'canonical', href: 'https://www.mermditor.dev/feedback' }],
  })
</script>

<style scoped>
.fb-page {
  min-height: 100vh;
  background: var(--bg);
  color: var(--text);
  display: flex;
  flex-direction: column;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

.fb-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem;
  height: 54px;
  border-bottom: 1px solid var(--border);
  position: sticky;
  top: 0;
  background: var(--bg);
  z-index: 10;
  flex-shrink: 0;
}

.fb-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 700;
  font-size: 1rem;
  color: var(--text);
  text-decoration: none;
}

.fb-logo img { height: 28px; width: auto; display: block; }

.fb-nav-links {
  display: flex;
  align-items: center;
  gap: 6px;
  list-style: none;
  padding: 0;
  margin: 0;
}

.fb-nav-links a {
  padding: 6px 12px;
  border-radius: 5px;
  font-size: 0.9rem;
  color: var(--dim);
  text-decoration: none;
  transition: color 0.15s, background 0.15s;
}

.fb-nav-links a:hover,
.fb-nav-links a.router-link-active { color: var(--text); background: var(--surface); }

.fb-nav-cta {
  background: var(--accent) !important;
  color: #fff !important;
  font-weight: 600;
}

.fb-nav-cta:hover { background: #5f9fff !important; }

.fb-main {
  flex: 1;
  padding: 4.5rem 2rem 5rem;
}

.fb-grid {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 4rem;
  max-width: 860px;
  margin: 0 auto;
  align-items: start;
}

.fb-left h1 {
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  margin-bottom: 10px;
}

.fb-left > p {
  color: var(--dim);
  font-size: 1rem;
  line-height: 1.7;
  margin-bottom: 2.25rem;
}

.fb-guidelines {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 1px;
  border: 1px solid var(--border);
  border-radius: 8px;
  overflow: hidden;
}

.fb-guidelines li {
  padding: 14px 18px;
  background: var(--surface);
  font-size: 0.9375rem;
}

.fb-guidelines li + li { border-top: 1px solid var(--border); }

.g-title { font-weight: 600; margin-bottom: 3px; }
.g-desc  { color: var(--dim); font-size: 0.875rem; line-height: 1.6; }

.fb-form-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 8px;
  overflow: hidden;
  position: sticky;
  top: 72px;
}

.fb-form-header {
  padding: 18px 20px 14px;
  border-bottom: 1px solid var(--border);
}

.fb-form-header h2 { font-size: 1rem; font-weight: 700; margin-bottom: 3px; }
.fb-form-header p  { font-size: 0.8125rem; color: var(--muted); }

.fb-form-body { padding: 18px 20px 20px; }

@media (max-width: 768px) {
  .fb-grid {
    grid-template-columns: 1fr;
    gap: 2.5rem;
  }

  .fb-form-card { position: static; }
}

@media (max-width: 480px) {
  .fb-nav, .fb-main { padding-left: 1.25rem; padding-right: 1.25rem; }
}
</style>
