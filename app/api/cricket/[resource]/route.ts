import { NextRequest, NextResponse } from 'next/server'

// CricketData (cricapi.com) — the key stays server-side and is read from CRICKET_API_KEY.
const CRICKET_BASE_URL = 'https://api.cricapi.com/v1'
const ALLOWED = new Set(['currentMatches', 'matches', 'series', 'match_info', 'series_info'])

export async function GET(request: NextRequest, { params }: { params: Promise<{ resource: string }> }) {
  const { resource } = await params
  if (!ALLOWED.has(resource)) {
    return NextResponse.json({ success: false, message: 'Unknown cricket resource' }, { status: 404 })
  }
  const apiKey = process.env.CRICKET_API_KEY
  if (!apiKey) {
    return NextResponse.json({ success: false, message: 'Cricket API key is not configured' }, { status: 503 })
  }

  const upstreamUrl = new URL(`${CRICKET_BASE_URL}/${resource}`)
  request.nextUrl.searchParams.forEach((value, key) => {
    if (key !== 'apikey') upstreamUrl.searchParams.set(key, value)
  })
  if (!upstreamUrl.searchParams.has('offset')) upstreamUrl.searchParams.set('offset', '0')
  upstreamUrl.searchParams.set('apikey', apiKey)

  try {
    const response = await fetch(upstreamUrl, { next: { revalidate: 60 } })
    const data = await response.json().catch(() => ({}))
    // Never echo the API key back to the browser.
    delete data.apikey
    const ok = response.ok && data.status !== 'failure'
    return NextResponse.json(
      ok ? { success: true, data: data.data, info: data.info } : { success: false, message: data.reason || 'Failed to fetch cricket matches' },
      { status: ok ? 200 : response.ok ? 502 : response.status },
    )
  } catch {
    return NextResponse.json({ success: false, message: 'Unable to fetch cricket data' }, { status: 502 })
  }
}
