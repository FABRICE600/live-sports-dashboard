import { NextRequest, NextResponse } from 'next/server'

const resourceMap = {
  competitions: '/competitions',
  live: '/matches',
  matches: '/matches',
  fixtures: '/matches',
  results: '/matches',
  standings: (code: string) => `/competitions/${code}/standings`,
  teams: (code: string) => `/competitions/${code}/teams`,
} as const

export async function GET(request: NextRequest, { params }: { params: Promise<{ resource: string }> }) {
  const { resource } = await params
  const endpoint = resourceMap[resource as keyof typeof resourceMap]
  if (!endpoint) return NextResponse.json({ success: false, message: 'Unknown football resource' }, { status: 404 })

  const search = request.nextUrl.searchParams
  const code = search.get('competition') || 'PL'
  const path = typeof endpoint === 'function' ? endpoint(code) : endpoint
  const query = new URLSearchParams()
  if (resource === 'live') query.set('status', 'LIVE')
  if (resource === 'results') query.set('status', 'FINISHED')
  if (resource === 'fixtures') {
    const date = search.get('date') || new Date().toISOString().slice(0, 10)
    query.set('dateFrom', date)
    query.set('dateTo', date)
  }

  try {
    const response = await fetch(`https://api.football-data.org/v4${path}?${query}`, {
      headers: { 'X-Auth-Token': process.env.FOOTBALL_API_KEY || '' },
      next: { revalidate: 60 },
    })
    const data = await response.json()
    return NextResponse.json({ success: response.ok, data: response.ok ? data : undefined, message: data.message }, { status: response.status })
  } catch {
    return NextResponse.json({ success: false, message: 'Unable to fetch football data' }, { status: 502 })
  }
}
