import { useQuery } from '@tanstack/react-query'

export interface VersionInfo {
  version: string
  commit: string
}

async function fetchVersion(): Promise<VersionInfo> {
  const res = await fetch('/api/version')
  if (!res.ok) throw new Error(`version request failed: ${res.status}`)
  return res.json()
}

/** The API's running build, from GET /api/version. */
export function useVersion() {
  return useQuery({
    queryKey: ['version'],
    queryFn: fetchVersion,
    staleTime: Infinity,
  })
}
