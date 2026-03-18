export default function ConcertHero() {
  return (
    <svg
      viewBox="0 0 520 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: '100%', height: 'auto', display: 'block' }}
    >
      {/* Stage platform */}
      <rect x="160" y="20" width="200" height="10" rx="2" fill="#111" />
      <rect x="180" y="30" width="160" height="6" rx="1" fill="#333" />

      {/* Left spotlight beam */}
      <polygon points="185,30 148,110 210,110" fill="#ea580c" fillOpacity="0.10" />
      <line x1="185" y1="30" x2="148" y2="110" stroke="#ea580c" strokeOpacity="0.35" strokeWidth="1" />
      <line x1="185" y1="30" x2="210" y2="110" stroke="#ea580c" strokeOpacity="0.35" strokeWidth="1" />

      {/* Right spotlight beam */}
      <polygon points="335,30 310,110 372,110" fill="#ea580c" fillOpacity="0.10" />
      <line x1="335" y1="30" x2="310" y2="110" stroke="#ea580c" strokeOpacity="0.35" strokeWidth="1" />
      <line x1="335" y1="30" x2="372" y2="110" stroke="#ea580c" strokeOpacity="0.35" strokeWidth="1" />

      {/* Spotlight sources */}
      <circle cx="185" cy="24" r="5" fill="#ea580c" />
      <circle cx="335" cy="24" r="5" fill="#ea580c" />

      {/* Seat rows — row 1 */}
      {[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19].map((i) => {
        const x = 60 + i * 22
        const filled = [2,3,5,7,8,10,12,13,15,17].includes(i)
        return (
          <rect key={`r1-${i}`} x={x} y={118} width="14" height="10" rx="2"
            fill={filled ? '#111' : '#e5e5e5'} />
        )
      })}

      {/* Seat rows — row 2 */}
      {[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19].map((i) => {
        const x = 60 + i * 22
        const filled = [0,1,3,4,6,7,9,11,12,14,16,18,19].includes(i)
        return (
          <rect key={`r2-${i}`} x={x} y={134} width="14" height="10" rx="2"
            fill={filled ? '#111' : '#e5e5e5'} />
        )
      })}

      {/* Seat rows — row 3 */}
      {[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19].map((i) => {
        const x = 60 + i * 22
        const filled = [1,2,4,5,6,8,9,10,12,13,15,16,17,19].includes(i)
        return (
          <rect key={`r3-${i}`} x={x} y={150} width="14" height="10" rx="2"
            fill={filled ? '#222' : '#e5e5e5'} />
        )
      })}

      {/* Floor line */}
      <line x1="40" y1="166" x2="480" y2="166" stroke="#e5e5e5" strokeWidth="1" />
    </svg>
  )
}
