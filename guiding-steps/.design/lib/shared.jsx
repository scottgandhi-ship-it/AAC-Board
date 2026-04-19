// Shared utilities and icons used across all three directions.
// Keeps icons as clean flat SVG (user asked to keep simple flat icons, cleaner).

// ─── Flat step icons ────────────────────────────────────────
// Each takes { size=56, palette } where palette is per-direction color tokens.
// The goal: same silhouettes, different treatments per direction.

const Icons = {
  sun: (p) => (
    <svg viewBox="0 0 64 64" width={p.size} height={p.size} fill="none">
      <circle cx="32" cy="32" r="11" fill={p.warm} />
      <g stroke={p.warm} strokeWidth="3.2" strokeLinecap="round">
        <line x1="32" y1="8"  x2="32" y2="15" />
        <line x1="32" y1="49" x2="32" y2="56" />
        <line x1="8"  y1="32" x2="15" y2="32" />
        <line x1="49" y1="32" x2="56" y2="32" />
        <line x1="15" y1="15" x2="20" y2="20" />
        <line x1="44" y1="44" x2="49" y2="49" />
        <line x1="49" y1="15" x2="44" y2="20" />
        <line x1="15" y1="49" x2="20" y2="44" />
      </g>
    </svg>
  ),
  toilet: (p) => (
    <svg viewBox="0 0 64 64" width={p.size} height={p.size} fill="none">
      <rect x="14" y="20" width="36" height="22" rx="6" fill={p.neutral} />
      <rect x="18" y="42" width="28" height="12" rx="3" fill={p.neutralDeep} />
      <ellipse cx="32" cy="26" rx="12" ry="4" fill={p.neutralDeep} opacity="0.4" />
    </svg>
  ),
  toothbrush: (p) => (
    <svg viewBox="0 0 64 64" width={p.size} height={p.size} fill="none">
      <rect x="27" y="8" width="10" height="32" rx="3" fill={p.cool} />
      <rect x="24" y="38" width="16" height="8" rx="2" fill={p.neutral} />
      <rect x="25" y="46" width="14" height="12" rx="3" fill={p.neutralDeep} />
    </svg>
  ),
  pajamas: (p) => (
    <svg viewBox="0 0 64 64" width={p.size} height={p.size} fill="none">
      <path d="M20 14 L32 10 L44 14 L46 26 L42 28 L42 54 L22 54 L22 28 L18 26 Z" fill={p.accent} />
      <circle cx="32" cy="30" r="1.8" fill={p.accentDeep} />
      <circle cx="32" cy="38" r="1.8" fill={p.accentDeep} />
      <circle cx="32" cy="46" r="1.8" fill={p.accentDeep} />
    </svg>
  ),
  book: (p) => (
    <svg viewBox="0 0 64 64" width={p.size} height={p.size} fill="none">
      <rect x="10" y="14" width="44" height="36" rx="3" fill={p.warm} />
      <line x1="32" y1="14" x2="32" y2="50" stroke="#fff" strokeWidth="2" opacity="0.6" />
      <line x1="16" y1="24" x2="28" y2="24" stroke="#fff" strokeWidth="1.5" opacity="0.6" />
      <line x1="16" y1="30" x2="28" y2="30" stroke="#fff" strokeWidth="1.5" opacity="0.6" />
      <line x1="36" y1="24" x2="48" y2="24" stroke="#fff" strokeWidth="1.5" opacity="0.6" />
      <line x1="36" y1="30" x2="48" y2="30" stroke="#fff" strokeWidth="1.5" opacity="0.6" />
    </svg>
  ),
  lightbulb: (p) => (
    <svg viewBox="0 0 64 64" width={p.size} height={p.size} fill="none">
      <path d="M32 10 C22 10 16 17 16 26 C16 32 20 36 23 40 L23 44 L41 44 L41 40 C44 36 48 32 48 26 C48 17 42 10 32 10 Z" fill={p.warm} />
      <rect x="24" y="46" width="16" height="5" rx="1.5" fill={p.neutralDeep} />
      <rect x="26" y="52" width="12" height="4" rx="1.5" fill={p.neutralDeep} />
    </svg>
  ),
  heart: (p) => (
    <svg viewBox="0 0 64 64" width={p.size} height={p.size} fill="none">
      <path d="M32 52 C10 36 10 18 22 18 C28 18 32 22 32 26 C32 22 36 18 42 18 C54 18 54 36 32 52 Z" fill={p.accent} />
    </svg>
  ),
  store: (p) => (
    <svg viewBox="0 0 120 120" width={p.size} height={p.size} fill="none">
      <rect x="20" y="40" width="80" height="60" rx="4" fill={p.coolPale} stroke={p.cool} strokeWidth="4" />
      <rect x="30" y="52" width="16" height="16" rx="2" fill={p.coolPale} stroke={p.cool} strokeWidth="3" />
      <rect x="52" y="52" width="16" height="16" rx="2" fill={p.coolPale} stroke={p.cool} strokeWidth="3" />
      <rect x="74" y="52" width="16" height="16" rx="2" fill={p.coolPale} stroke={p.cool} strokeWidth="3" />
      <rect x="48" y="74" width="24" height="26" rx="2" fill={p.cool} />
    </svg>
  ),
  house: (p) => (
    <svg viewBox="0 0 120 120" width={p.size} height={p.size} fill="none">
      <path d="M20 58 L60 26 L100 58 L100 100 L20 100 Z" fill={p.warmPale} stroke={p.warm} strokeWidth="4" strokeLinejoin="round"/>
      <rect x="50" y="66" width="20" height="34" fill={p.warm} />
      <rect x="30" y="66" width="14" height="14" fill={p.warmPale} stroke={p.warm} strokeWidth="3"/>
      <rect x="76" y="66" width="14" height="14" fill={p.warmPale} stroke={p.warm} strokeWidth="3"/>
    </svg>
  ),
  scissors: (p) => (
    <svg viewBox="0 0 120 120" width={p.size} height={p.size} fill="none">
      <circle cx="38" cy="36" r="12" fill={p.accent} />
      <circle cx="38" cy="84" r="12" fill={p.accent} />
      <circle cx="38" cy="36" r="5" fill={p.coolPale} />
      <circle cx="38" cy="84" r="5" fill={p.coolPale} />
      <path d="M50 42 L94 66 M50 78 L94 54" stroke={p.neutralDeep} strokeWidth="5" strokeLinecap="round"/>
    </svg>
  ),
};

// Tab icons — outlined, slightly different per direction weight
const TabIcons = {
  schedule: (c, w=2) => (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none">
      <line x1="5" y1="7" x2="7" y2="7" stroke={c} strokeWidth={w} strokeLinecap="round"/>
      <line x1="5" y1="12" x2="7" y2="12" stroke={c} strokeWidth={w} strokeLinecap="round"/>
      <line x1="5" y1="17" x2="7" y2="17" stroke={c} strokeWidth={w} strokeLinecap="round"/>
      <line x1="10" y1="7" x2="19" y2="7" stroke={c} strokeWidth={w} strokeLinecap="round"/>
      <line x1="10" y1="12" x2="19" y2="12" stroke={c} strokeWidth={w} strokeLinecap="round"/>
      <line x1="10" y1="17" x2="19" y2="17" stroke={c} strokeWidth={w} strokeLinecap="round"/>
    </svg>
  ),
  steps: (c, w=2, fill) => (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none">
      <path d="M12 3 L14.5 9 L21 9.5 L16 14 L17.5 20.5 L12 17 L6.5 20.5 L8 14 L3 9.5 L9.5 9 Z"
        stroke={c} strokeWidth={w} strokeLinejoin="round" fill={fill || 'none'}/>
    </svg>
  ),
  stories: (c, w=2, fill) => (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none">
      <rect x="5" y="3" width="14" height="18" rx="2" stroke={c} strokeWidth={w} fill={fill || 'none'}/>
      <line x1="9" y1="3" x2="9" y2="21" stroke={c} strokeWidth={w}/>
    </svg>
  ),
  settings: (c, w=2) => (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none">
      <circle cx="12" cy="12" r="3" stroke={c} strokeWidth={w}/>
      <path d="M12 2 L13 5 M12 22 L13 19 M22 12 L19 13 M2 12 L5 13 M19 5 L17 7 M5 19 L7 17 M19 19 L17 17 M5 5 L7 7"
        stroke={c} strokeWidth={w} strokeLinecap="round"/>
    </svg>
  ),
  check: (c, w=3) => (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none">
      <path d="M5 12 L10 17 L19 7" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  close: (c, w=2) => (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
      <path d="M6 6 L18 18 M18 6 L6 18" stroke={c} strokeWidth={w} strokeLinecap="round"/>
    </svg>
  ),
  print: (c, w=2) => (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
      <rect x="6" y="3" width="12" height="6" stroke={c} strokeWidth={w}/>
      <rect x="4" y="9" width="16" height="9" rx="2" stroke={c} strokeWidth={w}/>
      <rect x="7" y="14" width="10" height="6" stroke={c} strokeWidth={w}/>
    </svg>
  ),
  speaker: (c, w=2) => (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none">
      <path d="M4 9 L9 9 L14 5 L14 19 L9 15 L4 15 Z" stroke={c} strokeWidth={w} strokeLinejoin="round" fill={c} fillOpacity="0.15"/>
      <path d="M17 9 Q19 12 17 15" stroke={c} strokeWidth={w} strokeLinecap="round" fill="none"/>
    </svg>
  ),
  chevronL: (c, w=2.5) => (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
      <path d="M15 5 L8 12 L15 19" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  chevronR: (c, w=2.5) => (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
      <path d="M9 5 L16 12 L9 19" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  plus: (c, w=3) => (
    <svg viewBox="0 0 24 24" width="28" height="28" fill="none">
      <line x1="12" y1="5" x2="12" y2="19" stroke={c} strokeWidth={w} strokeLinecap="round"/>
      <line x1="5" y1="12" x2="19" y2="12" stroke={c} strokeWidth={w} strokeLinecap="round"/>
    </svg>
  ),
};

// Phone shell: rounded device-style rectangle, 390x844, bezel optional.
function Phone({ bg, children, label }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{
        width: 390, height: 844,
        borderRadius: 48,
        overflow: 'hidden',
        position: 'relative',
        background: bg,
        boxShadow: '0 0 0 10px #1a1a1a, 0 0 0 12px #2a2a2a, 0 40px 80px rgba(0,0,0,0.18)',
        fontFamily: 'inherit',
      }}>
        {/* dynamic island */}
        <div style={{
          position: 'absolute', top: 10, left: '50%', transform: 'translateX(-50%)',
          width: 120, height: 34, borderRadius: 24, background: '#000', zIndex: 50,
        }} />
        {children}
        {/* home indicator */}
        <div style={{
          position: 'absolute', bottom: 6, left: '50%', transform: 'translateX(-50%)',
          width: 134, height: 5, borderRadius: 99, background: 'rgba(0,0,0,0.3)', zIndex: 60,
        }} />
      </div>
      {label && (
        <div style={{
          marginTop: 16, fontSize: 13, fontWeight: 500,
          color: 'rgba(40,30,20,0.6)', letterSpacing: 0.1,
          fontFamily: '-apple-system, system-ui',
        }}>{label}</div>
      )}
    </div>
  );
}

// Status bar — minimal; time on left, signal/wifi/battery on right
function StatusBar({ color = '#000', time = '11:41' }) {
  return (
    <div style={{
      position: 'absolute', top: 0, left: 0, right: 0, height: 54,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '18px 28px 0', zIndex: 40, pointerEvents: 'none',
      fontFamily: '-apple-system, "SF Pro", system-ui',
    }}>
      <div style={{ fontSize: 16, fontWeight: 600, color }}>{time}</div>
      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
        {/* signal */}
        <svg width="17" height="11" viewBox="0 0 17 11"><g fill={color}>
          <rect x="0" y="7" width="3" height="4" rx="0.5"/>
          <rect x="4.5" y="5" width="3" height="6" rx="0.5"/>
          <rect x="9" y="3" width="3" height="8" rx="0.5"/>
          <rect x="13.5" y="1" width="3" height="10" rx="0.5"/>
        </g></svg>
        {/* wifi */}
        <svg width="16" height="11" viewBox="0 0 16 11" fill="none">
          <path d="M8 3 Q12 3 15 6" stroke={color} strokeWidth="1.6" fill="none" strokeLinecap="round"/>
          <path d="M8 6 Q10.5 6 12.5 8" stroke={color} strokeWidth="1.6" fill="none" strokeLinecap="round"/>
          <circle cx="8" cy="10" r="1.1" fill={color}/>
        </svg>
        {/* battery */}
        <svg width="26" height="11" viewBox="0 0 26 11" fill="none">
          <rect x="0.5" y="0.5" width="22" height="10" rx="2.5" stroke={color} strokeOpacity="0.5"/>
          <rect x="2" y="2" width="19" height="7" rx="1" fill={color}/>
          <rect x="23.5" y="4" width="1.5" height="3" rx="0.5" fill={color} fillOpacity="0.5"/>
        </svg>
      </div>
    </div>
  );
}

Object.assign(window, { Icons, TabIcons, Phone, StatusBar });
