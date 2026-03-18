export default function ConcertHero() {
  return (
    <svg
      viewBox="0 0 520 148"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: '100%', height: 'auto', display: 'block' }}
    >
      {/* Ticket body */}
      <rect x="16" y="12" width="488" height="124" rx="6" fill="#fff" stroke="#e5e5e5" strokeWidth="1.5" />

      {/* Orange top accent — left section only, clipped */}
      <rect x="16" y="12" width="362" height="5" rx="0" fill="#ea580c" />
      <rect x="16" y="12" width="6" height="5" rx="0" fill="#ea580c" />   {/* cover left corner gap */}

      {/* Perforation notch circles */}
      <circle cx="378" cy="12"  r="9" fill="#fafafa" stroke="#e5e5e5" strokeWidth="1.5" />
      <circle cx="378" cy="136" r="9" fill="#fafafa" stroke="#e5e5e5" strokeWidth="1.5" />

      {/* Dashed perforation line */}
      <line x1="378" y1="21" x2="378" y2="127" stroke="#ddd" strokeWidth="1" strokeDasharray="4 3" />

      {/* ── Left section ── */}

      {/* Label */}
      <text x="36" y="38" fontFamily="Noto Sans KR, sans-serif" fontSize="9" fontWeight="700"
        fill="#bbb" letterSpacing="2">CONCERT TICKET</text>

      {/* Main title */}
      <text x="36" y="72" fontFamily="Noto Sans KR, sans-serif" fontSize="28" fontWeight="800" fill="#ea580c">가자!</text>
      <text x="116" y="72" fontFamily="Noto Sans KR, sans-serif" fontSize="28" fontWeight="800" fill="#111">콘서트</text>

      {/* Date + venue */}
      <text x="36" y="96" fontFamily="JetBrains Mono, monospace" fontSize="11" fontWeight="500" fill="#555">
        2026.04.01  19:00
      </text>
      <text x="36" y="114" fontFamily="Noto Sans KR, sans-serif" fontSize="11" fontWeight="500" fill="#888">
        연습 홀 · 서울
      </text>

      {/* ── Right stub ── */}

      {/* Section label */}
      <text x="400" y="46" fontFamily="Noto Sans KR, sans-serif" fontSize="9" fontWeight="700"
        fill="#bbb" letterSpacing="1.5" textAnchor="middle">구역</text>

      {/* Section letter */}
      <text x="400" y="82" fontFamily="JetBrains Mono, monospace" fontSize="36" fontWeight="700"
        fill="#ea580c" textAnchor="middle">A</text>

      {/* Seat info */}
      <text x="400" y="100" fontFamily="JetBrains Mono, monospace" fontSize="10" fontWeight="500"
        fill="#888" textAnchor="middle">3열  7번</text>

      {/* Mini barcode */}
      {[0,1,2,3,4,5,6,7,8,9,10,11].map((i) => (
        <rect key={i} x={384 + i * (i % 3 === 0 ? 3 : 2)} y="112" width={i % 3 === 0 ? 2 : 1} height="14"
          rx="0.5" fill={i % 3 === 0 ? '#bbb' : '#ddd'} />
      ))}
    </svg>
  )
}
