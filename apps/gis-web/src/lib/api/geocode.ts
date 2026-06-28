/**
 * Address search via the Queensland Composite Locator (authoritative G-NAF-based
 * geocoder, covers regional QLD; no key, CORS reflects origin). Two steps:
 * `suggest` for as-you-type autocomplete, then `locate` for the picked address.
 */

const LOCATOR =
  'https://spatial-gis.information.qld.gov.au/arcgis/rest/services/Location/QldCompositeLocator/GeocodeServer'

export interface AddressSuggestion {
  text: string
  magicKey: string
}

export interface GeocodeResult {
  label: string
  lon: number
  lat: number
}

export function suggestUrl(text: string): string {
  const params = new URLSearchParams({ text, maxSuggestions: '6', f: 'json' })
  return `${LOCATOR}/suggest?${params.toString()}`
}

interface SuggestResponse {
  suggestions?: { text: string; magicKey: string }[]
}

export async function suggestAddresses(
  text: string,
): Promise<AddressSuggestion[]> {
  const res = await fetch(suggestUrl(text))
  if (!res.ok) throw new Error(`suggest failed: ${res.status}`)
  const data: SuggestResponse = await res.json()
  return (data.suggestions ?? []).map((s) => ({
    text: s.text,
    magicKey: s.magicKey,
  }))
}

interface CandidateResponse {
  candidates?: { address: string; location: { x: number; y: number } }[]
}

export async function locateAddress(
  magicKey: string,
): Promise<GeocodeResult | null> {
  const params = new URLSearchParams({ magicKey, outSR: '4326', f: 'json' })
  const res = await fetch(
    `${LOCATOR}/findAddressCandidates?${params.toString()}`,
  )
  if (!res.ok) throw new Error(`geocode failed: ${res.status}`)
  const data: CandidateResponse = await res.json()
  const candidate = data.candidates?.[0]
  return candidate
    ? {
        label: candidate.address,
        lon: candidate.location.x,
        lat: candidate.location.y,
      }
    : null
}
