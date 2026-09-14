import { LOCAL_KEY, PROFILES_KEY, MATCHES_KEY, SCRIPT, apiCall } from '../constants.js'

export default function Ajustes({ sessions, profiles, matches, onSaveSessions, onSaveProfiles, onSaveMatches, syncStatus, onSync }) {
  function exportar() {
    const data = { sessions, profiles, matches, exportedAt: new Date().toISOString(), version: 2 }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `m15_respaldo_${new Date().toISOString().slice(0, 10)}.json`
    a.click()
  }

  function importar() {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = async e => {
      const file = e.target.files[0]
      if (!file) return
      const text = await file.text()
      let data
      try { data = JSON.parse(text) } catch { return alert('Archivo inválido.') }
      if (!confirm(`¿Importar respaldo? Se reemplazarán ${data.sessions?.length ?? 0} sesiones, ${Object.keys(data.profiles || {}).length} perfiles y ${data.matches?.length ?? 0} partidos.`)) return
      if (data.sessions) { localStorage.setItem(LOCAL_KEY, JSON.stringify(data.sessions)); onSaveSessions(data.sessions) }
      if (data.profiles) { localStorage.setItem(PROFILES_KEY, JSON.stringify(data.profiles)); onSaveProfiles(data.profiles) }
      if (data.matches) { localStorage.setItem(MATCHES_KEY, JSON.stringify(data.matches)); onSaveMatches(data.matches) }
      alert('Importado ✓')
    }
    input.click()
  }

  const dotClass = syncStatus === 'on' ? 'on' : syncStatus === 'loading' ? 'loading' : 'off'
  const dotLabel = syncStatus === 'on' ? 'Conectado' : syncStatus === 'loading' ? 'Sincronizando…' : 'Sin conexión'

  return (
    <div>
      <div className="ajustes-section">
        <h3>Google Sheets</h3>
        <div className="ajustes-row">
          <label>Estado</label>
          <span><span className={`status-dot ${dotClass}`} />{dotLabel}</span>
        </div>
        <div className="ajustes-row">
          <label>Script URL</label>
          <span style={{ fontSize: 11, maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {SCRIPT.slice(0, 40)}…
          </span>
        </div>
        <button className="btn" style={{ marginTop: 8, width: '100%' }} onClick={onSync}
          disabled={syncStatus === 'loading'}>
          {syncStatus === 'loading' ? 'Sincronizando…' : '↻ Forzar sincronización'}
        </button>
      </div>

      <div className="ajustes-section">
        <h3>Datos</h3>
        <div style={{ display: 'flex', gap: 8, flexDirection: 'column' }}>
          <button className="btn" onClick={exportar}>📤 Exportar respaldo JSON</button>
          <button className="btn" onClick={importar}>📥 Importar respaldo JSON</button>
        </div>
        <div style={{ marginTop: 10, fontSize: 12, color: 'var(--text2)', lineHeight: 1.6 }}>
          {sessions.length} sesiones · {Object.keys(profiles).length} perfiles · {matches.length} partidos
        </div>
      </div>

      <div className="ajustes-section">
        <h3>Acerca de</h3>
        <div className="ajustes-row"><label>Versión</label><span>2.0.0</span></div>
        <div className="ajustes-row"><label>Equipo</label><span>M15 Banco Nación</span></div>
      </div>
    </div>
  )
}
