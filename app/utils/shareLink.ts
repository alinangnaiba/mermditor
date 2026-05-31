import LZString from 'lz-string'

export const SHARE_PARAM = 'd'
export const SHARE_SIZE_WARN_BYTES = 200_000

export const compressMarkdown = (markdown: string): string =>
  LZString.compressToEncodedURIComponent(markdown)

export const decompressMarkdown = (encoded: string): string | null =>
  LZString.decompressFromEncodedURIComponent(encoded) || null

export const buildShareUrl = (markdown: string, origin: string): string => {
  const compressed = compressMarkdown(markdown)
  return `${origin}/share?${SHARE_PARAM}=${compressed}`
}

export const estimateShareUrlBytes = (markdown: string): number =>
  compressMarkdown(markdown).length
