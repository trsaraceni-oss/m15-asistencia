import { useState, useEffect } from 'react'
import { LOCAL_KEY, PROFILES_KEY, MATCHES_KEY, SEED_SESSIONS } from './constants.js'
import {
  fetchSessions, upsertSessions,
  fetchProfiles, upsertProfiles,
  fetchMatches, upsertMatch, deleteMatch as dbDeleteMatch,
} from './supabase.js'
import Home from './screens/Home.jsx'
import Equipo from './screens/Equipo.jsx'
import Partidos from './screens/Partidos.jsx'
import Tomar from './screens/Tomar.jsx'
import Historial from './screens/Historial.jsx'
import Stats from './screens/Stats.jsx'
import Ranking from './screens/Ranking.jsx'
import Ajustes from './screens/Ajustes.jsx'

function normalizeSession(s) {
  if (!s || !s.fecha) return null
  if (!s.jugadores && s.players && typeof s.players === 'object') {
    return { ...s, jugadores: s.players }
  }
  if (s.jugadores && typeof s.jugadores === 'object') return s
  return null
}

function loadLocalSessions() {
  try {
    const raw = localStorage.getItem(LOCAL_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed.length > 0) {
        const valid = parsed.map(normalizeSession).filter(Boolean)
        if (valid.length > 0) return valid
      }
    }
  } catch {}
  return SEED_SESSIONS
}

function loadLocalProfiles() {
  try {
    const raw = localStorage.getItem(PROFILES_KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  return {}
}

function loadLocalMatches() {
  try {
    const raw = localStorage.getItem(MATCHES_KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  return []
}

const ASISTENCIA_TABS = ['Tomar', 'Historial', 'Stats', 'Ranking']

export default function App() {
  const [tab, setTab] = useState('home')
  const [asTab, setAsTab] = useState('Tomar')
  const [sessions, setSessions] = useState(loadLocalSessions)
  const [profiles, setProfiles] = useState(loadLocalProfiles)
  const [matches, setMatches] = useState(loadLocalMatches)
  const [syncStatus, setSyncStatus] = useState('loading')

  // ── Sync from Supabase on mount ──────────────────────────────────────────────
  useEffect(() => {
    async function loadAll() {
      setSyncStatus('loading')
      try {
        const [remoteSessions, remoteProfiles, remoteMatches] = await Promise.all([
          fetchSessions(),
          fetchProfiles(),
          fetchMatches(),
        ])

        const localSessions = loadLocalSessions()
        const localProfiles = loadLocalProfiles()
        const localMatches = loadLocalMatches()

        // Sessions: merge all, remote wins for same fecha
        const merged = Object.values(
          [...SEED_SESSIONS, ...localSessions, ...remoteSessions]
            .map(normalizeSession).filter(Boolean)
            .reduce((acc, s) => { acc[s.fecha] = s; return acc }, {})
        ).sort((a, b) => a.fecha < b.fecha ? 1 : -1)

        setSessions(merged)
        localStorage.setItem(LOCAL_KEY, JSON.stringify(merged))

        // Push local sessions missing from Supabase
        const remoteFechas = new Set(remoteSessions.map(s => s.fecha))
        const missingSessions = localSessions.filter(s => s.fecha && !remoteFechas.has(s.fecha))
        if (missingSessions.length) {
          upsertSessions(missingSessions).catch(() => {})
        }

        // Profiles: merge local + remote (remote wins); push local-only players
        const mergedProfiles = { ...localProfiles, ...remoteProfiles }
        setProfiles(mergedProfiles)
        localStorage.setItem(PROFILES_KEY, JSON.stringify(mergedProfiles))

        const missingProfiles = Object.fromEntries(
          Object.entries(localProfiles).filter(([p]) => !remoteProfiles[p])
        )
        if (Object.keys(missingProfiles).length) {
          upsertProfiles(missingProfiles).catch(() => {})
        }

        // Matches: merge local + remote; push local-only matches
        const remoteIds = new Set(remoteMatches.map(m => m.id))
        const missingMatches = localMatches.filter(m => m.id && !remoteIds.has(m.id))
        if (missingMatches.length) {
          Promise.all(missingMatches.map(m => upsertMatch(m))).catch(() => {})
        }

        const mergedMatches = Object.values(
          [...localMatches, ...remoteMatches]
            .reduce((acc, m) => { if (m.id) acc[m.id] = m; return acc }, {})
        ).sort((a, b) => a.fecha < b.fecha ? 1 : -1)

        setMatches(mergedMatches)
        localStorage.setItem(MATCHES_KEY, JSON.stringify(mergedMatches))

        setSyncStatus('on')
      } catch {
        setSyncStatus('off')
      }
    }
    loadAll()
  }, [])

  // ── Save helpers ─────────────────────────────────────────────────────────────

  async function saveSessions(s) {
    setSessions(s)
    localStorage.setItem(LOCAL_KEY, JSON.stringify(s))
    try { await upsertSessions(s) } catch {}
  }

  async function saveProfiles(p) {
    setProfiles(p)
    localStorage.setItem(PROFILES_KEY, JSON.stringify(p))
    try { await upsertProfiles(p) } catch {}
  }

  // matches: Partidos calls onSave(updatedArray) and also handles individual ops
  // We expose a full-array save AND individual upsert/delete for Partidos
  async function saveMatches(m) {
    setMatches(m)
    localStorage.setItem(MATCHES_KEY, JSON.stringify(m))
    // upsert all (Supabase upsert is idempotent)
    try {
      await Promise.all(m.map(match => upsertMatch(match)))
    } catch {}
  }

  async function saveMatchesWithDelete(updatedList, deletedId) {
    setMatches(updatedList)
    localStorage.setItem(MATCHES_KEY, JSON.stringify(updatedList))
    try {
      await dbDeleteMatch(deletedId)
    } catch {}
  }

  const totalSessions = sessions.length
  const totalMatches = matches.length

  if (tab === 'home') {
    return <Home onNavigate={setTab} />
  }

  return (
    <div className="app">
      <div className="top-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button className="back-btn" onClick={() => setTab('home')} aria-label="Inicio">←</button>
          <div>
            <h1>M15 Banco Nación</h1>
            <p>{totalSessions} sesiones · {totalMatches} partidos</p>
          </div>
        </div>
        <span className={`sync-badge ${syncStatus}`}>
          {syncStatus === 'on' ? '● Online' : syncStatus === 'loading' ? '◌ Sync…' : '○ Offline'}
        </span>
      </div>

      {tab === 'asistencia' && (
        <div className="sub-tabs">
          {ASISTENCIA_TABS.map(t => (
            <button key={t} className={`sub-tab ${asTab === t ? 'active' : ''}`} onClick={() => setAsTab(t)}>
              {t}
            </button>
          ))}
        </div>
      )}

      <div className={`screen ${tab === 'equipo' ? 'active' : ''}`}>
        <Equipo sessions={sessions} profiles={profiles} onSaveProfiles={saveProfiles} />
      </div>

      <div className={`screen ${tab === 'partidos' ? 'active' : ''}`}>
        <Partidos
          matches={matches}
          onSave={saveMatches}
          onDelete={saveMatchesWithDelete}
          profiles={profiles}
        />
      </div>

      <div className={`screen ${tab === 'asistencia' ? 'active' : ''}`}>
        {asTab === 'Tomar' && <Tomar sessions={sessions} onSave={saveSessions} />}
        {asTab === 'Historial' && <Historial sessions={sessions} onSave={saveSessions} />}
        {asTab === 'Stats' && <Stats sessions={sessions} />}
        {asTab === 'Ranking' && <Ranking sessions={sessions} />}
      </div>

      <div className={`screen ${tab === 'ajustes' ? 'active' : ''}`}>
        <Ajustes
          sessions={sessions} profiles={profiles} matches={matches}
          onSaveSessions={saveSessions} onSaveProfiles={saveProfiles} onSaveMatches={saveMatches}
          syncStatus={syncStatus}
        />
      </div>

      <nav className="nav">
        <button className={`nav-btn ${tab === 'equipo' ? 'active' : ''}`} onClick={() => setTab('equipo')}>
          <span className="icon">👥</span>Equipo
        </button>
        <button className={`nav-btn ${tab === 'partidos' ? 'active' : ''}`} onClick={() => setTab('partidos')}>
          <span className="icon">🏉</span>Partidos
        </button>
        <button className={`nav-btn ${tab === 'asistencia' ? 'active' : ''}`} onClick={() => setTab('asistencia')}>
          <span className="icon">📋</span>Asistencia
        </button>
        <button className={`nav-btn ${tab === 'ajustes' ? 'active' : ''}`} onClick={() => setTab('ajustes')}>
          <span className="icon">⚙️</span>Ajustes
        </button>
      </nav>
    </div>
  )
}
