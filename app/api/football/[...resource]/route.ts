import { NextRequest, NextResponse } from 'next/server'

const ALLOWED_ROOTS = new Set(['matches', 'competitions', 'teams', 'persons'])

function buildUpstreamPath(parts: string[]) {
  if (parts.length === 1 && parts[0] === 'matches') return '/matches'
  if (parts.length === 3 && parts[2] === 'matches' && ['competitions', 'teams', 'persons'].includes(parts[0])) {
    return `/${parts[0]}/${encodeURIComponent(parts[1])}/matches`
  }
  if (parts.length === 3 && parts[0] === 'competitions' && ['standings', 'scorers', 'teams'].includes(parts[2])) {
    return `/competitions/${encodeURIComponent(parts[1])}/${parts[2]}`
  }
  if (parts.length === 1 && ALLOWED_ROOTS.has(parts[0])) return `/${parts[0]}`
  return null
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ resource: string[] }> }) {
  const { resource } = await params
  const path = buildUpstreamPath(resource)
  if (!path) return NextResponse.json({ success: false, message: 'Unknown football resource' }, { status: 404 })

  const query = new URLSearchParams(request.nextUrl.searchParams)
  const upstreamUrl = new URL(`https://api.football-data.org/v4${path}`)
  query.forEach((value, key) => upstreamUrl.searchParams.set(key, value))

  try {
    const response = await fetch(upstreamUrl, {
      headers: { 'X-Auth-Token': process.env.FOOTBALL_API_KEY || process.env.FOOTBALL_API_KEY_2 || '' },
      next: { revalidate: 60 },
    })
    const data = await response.json()
    return NextResponse.json(
      { success: response.ok, data: response.ok ? data : undefined, message: data.message },
      { status: response.status },
    )
  } catch {
    return NextResponse.json({ success: false, message: 'Unable to fetch football data' }, { status: 502 })
  }
}
