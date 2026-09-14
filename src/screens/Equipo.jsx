import { useState } from 'react'
import { PLAYERS, POSITIONS, SKILLS, PROFILES_KEY, getAge } from '../constants.js'

function initProfile(name) {
  return {
    name,
    dob: '',
    positions: [],
    skills: { velocidad: 0, tackle: 0, pelota: 0, kick: 0, liderazgo: 0 },
    notas: '',
  }
}

function initials(name) {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
}

function getAttPct(name, sessions) {
  const valid = sessions.filter(s => s.jugadores[name] !== 'none')
  if (valid.length === 0) return null
  const pres = valid.filter(s => s.jugadores[name] === 'present').length
  return Math.round(pres / valid.length * 100)
}

export default function Equipo({ sessions, profiles, onSaveProfiles }) {
  const [search, setSearch] = useState('')
  const [editing, setEditing] = useState(null) // player name

  const filtered = PLAYERS.filter(p => p.toLowerCase().includes(search.toLowerCase()))

  function getProfile(name) {
    return profiles[name] || initProfile(name)
  }

  function openEdit(name) {
    setEditing({ name, ...getProfile(name) })
  }

  function saveEdit() {
    const { name, ...data } = editing
    const updated = { ...profiles, [name]: data }
    localStorage.setItem(PROFILES_KEY, JSON.stringify(updated))
    onSaveProfiles(updated)
    setEditing(null)
  }

  function setField(key, val) {
    setEditing(e => ({ ...e, [key]: val }))
  }

  function togglePos(pos) {
    setEditing(e => ({
      ...e,
      positions: e.positions.includes(pos)
        ? e.positions.filter(p => p !== pos)
        : [...e.positions, pos],
    }))
  }

  function setSkill(key, val) {
    setEditing(e => ({ ...e, skills: { ...e.skills, [key]: val } }))
  }

  const matchesPlayed = (name) => {
    return sessions.filter(s => s.jugadores[name] === 'present').length
  }

  return (
    <div>
      <div className="search-bar">
        <span className="search-icon">🔍</span>
        <input placeholder="Buscar jugador…" value={search} onChange={e => setSearch(e.target.value)} />
        {search && <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text2)' }}
          onClick={() => setSearch('')}>✕</button>}
      </div>

      <div>
        {filtered.map(name => {
          const pct = getAttPct(name, sessions)
          const prof = profiles[name] || {}
          const posStr = prof.positions?.length > 0 ? prof.positions.slice(0, 2).join(', ') : 'Sin posición'
          return (
            <div key={name} className="player-card" onClick={() => openEdit(name)}>
              <div className="player-av">{initials(name)}</div>
              <div className="player-info">
                <div className="player-name">{name}</div>
                <div className="player-sub">{posStr} · {matchesPlayed(name)} sesiones</div>
              </div>
              {pct !== null && (
                <div className={`player-pct ${pct < 75 ? 'low' : ''}`}>{pct}%</div>
              )}
            </div>
          )
        })}
      </div>

      {editing && (
        <div className="overlay" onClick={() => setEditing(null)}>
          <div className="bottom-sheet" onClick={e => e.stopPropagation()}>
            <div className="sheet-hdr">
              <h2>Perfil</h2>
              <button className="sheet-close" onClick={() => setEditing(null)}>✕</button>
            </div>

            <div className="profile-avatar">{initials(editing.name)}</div>
            <div className="profile-name">{editing.name}</div>
            {editing.dob && (
              <div className="profile-sub">{getAge(editing.dob)} años · {editing.dob}</div>
            )}

            <div className="profile-stats-row">
              <div className="profile-stat">
                <div className="val">{getAttPct(editing.name, sessions) ?? '—'}%</div>
                <div className="lbl">Asistencia</div>
              </div>
              <div className="profile-stat">
                <div className="val">{matchesPlayed(editing.name)}</div>
                <div className="lbl">Sesiones</div>
              </div>
            </div>

            <div className="form-group">
              <label>Fecha de nacimiento</label>
              <input type="date" value={editing.dob} onChange={e => setField('dob', e.target.value)} />
            </div>

            <div className="form-group">
              <label>Puestos</label>
              <div className="chip-wrap">
                {POSITIONS.map(pos => (
                  <button key={pos} className={`chip ${editing.positions.includes(pos) ? 'active' : ''}`}
                    onClick={() => togglePos(pos)}>{pos}</button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Habilidades</label>
              {SKILLS.map(({ key, label }) => (
                <div key={key} className="skill-row">
                  <div className="skill-label">{label}</div>
                  <div className="skill-dots">
                    {[1, 2, 3, 4, 5].map(n => (
                      <div key={n} className={`skill-dot ${(editing.skills[key] || 0) >= n ? 'filled' : ''}`}
                        onClick={() => setSkill(key, n === editing.skills[key] ? 0 : n)} />
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="form-group">
              <label>Notas</label>
              <textarea value={editing.notas} onChange={e => setField('notas', e.target.value)}
                placeholder="Observaciones del entrenador…" />
            </div>

            <button className="btn btn-save" style={{ width: '100%' }} onClick={saveEdit}>
              Guardar perfil
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
