import { useState } from 'react'
import { PLAYERS, MATCHES_KEY, makeId, MESES } from '../constants.js'

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

function emptyMatch() {
  return {
    id: makeId(),
    fecha: new Date().toISOString().slice(0, 10),
    rival: '',
    lugar: 'local',
    puntosNos: '',
    puntosThem: '',
    jugadores: [],
    notas: '',
  }
}

export default function Partidos({ matches, onSave }) {
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(emptyMatch)
  const [editId, setEditId] = useState(null)
  const [viewMatch, setViewMatch] = useState(null)

  function setField(key, val) { setForm(f => ({ ...f, [key]: val })) }

  function togglePlayer(name) {
    setForm(f => ({
      ...f,
      jugadores: f.jugadores.includes(name)
        ? f.jugadores.filter(p => p !== name)
        : [...f.jugadores, name],
    }))
  }

  function openNew() {
    setForm(emptyMatch())
    setEditId(null)
    setShowForm(true)
  }

  function openEdit(match) {
    setForm({ ...match })
    setEditId(match.id)
    setShowForm(true)
  }

  function saveForm() {
    if (!form.rival.trim()) return alert('Ingresá el rival.')
    let updated
    if (editId) {
      updated = matches.map(m => m.id === editId ? form : m)
    } else {
      updated = [form, ...matches]
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

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', margin: '8px 0 12px' }}>
        <button className="btn btn-save" onClick={openNew}>+ Nuevo partido</button>
      </div>

      {matches.length === 0 && (
        <div className="empty-state"><div className="icon">⚽</div><p>No hay partidos registrados</p></div>
      )}

      {matches.map(m => {
        const r = getResult(m)
        return (
          <div key={m.id} className="match-card" onClick={() => setViewMatch(m)}>
            <div className="match-hdr">
              <div className="match-rival">vs {m.rival}</div>
              <div className={`match-badge ${r}`}>{resultLabel(r)}</div>
            </div>
            <div className="match-sub">
              {fmtFecha(m.fecha)} · {m.lugar === 'local' ? '🏠 Local' : m.lugar === 'visitante' ? '✈️ Visitante' : '⚖️ Neutro'}
              {m.jugadores.length > 0 && ` · ${m.jugadores.length} jugadores`}
            </div>
            {(m.puntosNos !== '' && m.puntosThem !== '') && (
              <div className="match-score" style={{ marginTop: 6 }}>
                {m.puntosNos} – {m.puntosThem}
              </div>
            )}
          </div>
        )
      })}

      {/* Match detail / edit from list */}
      {viewMatch && !showForm && (
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
            {viewMatch.jugadores.length > 0 && (
              <div style={{ marginBottom: 12 }}>
                <div className="sec-hdr">Jugadores ({viewMatch.jugadores.length})</div>
                <div className="chip-wrap">
                  {viewMatch.jugadores.map(p => <div key={p} className="chip active">{p}</div>)}
                </div>
              </div>
            )}
            {viewMatch.notas && (
              <div style={{ marginBottom: 16 }}>
                <div className="sec-hdr">Notas</div>
                <p style={{ fontSize: 14, lineHeight: 1.6 }}>{viewMatch.notas}</p>
              </div>
            )}
            <div className="btn-row">
              <button className="btn" style={{ flex: 1 }} onClick={() => { openEdit(viewMatch); setViewMatch(null) }}>Editar</button>
              <button className="btn" style={{ flex: 1, color: 'var(--red)' }} onClick={() => deleteMatch(viewMatch.id)}>Eliminar</button>
            </div>
          </div>
        </div>
      )}

      {/* Form */}
      {showForm && (
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

            <div className="form-group">
              <label>Jugadores convocados</label>
              <div style={{ maxHeight: 220, overflowY: 'auto' }}>
                {PLAYERS.map(name => (
                  <div key={name} className="player-check-row" onClick={() => togglePlayer(name)}>
                    <div className={`check-box ${form.jugadores.includes(name) ? 'checked' : ''}`}>
                      {form.jugadores.includes(name) && '✓'}
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 500 }}>{name}</div>
                  </div>
                ))}
              </div>
              <div style={{ fontSize: 12, color: 'var(--text2)', marginTop: 6 }}>
                {form.jugadores.length} seleccionados
              </div>
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
    </div>
  )
}
