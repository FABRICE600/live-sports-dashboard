'use client'

import { useState } from 'react'
import {
  Activity, Bell, CalendarDays, ChevronDown, ChevronRight, CircleHelp, Clock3,
  Flame, Grid2X2, LayoutDashboard, Menu, Moon, MoreHorizontal, Search, Settings,
  Shield, Star, Sun, Trophy, Users, X, Zap,
} from 'lucide-react'

const navItems = [
  { label: 'Overview', icon: LayoutDashboard },
  { label: 'Live matches', icon: Activity, badge: '12' },
  { label: 'Fixtures', icon: CalendarDays },
  { label: 'Results', icon: Trophy },
  { label: 'Standings', icon: Grid2X2 },
]
const sports = [
  { name: 'Football', icon: '⚽', count: '8 live', color: 'lime' },
  { name: 'Basketball', icon: '🏀', count: '3 live', color: 'orange' },
  { name: 'Tennis', icon: '🎾', count: '1 live', color: 'blue' },
  { name: 'Cricket', icon: '🏏', count: '2 live', color: 'purple' },
]
const liveMatches = [
  { league: 'Premier League', teams: ['Arsenal', 'Chelsea'], abbr: ['AFC', 'CFC'], score: ['2', '1'], minute: "67'", color: 'lime' },
  { league: 'NBA · Regular Season', teams: ['Lakers', 'Warriors'], abbr: ['LAL', 'GSW'], score: ['84', '79'], minute: 'Q3 · 04:12', color: 'orange' },
  { league: 'ATP · Paris Masters', teams: ['A. Zverev', 'C. Alcaraz'], abbr: ['AZ', 'CA'], score: ['1', '0'], minute: 'Set 2 · 3—2', color: 'blue' },
]
const fixtures = [
  { time: '12:30', teams: ['Liverpool', 'Man City'], competition: 'Premier League', logos: ['LIV', 'MCI'] },
  { time: '15:00', teams: ['Real Madrid', 'Barcelona'], competition: 'La Liga', logos: ['RMA', 'FCB'] },
  { time: '19:30', teams: ['India', 'Australia'], competition: 'T20 World Cup', logos: ['IND', 'AUS'] },
]

function TeamMark({ label, tone = 'dark' }: { label: string; tone?: string }) {
  return <span className={`team-mark ${tone}`}>{label.slice(0, 3).toUpperCase()}</span>
}

export default function Page() {
  const [active, setActive] = useState('Overview')
  const [sport, setSport] = useState('All sports')
  const [dark, setDark] = useState(true)
  const [mobileNav, setMobileNav] = useState(false)
  const [favorites, setFavorites] = useState<string[]>(['Arsenal'])
  const [notice, setNotice] = useState('')
  const notify = (message: string) => {
    setNotice(message)
    window.setTimeout(() => setNotice(''), 2600)
  }
  const handleButtonFallback = (button: HTMLButtonElement) => {
    const label = button.getAttribute('aria-label') || button.textContent?.trim() || 'Action'
    notify(`${label} opened`)
  }

  return (
    <main className={dark ? 'app-shell dark' : 'app-shell'} onClick={(event) => {
      const target = event.target as HTMLElement
      const button = target.closest('button')
      if (button && !button.dataset.handled) handleButtonFallback(button)
    }}>
      {notice && <div className="action-toast" role="status">{notice}</div>}
      <aside className={`sidebar ${mobileNav ? 'open' : ''}`}>
        <div className="brand"><span className="brand-mark"><Zap size={17} fill="currentColor" /></span><span>pulse<span className="brand-dot">.</span></span></div>
        <button className="close-nav" onClick={() => setMobileNav(false)} aria-label="Close menu"><X size={20} /></button>
        <p className="eyebrow">Workspace</p>
        <nav className="main-nav">
          {navItems.map((item) => { const Icon = item.icon; return <button key={item.label} className={active === item.label ? 'nav-link active' : 'nav-link'} onClick={() => { setActive(item.label); setMobileNav(false) }}><Icon size={18} /><span>{item.label}</span>{item.badge && <b>{item.badge}</b>}</button> })}
        </nav>
        <p className="eyebrow sport-label">Sports</p>
        <div className="sports-nav">{sports.map((item) => <button key={item.name} className={sport === item.name ? 'sport-link selected' : 'sport-link'} onClick={() => setSport(item.name)}><span className={`sport-icon ${item.color}`}>{item.icon}</span><span>{item.name}</span><small>{item.count}</small></button>)}</div>
        <div className="sidebar-bottom"><button className="nav-link"><Users size={18} /><span>Teams & players</span></button><button className="nav-link"><Settings size={18} /><span>Settings</span></button><div className="profile"><span className="avatar">JD</span><span><strong>Jordan Davis</strong><small>Free account</small></span><MoreHorizontal size={17} /></div></div>
      </aside>
      {mobileNav && <button className="scrim" onClick={() => setMobileNav(false)} aria-label="Close navigation" />}
      <section className="main-content">
        <header className="topbar"><button className="mobile-menu" onClick={() => setMobileNav(true)} aria-label="Open menu"><Menu size={22} /></button><div className="breadcrumb"><span>Workspace</span><ChevronRight size={14} /><strong>{active}</strong></div><div className="top-actions"><button className="icon-button" aria-label="Search"><Search size={19} /></button><button className="icon-button" aria-label="Notifications"><Bell size={19} /><i /></button><button className="icon-button theme-button" onClick={() => setDark(!dark)} aria-label="Toggle theme">{dark ? <Sun size={18} /> : <Moon size={18} />}</button><span className="top-avatar">JD</span></div></header>
        <div className="page-wrap">
          <div className="welcome-row"><div><p className="date-line"><span className="live-dot" /> Saturday, November 8, 2026</p><h1>Good morning, Jordan <span>✦</span></h1><p className="subhead">Here&apos;s what&apos;s happening in sports today.</p></div><button className="date-button"><CalendarDays size={17} /> Today <ChevronDown size={15} /></button></div>
          <div className="sport-tabs"><button className={sport === 'All sports' ? 'active' : ''} onClick={() => setSport('All sports')}>All sports</button>{sports.map(s => <button key={s.name} className={sport === s.name ? 'active' : ''} onClick={() => setSport(s.name)}>{s.icon} {s.name}</button>)}<button className="more-sports"><MoreHorizontal size={18} /></button></div>
          <div className="section-heading"><div><h2>Live now <span className="live-pill">12 live</span></h2><p>Matches happening right now</p></div><button className="text-button">View all <ChevronRight size={16} /></button></div>
          <div className="live-grid">{liveMatches.map((match) => <article className="match-card" key={match.league}><div className="card-top"><span className="competition"><span className={`competition-dot ${match.color}`} />{match.league}</span><button aria-label="More options"><MoreHorizontal size={18} /></button></div><div className="match-status"><span><i className="live-indicator" /> LIVE</span><strong>{match.minute}</strong></div><div className="score-row"><div className="team"><TeamMark label={match.abbr[0]} tone={match.color} /><span>{match.teams[0]}</span></div><strong className="score">{match.score[0]}</strong></div><div className="score-row"><div className="team"><TeamMark label={match.abbr[1]} tone="muted" /><span>{match.teams[1]}</span></div><strong className="score">{match.score[1]}</strong></div><button className="match-detail">Match center <ChevronRight size={15} /></button></article>)}</div>
          <div className="content-grid"><section><div className="section-heading compact"><div><h2>Upcoming fixtures</h2><p>Saturday, November 8</p></div><button className="text-button">Full schedule <ChevronRight size={16} /></button></div><div className="fixture-card">{fixtures.map((fixture, i) => <div className="fixture-row" key={fixture.teams[0]}><div className="fixture-time"><strong>{fixture.time}</strong><small>Today</small></div><div className="fixture-teams"><div><TeamMark label={fixture.logos[0]} tone={i === 0 ? 'red' : 'muted'} />{fixture.teams[0]}</div><div><TeamMark label={fixture.logos[1]} tone={i === 1 ? 'blue' : 'muted'} />{fixture.teams[1]}</div></div><div className="fixture-league">{fixture.competition}</div><button className="star-button" onClick={() => setFavorites([...favorites, fixture.teams[0]])} aria-label={`Favorite ${fixture.teams[0]}`}><Star size={17} fill={favorites.includes(fixture.teams[0]) ? 'currentColor' : 'none'} /></button></div>)}</div></section><aside className="right-column"><div className="section-heading compact"><div><h2>Quick stats</h2><p>Your sports at a glance</p></div><button className="icon-button small"><MoreHorizontal size={18} /></button></div><div className="stats-card"><div className="stat-item"><span className="stat-icon lime"><Activity size={17} /></span><span><small>Live matches</small><strong>12</strong></span><em>+3 today</em></div><div className="stat-item"><span className="stat-icon orange"><Trophy size={17} /></span><span><small>Followed teams</small><strong>08</strong></span><em>+1 this week</em></div><div className="stat-item"><span className="stat-icon blue"><Flame size={17} /></span><span><small>Matches watched</small><strong>24</strong></span><em>+12% this month</em></div></div></aside></div>
          <div className="bottom-grid"><div className="trend-card"><div className="trend-copy"><span className="trend-badge"><Flame size={14} /> Trending</span><h3>Champions League<br />knockout stage</h3><p>See who&apos;s leading the race to the final.</p><button>Explore competition <ChevronRight size={15} /></button></div><div className="trend-orb"><Trophy size={52} /></div></div><div className="favorite-card"><div className="section-heading compact"><div><h2>My favorites</h2><p>{favorites.length} teams followed</p></div><button className="text-button">Manage <ChevronRight size={16} /></button></div><div className="favorite-team"><TeamMark label="ARS" tone="lime" /><div><strong>Arsenal</strong><small>Premier League · 1st</small></div><span className="form-dot win" /><span className="form-dot win" /><span className="form-dot draw" /><span className="form-dot win" /><ChevronRight size={17} /></div></div></div>
        </div>
        <footer><span>Pulse Sports</span><span>Data updates every 60 seconds <span className="footer-dot" /> All systems operational</span><CircleHelp size={15} /></footer>
      </section>
    </main>
  )
}
