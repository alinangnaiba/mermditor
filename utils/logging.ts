const formatLogMeta = (meta?: Record<string, unknown>): Record<string, unknown> | undefined => {
  if (!meta || Object.keys(meta).length === 0) {
    return undefined
  }

  return meta
}

export const logError = (
  context: string,
  error: unknown,
  meta?: Record<string, unknown>
): void => {
  const payload = {
    context,
    error,
    ...(formatLogMeta(meta) ? { meta: formatLogMeta(meta) } : {}),
  }

  console.error('[mermditor:error]', payload)
}
