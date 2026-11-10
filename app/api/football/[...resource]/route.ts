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

  if (!process.env.FOOTBALL_API_KEY) {
    // Sample data until FOOTBALL_API_KEY is configured.
    return NextResponse.json({
      success: true,
      mock: true,
      message: 'Sample data — set FOOTBALL_API_KEY to load live football-data.org results',
      data: {
        matches: [
          { id: 1, status: 'IN_PLAY', competition: { name: 'UEFA Champions League' }, homeTeam: { name: 'Real Madrid' }, awayTeam: { name: 'Barcelona' }, score: { fullTime: { home: 2, away: 1 } } },
          { id: 2, status: 'FINISHED', competition: { name: 'Premier League' }, homeTeam: { name: 'Man City' }, awayTeam: { name: 'Liverpool' }, score: { fullTime: { home: 3, away: 1 } } },
        ],
      },
    })
  }

  const query = new URLSearchParams(request.nextUrl.searchParams)
  const upstreamUrl = new URL(`https://api.football-data.org/v4${path}`)
  query.forEach((value, key) => upstreamUrl.searchParams.set(key, value))

  try {
    const response = await fetch(upstreamUrl, {
      headers: { 'X-Auth-Token': process.env.FOOTBALL_API_KEY },
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
