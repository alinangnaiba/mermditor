<template>
  <footer class="app-footer">
    <div class="footer-logo">
      <img src="../assets/images/logo.png" alt="merMDitor logo" />
      merMDitor
    </div>
    <div class="footer-links">
      <NuxtLink to="/editor">Editor</NuxtLink>
      <NuxtLink to="/guide">Guide</NuxtLink>
      <NuxtLink to="/feedback">Feedback</NuxtLink>
    </div>
  </footer>
</template>

<style scoped>
.app-footer {
  border-top: 1px solid var(--border);
  padding: 1.75rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.875rem;
  color: var(--muted);
  margin-top: auto;
}

.footer-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--muted);
}

.footer-logo img { height: 22px; width: auto; opacity: 0.5; }

.footer-links {
  display: flex;
  gap: 1.75rem;
}

.footer-links a {
  color: var(--muted);
  text-decoration: none;
  transition: color 0.15s;
}

.footer-links a:hover { color: var(--dim); }
</style>
