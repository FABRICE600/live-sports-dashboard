'use client'

import { useState } from 'react'
import { Activity, Bell, CalendarDays, ChevronRight, CircleHelp, Home, Info, Menu, Moon, RefreshCw, Search, Shield, Sun, Trophy, Users, X } from 'lucide-react'

const sports = [
  { name: 'Football', icon: '⚽', color: 'blue', live: '12', today: '24', league: 'UEFA Champions League' },
  { name: 'Basketball', icon: '🏀', color: 'orange', live: '8', today: '15', league: 'NBA Season' },
  { name: 'Tennis', icon: '🎾', color: 'green', live: '6', today: '18', league: 'ATP Tour' },
  { name: 'Cricket', icon: '🏏', color: 'purple', live: '7', today: '20', league: 'ICC Cricket' },
]
const nav = [
  { label: 'Home', icon: Home }, { label: 'Football', icon: () => <span>⚽</span> }, { label: 'Basketball', icon: () => <span>🏀</span> }, { label: 'Tennis', icon: () => <span>🎾</span> }, { label: 'Cricket', icon: () => <span>🏏</span> },
]
const upcoming = [['Real Madrid', 'Barcelona', '3:00 PM', 'Football', '⚽'], ['Lakers', 'Celtics', '4:30 PM', 'Basketball', '🏀'], ['Alcaraz', 'Sinner', '5:00 PM', 'Tennis', '🎾'], ['India', 'Australia', '6:00 PM', 'Cricket', '🏏']]
const results = [['Man City', 'Liverpool', '3 - 1', '2h ago', '⚽'], ['Warriors', 'Nuggets', '112 - 108', '3h ago', '🏀'], ['Djokovic', 'Medvedev', '2 - 0', '4h ago', '🎾'], ['Australia', 'England', '280/7', '5h ago', '🏏']]

export default function Page() {
  const [mobileNav, setMobileNav] = useState(false)
  const [active, setActive] = useState('Home')
  const [query, setQuery] = useState('')
  const [updated, setUpdated] = useState('07:15 AM')
  const [notice, setNotice] = useState('')
  const [language, setLanguage] = useState('en')
  const [accent, setAccent] = useState('blue')
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  const copy = language === 'fr' ? { search: 'Rechercher des équipes, ligues ou matchs...', live: 'En direct', about: 'À propos', watch: 'Regarder en direct', upcoming: 'Matchs à venir', results: 'Résultats récents', view: 'Voir tout', refreshed: 'Données actualisées' } : language === 'es' ? { search: 'Buscar equipos, ligas o partidos...', live: 'En vivo', about: 'Acerca de', watch: 'Ver en vivo', upcoming: 'Próximos partidos', results: 'Resultados recientes', view: 'Ver todo', refreshed: 'Datos actualizados' } : { search: 'Search teams, leagues or matches...', live: 'Live', about: 'About', watch: 'Watch Live', upcoming: 'Upcoming Matches', results: 'Recent Results', view: 'View All', refreshed: 'Sports data refreshed' }
  const refresh = () => { setUpdated(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })); setNotice(copy.refreshed); window.setTimeout(() => setNotice(''), 2200) }
  const filtered = upcoming.filter((item) => item.slice(0, 2).join(' ').toLowerCase().includes(query.toLowerCase()))
  return <main className={`app-shell accent-${accent} theme-${theme}`}>
    {notice && <div className="action-toast" role="status">{notice}</div>}
    <aside className={`sidebar ${mobileNav ? 'open' : ''}`}>
      <div className="brand"><span className="ball">⚽</span><span>Live <b>Mutch</b><small>Live Sports Dashboard</small></span></div>
      <button className="close-nav" onClick={() => setMobileNav(false)} aria-label="Close menu"><X size={20} /></button>
      <nav>{nav.map(({ label, icon: Icon }) => <button key={label} onClick={() => { setActive(label); setMobileNav(false) }} className={`nav-link ${active === label ? 'active' : ''}`}><Icon size={20} /><span>{label}</span></button>)}</nav>
      <div className="nav-divider" />
      <nav>{[{ label: 'Live Matches', icon: Activity }, { label: 'Upcoming', icon: CalendarDays }, { label: 'Results', icon: Trophy }, { label: 'Teams', icon: Users }, { label: 'Leagues', icon: Shield }, { label: 'Search', icon: Search }].map(({ label, icon: Icon }) => <button key={label} className="nav-link"><Icon size={20} /><span>{label}</span></button>)}</nav>
      <div className="sidebar-bottom"><button className="nav-link"><Info size={20} /><span>About</span></button><button className="nav-link"><CircleHelp size={20} /><span>Contact</span></button><div className="promo"><span>🏆</span><strong>Live Mutch</strong><small>Sports. Anytime.<br />Anywhere.</small></div><div className="socials">◉　𝕏　●　◎</div></div>
    </aside>
    {mobileNav && <button className="scrim" onClick={() => setMobileNav(false)} aria-label="Close navigation" />}
    <section className="main-content">
      <header className="topbar"><button className="mobile-menu" onClick={() => setMobileNav(true)} aria-label="Open menu"><Menu size={22} /></button><div className="search"><Search size={20} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={copy.search} aria-label={copy.search} /></div><div className="top-actions"><span className="live-status"><i /> {copy.live}</span><span className="updated">Last update: {updated}</span><button onClick={refresh} className="icon-button" aria-label="Refresh data"><RefreshCw size={20} /></button><label className="language-picker"><span className="sr-only">Language</span><select value={language} onChange={(e) => setLanguage(e.target.value)} aria-label="Language"><option value="en">EN</option><option value="fr">FR</option><option value="es">ES</option></select></label><div className="color-picker" role="group" aria-label="Accent color">{(['blue', 'green', 'purple', 'orange'] as const).map((color) => <button key={color} className={`color-dot ${color} ${accent === color ? 'selected' : ''}`} onClick={() => setAccent(color)} aria-label={`Use ${color} accent`} />)}</div><button className="theme-toggle" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}>{theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}</button><button className="about-button">{copy.about}</button><Bell size={22} /><span className="user-avatar">JD</span></div></header>
      <div className="page-wrap">
        <section className="hero"><div><h1>Live <em>Mutch</em></h1><h2>Your Ultimate Live Sports Dashboard</h2><p>Football <b>•</b> Basketball <b>•</b> Tennis <b>•</b> Cricket</p><button onClick={() => setActive('Live Matches')}>{copy.watch} <ChevronRight size={18} /></button></div></section>
        <section className="live-strip"><div className="live-label">● LIVE NOW</div>{sports.map((sport) => <div className="strip-match" key={sport.name}><strong><span>{sport.icon}</span> {sport.name}</strong><span>{sport.name === 'Football' ? 'Real Madrid　 2 - 1　 Barcelona' : sport.name === 'Basketball' ? 'Lakers　 98 - 95　 Celtics' : sport.name === 'Tennis' ? 'Alcaraz　 6-4  6-3　 Sinner' : 'IND　 245/6　 vs　 AUS'}</span></div>)}</section>
        <div className="sport-grid">{sports.map((sport) => <article className={`sport-card ${sport.color}`} key={sport.name}><div className="sport-card-head"><span>{sport.icon}　{sport.name}</span><button onClick={() => setActive(sport.name)}>View All →</button></div><div className="sport-card-body"><div className="sport-art">{sport.icon}</div><h3>{sport.league}</h3></div><div className="sport-card-foot"><span>●　Live {sport.name === 'Basketball' ? 'Games' : 'Matches'}: {sport.live}</span><span>▣　 Today: {sport.today}</span></div></article>)}</div>
        <div className="tables-grid"><section className="panel"><div className="panel-head"><h2>🏆　{copy.upcoming}</h2><button>{copy.view} →</button></div>{filtered.map((match, i) => <div className="table-row" key={match[0]}><b>{i + 1}</b><span>{match[4]}　{match[0]} <small>vs</small> {match[1]}</span><span className="date">Nov 8, 2026<br /><b>{match[2]}</b></span><strong className={`badge ${match[3].toLowerCase()}`}>{match[3]}</strong></div>)}{filtered.length === 0 && <div className="empty">No matches available at the moment.</div>}</section><section className="panel"><div className="panel-head"><h2>📊　{copy.results}</h2><button>{copy.view} →</button></div>{results.map((match) => <div className="table-row result" key={match[0]}><b>{match[4]}</b><span>{match[1]}</span><strong>{match[2]}</strong><span>{match[0]}</span><small>{match[3]}</small></div>)}</section></div>
      </div><footer><strong>Live <b>Mutch</b></strong><span>Follow us:　��　𝕏　🔵　◎</span><span>© 2026 Live Mutch. All rights reserved.</span><span className="api-ok">● API Connected</span><span>Privacy　　Terms　　Contact</span></footer>
    </section>
  </main>
}
