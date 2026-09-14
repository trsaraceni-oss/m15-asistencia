import { useState } from 'react'
import { PLAYERS, ini, today, apiCall } from '../constants.js'

function cycle(v) {
  return v === 'none' ? 'present' : v === 'present' ? 'absent' : 'none'
}

export default function Tomar({ sessions, onSave }) {
  const [cur, setCur] = useState(ini)
  const [fecha, setFecha] = useState(today)
  const [saving, setSaving] = useState(false)

  const presentes = PLAYERS.filter(p => cur[p] === 'present').length
  const ausentes = PLAYERS.filter(p => cur[p] === 'absent').length

  function toggle(p) { setCur(c => ({ ...c, [p]: cycle(c[p]) })) }
  function markAll(v) { setCur(Object.fromEntries(PLAYERS.map(p => [p, v]))) }
  function resetAll() { setCur(ini()) }

  async function guardar() {
    if (presentes + ausentes === 0) return alert('Marcá al menos un jugador.')
    setSaving(true)
    const sess = { fecha, jugadores: { ...cur } }
    const updated = [...sessions.filter(s => s.fecha !== fecha), sess]
      .sort((a, b) => a.fecha < b.fecha ? 1 : -1)
    onSave(updated)
    try { await apiCall({ action: 'saveSession', session: sess }) } catch {}
    setSaving(false)
    alert('Guardado ✓')
  }

  return (
    <div>
      <div className="stats-bar">
        <div className="stat-box"><div className="val">{PLAYERS.length}</div><div className="lbl">Total</div></div>
        <div className="stat-box green"><div className="val">{presentes}</div><div className="lbl">Presentes</div></div>
        <div className="stat-box red"><div className="val">{ausentes}</div><div className="lbl">Ausentes</div></div>
      </div>

      <div className="form-group">
        <label>Fecha</label>
        <input type="date" value={fecha} onChange={e => setFecha(e.target.value)} />
      </div>

      <div className="btn-row">
        <button className="btn" onClick={() => markAll('present')}>✓ Todos</button>
        <button className="btn" onClick={() => markAll('absent')}>✗ Ninguno</button>
        <button className="btn" onClick={resetAll}>↺ Limpiar</button>
      </div>

      <div>
        {PLAYERS.map(p => (
          <div key={p} className="prow" onClick={() => toggle(p)}>
            <div className={`av ${cur[p]}`}>
              {cur[p] === 'present' ? '✓' : cur[p] === 'absent' ? '✗' : p[0]}
            </div>
            <div className="pname">{p}</div>
            <div className="picon">
              {cur[p] === 'present' ? '🟢' : cur[p] === 'absent' ? '🔴' : '⚪'}
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 16 }}>
        <button className="btn btn-save" style={{ width: '100%' }} onClick={guardar} disabled={saving}>
          {saving ? 'Guardando…' : 'Guardar asistencia'}
        </button>
      </div>
    </div>
  )
}
