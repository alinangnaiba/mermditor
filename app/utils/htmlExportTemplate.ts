import { PRISM_CSS } from './htmlExportPrismCss'

const PROSE_CSS = `
*,*::before,*::after{box-sizing:border-box}
body{margin:0;padding:40px 24px 80px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;font-size:16px;line-height:1.75;color:#1e2433;background:#fff}
.content{max-width:780px;margin:0 auto}
h1,h2,h3,h4,h5,h6{font-weight:700;line-height:1.3;margin:1.6em 0 0.4em;color:#0f1117}
h1{font-size:2em;margin-top:0}h2{font-size:1.5em}h3{font-size:1.25em}h4{font-size:1.1em}
h1+h2,h2+h3,h3+h4{margin-top:0.6em}
p{margin:0.75em 0}
a{color:#2563eb;text-decoration:underline}a:hover{color:#1d4ed8}
strong,b{font-weight:700}em,i{font-style:italic}
hr{border:none;border-top:1px solid #e5e7eb;margin:2em 0}
img{max-width:100%;height:auto}
blockquote{margin:1em 0;padding:.5em 1em;border-left:3px solid #d1d5db;color:#4b5563}
blockquote p{margin:0}
ul,ol{padding-left:1.6em;margin:.75em 0}li{margin:.3em 0}
ul ul,ol ol,ul ol,ol ul{margin:.25em 0}
table{border-collapse:collapse;width:100%;margin:1em 0;font-size:.95em}
th,td{border:1px solid #e5e7eb;padding:8px 14px;text-align:left}
th{background:#f9fafb;font-weight:600;color:#111}
tr:nth-child(even) td{background:#fafafa}
code:not(pre code){background:#f3f4f6;border:1px solid #e5e7eb;padding:2px 6px;border-radius:4px;font-size:.875em;font-family:'Fira Code',Consolas,'Cascadia Code',monospace;color:#c7254e}
del{text-decoration:line-through;color:#6b7280}
mark{background:#fef08a;color:inherit;padding:1px 3px;border-radius:2px}
sup{font-size:.75em;vertical-align:super}sub{font-size:.75em;vertical-align:sub}
.footnotes{margin-top:2em;padding-top:1em;border-top:1px solid #e5e7eb;font-size:.875em;color:#6b7280}
.footnotes ol{padding-left:1.2em}
.md-task-list-item{list-style:none;margin-left:-1.4em}
.md-task-checkbox{margin-right:.5em;accent-color:#2563eb}
.code-block-container{background:#f8f9fa;border:1px solid #e5e7eb;border-radius:6px;margin:1.25em 0;overflow:hidden}
.code-block-header{display:flex;align-items:center;padding:5px 12px;background:#f1f3f5;border-bottom:1px solid #e5e7eb;font-size:.78em;color:#6b7280;font-family:monospace}
.code-block-language{font-weight:600}
.code-block-actions{display:none!important}
.code-block-body{overflow-x:auto}
.code-block-body pre{margin:0;padding:.9em 1em;font-size:.875em;line-height:1.6;background:transparent}
.code-block-body pre code{background:transparent;border:none;padding:0;color:inherit;font-size:inherit}
.mermaid-container{margin:1.5em 0;text-align:center}
.mermaid-controls{display:none!important}
.mermaid-container svg{max-width:100%;height:auto}
.katex-display{overflow-x:auto;overflow-y:hidden;padding:.5em 0}
`.trim()

export const buildHtmlExport = (contentHtml: string, title: string): string => {
  const safeTitle = title.replace(/</g, '&lt;').replace(/>/g, '&gt;')

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${safeTitle}</title>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.22/dist/katex.min.css" crossorigin="anonymous">
<style>${PROSE_CSS}</style>
<style>${PRISM_CSS}</style>
</head>
<body>
<div class="content">
${contentHtml}
</div>
</body>
</html>`
}
