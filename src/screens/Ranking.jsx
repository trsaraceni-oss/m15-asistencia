import { useRef } from 'react'
import { PLAYERS } from '../constants.js'

function getGroups(sessions) {
  const rows = PLAYERS.map(p => {
    const valid = sessions.filter(s => s.jugadores[p] !== 'none')
    const pres = valid.filter(s => s.jugadores[p] === 'present').length
    const pct = valid.length > 0 ? Math.round(pres / valid.length * 100) : 0
    return { p, pct }
  }).sort((a, b) => b.pct - a.pct)
  return {
    warriors: rows.filter(r => r.pct >= 85),
    soldados: rows.filter(r => r.pct >= 60 && r.pct < 85),
    recuperar: rows.filter(r => r.pct < 60),
  }
}

function SlideContent({ sessions, id }) {
  const { warriors, soldados, recuperar } = getGroups(sessions)
  const now = new Date()
  const dateStr = `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()}`

  return (
    <div id={id} className="ranking-slide">
      <div className="slide-title">🏉 M15 — Banco Nación</div>
      <div className="slide-sub">Ranking de asistencia · {dateStr}</div>
      <div className="slide-cols">
        <div className="slide-col col-warriors">
          <div className="slide-col-hdr">⭐ Warriors</div>
          {warriors.map(r => (
            <div key={r.p} className="slide-player">{r.p} {r.pct}%</div>
          ))}
          {warriors.length === 0 && <div className="slide-player" style={{ opacity: 0.4 }}>—</div>}
        </div>
        <div className="slide-col col-soldados">
          <div className="slide-col-hdr">🛡️ Soldados</div>
          {soldados.map(r => (
            <div key={r.p} className="slide-player">{r.p} {r.pct}%</div>
          ))}
          {soldados.length === 0 && <div className="slide-player" style={{ opacity: 0.4 }}>—</div>}
        </div>
        <div className="slide-col col-recuperar">
          <div className="slide-col-hdr">⚡ Recuperar</div>
          {recuperar.map(r => (
            <div key={r.p} className="slide-player">{r.p} {r.pct}%</div>
          ))}
          {recuperar.length === 0 && <div className="slide-player" style={{ opacity: 0.4 }}>—</div>}
        </div>
      </div>
    </div>
  )
}

export default function Ranking({ sessions }) {
  const slideRef = useRef(null)

  async function compartir() {
    try {
      const h2c = (await import('html2canvas')).default
      const canvas = await h2c(slideRef.current, { scale: 2, useCORS: true })
      const blob = await new Promise(res => canvas.toBlob(res, 'image/png'))
      const file = new File([blob], 'ranking-m15.png', { type: 'image/png' })
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: 'Ranking M15' })
      } else {
        const a = document.createElement('a')
        a.href = URL.createObjectURL(blob)
        a.download = 'ranking-m15.png'
        a.click()
      }
    } catch (e) {
      alert('No se pudo generar la imagen: ' + e.message)
    }
  }

  return (
    <div>
      <div className="ranking-wrap">
        <div ref={slideRef}>
          <SlideContent sessions={sessions} id="ranking-slide" />
        </div>
      </div>
      <button className="btn btn-save" style={{ width: '100%' }} onClick={compartir}>
        📸 Compartir imagen
      </button>
    </div>
  )
}
