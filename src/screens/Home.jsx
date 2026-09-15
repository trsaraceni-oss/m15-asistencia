const NAV_ITEMS = [
  { key: 'equipo',     label: 'JUGADORES',    icon: '👥' },
  { key: 'asistencia', label: 'ASISTENCIA',   icon: '📋' },
  { key: 'partidos',   label: 'PARTIDOS',     icon: '🏉' },
  { key: 'ajustes',    label: 'CONFIGURACIÓN',icon: '⚙️' },
]

export default function Home({ onNavigate }) {
  return (
    <div className="home-screen">
      <h1 className="home-title">BANCO NACIÓN<br />– M15 2026</h1>

      <div className="home-grid">
        {NAV_ITEMS.map(item => (
          <button
            key={item.key}
            className="home-btn"
            onClick={() => onNavigate(item.key)}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="home-logo">
        <img src="/m15-asistencia/escudo.jpg" alt="Rugby Banco" width="172" height="172"
          style={{ borderRadius: '50%', objectFit: 'cover' }} />
      </div>
    </div>
  )
}
