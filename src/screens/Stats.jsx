import { useState } from 'react'
import { PLAYERS, MESES } from '../constants.js'

export default function Stats({ sessions }) {
  const [period, setPeriod] = useState('ytd')
  const [selectedMes, setSelectedMes] = useState(new Date().getMonth() + 1)

  const filtered = sessions.filter(s => {
    if (period === 'ytd') return true
    const m = +s.fecha.slice(5, 7)
    return m === selectedMes
  })

  const rows = PLAYERS.map(p => {
    const valid = filtered.filter(s => s.jugadores[p] !== 'none')
    const pres = valid.filter(s => s.jugadores[p] === 'present').length
    const pct = valid.length > 0 ? Math.round(pres / valid.length * 100) : 0
    return { p, pct, pres, total: valid.length }
  }).sort((a, b) => b.pct - a.pct)

  const avg = rows.length > 0 ? Math.round(rows.reduce((s, r) => s + r.pct, 0) / rows.length) : 0

  return (
    <div>
      <div className="period-row">
        <button className={`period-btn ${period === 'ytd' ? 'active' : ''}`} onClick={() => setPeriod('ytd')}>Año</button>
        <button className={`period-btn ${period === 'mes' ? 'active' : ''}`} onClick={() => setPeriod('mes')}>Por mes</button>
      </div>

      {period === 'mes' && (
        <div className="period-row">
          {MESES.map((m, i) => (
            <button key={m} className={`period-btn ${selectedMes === i + 1 ? 'active' : ''}`}
              onClick={() => setSelectedMes(i + 1)}>{m}</button>
          ))}
        </div>
      )}

      <div className="stats-bar">
        <div className="stat-box"><div className="val">{filtered.length}</div><div className="lbl">Sesiones</div></div>
        <div className="stat-box green"><div className="val">{avg}%</div><div className="lbl">Promedio</div></div>
      </div>

      <div>
        {rows.map(r => (
          <div key={r.p} className="pstat-row">
            <div className="pstat-name">{r.p}</div>
            <div className="pstat-bar">
              <div className="pstat-fill"
                style={{ width: `${r.pct}%`, background: r.pct >= 75 ? 'var(--teal)' : 'var(--red)' }} />
            </div>
            <div className="pstat-pct" style={{ color: r.pct >= 75 ? 'var(--teal)' : 'var(--red)' }}>
              {r.pct}%
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
