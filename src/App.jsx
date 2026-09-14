import { useState, useEffect } from 'react'
import { LOCAL_KEY, PROFILES_KEY, MATCHES_KEY, SEED_SESSIONS, apiCall } from './constants.js'
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
  // old HTML app stored attendance as s.players; new app uses s.jugadores
  if (!s.jugadores && s.players && typeof s.players === 'object') {
    return { ...s, jugadores: s.players }
  }
  if (s.jugadores && typeof s.jugadores === 'object') return s
  return null
}

function loadSessions() {
  try {
    const raw = localStorage.getItem(LOCAL_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed.length > 0) {
        const valid = parsed.map(normalizeSession).filter(Boolean)
        if (valid.length > 0) {
          const merged = Object.values(
            [...SEED_SESSIONS, ...valid].reduce((acc, s) => { acc[s.fecha] = s; return acc }, {})
          ).sort((a, b) => a.fecha < b.fecha ? 1 : -1)
          return merged
        }
      }
    }
  } catch {}
  return SEED_SESSIONS
}

function loadProfiles() {
  try {
    const raw = localStorage.getItem(PROFILES_KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  return {}
}

function loadMatches() {
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
  const [sessions, setSessions] = useState(loadSessions)
  const [profiles, setProfiles] = useState(loadProfiles)
  const [matches, setMatches] = useState(loadMatches)
  const [syncStatus, setSyncStatus] = useState('off')

  function saveSessions(s) {
    setSessions(s)
    localStorage.setItem(LOCAL_KEY, JSON.stringify(s))
  }

  function saveProfiles(p) {
    setProfiles(p)
    localStorage.setItem(PROFILES_KEY, JSON.stringify(p))
  }

  function saveMatches(m) {
    setMatches(m)
    localStorage.setItem(MATCHES_KEY, JSON.stringify(m))
  }

  async function sincronizar() {
    setSyncStatus('loading')
    try {
      const data = await apiCall({ action: 'getSessions' })
      if (data?.sessions?.length) {
        const merged = Object.values(
          [...SEED_SESSIONS, ...data.sessions].reduce((acc, s) => {
            acc[s.fecha] = s; return acc
          }, {})
        ).sort((a, b) => a.fecha < b.fecha ? 1 : -1)
        saveSessions(merged)
      }
      setSyncStatus('on')
    } catch {
      setSyncStatus('off')
    }
  }

  useEffect(() => { sincronizar() }, [])

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

      {/* Asistencia sub-tabs */}
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
        <Partidos matches={matches} onSave={saveMatches} />
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
          syncStatus={syncStatus} onSync={sincronizar}
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
