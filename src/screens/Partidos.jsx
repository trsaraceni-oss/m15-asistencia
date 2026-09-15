import { useState } from 'react'
import { PLAYERS, MATCHES_KEY, makeId, MESES, FORMATION } from '../constants.js'

function fmtFecha(f) {
  if (!f) return '—'
  const [y, m, d] = f.split('-')
  return `${d} ${MESES[+m - 1]} ${y}`
}

function getResult(match) {
  if (match.puntosNos == null || match.puntosThem == null) return 'P'
  const n = +match.puntosNos, t = +match.puntosThem
  if (n > t) return 'W'
  if (n < t) return 'L'
  return 'D'
}

function resultLabel(r) {
  return { W: 'Victoria', L: 'Derrota', D: 'Empate', P: 'Pendiente' }[r]
}

function emptyFormation() {
  return Object.fromEntries(FORMATION.map(f => [f.num, '']))
}

function emptyMatch() {
  return {
    id: makeId(),
    fecha: new Date().toISOString().slice(0, 10),
    rival: '',
    lugar: 'local',
    puntosNos: '',
    puntosThem: '',
    formation: emptyFormation(),
    notas: '',
  }
}

function formationToJugadores(formation) {
  return [...new Set(Object.values(formation).filter(Boolean))]
}

function shortName(name) {
  if (!name) return ''
  const parts = name.split(' ')
  return parts.length > 1 ? `${parts[0]} ${parts[1][0]}.` : parts[0]
}

// SVG coordinates for each jersey number on the field
const FIELD_XY = {
  1:  [60,  62],
  2:  [150, 62],
  3:  [240, 62],
  4:  [100, 118],
  5:  [200, 118],
  6:  [60,  174],
  7:  [240, 174],
  8:  [150, 174],
  9:  [150, 226],
  10: [205, 276],
  11: [30,  316],
  12: [110, 326],
  13: [200, 326],
  14: [270, 316],
  15: [150, 415],
}

function RugbyField({ formation }) {
  return (
    <svg viewBox="0 0 300 460" width="100%" style={{ display: 'block', maxHeight: '62vh' }}>
      {/* Grass */}
      <rect width="300" height="460" rx="10" fill="#2d7a27" />
      {/* Alternating grass stripes */}
      {[0,1,2,3,4,5].map(i => (
        <rect key={i} x="10" y={10 + i*73} width="280" height="37"
          fill="rgba(0,0,0,0.06)" />
      ))}
      {/* Touch lines */}
      <rect x="10" y="10" width="280" height="440" rx="5" fill="none"
        stroke="white" strokeWidth="1.5" opacity="0.7" />
      {/* Try lines */}
      <line x1="10" y1="42"  x2="290" y2="42"  stroke="white" strokeWidth="2" opacity="0.8" />
      <line x1="10" y1="428" x2="290" y2="428" stroke="white" strokeWidth="2" opacity="0.8" />
      {/* 22m lines */}
      <line x1="10" y1="130" x2="290" y2="130" stroke="white" strokeWidth="1" opacity="0.4"
        strokeDasharray="8,5" />
      <line x1="10" y1="340" x2="290" y2="340" stroke="white" strokeWidth="1" opacity="0.4"
        strokeDasharray="8,5" />
      {/* Halfway */}
      <line x1="10" y1="235" x2="290" y2="235" stroke="white" strokeWidth="1.5" opacity="0.5" />
      <circle cx="150" cy="235" r="3" fill="white" opacity="0.6" />

      {/* Players */}
      {FORMATION.map(({ num }) => {
        const [cx, cy] = FIELD_XY[num]
        const name = formation[num] || ''
        const filled = !!name
        return (
          <g key={num}>
            <circle cx={cx} cy={cy} r={21}
              fill={filled ? 'white' : 'rgba(255,255,255,0.12)'}
              stroke={filled ? '#1a5c1a' : 'rgba(255,255,255,0.45)'}
              strokeWidth="1.5"
              strokeDasharray={filled ? undefined : '4,3'} />
            <text x={cx} y={cy + 5} textAnchor="middle"
              fontSize={filled ? '13' : '12'} fontWeight="700"
              fill={filled ? '#1a3d1a' : 'rgba(255,255,255,0.5)'}>
              {num}
            </text>
            {filled && (
              <text x={cx} y={cy + 36} textAnchor="middle"
                fontSize="8" fill="white" fontWeight="500"
                style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
                {shortName(name)}
              </text>
            )}
          </g>
        )
      })}
    </svg>
  )
}

export default function Partidos({ matches, onSave, profiles = {} }) {
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(emptyMatch)
  const [editId, setEditId] = useState(null)
  const [viewMatch, setViewMatch] = useState(null)
  const [showField, setShowField] = useState(false)
  const [fieldFormation, setFieldFormation] = useState(null)

  function setField(key, val) { setForm(f => ({ ...f, [key]: val })) }

  function setFormationSlot(num, player) {
    setForm(f => ({ ...f, formation: { ...f.formation, [num]: player } }))
  }

  function openNew() {
    setForm(emptyMatch())
    setEditId(null)
    setShowForm(true)
  }

  function openEdit(match) {
    setForm({ ...match, formation: match.formation || emptyFormation() })
    setEditId(match.id)
    setShowForm(true)
  }

  function saveForm() {
    if (!form.rival.trim()) return alert('Ingresá el rival.')
    const jugadores = formationToJugadores(form.formation)
    const toSave = { ...form, jugadores }
    let updated
    if (editId) {
      updated = matches.map(m => m.id === editId ? toSave : m)
    } else {
      updated = [toSave, ...matches]
    }
    updated.sort((a, b) => a.fecha < b.fecha ? 1 : -1)
    localStorage.setItem(MATCHES_KEY, JSON.stringify(updated))
    onSave(updated)
    setShowForm(false)
  }

  function deleteMatch(id) {
    if (!confirm('¿Eliminar este partido?')) return
    const updated = matches.filter(m => m.id !== id)
    localStorage.setItem(MATCHES_KEY, JSON.stringify(updated))
    onSave(updated)
    setViewMatch(null)
  }

  function openField(formation) {
    setFieldFormation(formation)
    setShowField(true)
  }

  function filledCount(formation) {
    return Object.values(formation).filter(Boolean).length
  }

  // Returns players sorted: preferred for position first, others after
  function playersForPos(pos) {
    const preferred = PLAYERS.filter(p => profiles[p]?.positions?.includes(pos))
    const others = PLAYERS.filter(p => !profiles[p]?.positions?.includes(pos))
    return { preferred, others }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', margin: '8px 0 12px' }}>
        <button className="btn btn-save" onClick={openNew}>+ Nuevo partido</button>
      </div>

      {matches.length === 0 && (
        <div className="empty-state">
          <div className="icon">🏉</div>
          <p>No hay partidos registrados</p>
        </div>
      )}

      {matches.map(m => {
        const r = getResult(m)
        const xvCount = m.formation ? filledCount(m.formation) : (m.jugadores?.length || 0)
        return (
          <div key={m.id} className="match-card" onClick={() => setViewMatch(m)}>
            <div className="match-hdr">
              <div className="match-rival">vs {m.rival}</div>
              <div className={`match-badge ${r}`}>{resultLabel(r)}</div>
            </div>
            <div className="match-sub">
              {fmtFecha(m.fecha)} · {m.lugar === 'local' ? '🏠 Local' : m.lugar === 'visitante' ? '✈️ Visitante' : '⚖️ Neutro'}
              {xvCount > 0 && ` · XV: ${xvCount}/15`}
            </div>
            {(m.puntosNos !== '' && m.puntosThem !== '') && (
              <div className="match-score" style={{ marginTop: 6 }}>
                {m.puntosNos} – {m.puntosThem}
              </div>
            )}
          </div>
        )
      })}

      {/* Match detail */}
      {viewMatch && !showForm && !showField && (
        <div className="overlay" onClick={() => setViewMatch(null)}>
          <div className="bottom-sheet" onClick={e => e.stopPropagation()}>
            <div className="sheet-hdr">
              <h2>vs {viewMatch.rival}</h2>
              <button className="sheet-close" onClick={() => setViewMatch(null)}>✕</button>
            </div>
            <p style={{ fontSize: 14, color: 'var(--text2)', marginBottom: 12 }}>
              {fmtFecha(viewMatch.fecha)} · {viewMatch.lugar}
            </p>
            {(viewMatch.puntosNos !== '' && viewMatch.puntosThem !== '') && (
              <div className="match-score" style={{ marginBottom: 12 }}>
                {viewMatch.puntosNos} – {viewMatch.puntosThem}
              </div>
            )}
            {viewMatch.formation && filledCount(viewMatch.formation) > 0 && (
              <div style={{ marginBottom: 12 }}>
                <div className="sec-hdr">XV Inicial — {filledCount(viewMatch.formation)}/15</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {FORMATION.map(({ num, pos }) => {
                    const player = viewMatch.formation[num]
                    if (!player) return null
                    return (
                      <div key={num} style={{ display: 'flex', alignItems: 'center', gap: 5,
                        background: 'var(--teal-bg)', borderRadius: 20, padding: '3px 10px 3px 4px' }}>
                        <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'var(--teal)',
                          color: '#fff', fontSize: 11, fontWeight: 700, display: 'flex',
                          alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{num}</div>
                        <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--teal-dark)' }}>{player}</span>
                      </div>
                    )
                  })}
                </div>
                <button className="btn" style={{ marginTop: 10, width: '100%' }}
                  onClick={() => openField(viewMatch.formation)}>
                  🏟 Ver en cancha
                </button>
              </div>
            )}
            {viewMatch.notas && (
              <div style={{ marginBottom: 16 }}>
                <div className="sec-hdr">Notas</div>
                <p style={{ fontSize: 14, lineHeight: 1.6 }}>{viewMatch.notas}</p>
              </div>
            )}
            <div className="btn-row">
              <button className="btn" style={{ flex: 1 }}
                onClick={() => { openEdit(viewMatch); setViewMatch(null) }}>Editar</button>
              <button className="btn" style={{ flex: 1, color: 'var(--red)' }}
                onClick={() => deleteMatch(viewMatch.id)}>Eliminar</button>
            </div>
          </div>
        </div>
      )}

      {/* Match form */}
      {showForm && !showField && (
        <div className="overlay" onClick={() => setShowForm(false)}>
          <div className="bottom-sheet" onClick={e => e.stopPropagation()}>
            <div className="sheet-hdr">
              <h2>{editId ? 'Editar partido' : 'Nuevo partido'}</h2>
              <button className="sheet-close" onClick={() => setShowForm(false)}>✕</button>
            </div>

            <div className="form-group">
              <label>Fecha</label>
              <input type="date" value={form.fecha} onChange={e => setField('fecha', e.target.value)} />
            </div>

            <div className="form-group">
              <label>Rival</label>
              <input placeholder="Nombre del equipo rival" value={form.rival}
                onChange={e => setField('rival', e.target.value)} />
            </div>

            <div className="form-group">
              <label>Cancha</label>
              <div className="lugar-row">
                {['local', 'visitante', 'neutro'].map(l => (
                  <button key={l} className={`lugar-btn ${form.lugar === l ? 'active' : ''}`}
                    onClick={() => setField('lugar', l)}>
                    {l === 'local' ? '🏠 Local' : l === 'visitante' ? '✈️ Visitante' : '⚖️ Neutro'}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Resultado</label>
              <div className="score-row">
                <input type="number" min="0" placeholder="Nac" value={form.puntosNos}
                  onChange={e => setField('puntosNos', e.target.value)} />
                <span className="score-sep">–</span>
                <input type="number" min="0" placeholder="Riv" value={form.puntosThem}
                  onChange={e => setField('puntosThem', e.target.value)} />
              </div>
            </div>

            {/* XV Formation picker */}
            <div className="form-group">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <label style={{ margin: 0 }}>XV Inicial</label>
                <span style={{ fontSize: 12, color: 'var(--text2)' }}>
                  {filledCount(form.formation)}/15 asignados
                </span>
              </div>
              <div style={{ background: 'var(--bg2)', borderRadius: 8, overflow: 'hidden' }}>
                {FORMATION.map(({ num, pos }, idx) => {
                  const { preferred, others } = playersForPos(pos)
                  return (
                    <div key={num} className="formation-row"
                      style={{ borderTop: idx > 0 ? '0.5px solid var(--border)' : 'none' }}>
                      <div className="pos-num">{num}</div>
                      <div className="pos-label">{pos}</div>
                      <select value={form.formation[num]}
                        onChange={e => setFormationSlot(num, e.target.value)}>
                        <option value="">—</option>
                        {preferred.length > 0 && (
                          <optgroup label="Habituales">
                            {preferred.map(p => <option key={p} value={p}>{p}</option>)}
                          </optgroup>
                        )}
                        {others.length > 0 && (
                          <optgroup label={preferred.length > 0 ? 'Otros' : 'Jugadores'}>
                            {others.map(p => <option key={p} value={p}>{p}</option>)}
                          </optgroup>
                        )}
                      </select>
                    </div>
                  )
                })}
              </div>
              {filledCount(form.formation) > 0 && (
                <button className="btn" style={{ width: '100%', marginTop: 10 }}
                  onClick={() => openField(form.formation)}>
                  🏟 Ver en cancha
                </button>
              )}
            </div>

            <div className="form-group">
              <label>Notas</label>
              <textarea value={form.notas} onChange={e => setField('notas', e.target.value)}
                placeholder="Observaciones del partido…" />
            </div>

            <button className="btn btn-save" style={{ width: '100%' }} onClick={saveForm}>
              Guardar partido
            </button>
          </div>
        </div>
      )}

      {/* Rugby field overlay */}
      {showField && fieldFormation && (
        <div className="overlay" onClick={() => setShowField(false)}>
          <div className="bottom-sheet" style={{ paddingBottom: 24 }}
            onClick={e => e.stopPropagation()}>
            <div className="sheet-hdr">
              <h2>XV en Cancha</h2>
              <button className="sheet-close" onClick={() => setShowField(false)}>✕</button>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              fontSize: 12, color: 'var(--text2)', marginBottom: 10 }}>
              <span>⬆️ Ataque</span>
              <span>{filledCount(fieldFormation)}/15 jugadores</span>
            </div>
            <RugbyField formation={fieldFormation} />
          </div>
        </div>
      )}
    </div>
  )
}
