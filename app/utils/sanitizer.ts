import DOMPurify from 'dompurify'

export const sanitizeHtml = (html: string): string => {
  // DOMPurify requires a DOM, so skip sanitization on server-side
  // The content will be sanitized on the client when it hydrates
  if (typeof window === 'undefined') {
    return html
  }

  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'p', 'br', 'strong', 'em', 'u', 's',
      'ul', 'ol', 'li', 'blockquote', 'pre', 'code',
      'a', 'img', 'table', 'thead', 'tbody', 'tr', 'th', 'td',
      'div', 'span', 'svg', 'path', 'g', 'rect', 'circle',
      'line', 'polyline', 'polygon', 'text', 'tspan',
      'defs', 'marker', 'use', 'symbol', 'clipPath',
      'linearGradient', 'radialGradient', 'stop', 'pattern',
      'foreignObject', 'switch', 'desc', 'title', 'metadata',
      'sub', 'sup', 'mark', 'del', 'ins', 'small',
      'dl', 'dt', 'dd', 'hr', 'input', 'label',
      'button', 'details', 'summary', 'figure', 'figcaption',
    ],
    ALLOWED_ATTR: [
      'href', 'src', 'alt', 'title', 'class', 'id', 'name',
      'width', 'height', 'style', 'viewBox', 'd', 'fill',
      'stroke', 'stroke-width', 'stroke-linecap', 'stroke-linejoin',
      'stroke-dasharray', 'stroke-dashoffset', 'stroke-opacity',
      'fill-opacity', 'opacity', 'transform', 'transform-origin',
      'cx', 'cy', 'r', 'rx', 'ry', 'x', 'y', 'x1', 'y1', 'x2', 'y2',
      'points', 'dx', 'dy', 'text-anchor', 'dominant-baseline',
      'font-size', 'font-family', 'font-weight', 'font-style',
      'marker-start', 'marker-mid', 'marker-end', 'markerWidth', 'markerHeight',
      'refX', 'refY', 'orient', 'preserveAspectRatio', 'xmlns',
      'xlink:href', 'clip-path', 'mask', 'filter',
      'data-processed', 'data-content', 'type', 'checked', 'disabled',
      'target', 'rel', 'colspan', 'rowspan', 'open', 'aria-label', 'role',
    ],
    ALLOW_DATA_ATTR: true,
    ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|cid|xmpp|data):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
  })
}

export const sanitizeSvg = (svg: string): string => {
  // DOMPurify requires a DOM, so skip sanitization on server-side
  if (typeof window === 'undefined') {
    return svg
  }

  return DOMPurify.sanitize(svg, {
    USE_PROFILES: { html: true, svg: true, svgFilters: true },
    ADD_TAGS: ['foreignObject'],
    ADD_ATTR: ['target'],
    HTML_INTEGRATION_POINTS: { foreignobject: true },
  })
}
