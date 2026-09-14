const BullLogo = () => (
  <svg viewBox="0 0 200 200" width="160" height="160" xmlns="http://www.w3.org/2000/svg">
    {/* outer circle */}
    <circle cx="100" cy="100" r="98" fill="#d0d8dc" stroke="#b0bcc2" strokeWidth="1.5" />
    {/* inner circle */}
    <circle cx="100" cy="100" r="88" fill="#e8edf0" />

    {/* jersey body - light blue stripes */}
    <ellipse cx="100" cy="128" rx="38" ry="42" fill="#5bb8d4" />
    <rect x="62" y="100" width="13" height="70" fill="#ffffff" opacity="0.7" rx="2" />
    <rect x="88" y="100" width="13" height="70" fill="#ffffff" opacity="0.7" rx="2" />
    <rect x="114" y="100" width="13" height="70" fill="#ffffff" opacity="0.7" rx="2" />
    {/* collar */}
    <ellipse cx="100" cy="103" rx="14" ry="7" fill="#3a9ab5" />

    {/* neck */}
    <rect x="86" y="82" width="28" height="22" rx="8" fill="#c8a070" />

    {/* head */}
    <ellipse cx="100" cy="72" rx="30" ry="26" fill="#d4a878" />

    {/* snout */}
    <ellipse cx="100" cy="83" rx="18" ry="12" fill="#e8b888" />
    <ellipse cx="94" cy="83" rx="5" ry="4" fill="#b07050" opacity="0.6" />
    <ellipse cx="106" cy="83" rx="5" ry="4" fill="#b07050" opacity="0.6" />

    {/* eyes */}
    <circle cx="88" cy="65" r="7" fill="white" />
    <circle cx="112" cy="65" r="7" fill="white" />
    <circle cx="89" cy="65" r="4" fill="#2a2a2a" />
    <circle cx="113" cy="65" r="4" fill="#2a2a2a" />
    <circle cx="90.5" cy="63.5" r="1.5" fill="white" />
    <circle cx="114.5" cy="63.5" r="1.5" fill="white" />

    {/* eyebrows */}
    <path d="M82 59 Q88 55 95 58" stroke="#5a3510" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    <path d="M105 58 Q112 55 118 59" stroke="#5a3510" strokeWidth="2.5" fill="none" strokeLinecap="round" />

    {/* horns */}
    <path d="M74 58 Q60 30 72 20 Q76 40 84 52 Z" fill="#b8906a" />
    <path d="M126 58 Q140 30 128 20 Q124 40 116 52 Z" fill="#b8906a" />
    {/* horn tips */}
    <path d="M70 22 Q66 18 72 20" fill="#8a6040" />
    <path d="M130 22 Q134 18 128 20" fill="#8a6040" />

    {/* ears */}
    <ellipse cx="70" cy="68" rx="8" ry="11" fill="#c8a070" />
    <ellipse cx="70" cy="68" rx="5" ry="7" fill="#e8b888" />
    <ellipse cx="130" cy="68" rx="8" ry="11" fill="#c8a070" />
    <ellipse cx="130" cy="68" rx="5" ry="7" fill="#e8b888" />

    {/* arms */}
    <path d="M62 115 Q45 120 42 135 Q50 130 62 128 Z" fill="#5bb8d4" />
    <path d="M138 115 Q155 120 158 135 Q150 130 138 128 Z" fill="#5bb8d4" />

    {/* curved text arc - RUGBY BANCO */}
    <path id="arc" d="M 22 100 A 78 78 0 0 0 178 100" fill="none" />
    <text fontFamily="Arial Black, Arial, sans-serif" fontSize="14" fontWeight="900" fill="#1a3a4a" letterSpacing="3">
      <textPath href="#arc" startOffset="10%">RUGBY BANCO</textPath>
    </text>

    {/* bottom decorative line */}
    <path d="M 35 150 Q 100 165 165 150" stroke="#2d6e7c" strokeWidth="2" fill="none" opacity="0.4" />
  </svg>
)

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
        <BullLogo />
      </div>
    </div>
  )
}
