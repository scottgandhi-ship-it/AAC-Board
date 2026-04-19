
// ====== lib/design-canvas.jsx ======

// DesignCanvas.jsx — Figma-ish design canvas wrapper
// Warm gray grid bg + Sections + Artboards + PostIt notes.
// No assets, no deps.

const DC = {
  bg: '#f0eee9',
  grid: 'rgba(0,0,0,0.06)',
  label: 'rgba(60,50,40,0.7)',
  title: 'rgba(40,30,20,0.85)',
  subtitle: 'rgba(60,50,40,0.6)',
  postitBg: '#fef4a8',
  postitText: '#5a4a2a',
  font: '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
};

// ─────────────────────────────────────────────────────────────
// Main canvas — transform-based pan/zoom viewport
//
// Input mapping (Figma-style):
//   • trackpad pinch  → zoom   (ctrlKey wheel; Safari gesture* events)
//   • trackpad scroll → pan    (two-finger)
//   • mouse wheel     → zoom   (notched; distinguished from trackpad scroll)
//   • middle-drag / primary-drag-on-bg → pan
//
// Transform state lives in a ref and is written straight to the DOM
// (translate3d + will-change) so wheel ticks don't go through React —
// keeps pans at 60fps on dense canvases.
// ─────────────────────────────────────────────────────────────
function DesignCanvas({ children, minScale = 0.1, maxScale = 8, style = {} }) {
  const vpRef = React.useRef(null);
  const worldRef = React.useRef(null);
  const tf = React.useRef({ x: 0, y: 0, scale: 1 });

  const apply = React.useCallback(() => {
    const { x, y, scale } = tf.current;
    const el = worldRef.current;
    if (el) el.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
  }, []);

  React.useEffect(() => {
    const vp = vpRef.current;
    if (!vp) return;

    const zoomAt = (cx, cy, factor) => {
      const r = vp.getBoundingClientRect();
      const px = cx - r.left, py = cy - r.top;
      const t = tf.current;
      const next = Math.min(maxScale, Math.max(minScale, t.scale * factor));
      const k = next / t.scale;
      // keep the world point under the cursor fixed
      t.x = px - (px - t.x) * k;
      t.y = py - (py - t.y) * k;
      t.scale = next;
      apply();
    };

    // Mouse-wheel vs trackpad-scroll heuristic. A physical wheel sends
    // line-mode deltas (Firefox) or large integer pixel deltas with no X
    // component (Chrome/Safari, typically multiples of 100/120). Trackpad
    // two-finger scroll sends small/fractional pixel deltas, often with
    // non-zero deltaX. ctrlKey is set by the browser for trackpad pinch.
    const isMouseWheel = (e) =>
      e.deltaMode !== 0 ||
      (e.deltaX === 0 && Number.isInteger(e.deltaY) && Math.abs(e.deltaY) >= 40);

    const onWheel = (e) => {
      e.preventDefault();
      if (isGesturing) return; // Safari: gesture* owns the pinch — discard concurrent wheels
      if (e.ctrlKey) {
        // trackpad pinch (or explicit ctrl+wheel)
        zoomAt(e.clientX, e.clientY, Math.exp(-e.deltaY * 0.01));
      } else if (isMouseWheel(e)) {
        // notched mouse wheel — fixed-ratio step per click
        zoomAt(e.clientX, e.clientY, Math.exp(-Math.sign(e.deltaY) * 0.18));
      } else {
        // trackpad two-finger scroll — pan
        tf.current.x -= e.deltaX;
        tf.current.y -= e.deltaY;
        apply();
      }
    };

    // Safari sends native gesture* events for trackpad pinch with a smooth
    // e.scale; preferring these over the ctrl+wheel fallback gives a much
    // better feel there. No-ops on other browsers. Safari also fires
    // ctrlKey wheel events during the same pinch — isGesturing makes
    // onWheel drop those entirely so they neither zoom nor pan.
    let gsBase = 1;
    let isGesturing = false;
    const onGestureStart = (e) => { e.preventDefault(); isGesturing = true; gsBase = tf.current.scale; };
    const onGestureChange = (e) => {
      e.preventDefault();
      zoomAt(e.clientX, e.clientY, (gsBase * e.scale) / tf.current.scale);
    };
    const onGestureEnd = (e) => { e.preventDefault(); isGesturing = false; };

    // Drag-pan: middle button anywhere, or primary button starting on the
    // canvas background (not inside an artboard).
    let drag = null;
    const onPointerDown = (e) => {
      const onBg = e.target === vp || e.target === worldRef.current;
      if (!(e.button === 1 || (e.button === 0 && onBg))) return;
      e.preventDefault();
      vp.setPointerCapture(e.pointerId);
      drag = { id: e.pointerId, lx: e.clientX, ly: e.clientY };
      vp.style.cursor = 'grabbing';
    };
    const onPointerMove = (e) => {
      if (!drag || e.pointerId !== drag.id) return;
      tf.current.x += e.clientX - drag.lx;
      tf.current.y += e.clientY - drag.ly;
      drag.lx = e.clientX; drag.ly = e.clientY;
      apply();
    };
    const onPointerUp = (e) => {
      if (!drag || e.pointerId !== drag.id) return;
      vp.releasePointerCapture(e.pointerId);
      drag = null;
      vp.style.cursor = '';
    };

    vp.addEventListener('wheel', onWheel, { passive: false });
    vp.addEventListener('gesturestart', onGestureStart, { passive: false });
    vp.addEventListener('gesturechange', onGestureChange, { passive: false });
    vp.addEventListener('gestureend', onGestureEnd, { passive: false });
    vp.addEventListener('pointerdown', onPointerDown);
    vp.addEventListener('pointermove', onPointerMove);
    vp.addEventListener('pointerup', onPointerUp);
    vp.addEventListener('pointercancel', onPointerUp);
    return () => {
      vp.removeEventListener('wheel', onWheel);
      vp.removeEventListener('gesturestart', onGestureStart);
      vp.removeEventListener('gesturechange', onGestureChange);
      vp.removeEventListener('gestureend', onGestureEnd);
      vp.removeEventListener('pointerdown', onPointerDown);
      vp.removeEventListener('pointermove', onPointerMove);
      vp.removeEventListener('pointerup', onPointerUp);
      vp.removeEventListener('pointercancel', onPointerUp);
    };
  }, [apply, minScale, maxScale]);

  const gridSvg = `url("data:image/svg+xml,%3Csvg width='120' height='120' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M120 0H0v120' fill='none' stroke='${encodeURIComponent(DC.grid)}' stroke-width='1'/%3E%3C/svg%3E")`;
  return (
    <div
      ref={vpRef}
      className="design-canvas"
      style={{
        height: '100vh', width: '100vw',
        background: DC.bg,
        overflow: 'hidden',
        overscrollBehavior: 'none',
        touchAction: 'none',
        position: 'relative',
        fontFamily: DC.font,
        boxSizing: 'border-box',
        ...style,
      }}
    >
      <div
        ref={worldRef}
        style={{
          position: 'absolute', top: 0, left: 0,
          transformOrigin: '0 0',
          willChange: 'transform',
          width: 'max-content', minWidth: '100%',
          minHeight: '100%',
          padding: '60px 0 80px',
          backgroundImage: gridSvg,
          backgroundSize: '120px 120px',
        }}
      >
        {children}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Section — title + subtitle + h-stack of artboards (no wrap)
// ─────────────────────────────────────────────────────────────
function DCSection({ title, subtitle, children, gap = 48 }) {
  return (
    <div style={{ marginBottom: 80, position: 'relative' }}>
      <div style={{ padding: '0 60px 36px' }}>
        <div style={{
          fontSize: 22, fontWeight: 600, color: DC.title,
          letterSpacing: -0.3, marginBottom: 4,
        }}>{title}</div>
        {subtitle && (
          <div style={{
            fontSize: 14, fontWeight: 400, color: DC.subtitle,
          }}>{subtitle}</div>
        )}
      </div>
      {/* h-stack — clips offscreen, never wraps */}
      <div style={{
        display: 'flex', gap, padding: '0 60px',
        alignItems: 'flex-start', width: 'max-content',
      }}>
        {children}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Artboard — labeled card
// ─────────────────────────────────────────────────────────────
function DCArtboard({ label, children, width, height, style = {} }) {
  return (
    <div style={{ position: 'relative', flexShrink: 0 }}>
      {label && (
        <div style={{
          position: 'absolute', bottom: '100%', left: 0,
          paddingBottom: 8,
          fontSize: 12, fontWeight: 500, color: DC.label,
          whiteSpace: 'nowrap',
        }}>{label}</div>
      )}
      <div style={{
        borderRadius: 2,
        boxShadow: '0 1px 3px rgba(0,0,0,0.08), 0 4px 16px rgba(0,0,0,0.06)',
        overflow: 'hidden',
        width, height,
        background: '#fff',
        ...style,
      }}>
        {children}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Post-it — absolute-positioned sticky note
// ─────────────────────────────────────────────────────────────
function DCPostIt({ children, top, left, right, bottom, rotate = -2, width = 180 }) {
  return (
    <div style={{
      position: 'absolute', top, left, right, bottom, width,
      background: DC.postitBg, padding: '14px 16px',
      fontFamily: '"Comic Sans MS", "Marker Felt", "Segoe Print", cursive',
      fontSize: 14, lineHeight: 1.4, color: DC.postitText,
      boxShadow: '0 2px 8px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.08)',
      transform: `rotate(${rotate}deg)`,
      zIndex: 5,
    }}>{children}</div>
  );
}

Object.assign(window, { DesignCanvas, DCSection, DCArtboard, DCPostIt });



// ====== lib/shared.jsx ======
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


// ====== lib/direction-a.jsx ======
// Direction A — "Warm Sunrise"
// Warm & encouraging. Soft butter/apricot gradients, cream cards, rounded serif display + Nunito body.
// Progress: filled dots with a leading "rising sun" path.
// Done affordance: big tappable card w/ green badge that fills on hold.

const A = {
  // palette
  bg: 'linear-gradient(180deg, #FFF4E6 0%, #FFE6D5 55%, #FFD7C2 100%)',
  bgSolid: '#FFF4E6',
  card: '#FFFFFF',
  cardActive: '#FFEDD8',
  ink: '#2C2416',
  inkSoft: '#6B5B47',
  inkMuted: '#A59887',
  accent: '#E8824A',       // apricot
  accentDeep: '#C45A1F',
  accentSoft: '#FCE2D1',
  success: '#4A8F3C',      // sage green
  successSoft: '#DFEED9',
  lavender: '#9B7BB8',     // schedule header color (warm purple)
  hair: 'rgba(90,60,30,0.08)',
  shadow: '0 1px 2px rgba(184,115,51,0.05), 0 6px 20px rgba(184,115,51,0.08)',
  shadowLg: '0 2px 4px rgba(184,115,51,0.06), 0 16px 40px rgba(184,115,51,0.12)',

  // icon palette
  iconPalette: {
    warm: '#E8824A', warmPale: '#FCE2D1',
    cool: '#6B8E7F', coolPale: '#DCE8DE',
    accent: '#B87BA8', accentDeep: '#7A4E70',
    neutral: '#E5DCC8', neutralDeep: '#B8A789',
  },

  // type
  fontDisplay: '"Fraunces", "Playfair Display", Georgia, serif',
  fontBody: '"Nunito", -apple-system, system-ui, sans-serif',
};

function DirA_TopBar({ title, subtitle }) {
  return (
    <div style={{
      padding: '58px 20px 12px', position: 'relative',
      textAlign: 'center',
    }}>
      <div style={{
        fontFamily: A.fontDisplay, fontWeight: 500, fontStyle: 'italic',
        fontSize: 30, color: A.accentDeep, letterSpacing: -0.4,
        lineHeight: 1.1,
      }}>{title}</div>
      {subtitle && (
        <div style={{
          fontFamily: A.fontBody, fontSize: 14, color: A.inkSoft,
          fontWeight: 500, marginTop: 4, letterSpacing: 0.2,
        }}>{subtitle}</div>
      )}
    </div>
  );
}

// Routine header — progress dots + title
function DirA_RoutineHeader({ title, step, total }) {
  return (
    <div style={{ padding: '8px 24px 18px' }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14,
      }}>
        {/* sun icon */}
        <svg viewBox="0 0 40 40" width="32" height="32">
          <circle cx="20" cy="20" r="7" fill={A.accent}/>
          <g stroke={A.accent} strokeWidth="2.2" strokeLinecap="round">
            <line x1="20" y1="4" x2="20" y2="9"/>
            <line x1="20" y1="31" x2="20" y2="36"/>
            <line x1="4" y1="20" x2="9" y2="20"/>
            <line x1="31" y1="20" x2="36" y2="20"/>
            <line x1="9" y1="9" x2="12" y2="12"/>
            <line x1="28" y1="28" x2="31" y2="31"/>
            <line x1="31" y1="9" x2="28" y2="12"/>
            <line x1="9" y1="31" x2="12" y2="28"/>
          </g>
        </svg>
        <div>
          <div style={{
            fontFamily: A.fontDisplay, fontWeight: 600, fontSize: 22,
            color: A.ink, letterSpacing: -0.3, lineHeight: 1.1,
          }}>{title}</div>
          <div style={{
            fontFamily: A.fontBody, fontSize: 13, color: A.inkSoft,
            fontWeight: 600, marginTop: 2,
          }}>Step {step} of {total}</div>
        </div>
      </div>
      {/* dot progress */}
      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
        {Array.from({length: total}).map((_, i) => (
          <div key={i} style={{
            flex: i < step ? '0 0 18px' : 1,
            height: 8, borderRadius: 99,
            background: i < step ? A.accent : (i === step-1 ? 'none' : A.accentSoft),
          }} />
        ))}
      </div>
    </div>
  );
}

// Step row
function DirA_StepRow({ icon, label, active, done, last }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 16,
      padding: '16px 18px', borderRadius: 24,
      background: active ? A.cardActive : A.card,
      border: active ? `2px solid ${A.accent}` : `1px solid ${A.hair}`,
      boxShadow: active ? A.shadowLg : A.shadow,
      marginBottom: 12, position: 'relative',
      opacity: done ? 0.6 : 1,
    }}>
      {/* icon tile */}
      <div style={{
        width: 64, height: 64, borderRadius: 18,
        background: active ? '#FFFFFF' : A.bgSolid,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        {icon}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{
          fontFamily: A.fontBody, fontWeight: 700, fontSize: 19,
          color: A.ink, letterSpacing: -0.2,
          textDecoration: done ? 'line-through' : 'none',
        }}>{label}</div>
      </div>
      {active && (
        <div style={{
          width: 56, height: 56, borderRadius: 99,
          background: A.success, display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 2px 8px rgba(74,143,60,0.3)',
          color: 'white', fontFamily: A.fontDisplay,
          fontWeight: 600, fontSize: 16, letterSpacing: -0.2,
          fontStyle: 'italic',
        }}>Done!</div>
      )}
      {done && !active && (
        <div style={{
          width: 32, height: 32, borderRadius: 99,
          background: A.success, display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          {TabIcons.check('#fff', 3)}
        </div>
      )}
    </div>
  );
}

// Tab bar
function DirA_TabBar({ active = 'schedule' }) {
  const tab = (key, Icon, label) => {
    const isActive = key === active;
    const color = isActive ? A.accentDeep : A.inkMuted;
    return (
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', gap: 4, padding: '8px 0',
      }}>
        <div style={{
          padding: isActive ? '4px 14px' : 0,
          borderRadius: 99,
          background: isActive ? A.accentSoft : 'none',
        }}>
          <Icon />
        </div>
        <div style={{
          fontFamily: A.fontBody, fontSize: 11, fontWeight: isActive ? 700 : 600,
          color, letterSpacing: 0.1,
        }}>{label}</div>
      </div>
    );
  };
  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0,
      background: 'rgba(255,250,240,0.92)',
      backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
      borderTop: `1px solid ${A.hair}`,
      padding: '4px 12px 20px', display: 'flex',
      zIndex: 30,
    }}>
      {tab('schedule', () => TabIcons.schedule(active==='schedule'?A.accentDeep:A.inkMuted, 2), 'Today')}
      {tab('steps', () => TabIcons.steps(active==='steps'?A.accentDeep:A.inkMuted, 2, active==='steps'?A.accentDeep:'none'), 'Steps')}
      {tab('stories', () => TabIcons.stories(active==='stories'?A.accentDeep:A.inkMuted, 2, active==='stories'?A.accentDeep:'none'), 'Stories')}
      {tab('settings', () => TabIcons.settings(active==='settings'?A.accentDeep:A.inkMuted, 2), 'Settings')}
    </div>
  );
}

// ─── SCREEN 1: Schedule (Morning Routine) ────────────────────
function DirA_Schedule() {
  const P = A.iconPalette;
  return (
    <Phone bg={A.bg} label="A · Schedule">
      <StatusBar color={A.ink} />
      <div style={{ fontFamily: A.fontBody }}>
        <DirA_TopBar title="Today" subtitle="Tuesday · April 19" />
        <DirA_RoutineHeader title="Morning Routine" step={1} total={5} />
        <div style={{ padding: '0 20px', paddingBottom: 180 }}>
          <DirA_StepRow active icon={Icons.sun({ size: 44, ...P })} label="Wake up" />
          <DirA_StepRow icon={Icons.toilet({ size: 44, ...P })} label="Go potty" />
          <DirA_StepRow icon={Icons.toothbrush({ size: 44, ...P })} label="Brush teeth" />
          <DirA_StepRow icon={<div style={{width:44,height:44,borderRadius:10,background:P.warmPale,display:'flex',alignItems:'center',justifyContent:'center'}}><svg viewBox="0 0 40 40" width="28" height="28"><path d="M8 22 L20 8 L32 22 L28 22 L28 32 L12 32 L12 22 Z" fill={P.warm} stroke={P.warm} strokeWidth="0" strokeLinejoin="round"/><rect x="17" y="24" width="6" height="8" fill="#fff"/></svg></div>} label="Get dressed" />
          <DirA_StepRow icon={<div style={{width:44,height:44,borderRadius:10,background:P.warmPale,display:'flex',alignItems:'center',justifyContent:'center',fontSize:24}}>🥣</div>} label="Eat breakfast" last />
        </div>
      </div>
      <div style={{
        position: 'absolute', bottom: 96, left: 20, right: 20,
        display: 'flex', gap: 10, zIndex: 25,
      }}>
        <button style={{
          flex: 1, padding: '13px 16px', borderRadius: 16,
          background: A.card, border: `1px solid ${A.hair}`,
          fontFamily: A.fontBody, fontWeight: 700, fontSize: 14,
          color: A.accentDeep, boxShadow: A.shadow,
        }}>Set up</button>
        <button style={{
          flex: 1, padding: '13px 16px', borderRadius: 16,
          background: A.card, border: `1px solid ${A.hair}`,
          fontFamily: A.fontBody, fontWeight: 700, fontSize: 14,
          color: A.accentDeep, boxShadow: A.shadow,
        }}>Templates</button>
      </div>
      <DirA_TabBar active="schedule" />
    </Phone>
  );
}

// ─── SCREEN 2: Steps (Bedtime) ────────────────────────────
function DirA_Steps() {
  const P = A.iconPalette;
  return (
    <Phone bg={A.bg} label="A · Steps (Bedtime)">
      <StatusBar color={A.ink} />
      <div style={{ fontFamily: A.fontBody }}>
        <DirA_TopBar title="Steps" />
        <div style={{ padding: '0 20px 14px' }}>
          <div style={{
            fontFamily: A.fontDisplay, fontSize: 20, color: A.ink,
            fontWeight: 600, letterSpacing: -0.2,
          }}>Bedtime</div>
          <div style={{
            fontFamily: A.fontBody, fontSize: 13, color: A.inkSoft,
            fontWeight: 600,
          }}>6 steps · about 20 minutes</div>
        </div>
        <div style={{ padding: '0 20px', paddingBottom: 180 }}>
          <DirA_StepRow active icon={Icons.pajamas({ size: 44, ...P })} label="Put on pajamas" />
          <DirA_StepRow icon={Icons.toothbrush({ size: 44, ...P })} label="Brush teeth" />
          <DirA_StepRow icon={Icons.toilet({ size: 44, ...P })} label="Go potty" />
          <DirA_StepRow icon={Icons.book({ size: 44, ...P })} label="Read a book" />
          <DirA_StepRow icon={Icons.lightbulb({ size: 44, ...P })} label="Lights off" />
          <DirA_StepRow icon={Icons.heart({ size: 44, ...P })} label="Goodnight hug" last />
        </div>
      </div>
      <div style={{
        position: 'absolute', bottom: 96, left: 20, right: 20,
        display: 'flex', gap: 10, zIndex: 25,
      }}>
        <button style={{
          flex: 1, padding: '13px 12px', borderRadius: 16,
          background: A.card, border: `1px solid ${A.hair}`,
          fontFamily: A.fontBody, fontWeight: 700, fontSize: 13,
          color: A.accentDeep, boxShadow: A.shadow,
        }}>New chart</button>
        <button style={{
          flex: 1, padding: '13px 12px', borderRadius: 16,
          background: A.card, border: `1px solid ${A.hair}`,
          fontFamily: A.fontBody, fontWeight: 700, fontSize: 13,
          color: A.accentDeep, boxShadow: A.shadow,
        }}>Configure</button>
        <button style={{
          flex: 1, padding: '13px 12px', borderRadius: 16,
          background: A.accent, border: 'none',
          fontFamily: A.fontBody, fontWeight: 700, fontSize: 13,
          color: '#fff', boxShadow: A.shadow,
        }}>Start</button>
      </div>
      <DirA_TabBar active="steps" />
    </Phone>
  );
}

// ─── SCREEN 3: Stories grid ────────────────────────────
function DirA_StoryCard({ icon, title, reads, accent }) {
  return (
    <div style={{
      borderRadius: 24, background: A.card,
      overflow: 'hidden', boxShadow: A.shadow,
      border: `1px solid ${A.hair}`,
    }}>
      <div style={{
        height: 128, background: accent || A.bgSolid,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>{icon}</div>
      <div style={{ padding: 14 }}>
        <div style={{
          fontFamily: A.fontDisplay, fontSize: 17, fontWeight: 600,
          color: A.ink, letterSpacing: -0.2, lineHeight: 1.2,
        }}>{title}</div>
        {reads && (
          <div style={{
            fontFamily: A.fontBody, fontSize: 12, color: A.inkSoft,
            fontWeight: 600, marginTop: 3,
          }}>Read {reads}×</div>
        )}
        <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
          {['Edit','Share'].map(l => (
            <div key={l} style={{
              padding: '5px 10px', borderRadius: 99,
              background: A.bgSolid, fontSize: 11, fontWeight: 700,
              color: A.inkSoft, fontFamily: A.fontBody,
            }}>{l}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DirA_Stories() {
  const P = A.iconPalette;
  return (
    <Phone bg={A.bg} label="A · Stories">
      <StatusBar color={A.ink} />
      <div style={{ fontFamily: A.fontBody }}>
        <DirA_TopBar title="Stories" subtitle="Social stories for new experiences" />
        <div style={{ padding: '12px 20px', paddingBottom: 180, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <DirA_StoryCard
            icon={Icons.store({ size: 88, ...P })}
            title="Going to the Grocery Store"
            reads="3"
            accent="#F4ECDC"
          />
          <DirA_StoryCard
            icon={Icons.house({ size: 88, ...P })}
            title="First Day of School"
            reads="1"
            accent="#FDE4CF"
          />
          <DirA_StoryCard
            icon={Icons.scissors({ size: 88, ...P })}
            title="Getting a Haircut"
            accent="#F2DFE8"
          />
          {/* add new */}
          <div style={{
            borderRadius: 24, border: `2px dashed ${A.accent}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexDirection: 'column', gap: 8, minHeight: 210,
            background: 'rgba(255,255,255,0.5)',
          }}>
            <div style={{
              width: 48, height: 48, borderRadius: 99,
              background: A.accent, display: 'flex',
              alignItems: 'center', justifyContent: 'center',
            }}>{TabIcons.plus('#fff', 3)}</div>
            <div style={{
              fontFamily: A.fontDisplay, fontWeight: 600, fontStyle: 'italic',
              fontSize: 16, color: A.accentDeep,
            }}>Create story</div>
          </div>
        </div>
      </div>
      <div style={{
        position: 'absolute', bottom: 96, left: 20, right: 20,
        display: 'flex', gap: 10, zIndex: 25,
      }}>
        <button style={{
          flex: 1, padding: '14px 16px', borderRadius: 16,
          background: A.accent, border: 'none',
          fontFamily: A.fontBody, fontWeight: 700, fontSize: 14,
          color: '#fff', boxShadow: '0 4px 12px rgba(232,130,74,0.35)',
        }}>+ New story</button>
        <button style={{
          flex: 1, padding: '14px 16px', borderRadius: 16,
          background: A.card, border: `1px solid ${A.hair}`,
          fontFamily: A.fontBody, fontWeight: 700, fontSize: 14,
          color: A.accentDeep, boxShadow: A.shadow,
        }}>Import</button>
      </div>
      <DirA_TabBar active="stories" />
    </Phone>
  );
}

// ─── SCREEN 4: Story Reader ────────────────────────────
function DirA_Reader() {
  const P = A.iconPalette;
  return (
    <Phone bg="#FFF7EF" label="A · Story Reader">
      <StatusBar color={A.ink} />
      {/* top bar */}
      <div style={{
        position: 'absolute', top: 54, left: 0, right: 0,
        display: 'flex', justifyContent: 'space-between',
        padding: '12px 18px', zIndex: 20,
      }}>
        <div style={{
          width: 40, height: 40, borderRadius: 99,
          background: A.card, display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          boxShadow: A.shadow,
        }}>{TabIcons.close(A.ink, 2)}</div>
        <div style={{
          padding: '8px 14px', borderRadius: 99,
          background: A.card, fontFamily: A.fontBody,
          fontWeight: 700, fontSize: 13, color: A.accentDeep,
          boxShadow: A.shadow,
        }}>Page 1 of 7</div>
        <div style={{
          width: 40, height: 40, borderRadius: 99,
          background: A.card, display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          boxShadow: A.shadow,
        }}>{TabIcons.print(A.ink, 2)}</div>
      </div>

      {/* illustration */}
      <div style={{
        position: 'absolute', top: 130, left: 30, right: 30, height: 320,
        borderRadius: 32, background: '#F4ECDC',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: A.shadowLg,
      }}>
        {Icons.store({ size: 200, ...P })}
      </div>

      {/* speaker button */}
      <div style={{
        position: 'absolute', top: 464, right: 34,
        width: 56, height: 56, borderRadius: 99,
        background: A.accent, display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 6px 16px rgba(232,130,74,0.4)', zIndex: 20,
      }}>{TabIcons.speaker('#fff', 2.5)}</div>

      {/* text card */}
      <div style={{
        position: 'absolute', bottom: 160, left: 24, right: 24,
        padding: '22px 24px', borderRadius: 24, background: A.card,
        boxShadow: A.shadowLg, border: `1px solid ${A.hair}`,
      }}>
        <div style={{
          fontFamily: A.fontDisplay, fontSize: 24, lineHeight: 1.35,
          color: A.ink, letterSpacing: -0.3, fontWeight: 500,
        }}>Today I am going to the grocery store with Mommy.</div>
      </div>

      {/* controls */}
      <div style={{
        position: 'absolute', bottom: 40, left: 0, right: 0,
        display: 'flex', justifyContent: 'space-between',
        padding: '0 28px', alignItems: 'center', zIndex: 20,
      }}>
        <div style={{
          width: 56, height: 56, borderRadius: 99,
          background: A.card, display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          boxShadow: A.shadow, opacity: 0.5,
        }}>{TabIcons.chevronL(A.ink)}</div>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          {[0,1,2,3,4,5,6].map(i => (
            <div key={i} style={{
              width: i===0 ? 22 : 8, height: 8, borderRadius: 99,
              background: i===0 ? A.accent : A.accentSoft,
            }}/>
          ))}
        </div>
        <div style={{
          width: 56, height: 56, borderRadius: 99,
          background: A.accent, display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(232,130,74,0.4)',
        }}>{TabIcons.chevronR('#fff', 2.5)}</div>
      </div>
    </Phone>
  );
}

// ─── SCREEN 5: Schedule with settings peek ─────────────────
function DirA_ScheduleSettings() {
  const P = A.iconPalette;
  return (
    <Phone bg={A.bg} label="A · Schedule + settings tooltip">
      <StatusBar color={A.ink} />
      <div style={{ fontFamily: A.fontBody }}>
        <DirA_TopBar title="Today" subtitle="Tuesday · April 19" />
        <DirA_RoutineHeader title="Morning Routine" step={2} total={5} />
        <div style={{ padding: '0 20px', paddingBottom: 180 }}>
          <DirA_StepRow done icon={Icons.sun({ size: 44, ...P })} label="Wake up" />
          <DirA_StepRow active icon={Icons.toilet({ size: 44, ...P })} label="Go potty" />
          <DirA_StepRow icon={Icons.toothbrush({ size: 44, ...P })} label="Brush teeth" />
          <DirA_StepRow icon={<div style={{width:44,height:44,borderRadius:10,background:P.warmPale,display:'flex',alignItems:'center',justifyContent:'center',fontSize:24}}>👕</div>} label="Get dressed" />
          <DirA_StepRow icon={<div style={{width:44,height:44,borderRadius:10,background:P.warmPale,display:'flex',alignItems:'center',justifyContent:'center',fontSize:24}}>🥣</div>} label="Eat breakfast" last />
        </div>
      </div>
      <DirA_TabBar active="schedule" />
      {/* tooltip */}
      <div style={{
        position: 'absolute', bottom: 88, right: 16, zIndex: 35,
        padding: '10px 14px', background: A.ink, color: '#fff',
        borderRadius: 12, fontFamily: A.fontBody,
        fontSize: 13, fontWeight: 600,
      }}>
        Hold for settings
        <div style={{
          position: 'absolute', bottom: -5, right: 30,
          width: 10, height: 10, background: A.ink,
          transform: 'rotate(45deg)',
        }}/>
      </div>
    </Phone>
  );
}

Object.assign(window, {
  DirA_Schedule, DirA_Steps, DirA_Stories, DirA_Reader, DirA_ScheduleSettings,
});


// ====== lib/direction-b.jsx ======
// Direction B — "Playful Blocks"
// Bold & confident. Saturated primaries, chunky cards with hard shadows,
// rounded-geometric display type, stepping-stones journey progress.

const B = {
  bg: '#FFF8E8',           // warm cream
  bgAlt: '#FDF1D0',
  card: '#FFFFFF',
  ink: '#1B1A17',
  inkSoft: '#5C5A52',
  inkMuted: '#8F8B7E',
  accent: '#FF6B4A',       // punchy coral
  accentDeep: '#D93E1D',
  blue: '#3B82F6',
  blueDeep: '#1D4ED8',
  blueSoft: '#DBEAFE',
  yellow: '#FDD43F',
  yellowSoft: '#FFF0B3',
  green: '#22C55E',
  greenSoft: '#D1FAE5',
  purple: '#8B5CF6',
  purpleSoft: '#EDE9FE',
  pink: '#EC4899',
  pinkSoft: '#FCE7F3',
  hair: 'rgba(27,26,23,0.1)',
  border: '#1B1A17',
  shadowHard: '4px 4px 0 #1B1A17',
  shadowHardSmall: '3px 3px 0 #1B1A17',

  iconPalette: {
    warm: '#FF6B4A', warmPale: '#FED7CC',
    cool: '#3B82F6', coolPale: '#DBEAFE',
    accent: '#8B5CF6', accentDeep: '#6D28D9',
    neutral: '#E5E5E5', neutralDeep: '#A3A3A3',
  },

  fontDisplay: '"Nunito", -apple-system, system-ui, sans-serif',
  fontBody: '"Nunito", -apple-system, system-ui, sans-serif',
};

// Chunky card w/ hard shadow & black border
function DirB_Card({ children, bg, style, small }) {
  return (
    <div style={{
      background: bg || B.card,
      border: `2.5px solid ${B.border}`,
      borderRadius: 20,
      boxShadow: small ? B.shadowHardSmall : B.shadowHard,
      ...style,
    }}>{children}</div>
  );
}

function DirB_TopBar({ title }) {
  return (
    <div style={{
      padding: '58px 20px 10px', textAlign: 'center',
      fontFamily: B.fontDisplay,
    }}>
      <div style={{
        fontWeight: 900, fontSize: 28, color: B.ink,
        letterSpacing: -0.8, lineHeight: 1,
      }}>{title}</div>
    </div>
  );
}

// Stepping-stones journey — horizontal path with dots
function DirB_Journey({ step, total }) {
  return (
    <div style={{
      padding: '14px 22px 18px',
      display: 'flex', alignItems: 'center', gap: 8,
    }}>
      {Array.from({length: total}).map((_, i) => {
        const done = i < step - 1;
        const cur = i === step - 1;
        const size = cur ? 32 : 24;
        return (
          <React.Fragment key={i}>
            <div style={{
              width: size, height: size, borderRadius: 99,
              background: done || cur ? B.accent : B.card,
              border: `2.5px solid ${B.border}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: cur ? B.shadowHardSmall : 'none',
              transition: 'all 0.2s',
              flexShrink: 0,
            }}>
              {done && TabIcons.check('#fff', 3.5)}
              {cur && <div style={{
                width: 10, height: 10, borderRadius: 99,
                background: '#fff',
              }}/>}
            </div>
            {i < total - 1 && (
              <div style={{
                flex: 1, height: 4,
                background: i < step - 1 ? B.accent : B.ink,
                opacity: i < step - 1 ? 1 : 0.15,
                borderRadius: 2,
              }}/>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

// Step row
function DirB_StepRow({ icon, label, active, done, tileColor = B.yellowSoft }) {
  return (
    <div style={{
      background: active ? B.yellow : B.card,
      border: `2.5px solid ${B.border}`,
      borderRadius: 22, padding: 14,
      boxShadow: active ? B.shadowHard : B.shadowHardSmall,
      marginBottom: 14, display: 'flex', alignItems: 'center', gap: 14,
      opacity: done ? 0.45 : 1,
    }}>
      <div style={{
        width: 64, height: 64, borderRadius: 14,
        background: active ? '#fff' : tileColor,
        border: `2.5px solid ${B.border}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>{icon}</div>
      <div style={{ flex: 1 }}>
        <div style={{
          fontFamily: B.fontDisplay, fontWeight: 900, fontSize: 20,
          color: B.ink, letterSpacing: -0.3,
          textDecoration: done ? 'line-through' : 'none',
        }}>{label}</div>
      </div>
      {active && (
        <div style={{
          height: 56, padding: '0 20px', borderRadius: 99,
          background: B.green,
          border: `2.5px solid ${B.border}`,
          boxShadow: B.shadowHardSmall,
          display: 'flex', alignItems: 'center', gap: 6,
          color: '#fff', fontFamily: B.fontDisplay,
          fontWeight: 900, fontSize: 16, letterSpacing: -0.2,
        }}>
          {TabIcons.check('#fff', 3)}
          Done
        </div>
      )}
      {done && !active && (
        <div style={{
          width: 34, height: 34, borderRadius: 99,
          background: B.green,
          border: `2.5px solid ${B.border}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>{TabIcons.check('#fff', 3)}</div>
      )}
    </div>
  );
}

// Tab bar — chunky pill with black border
function DirB_TabBar({ active = 'schedule' }) {
  const tab = (key, Icon, label) => {
    const isActive = key === active;
    return (
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', gap: 2, padding: '8px 0',
      }}>
        <div style={{
          width: 48, height: 36, borderRadius: 12,
          background: isActive ? B.yellow : 'transparent',
          border: isActive ? `2.5px solid ${B.border}` : 'none',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}><Icon /></div>
        <div style={{
          fontFamily: B.fontDisplay, fontSize: 11,
          fontWeight: isActive ? 900 : 700,
          color: isActive ? B.ink : B.inkMuted, letterSpacing: 0.1,
        }}>{label}</div>
      </div>
    );
  };
  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0,
      background: B.card, borderTop: `2.5px solid ${B.border}`,
      padding: '6px 10px 18px', display: 'flex', zIndex: 30,
    }}>
      {tab('schedule', () => TabIcons.schedule(B.ink, 2.2), 'Schedule')}
      {tab('steps', () => TabIcons.steps(B.ink, 2.2, 'none'), 'Steps')}
      {tab('stories', () => TabIcons.stories(B.ink, 2.2, 'none'), 'Stories')}
      {tab('settings', () => TabIcons.settings(B.ink, 2.2), 'Settings')}
    </div>
  );
}

// ── SCREEN 1: Schedule ─────────────────────────────
function DirB_Schedule() {
  const P = B.iconPalette;
  return (
    <Phone bg={B.bg} label="B · Schedule">
      <StatusBar color={B.ink} />
      <DirB_TopBar title="Schedule" />
      <div style={{ padding: '0 20px' }}>
        <DirB_Card bg={B.yellow} small style={{ padding: '14px 18px' }}>
          <div style={{
            fontFamily: B.fontDisplay, fontWeight: 900, fontSize: 22,
            color: B.ink, letterSpacing: -0.4,
          }}>Morning Routine ☀️</div>
          <div style={{
            fontFamily: B.fontDisplay, fontWeight: 700, fontSize: 13,
            color: B.ink, marginTop: 2, opacity: 0.7,
          }}>Step 1 of 5</div>
        </DirB_Card>
      </div>
      <DirB_Journey step={1} total={5} />
      <div style={{ padding: '0 20px 180px' }}>
        <DirB_StepRow active icon={Icons.sun({ size: 44, ...P })} label="Wake up" tileColor={B.yellowSoft}/>
        <DirB_StepRow icon={Icons.toilet({ size: 44, ...P })} label="Go potty" tileColor={B.blueSoft}/>
        <DirB_StepRow icon={Icons.toothbrush({ size: 44, ...P })} label="Brush teeth" tileColor={B.purpleSoft}/>
        <DirB_StepRow icon={<div style={{fontSize:34}}>👕</div>} label="Get dressed" tileColor={B.pinkSoft}/>
        <DirB_StepRow icon={<div style={{fontSize:34}}>🥣</div>} label="Eat breakfast" tileColor={B.greenSoft}/>
      </div>
      <div style={{
        position: 'absolute', bottom: 96, left: 20, right: 20,
        display: 'flex', gap: 10, zIndex: 25,
      }}>
        <button style={{
          flex: 1, padding: '12px 14px', borderRadius: 14,
          background: B.card, border: `2.5px solid ${B.border}`,
          fontFamily: B.fontDisplay, fontWeight: 900, fontSize: 14,
          color: B.ink, boxShadow: B.shadowHardSmall,
        }}>Set up</button>
        <button style={{
          flex: 1, padding: '12px 14px', borderRadius: 14,
          background: B.card, border: `2.5px solid ${B.border}`,
          fontFamily: B.fontDisplay, fontWeight: 900, fontSize: 14,
          color: B.ink, boxShadow: B.shadowHardSmall,
        }}>Templates</button>
      </div>
      <DirB_TabBar active="schedule" />
    </Phone>
  );
}

// ── SCREEN 2: Steps (Bedtime) ─────────────────────────────
function DirB_Steps() {
  const P = B.iconPalette;
  return (
    <Phone bg={B.bg} label="B · Steps (Bedtime)">
      <StatusBar color={B.ink} />
      <DirB_TopBar title="Steps" />
      <div style={{ padding: '0 20px 12px' }}>
        <DirB_Card bg={B.purple} small style={{ padding: '14px 18px' }}>
          <div style={{
            fontFamily: B.fontDisplay, fontWeight: 900, fontSize: 22,
            color: '#fff', letterSpacing: -0.4,
          }}>Bedtime 🌙</div>
          <div style={{
            fontFamily: B.fontDisplay, fontWeight: 700, fontSize: 13,
            color: '#fff', marginTop: 2, opacity: 0.85,
          }}>6 steps · about 20 min</div>
        </DirB_Card>
      </div>
      <div style={{ padding: '8px 20px 180px' }}>
        <DirB_StepRow active icon={Icons.pajamas({ size: 44, ...P })} label="Put on pajamas" tileColor={B.purpleSoft}/>
        <DirB_StepRow icon={Icons.toothbrush({ size: 44, ...P })} label="Brush teeth" tileColor={B.blueSoft}/>
        <DirB_StepRow icon={Icons.toilet({ size: 44, ...P })} label="Go potty" tileColor={B.yellowSoft}/>
        <DirB_StepRow icon={Icons.book({ size: 44, ...P })} label="Read a book" tileColor={B.greenSoft}/>
        <DirB_StepRow icon={Icons.lightbulb({ size: 44, ...P })} label="Lights off" tileColor={B.yellowSoft}/>
        <DirB_StepRow icon={Icons.heart({ size: 44, ...P })} label="Goodnight hug" tileColor={B.pinkSoft}/>
      </div>
      <div style={{
        position: 'absolute', bottom: 96, left: 20, right: 20,
        display: 'flex', gap: 8, zIndex: 25,
      }}>
        <button style={{
          flex: 1, padding: '12px 10px', borderRadius: 14,
          background: B.card, border: `2.5px solid ${B.border}`,
          fontFamily: B.fontDisplay, fontWeight: 900, fontSize: 13,
          color: B.ink, boxShadow: B.shadowHardSmall,
        }}>New chart</button>
        <button style={{
          flex: 1, padding: '12px 10px', borderRadius: 14,
          background: B.card, border: `2.5px solid ${B.border}`,
          fontFamily: B.fontDisplay, fontWeight: 900, fontSize: 13,
          color: B.ink, boxShadow: B.shadowHardSmall,
        }}>Configure</button>
        <button style={{
          flex: 1, padding: '12px 10px', borderRadius: 14,
          background: B.accent, border: `2.5px solid ${B.border}`,
          fontFamily: B.fontDisplay, fontWeight: 900, fontSize: 13,
          color: '#fff', boxShadow: B.shadowHardSmall,
        }}>▶ Start</button>
      </div>
      <DirB_TabBar active="steps" />
    </Phone>
  );
}

// ── SCREEN 3: Stories ─────────────────────────────
function DirB_StoryCard({ icon, title, bg, reads }) {
  return (
    <DirB_Card small style={{ overflow: 'hidden' }}>
      <div style={{
        height: 130, background: bg,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        borderBottom: `2.5px solid ${B.border}`,
      }}>{icon}</div>
      <div style={{ padding: 12 }}>
        <div style={{
          fontFamily: B.fontDisplay, fontWeight: 900, fontSize: 15,
          color: B.ink, letterSpacing: -0.2, lineHeight: 1.2,
        }}>{title}</div>
        {reads && (
          <div style={{
            fontFamily: B.fontDisplay, fontWeight: 700, fontSize: 11,
            color: B.inkMuted, marginTop: 3,
          }}>Read {reads}×</div>
        )}
        <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
          <div style={{
            padding: '4px 10px', borderRadius: 99,
            background: B.yellow, border: `2px solid ${B.border}`,
            fontSize: 11, fontWeight: 900, color: B.ink,
          }}>Edit</div>
          <div style={{
            padding: '4px 10px', borderRadius: 99,
            background: B.blueSoft, border: `2px solid ${B.border}`,
            fontSize: 11, fontWeight: 900, color: B.ink,
          }}>Share</div>
        </div>
      </div>
    </DirB_Card>
  );
}

function DirB_Stories() {
  const P = B.iconPalette;
  return (
    <Phone bg={B.bg} label="B · Stories">
      <StatusBar color={B.ink} />
      <DirB_TopBar title="Stories" />
      <div style={{
        padding: '8px 20px 180px',
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14,
      }}>
        <DirB_StoryCard icon={Icons.store({ size: 90, ...P })} title="Going to the Grocery Store" reads="3" bg={B.greenSoft}/>
        <DirB_StoryCard icon={Icons.house({ size: 90, ...P })} title="First Day of School" reads="1" bg={B.yellowSoft}/>
        <DirB_StoryCard icon={Icons.scissors({ size: 90, ...P })} title="Getting a Haircut" bg={B.pinkSoft}/>
        <div style={{
          borderRadius: 20, border: `2.5px dashed ${B.border}`,
          background: B.bg,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexDirection: 'column', gap: 8,
        }}>
          <div style={{
            width: 52, height: 52, borderRadius: 14,
            background: B.accent, border: `2.5px solid ${B.border}`,
            boxShadow: B.shadowHardSmall,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>{TabIcons.plus('#fff', 3.5)}</div>
          <div style={{
            fontFamily: B.fontDisplay, fontWeight: 900, fontSize: 15,
            color: B.ink,
          }}>New Story</div>
        </div>
      </div>
      <div style={{
        position: 'absolute', bottom: 96, left: 20, right: 20,
        display: 'flex', gap: 10, zIndex: 25,
      }}>
        <button style={{
          flex: 1, padding: '13px 16px', borderRadius: 14,
          background: B.accent, border: `2.5px solid ${B.border}`,
          fontFamily: B.fontDisplay, fontWeight: 900, fontSize: 14,
          color: '#fff', boxShadow: B.shadowHardSmall,
        }}>+ New story</button>
        <button style={{
          flex: 1, padding: '13px 16px', borderRadius: 14,
          background: B.card, border: `2.5px solid ${B.border}`,
          fontFamily: B.fontDisplay, fontWeight: 900, fontSize: 14,
          color: B.ink, boxShadow: B.shadowHardSmall,
        }}>Import</button>
      </div>
      <DirB_TabBar active="stories" />
    </Phone>
  );
}

// ── SCREEN 4: Reader ─────────────────────────────
function DirB_Reader() {
  const P = B.iconPalette;
  return (
    <Phone bg={B.bg} label="B · Story Reader">
      <StatusBar color={B.ink} />
      <div style={{
        position: 'absolute', top: 54, left: 0, right: 0,
        display: 'flex', justifyContent: 'space-between',
        padding: '12px 18px', zIndex: 20,
      }}>
        <div style={{
          width: 42, height: 42, borderRadius: 14,
          background: B.card, border: `2.5px solid ${B.border}`,
          boxShadow: B.shadowHardSmall,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>{TabIcons.close(B.ink, 2.5)}</div>
        <div style={{
          padding: '8px 14px', borderRadius: 99,
          background: B.yellow, border: `2.5px solid ${B.border}`,
          boxShadow: B.shadowHardSmall,
          fontFamily: B.fontDisplay, fontWeight: 900, fontSize: 14, color: B.ink,
        }}>PAGE 1 / 7</div>
        <div style={{
          width: 42, height: 42, borderRadius: 14,
          background: B.card, border: `2.5px solid ${B.border}`,
          boxShadow: B.shadowHardSmall,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>{TabIcons.print(B.ink, 2.5)}</div>
      </div>

      {/* chunky illustration card */}
      <div style={{
        position: 'absolute', top: 128, left: 24, right: 24, height: 340,
        borderRadius: 26, background: B.greenSoft,
        border: `2.5px solid ${B.border}`, boxShadow: B.shadowHard,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>{Icons.store({ size: 220, ...P })}</div>

      {/* speaker */}
      <div style={{
        position: 'absolute', top: 480, right: 32,
        width: 56, height: 56, borderRadius: 16,
        background: B.accent, border: `2.5px solid ${B.border}`,
        boxShadow: B.shadowHard, zIndex: 20,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>{TabIcons.speaker('#fff', 2.5)}</div>

      {/* text */}
      <div style={{
        position: 'absolute', bottom: 160, left: 24, right: 24,
        padding: '20px 22px', borderRadius: 22, background: B.card,
        border: `2.5px solid ${B.border}`, boxShadow: B.shadowHard,
      }}>
        <div style={{
          fontFamily: B.fontDisplay, fontSize: 24, lineHeight: 1.3,
          color: B.ink, letterSpacing: -0.4, fontWeight: 800,
        }}>Today I am going to the grocery store with Mommy.</div>
      </div>

      {/* controls */}
      <div style={{
        position: 'absolute', bottom: 40, left: 0, right: 0,
        display: 'flex', justifyContent: 'space-between',
        padding: '0 28px', alignItems: 'center', zIndex: 20,
      }}>
        <div style={{
          width: 56, height: 56, borderRadius: 16,
          background: B.card, border: `2.5px solid ${B.border}`,
          boxShadow: B.shadowHardSmall, opacity: 0.45,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>{TabIcons.chevronL(B.ink, 3)}</div>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          {[0,1,2,3,4,5,6].map(i => (
            <div key={i} style={{
              width: i===0 ? 26 : 10, height: 10, borderRadius: 99,
              background: i===0 ? B.accent : B.card,
              border: `2px solid ${B.border}`,
            }}/>
          ))}
        </div>
        <div style={{
          width: 56, height: 56, borderRadius: 16,
          background: B.accent, border: `2.5px solid ${B.border}`,
          boxShadow: B.shadowHardSmall,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>{TabIcons.chevronR('#fff', 3)}</div>
      </div>
    </Phone>
  );
}

// ── SCREEN 5: Schedule w/ settings tooltip ─────────────────
function DirB_ScheduleSettings() {
  const P = B.iconPalette;
  return (
    <Phone bg={B.bg} label="B · Schedule + settings tooltip">
      <StatusBar color={B.ink} />
      <DirB_TopBar title="Schedule" />
      <div style={{ padding: '0 20px' }}>
        <DirB_Card bg={B.yellow} small style={{ padding: '14px 18px' }}>
          <div style={{
            fontFamily: B.fontDisplay, fontWeight: 900, fontSize: 22,
            color: B.ink, letterSpacing: -0.4,
          }}>Morning Routine ☀️</div>
          <div style={{
            fontFamily: B.fontDisplay, fontWeight: 700, fontSize: 13,
            color: B.ink, marginTop: 2, opacity: 0.7,
          }}>Step 2 of 5</div>
        </DirB_Card>
      </div>
      <DirB_Journey step={2} total={5} />
      <div style={{ padding: '0 20px 180px' }}>
        <DirB_StepRow done icon={Icons.sun({ size: 44, ...P })} label="Wake up" tileColor={B.yellowSoft}/>
        <DirB_StepRow active icon={Icons.toilet({ size: 44, ...P })} label="Go potty" tileColor={B.blueSoft}/>
        <DirB_StepRow icon={Icons.toothbrush({ size: 44, ...P })} label="Brush teeth" tileColor={B.purpleSoft}/>
        <DirB_StepRow icon={<div style={{fontSize:34}}>👕</div>} label="Get dressed" tileColor={B.pinkSoft}/>
        <DirB_StepRow icon={<div style={{fontSize:34}}>🥣</div>} label="Eat breakfast" tileColor={B.greenSoft}/>
      </div>
      <DirB_TabBar active="schedule" />
      <div style={{
        position: 'absolute', bottom: 92, right: 14, zIndex: 35,
        padding: '10px 14px', background: B.ink, color: '#fff',
        borderRadius: 12, border: `2.5px solid ${B.border}`,
        boxShadow: B.shadowHardSmall,
        fontFamily: B.fontDisplay, fontSize: 13, fontWeight: 800,
      }}>
        Hold for settings
      </div>
    </Phone>
  );
}

Object.assign(window, {
  DirB_Schedule, DirB_Steps, DirB_Stories, DirB_Reader, DirB_ScheduleSettings,
});


// ====== lib/direction-c.jsx ======
// Direction C — "Storybook Canvas"
// Calm, editorial, ultra-readable. Low-stimulation cream, single deep-teal accent,
// Fraunces display + humanist sans. Progress: numbered breadcrumbs + a left "spine" line.
// Done: long-press to confirm (ring fills).

const C = {
  bg: '#F6F1E7',           // oat cream
  bgAlt: '#EDE5D5',
  card: '#FFFFFF',
  ink: '#1F2D2A',          // deep forest ink
  inkSoft: '#4F5F5B',
  inkMuted: '#8A928D',
  accent: '#2F6B5E',       // deep teal
  accentSoft: '#D6E5DF',
  accentDeep: '#1E4A40',
  warn: '#B85C3C',         // clay for delete
  hair: 'rgba(31,45,42,0.12)',
  hairSoft: 'rgba(31,45,42,0.06)',
  shadow: '0 1px 2px rgba(31,45,42,0.04), 0 8px 24px rgba(31,45,42,0.06)',

  iconPalette: {
    warm: '#B85C3C', warmPale: '#F0DDD2',
    cool: '#2F6B5E', coolPale: '#D6E5DF',
    accent: '#6B5BA8', accentDeep: '#463D82',
    neutral: '#E4DECE', neutralDeep: '#B0A890',
  },

  fontDisplay: '"Fraunces", Georgia, serif',
  fontBody: '"Inter", -apple-system, system-ui, sans-serif',
};

function DirC_TopBar({ title, eyebrow }) {
  return (
    <div style={{ padding: '58px 24px 14px' }}>
      {eyebrow && (
        <div style={{
          fontFamily: C.fontBody, fontSize: 11, fontWeight: 600,
          color: C.inkMuted, letterSpacing: 1.4, textTransform: 'uppercase',
          marginBottom: 4,
        }}>{eyebrow}</div>
      )}
      <div style={{
        fontFamily: C.fontDisplay, fontWeight: 400, fontSize: 34,
        color: C.ink, letterSpacing: -0.8, lineHeight: 1.05,
      }}>{title}</div>
    </div>
  );
}

// Spine-style progress: vertical line, numbered dots
function DirC_StepSpine({ icon, label, active, done, num, isLast }) {
  return (
    <div style={{ display: 'flex', gap: 14, position: 'relative' }}>
      {/* spine column */}
      <div style={{
        width: 32, flexShrink: 0, display: 'flex', flexDirection: 'column',
        alignItems: 'center', position: 'relative', paddingTop: 18,
      }}>
        <div style={{
          width: 28, height: 28, borderRadius: 99, zIndex: 2,
          background: done ? C.accent : (active ? C.ink : C.card),
          border: `1.5px solid ${active || done ? (done?C.accent:C.ink) : C.hair}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: C.fontBody, fontSize: 12, fontWeight: 700,
          color: done || active ? '#fff' : C.inkMuted,
        }}>{done ? TabIcons.check('#fff', 3) : num}</div>
        {!isLast && (
          <div style={{
            position: 'absolute', top: 44, bottom: -12, left: '50%',
            width: 2, background: done ? C.accent : C.hair,
            transform: 'translateX(-50%)',
          }}/>
        )}
      </div>
      {/* card */}
      <div style={{
        flex: 1, marginBottom: 14,
        background: active ? C.card : 'transparent',
        border: active ? `1px solid ${C.hair}` : 'none',
        borderRadius: 18, padding: active ? 12 : '14px 4px 14px 0',
        boxShadow: active ? C.shadow : 'none',
        display: 'flex', alignItems: 'center', gap: 14,
        opacity: done ? 0.55 : 1,
      }}>
        <div style={{
          width: 54, height: 54, borderRadius: 12,
          background: active ? C.accentSoft : C.bgAlt,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>{icon}</div>
        <div style={{ flex: 1 }}>
          <div style={{
            fontFamily: C.fontDisplay, fontSize: 20, fontWeight: 500,
            color: C.ink, letterSpacing: -0.3, lineHeight: 1.1,
            textDecoration: done ? 'line-through' : 'none',
          }}>{label}</div>
        </div>
        {active && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '0 4px',
          }}>
            {/* long-press ring */}
            <div style={{
              position: 'relative', width: 52, height: 52,
            }}>
              <div style={{
                position: 'absolute', inset: 0, borderRadius: 99,
                background: C.accent,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>{TabIcons.check('#fff', 3)}</div>
              <svg width="52" height="52" style={{
                position: 'absolute', inset: 0, transform: 'rotate(-90deg)',
              }}>
                <circle cx="26" cy="26" r="24" fill="none"
                  stroke={C.accentDeep} strokeWidth="2.5"
                  strokeDasharray="150.8" strokeDashoffset="113" strokeLinecap="round"/>
              </svg>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function DirC_TabBar({ active = 'schedule' }) {
  const tab = (key, Icon, label) => {
    const isActive = key === active;
    return (
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', gap: 4, padding: '10px 0',
        position: 'relative',
      }}>
        {isActive && (
          <div style={{
            position: 'absolute', top: 4, width: 24, height: 3,
            borderRadius: 99, background: C.accent,
          }}/>
        )}
        <div style={{ marginTop: 4 }}><Icon /></div>
        <div style={{
          fontFamily: C.fontBody, fontSize: 10.5, fontWeight: isActive ? 600 : 500,
          color: isActive ? C.accent : C.inkMuted, letterSpacing: 0.2,
        }}>{label}</div>
      </div>
    );
  };
  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0,
      background: 'rgba(246,241,231,0.92)',
      backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
      borderTop: `1px solid ${C.hair}`,
      padding: '0 12px 22px', display: 'flex', zIndex: 30,
    }}>
      {tab('schedule', () => TabIcons.schedule(active==='schedule'?C.accent:C.inkMuted, 1.8), 'Schedule')}
      {tab('steps', () => TabIcons.steps(active==='steps'?C.accent:C.inkMuted, 1.8, active==='steps'?C.accent:'none'), 'Steps')}
      {tab('stories', () => TabIcons.stories(active==='stories'?C.accent:C.inkMuted, 1.8, active==='stories'?C.accent:'none'), 'Stories')}
      {tab('settings', () => TabIcons.settings(active==='settings'?C.accent:C.inkMuted, 1.8), 'Settings')}
    </div>
  );
}

// ─ SCREEN 1: Schedule ─
function DirC_Schedule() {
  const P = C.iconPalette;
  return (
    <Phone bg={C.bg} label="C · Schedule">
      <StatusBar color={C.ink} />
      <DirC_TopBar eyebrow="Tuesday · April 19" title="Morning Routine" />
      <div style={{ padding: '0 24px 4px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          fontFamily: C.fontBody, fontSize: 13, fontWeight: 600,
          color: C.accent, letterSpacing: 0.1,
        }}>Step 1 of 5</div>
        <div style={{ flex: 1, height: 1, background: C.hair }}/>
        <div style={{
          fontFamily: C.fontBody, fontSize: 12, color: C.inkMuted,
        }}>~15 min</div>
      </div>
      <div style={{ padding: '18px 24px 180px' }}>
        <DirC_StepSpine num="1" active icon={Icons.sun({ size: 38, ...P })} label="Wake up" />
        <DirC_StepSpine num="2" icon={Icons.toilet({ size: 38, ...P })} label="Go potty" />
        <DirC_StepSpine num="3" icon={Icons.toothbrush({ size: 38, ...P })} label="Brush teeth" />
        <DirC_StepSpine num="4" icon={<div style={{fontSize:28}}>👕</div>} label="Get dressed" />
        <DirC_StepSpine num="5" icon={<div style={{fontSize:28}}>🥣</div>} label="Eat breakfast" isLast />
      </div>
      <div style={{
        position: 'absolute', bottom: 88, left: 24, right: 24,
        display: 'flex', gap: 10, zIndex: 25,
      }}>
        <button style={{
          flex: 1, padding: '13px 16px', borderRadius: 12,
          background: C.card, border: `1px solid ${C.hair}`,
          fontFamily: C.fontBody, fontWeight: 600, fontSize: 14,
          color: C.ink,
        }}>Set up schedule</button>
        <button style={{
          flex: 1, padding: '13px 16px', borderRadius: 12,
          background: C.card, border: `1px solid ${C.hair}`,
          fontFamily: C.fontBody, fontWeight: 600, fontSize: 14,
          color: C.ink,
        }}>Edit templates</button>
      </div>
      <DirC_TabBar active="schedule" />
    </Phone>
  );
}

// ─ SCREEN 2: Steps (Bedtime) ─
function DirC_Steps() {
  const P = C.iconPalette;
  return (
    <Phone bg={C.bg} label="C · Steps (Bedtime)">
      <StatusBar color={C.ink} />
      <DirC_TopBar eyebrow="Bedtime · 6 steps" title="Bedtime" />
      <div style={{ padding: '0 24px 4px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          fontFamily: C.fontBody, fontSize: 13, fontWeight: 600,
          color: C.accent, letterSpacing: 0.1,
        }}>Step 1 of 6</div>
        <div style={{ flex: 1, height: 1, background: C.hair }}/>
        <div style={{
          fontFamily: C.fontBody, fontSize: 12, color: C.inkMuted,
        }}>~20 min</div>
      </div>
      <div style={{ padding: '18px 24px 180px' }}>
        <DirC_StepSpine num="1" active icon={Icons.pajamas({ size: 38, ...P })} label="Put on pajamas" />
        <DirC_StepSpine num="2" icon={Icons.toothbrush({ size: 38, ...P })} label="Brush teeth" />
        <DirC_StepSpine num="3" icon={Icons.toilet({ size: 38, ...P })} label="Go potty" />
        <DirC_StepSpine num="4" icon={Icons.book({ size: 38, ...P })} label="Read a book" />
        <DirC_StepSpine num="5" icon={Icons.lightbulb({ size: 38, ...P })} label="Lights off" />
        <DirC_StepSpine num="6" icon={Icons.heart({ size: 38, ...P })} label="Goodnight hug" isLast />
      </div>
      <div style={{
        position: 'absolute', bottom: 88, left: 24, right: 24,
        display: 'flex', gap: 8, zIndex: 25,
      }}>
        <button style={{
          flex: 1, padding: '12px 10px', borderRadius: 12,
          background: C.card, border: `1px solid ${C.hair}`,
          fontFamily: C.fontBody, fontWeight: 600, fontSize: 13,
          color: C.ink,
        }}>New chart</button>
        <button style={{
          flex: 1, padding: '12px 10px', borderRadius: 12,
          background: C.card, border: `1px solid ${C.hair}`,
          fontFamily: C.fontBody, fontWeight: 600, fontSize: 13,
          color: C.ink,
        }}>Configure</button>
        <button style={{
          flex: 1, padding: '12px 10px', borderRadius: 12,
          background: C.accent, border: 'none',
          fontFamily: C.fontBody, fontWeight: 600, fontSize: 13,
          color: '#fff',
        }}>Start →</button>
      </div>
      <DirC_TabBar active="steps" />
    </Phone>
  );
}

// ─ SCREEN 3: Stories ─
function DirC_StoryRow({ icon, title, reads, bg }) {
  return (
    <div style={{
      display: 'flex', gap: 14, padding: 14,
      background: C.card, borderRadius: 18, marginBottom: 10,
      border: `1px solid ${C.hair}`,
    }}>
      <div style={{
        width: 80, height: 80, borderRadius: 14,
        background: bg, flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>{icon}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: C.fontDisplay, fontSize: 18, fontWeight: 500,
          color: C.ink, letterSpacing: -0.3, lineHeight: 1.2,
        }}>{title}</div>
        {reads && (
          <div style={{
            fontFamily: C.fontBody, fontSize: 12, color: C.inkMuted,
            marginTop: 2, fontWeight: 500,
          }}>Read {reads}× · 7 pages</div>
        )}
        <div style={{ display: 'flex', gap: 14, marginTop: 10 }}>
          <div style={{
            fontFamily: C.fontBody, fontSize: 13, fontWeight: 600,
            color: C.accent,
          }}>Open</div>
          <div style={{
            fontFamily: C.fontBody, fontSize: 13, fontWeight: 500,
            color: C.inkSoft,
          }}>Edit</div>
          <div style={{
            fontFamily: C.fontBody, fontSize: 13, fontWeight: 500,
            color: C.inkSoft,
          }}>Share</div>
        </div>
      </div>
    </div>
  );
}

function DirC_Stories() {
  const P = C.iconPalette;
  return (
    <Phone bg={C.bg} label="C · Stories">
      <StatusBar color={C.ink} />
      <DirC_TopBar eyebrow="Social stories · 3 saved" title="Stories" />
      <div style={{ padding: '8px 24px 180px' }}>
        <DirC_StoryRow icon={Icons.store({ size: 60, ...P })} title="Going to the Grocery Store" reads="3" bg={C.accentSoft}/>
        <DirC_StoryRow icon={Icons.house({ size: 60, ...P })} title="First Day of School" reads="1" bg="#F0DDD2"/>
        <DirC_StoryRow icon={Icons.scissors({ size: 60, ...P })} title="Getting a Haircut" bg="#EDE5D5"/>
        {/* create row */}
        <div style={{
          display: 'flex', gap: 14, alignItems: 'center',
          padding: 14, borderRadius: 18, marginTop: 6,
          border: `1.5px dashed ${C.hair}`,
        }}>
          <div style={{
            width: 80, height: 80, borderRadius: 14,
            background: C.bgAlt, flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>{TabIcons.plus(C.accent, 2)}</div>
          <div style={{ flex: 1 }}>
            <div style={{
              fontFamily: C.fontDisplay, fontSize: 18, fontWeight: 500,
              color: C.accent, letterSpacing: -0.3,
            }}>Create a new story</div>
            <div style={{
              fontFamily: C.fontBody, fontSize: 12, color: C.inkMuted,
              marginTop: 2, fontWeight: 500,
            }}>Walk your child through something new</div>
          </div>
        </div>
      </div>
      <div style={{
        position: 'absolute', bottom: 88, left: 24, right: 24,
        display: 'flex', gap: 10, zIndex: 25,
      }}>
        <button style={{
          flex: 1, padding: '13px 16px', borderRadius: 12,
          background: C.accent, border: 'none',
          fontFamily: C.fontBody, fontWeight: 600, fontSize: 14,
          color: '#fff',
        }}>New story</button>
        <button style={{
          flex: 1, padding: '13px 16px', borderRadius: 12,
          background: C.card, border: `1px solid ${C.hair}`,
          fontFamily: C.fontBody, fontWeight: 600, fontSize: 14,
          color: C.ink,
        }}>Import</button>
      </div>
      <DirC_TabBar active="stories" />
    </Phone>
  );
}

// ─ SCREEN 4: Reader ─
function DirC_Reader() {
  const P = C.iconPalette;
  return (
    <Phone bg={C.bg} label="C · Story Reader">
      <StatusBar color={C.ink} />
      <div style={{
        position: 'absolute', top: 54, left: 0, right: 0,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '14px 18px', zIndex: 20,
      }}>
        <div style={{
          width: 38, height: 38, borderRadius: 99,
          background: C.card, border: `1px solid ${C.hair}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>{TabIcons.close(C.ink, 2)}</div>
        <div style={{
          fontFamily: C.fontBody, fontSize: 12, color: C.inkMuted,
          letterSpacing: 1.2, textTransform: 'uppercase', fontWeight: 600,
        }}>Grocery Store · 1 / 7</div>
        <div style={{
          width: 38, height: 38, borderRadius: 99,
          background: C.card, border: `1px solid ${C.hair}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>{TabIcons.print(C.ink, 2)}</div>
      </div>

      {/* page card */}
      <div style={{
        position: 'absolute', top: 118, left: 24, right: 24, bottom: 110,
        borderRadius: 28, background: C.card,
        border: `1px solid ${C.hair}`,
        boxShadow: C.shadow, overflow: 'hidden',
        display: 'flex', flexDirection: 'column',
      }}>
        <div style={{
          flex: 1, background: C.accentSoft,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          position: 'relative',
        }}>
          {Icons.store({ size: 200, ...P })}
          {/* speaker */}
          <div style={{
            position: 'absolute', bottom: 16, right: 16,
            width: 44, height: 44, borderRadius: 99,
            background: C.card, border: `1px solid ${C.hair}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: C.shadow,
          }}>{TabIcons.speaker(C.accent, 2)}</div>
        </div>
        <div style={{
          padding: '24px 26px 28px',
        }}>
          <div style={{
            fontFamily: C.fontBody, fontSize: 10.5, fontWeight: 600,
            color: C.inkMuted, letterSpacing: 1.4, textTransform: 'uppercase',
            marginBottom: 8,
          }}>Page One</div>
          <div style={{
            fontFamily: C.fontDisplay, fontSize: 22, lineHeight: 1.35,
            color: C.ink, letterSpacing: -0.3, fontWeight: 400,
          }}>Today I am going to the grocery store with Mommy.</div>
        </div>
      </div>

      {/* controls */}
      <div style={{
        position: 'absolute', bottom: 28, left: 0, right: 0,
        display: 'flex', justifyContent: 'space-between',
        padding: '0 28px', alignItems: 'center', zIndex: 20,
      }}>
        <div style={{
          width: 48, height: 48, borderRadius: 99,
          background: C.card, border: `1px solid ${C.hair}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          opacity: 0.4,
        }}>{TabIcons.chevronL(C.ink)}</div>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          {[0,1,2,3,4,5,6].map(i => (
            <div key={i} style={{
              width: i===0 ? 20 : 6, height: 6, borderRadius: 99,
              background: i===0 ? C.accent : C.hair,
            }}/>
          ))}
        </div>
        <div style={{
          width: 48, height: 48, borderRadius: 99,
          background: C.accent,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>{TabIcons.chevronR('#fff', 2.5)}</div>
      </div>
    </Phone>
  );
}

// ─ SCREEN 5: Schedule w/ tooltip ─
function DirC_ScheduleSettings() {
  const P = C.iconPalette;
  return (
    <Phone bg={C.bg} label="C · Schedule + settings tooltip">
      <StatusBar color={C.ink} />
      <DirC_TopBar eyebrow="Tuesday · April 19" title="Morning Routine" />
      <div style={{ padding: '0 24px 4px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          fontFamily: C.fontBody, fontSize: 13, fontWeight: 600,
          color: C.accent, letterSpacing: 0.1,
        }}>Step 2 of 5</div>
        <div style={{ flex: 1, height: 1, background: C.hair }}/>
        <div style={{
          fontFamily: C.fontBody, fontSize: 12, color: C.inkMuted,
        }}>~15 min</div>
      </div>
      <div style={{ padding: '18px 24px 180px' }}>
        <DirC_StepSpine num="1" done icon={Icons.sun({ size: 38, ...P })} label="Wake up" />
        <DirC_StepSpine num="2" active icon={Icons.toilet({ size: 38, ...P })} label="Go potty" />
        <DirC_StepSpine num="3" icon={Icons.toothbrush({ size: 38, ...P })} label="Brush teeth" />
        <DirC_StepSpine num="4" icon={<div style={{fontSize:28}}>👕</div>} label="Get dressed" />
        <DirC_StepSpine num="5" icon={<div style={{fontSize:28}}>🥣</div>} label="Eat breakfast" isLast />
      </div>
      <DirC_TabBar active="schedule" />
      <div style={{
        position: 'absolute', bottom: 82, right: 18, zIndex: 35,
        padding: '10px 14px', background: C.ink, color: '#fff',
        borderRadius: 10, fontFamily: C.fontBody,
        fontSize: 12, fontWeight: 500, letterSpacing: 0.2,
      }}>
        Hold for settings
      </div>
    </Phone>
  );
}

Object.assign(window, {
  DirC_Schedule, DirC_Steps, DirC_Stories, DirC_Reader, DirC_ScheduleSettings,
});


// ====== lib/app.jsx ======
// Main app — mounted from inline <script> in the HTML.

function useTweaks() {
  const [t, setT] = React.useState(window.__GS_TWEAKS || {});
  const [editMode, setEditMode] = React.useState(false);

  React.useEffect(() => {
    const onMsg = (e) => {
      const d = e.data || {};
      if (d.type === '__activate_edit_mode') setEditMode(true);
      else if (d.type === '__deactivate_edit_mode') setEditMode(false);
    };
    window.addEventListener('message', onMsg);
    window.parent.postMessage({ type: '__edit_mode_available' }, '*');
    return () => window.removeEventListener('message', onMsg);
  }, []);

  const update = (patch) => {
    setT((prev) => {
      const next = { ...prev, ...patch };
      window.parent.postMessage({ type: '__edit_mode_set_keys', edits: patch }, '*');
      return next;
    });
  };
  return [t, update, editMode];
}

function TweakPanel({ t, update }) {
  const row = (label, ctrl) => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '8px 0' }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: '#333' }}>{label}</div>
      {ctrl}
    </div>
  );
  const pill = (v, cur, onClick, label) => (
    <button onClick={onClick} style={{
      padding: '5px 10px', borderRadius: 99, fontSize: 11, fontWeight: 600,
      border: cur === v ? '1.5px solid #1B1A17' : '1px solid #ccc',
      background: cur === v ? '#1B1A17' : '#fff',
      color: cur === v ? '#fff' : '#333', cursor: 'pointer',
    }}>{label}</button>
  );
  return (
    <div style={{
      position: 'fixed', right: 16, bottom: 16, zIndex: 1000,
      width: 280, background: '#fff',
      borderRadius: 16, padding: 16,
      boxShadow: '0 4px 16px rgba(0,0,0,0.08), 0 20px 60px rgba(0,0,0,0.18)',
      border: '1px solid rgba(0,0,0,0.08)',
      fontFamily: '-apple-system, system-ui',
    }}>
      <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: -0.1, marginBottom: 8 }}>Tweaks</div>
      {row('Direction', <div style={{ display: 'flex', gap: 4 }}>
        {pill('all', t.direction, () => update({ direction: 'all' }), 'All')}
        {pill('A', t.direction, () => update({ direction: 'A' }), 'A')}
        {pill('B', t.direction, () => update({ direction: 'B' }), 'B')}
        {pill('C', t.direction, () => update({ direction: 'C' }), 'C')}
      </div>)}
      {row('Text size', <input type="range" min="0.85" max="1.2" step="0.05"
        value={t.textSize} onChange={(e) => update({ textSize: parseFloat(e.target.value) })} style={{ width: 120 }}/>)}
      {row('Dark mode', <input type="checkbox" checked={!!t.darkMode} onChange={(e) => update({ darkMode: e.target.checked })}/>)}
      {row('Reduce motion', <input type="checkbox" checked={!!t.reduceMotion} onChange={(e) => update({ reduceMotion: e.target.checked })}/>)}
    </div>
  );
}

function DirHero({ letter, name, mood, palette, fonts, tagline }) {
  return (
    <div style={{
      background: '#fff', borderRadius: 2,
      padding: '24px 28px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)',
      width: 680, marginBottom: 36,
    }}>
      <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
        <div style={{
          width: 72, height: 72, borderRadius: 18,
          background: palette[0], color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'Fraunces, serif', fontWeight: 600, fontSize: 40,
          letterSpacing: -1, flexShrink: 0,
        }}>{letter}</div>
        <div style={{ flex: 1 }}>
          <div style={{
            fontFamily: 'Fraunces, serif', fontWeight: 500, fontSize: 28,
            color: '#1a1a1a', letterSpacing: -0.5, lineHeight: 1,
          }}>{name}</div>
          <div style={{
            fontFamily: '-apple-system, system-ui', fontSize: 14, color: '#666',
            marginTop: 4, fontStyle: 'italic',
          }}>{tagline}</div>
          <div style={{ display: 'flex', gap: 20, marginTop: 14, flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, color: '#999', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 }}>Mood</div>
              <div style={{ fontSize: 13, fontWeight: 500, color: '#222' }}>{mood}</div>
            </div>
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, color: '#999', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 }}>Palette</div>
              <div style={{ display: 'flex', gap: 4 }}>
                {palette.map((c, i) => (
                  <div key={i} style={{
                    width: 22, height: 22, borderRadius: 6, background: c,
                    border: '1px solid rgba(0,0,0,0.08)',
                  }}/>
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, color: '#999', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 }}>Fonts</div>
              <div style={{ fontSize: 13, fontWeight: 500, color: '#222' }}>{fonts}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [t, update, editMode] = useTweaks();

  const wrapStyle = {
    fontSize: `${16 * (t.textSize || 1)}px`,
    filter: t.darkMode ? 'invert(0.92) hue-rotate(180deg)' : 'none',
  };

  const showA = !t.direction || t.direction === 'all' || t.direction === 'A';
  const showB = !t.direction || t.direction === 'all' || t.direction === 'B';
  const showC = !t.direction || t.direction === 'all' || t.direction === 'C';

  return (
    <div style={wrapStyle}>
      <DesignCanvas>
        <div style={{ padding: '0 60px 40px', width: 1200 }}>
          <div style={{
            fontFamily: 'Fraunces, serif', fontSize: 44, fontWeight: 500,
            color: '#1a1a1a', letterSpacing: -1.2, lineHeight: 1,
          }}>Guiding Steps — visual direction study</div>
          <div style={{
            fontFamily: '-apple-system, system-ui', fontSize: 15, color: '#666',
            marginTop: 10, maxWidth: 720, lineHeight: 1.5,
          }}>
            Three directions for the Schedule, Steps, Stories, and Story Reader surfaces.
            Same components, same copy, same icon silhouettes — different visual languages.
            Each is warm &amp; encouraging but pulls a different lever: softness, confidence,
            or calm editorial clarity. Toggle <b>Tweaks</b> for text size, dark mode,
            or to isolate one direction.
          </div>
        </div>

        {showA && (
          <>
            <div style={{ padding: '0 60px' }}>
              <DirHero letter="A" name="Warm Sunrise"
                tagline="Soft, encouraging, a little magical."
                mood="Warm · patient · gentle"
                palette={['#E8824A', '#C45A1F', '#FCE2D1', '#4A8F3C', '#FFF4E6']}
                fonts="Fraunces display (italic) + Nunito body"/>
            </div>
            <DCSection title="Direction A · Warm Sunrise" subtitle="Peachy gradients, italic serif headers, filled-dot progress, big green Done badge. Feels like a hug." gap={40}>
              <DCArtboard width={390} height={900} style={{ background: 'transparent', boxShadow: 'none' }}><DirA_Schedule /></DCArtboard>
              <DCArtboard width={390} height={900} style={{ background: 'transparent', boxShadow: 'none' }}><DirA_ScheduleSettings /></DCArtboard>
              <DCArtboard width={390} height={900} style={{ background: 'transparent', boxShadow: 'none' }}><DirA_Steps /></DCArtboard>
              <DCArtboard width={390} height={900} style={{ background: 'transparent', boxShadow: 'none' }}><DirA_Stories /></DCArtboard>
              <DCArtboard width={390} height={900} style={{ background: 'transparent', boxShadow: 'none' }}><DirA_Reader /></DCArtboard>
              <DCPostIt top={-30} left={200} rotate={-3}>Italic serif for titles signals care + warmth without getting cutesy.</DCPostIt>
              <DCPostIt top={400} left={-30} rotate={2} width={160}>Done button stays large and green so kids recognize it instantly.</DCPostIt>
            </DCSection>
          </>
        )}

        {showB && (
          <>
            <div style={{ padding: '0 60px' }}>
              <DirHero letter="B" name="Playful Blocks"
                tagline="Chunky, confident, rewarding."
                mood="Bold · energetic · sticker-book"
                palette={['#FF6B4A', '#FDD43F', '#8B5CF6', '#22C55E', '#FFF8E8']}
                fonts="Nunito 900 display + 700 body"/>
            </div>
            <DCSection title="Direction B · Playful Blocks" subtitle="Hard black borders, offset drop shadows, multi-color tiles. Stepping-stones progress. Reads like a reward chart." gap={40}>
              <DCArtboard width={390} height={900} style={{ background: 'transparent', boxShadow: 'none' }}><DirB_Schedule /></DCArtboard>
              <DCArtboard width={390} height={900} style={{ background: 'transparent', boxShadow: 'none' }}><DirB_ScheduleSettings /></DCArtboard>
              <DCArtboard width={390} height={900} style={{ background: 'transparent', boxShadow: 'none' }}><DirB_Steps /></DCArtboard>
              <DCArtboard width={390} height={900} style={{ background: 'transparent', boxShadow: 'none' }}><DirB_Stories /></DCArtboard>
              <DCArtboard width={390} height={900} style={{ background: 'transparent', boxShadow: 'none' }}><DirB_Reader /></DCArtboard>
              <DCPostIt top={-30} left={260} rotate={-2}>Each tile a different pastel — rainbow helps younger kids remember sequence.</DCPostIt>
              <DCPostIt top={450} left={-40} rotate={3} width={170}>Stepping-stones bar → visible reward each tap.</DCPostIt>
            </DCSection>
          </>
        )}

        {showC && (
          <>
            <div style={{ padding: '0 60px' }}>
              <DirHero letter="C" name="Storybook Canvas"
                tagline="Calm, editorial, dignified."
                mood="Quiet · bookish · sensory-safe"
                palette={['#2F6B5E', '#B85C3C', '#D6E5DF', '#F6F1E7', '#1F2D2A']}
                fonts="Fraunces display + Inter body"/>
            </div>
            <DCSection title="Direction C · Storybook Canvas" subtitle="Oat cream background, single deep-teal accent, numbered spine progress, long-press confirm. Low-stim, high-readability." gap={40}>
              <DCArtboard width={390} height={900} style={{ background: 'transparent', boxShadow: 'none' }}><DirC_Schedule /></DCArtboard>
              <DCArtboard width={390} height={900} style={{ background: 'transparent', boxShadow: 'none' }}><DirC_ScheduleSettings /></DCArtboard>
              <DCArtboard width={390} height={900} style={{ background: 'transparent', boxShadow: 'none' }}><DirC_Steps /></DCArtboard>
              <DCArtboard width={390} height={900} style={{ background: 'transparent', boxShadow: 'none' }}><DirC_Stories /></DCArtboard>
              <DCArtboard width={390} height={900} style={{ background: 'transparent', boxShadow: 'none' }}><DirC_Reader /></DCArtboard>
              <DCPostIt top={-30} left={220} rotate={-2}>Single accent + negative space = lower sensory load.</DCPostIt>
              <DCPostIt top={420} left={-30} rotate={3} width={170}>Long-press ring confirms — prevents accidental taps.</DCPostIt>
            </DCSection>
          </>
        )}

        <div style={{ height: 80 }}/>
      </DesignCanvas>

      {editMode && <TweakPanel t={t} update={update} />}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);

