const BullLogo = () => (
  <svg viewBox="0 0 220 220" width="172" height="172" xmlns="http://www.w3.org/2000/svg">
    {/* outer circle - gray */}
    <circle cx="110" cy="110" r="108" fill="#a8b0b4" />

    {/* inner cyan circle behind bull */}
    <circle cx="110" cy="108" r="80" fill="#6ec6d8" />

    {/* shirt body - white with blue stripes, at bottom */}
    <ellipse cx="110" cy="175" rx="52" ry="38" fill="white" />
    {/* blue vertical stripes on shirt */}
    {[87, 98, 109, 120, 131].map(x => (
      <rect key={x} x={x} y="148" width="5" height="65" fill="#4488cc" opacity="0.55" />
    ))}
    {/* shirt collar - V shape */}
    <polygon points="110,152 98,165 122,165" fill="#4488cc" opacity="0.7" />

    {/* neck */}
    <rect x="96" y="132" width="28" height="22" rx="4" fill="#1a1a1a" />

    {/* bull head - large black shape */}
    <ellipse cx="110" cy="108" rx="54" ry="52" fill="#1a1a1a" />

    {/* left horn */}
    <path d="M 68 80 Q 38 40 52 18 Q 62 44 76 68 Z" fill="#1a1a1a" />
    <path d="M 52 18 Q 44 12 50 22 Q 56 16 62 24" fill="#1a1a1a" />

    {/* right horn */}
    <path d="M 152 80 Q 182 40 168 18 Q 158 44 144 68 Z" fill="#1a1a1a" />
    <path d="M 168 18 Q 176 12 170 22 Q 164 16 158 24" fill="#1a1a1a" />

    {/* forehead bump / poll - rounded top with dot pattern */}
    <ellipse cx="110" cy="68" rx="28" ry="24" fill="#2a2a2a" />
    {/* dots on forehead (curly hair / poll) */}
    {[
      [100,62],[108,58],[116,62],[104,70],[112,68],[120,66],
      [96,68],[106,54],[114,54],[122,58],[118,72],[98,74]
    ].map(([cx,cy],i) => (
      <circle key={i} cx={cx} cy={cy} r="3" fill="#1a1a1a" stroke="#e0e0e0" strokeWidth="0.8" />
    ))}

    {/* left ear */}
    <ellipse cx="58" cy="100" rx="12" ry="16" fill="#1a1a1a" />

    {/* right ear */}
    <ellipse cx="162" cy="100" rx="12" ry="16" fill="#1a1a1a" />

    {/* face - lighter area around muzzle */}
    <ellipse cx="110" cy="118" rx="38" ry="30" fill="#2e2e2e" />

    {/* eyes - white with dark pupils */}
    <ellipse cx="90" cy="104" rx="11" ry="12" fill="white" />
    <ellipse cx="130" cy="104" rx="11" ry="12" fill="white" />
    <circle cx="91" cy="106" r="7" fill="#111" />
    <circle cx="131" cy="106" r="7" fill="#111" />
    <circle cx="89" cy="103" r="2.5" fill="white" />
    <circle cx="129" cy="103" r="2.5" fill="white" />

    {/* muzzle / snout - cream/beige large oval */}
    <ellipse cx="110" cy="128" rx="30" ry="20" fill="#d4b07a" />
    {/* nostrils */}
    <ellipse cx="101" cy="130" rx="7" ry="5" fill="#b08050" />
    <ellipse cx="119" cy="130" rx="7" ry="5" fill="#b08050" />

    {/* mouth line */}
    <path d="M 100 138 Q 110 143 120 138" stroke="#8a6030" strokeWidth="2" fill="none" strokeLinecap="round" />

    {/* "RUGBY BANCO" text - bold blue at bottom */}
    <text
      x="110" y="196"
      textAnchor="middle"
      fontFamily="'Arial Black', Arial, sans-serif"
      fontSize="17"
      fontWeight="900"
      fill="#2255bb"
      letterSpacing="1.5"
    >RUGBY BANCO</text>
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
