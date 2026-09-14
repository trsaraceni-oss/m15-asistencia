import { useState } from 'react'
import { PLAYERS, MESES, apiCall } from '../constants.js'

function fmtFecha(f) {
  const [y, m, d] = f.split('-')
  return `${d} ${MESES[+m - 1]} ${y}`
}

export default function Historial({ sessions, onSave }) {
  const [editIdx, setEditIdx] = useState(null)
  const [editFecha, setEditFecha] = useState('')
  const [editCur, setEditCur] = useState({})

  function openEdit(i) {
    setEditIdx(i)
    setEditFecha(sessions[i].fecha)
    setEditCur({ ...sessions[i].jugadores })
  }

  function toggleEdit(p) {
    setEditCur(c => ({ ...c, [p]: c[p] === 'present' ? 'absent' : 'present' }))
  }

  async function guardarEdicion() {
    const updated = sessions.map((s, i) =>
      i === editIdx ? { fecha: editFecha, jugadores: editCur } : s
    ).sort((a, b) => a.fecha < b.fecha ? 1 : -1)
    onSave(updated)
    try { await apiCall({ action: 'saveSession', session: { fecha: editFecha, jugadores: editCur } }) } catch {}
    setEditIdx(null)
  }

  async function borrar(i) {
    if (!confirm('¿Eliminar esta sesión?')) return
    const removed = sessions[i]
    const updated = sessions.filter((_, j) => j !== i)
    onSave(updated)
    try { await apiCall({ action: 'deleteSession', fecha: removed.fecha }) } catch {}
  }

  return (
    <div>
      {sessions.length === 0 && (
        <div className="empty-state"><div className="icon">📋</div><p>No hay sesiones registradas</p></div>
      )}
      {sessions.map((s, i) => {
        const presentes = PLAYERS.filter(p => s.jugadores[p] === 'present')
        const ausentes = PLAYERS.filter(p => s.jugadores[p] === 'absent')
        return (
          <div key={s.fecha} className="hist-card">
            <div className="hdr">
              <span className="fecha">{fmtFecha(s.fecha)}</span>
              <span className="count">✓ {presentes.length}</span>
            </div>
            {ausentes.length > 0 && (
              <div className="ausentes">Ausentes: {ausentes.join(', ')}</div>
            )}
            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              <button className="edit-btn" onClick={() => openEdit(i)}>Editar</button>
              <button className="edit-btn" style={{ color: 'var(--red)' }} onClick={() => borrar(i)}>Eliminar</button>
            </div>
          </div>
        )
      })}

      {editIdx !== null && (
        <div className="overlay" onClick={() => setEditIdx(null)}>
          <div className="bottom-sheet" onClick={e => e.stopPropagation()}>
            <div className="sheet-hdr">
              <h2>Editar sesión</h2>
              <button className="sheet-close" onClick={() => setEditIdx(null)}>✕</button>
            </div>
            <div className="form-group">
              <label>Fecha</label>
              <input type="date" value={editFecha} onChange={e => setEditFecha(e.target.value)} />
            </div>
            {PLAYERS.map(p => (
              <div key={p} className="prow" onClick={() => toggleEdit(p)}>
                <div className={`av ${editCur[p] === 'present' ? 'present' : 'absent'}`}>
                  {editCur[p] === 'present' ? '✓' : '✗'}
                </div>
                <div className="pname">{p}</div>
                <div className="picon">{editCur[p] === 'present' ? '🟢' : '🔴'}</div>
              </div>
            ))}
            <button className="btn btn-save" style={{ width: '100%', marginTop: 16 }} onClick={guardarEdicion}>
              Guardar cambios
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
