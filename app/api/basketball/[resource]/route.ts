import { NextRequest, NextResponse } from 'next/server'

// BALLDONTLIE API — the key stays server-side and is read from BASKETBALL_API_KEY.
const BASKETBALL_BASE_URL = 'https://api.balldontlie.io/v1'
const ALLOWED = new Set(['players', 'games', 'teams'])

const warriors = { id: 10, conference: 'West', division: 'Pacific', city: 'Golden State', name: 'Warriors', full_name: 'Golden State Warriors', abbreviation: 'GSW' }
const lakers = { id: 14, conference: 'West', division: 'Pacific', city: 'Los Angeles', name: 'Lakers', full_name: 'Los Angeles Lakers', abbreviation: 'LAL' }
const celtics = { id: 2, conference: 'East', division: 'Atlantic', city: 'Boston', name: 'Celtics', full_name: 'Boston Celtics', abbreviation: 'BOS' }

// Sample data until BASKETBALL_API_KEY is configured.
const SAMPLE: Record<string, unknown[]> = {
  players: [{ id: 115, first_name: 'Stephen', last_name: 'Curry', position: 'G', jersey_number: '30', team: warriors }],
  teams: [warriors, lakers, celtics],
  games: [{ id: 1, status: 'Final', home_team: lakers, visitor_team: celtics, home_team_score: 98, visitor_team_score: 95 }],
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ resource: string }> }) {
  const { resource } = await params
  if (!ALLOWED.has(resource)) {
    return NextResponse.json({ success: false, message: 'Unknown basketball resource' }, { status: 404 })
  }
  const apiKey = process.env.BASKETBALL_API_KEY
  if (!apiKey) {
    return NextResponse.json({
      success: true,
      mock: true,
      message: 'Sample data — set BASKETBALL_API_KEY to load live BALLDONTLIE results',
      data: SAMPLE[resource],
      meta: { per_page: SAMPLE[resource].length },
    })
  }

  const upstreamUrl = new URL(`${BASKETBALL_BASE_URL}/${resource}`)
  request.nextUrl.searchParams.forEach((value, key) => upstreamUrl.searchParams.append(key, value))

  try {
    const response = await fetch(upstreamUrl, {
      headers: { Authorization: apiKey },
      next: { revalidate: 60 },
    })
    const data = await response.json().catch(() => ({}))
    return NextResponse.json(
      response.ok
        ? { success: true, ...data }
        : { success: false, message: data.message || data.error || 'Failed to fetch basketball data' },
      { status: response.status },
    )
  } catch {
    return NextResponse.json({ success: false, message: 'Unable to fetch basketball data' }, { status: 502 })
  }
}
