// Client-side helpers that read from this app's own /api routes (never from providers directly),
// so no sports API key is ever needed in the browser.

export type SportName = 'Football' | 'Basketball' | 'Cricket'
export type LiveLine = { sport: SportName; text: string }
export type ResultRow = { sport: SportName; home: string; away: string; score: string; when: string }
export type LiveData = { live: Partial<Record<SportName, string>>; results: Partial<Record<SportName, ResultRow>> }

type Json = Record<string, any>

async function getJson(url: string): Promise<Json | null> {
  try {
    const res = await fetch(url)
    if (!res.ok) return null
    const body = await res.json()
    return body?.success ? body : null
  } catch {
    return null
  }
}

const short = (team: Json | undefined) => team?.shortName || team?.name || team?.full_name || '—'

function football(body: Json | null, data: LiveData) {
  const matches: Json[] = body?.data?.matches ?? []
  const live = matches.find((m) => ['IN_PLAY', 'PAUSED', 'LIVE'].includes(m.status)) ?? matches[0]
  if (live) {
    const s = live.score?.fullTime ?? {}
    data.live.Football = `${short(live.homeTeam)}　 ${s.home ?? 0} - ${s.away ?? 0}　 ${short(live.awayTeam)}`
  }
  const done = matches.find((m) => m.status === 'FINISHED')
  if (done) {
    const s = done.score?.fullTime ?? {}
    data.results.Football = { sport: 'Football', home: short(done.homeTeam), away: short(done.awayTeam), score: `${s.home} - ${s.away}`, when: 'Today' }
  }
}

function basketball(body: Json | null, data: LiveData) {
  const games: Json[] = Array.isArray(body?.data) ? body.data : []
  const valid = games.filter((g) => g.home_team && g.visitor_team)
  const live = valid.find((g) => g.status && g.status !== 'Final' && g.period > 0) ?? valid[0]
  if (live) {
    data.live.Basketball = `${live.home_team.name}　 ${live.home_team_score} - ${live.visitor_team_score}　 ${live.visitor_team.name}`
  }
  const done = valid.find((g) => g.status === 'Final')
  if (done) {
    data.results.Basketball = { sport: 'Basketball', home: done.home_team.name, away: done.visitor_team.name, score: `${done.home_team_score} - ${done.visitor_team_score}`, when: 'Final' }
  }
}

function cricketScore(m: Json) {
  const last = Array.isArray(m.score) ? m.score[m.score.length - 1] : null
  return last ? `${last.r}/${last.w}` : ''
}

function cricket(body: Json | null, data: LiveData) {
  const matches: Json[] = Array.isArray(body?.data) ? body.data : []
  const teams = (m: Json) => (Array.isArray(m.teams) ? m.teams : [])
  const live = matches.find((m) => m.matchStarted && !m.matchEnded && teams(m).length === 2)
  if (live) {
    const [a, b] = teams(live)
    data.live.Cricket = `${a}　 ${cricketScore(live)}　 vs　 ${b}`
  }
  const done = matches.find((m) => m.matchEnded && teams(m).length === 2)
  if (done) {
    const [a, b] = teams(done)
    data.results.Cricket = { sport: 'Cricket', home: a, away: b, score: cricketScore(done) || '—', when: 'Ended' }
  }
}

export async function loadLiveData(): Promise<LiveData> {
  const today = new Date().toISOString().slice(0, 10)
  const [f, b, c] = await Promise.all([
    getJson('/api/football/matches'),
    getJson(`/api/basketball/games?dates[]=${today}`),
    getJson('/api/cricket/currentMatches'),
  ])
  const data: LiveData = { live: {}, results: {} }
  football(f, data)
  basketball(b, data)
  cricket(c, data)
  return data
}
