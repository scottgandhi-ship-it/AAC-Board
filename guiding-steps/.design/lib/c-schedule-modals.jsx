// Storybook Canvas — Schedule-related modals
// Modal shell + Edit Templates / New Schedule / Edit Schedule

// Generic modal shell — 356px wide floating card over dimmed background
function DirC_ModalShell({ label, children, backdrop, align = 'center', padBottom = 0 }) {
  return (
    <Phone bg={C.bg} label={label}>
      <StatusBar color={C.ink} />
      {/* dimmed backdrop content (optional ghost of underlying screen) */}
      {backdrop}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'rgba(27,29,46,0.28)',
        backdropFilter: 'blur(1.5px)',
        zIndex: 10,
      }}/>
      <div style={{
        position: 'absolute',
        left: 14, right: 14,
        ...(align === 'top' ? { top: 60 } : { top: '50%', transform: 'translateY(-50%)' }),
        background: C.bg, borderRadius: 22,
        boxShadow: '0 8px 30px rgba(27,29,46,0.18), 0 24px 60px rgba(27,29,46,0.12)',
        border: `1px solid ${C.hair}`,
        padding: 0, overflow: 'hidden',
        zIndex: 20,
        maxHeight: 720,
        display: 'flex', flexDirection: 'column',
        paddingBottom: padBottom,
      }}>{children}</div>
    </Phone>
  );
}

function ModalHeader({ title }) {
  return (
    <div style={{
      padding: '22px 22px 6px',
    }}>
      <div style={{
        fontFamily: C.fontDisplay, fontSize: 24, fontWeight: 400,
        color: C.ink, letterSpacing: -0.5, lineHeight: 1,
      }}>{title}</div>
    </div>
  );
}

// Soft ghosted schedule behind modals (for realism of overlay)
function GhostSchedule() {
  const P = C.iconPalette;
  return (
    <div style={{ position: 'absolute', inset: 0, opacity: 0.45 }}>
      <DirC_TopBar eyebrow="Tuesday · April 19" title="Morning Routine" />
      <div style={{ padding: '0 24px 4px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ fontFamily: C.fontBody, fontSize: 13, fontWeight: 600, color: C.accent }}>Step 3 of 5</div>
        <div style={{ flex: 1, height: 1, background: C.hair }}/>
        <div style={{ fontFamily: C.fontBody, fontSize: 12, color: C.inkMuted }}>~15 min</div>
      </div>
      <div style={{ padding: '18px 24px' }}>
        <DirC_StepSpine num="1" done icon={Icons.sun({ size: 38, ...P })} label="Wake up" />
        <DirC_StepSpine num="2" done icon={Icons.toilet({ size: 38, ...P })} label="Go potty" />
        <DirC_StepSpine num="3" active icon={Icons.toothbrush({ size: 38, ...P })} label="Brush teeth" isLast />
      </div>
    </div>
  );
}

// ─── Edit Templates ────────────────────────────────────────
function TemplateRow({ name, steps }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '14px 16px', background: C.card,
      border: `1px solid ${C.hair}`, borderRadius: 12,
      marginBottom: 8,
    }}>
      <div style={{
        fontFamily: C.fontDisplay, fontSize: 17, fontWeight: 500,
        color: C.ink, letterSpacing: -0.2,
      }}>{name}</div>
      <div style={{
        fontFamily: C.fontBody, fontSize: 12, color: C.inkMuted, fontWeight: 500,
      }}>{steps} steps</div>
    </div>
  );
}

function DirC_EditTemplates() {
  return (
    <DirC_ModalShell label="C · Edit Templates" backdrop={<GhostSchedule/>} align="top">
      <ModalHeader title="Edit Templates" />
      <div style={{ padding: '14px 18px 6px', flex: 1, overflowY: 'auto' }}>
        <TemplateRow name="Full Day" steps={20}/>
        <TemplateRow name="School Day" steps={18}/>
        <TemplateRow name="Morning Routine" steps={5}/>
        <TemplateRow name="Bedtime Routine" steps={7}/>
        <TemplateRow name="Therapy Day" steps={22}/>
        <TemplateRow name="Weekend / Fun Day" steps={18}/>

        <div style={{
          padding: '14px 16px', border: `1.5px dashed ${C.hair}`,
          borderRadius: 12, textAlign: 'center', marginTop: 6,
          fontFamily: C.fontBody, fontSize: 14, fontWeight: 600,
          color: C.accent, background: C.card,
        }}>+ Create new template</div>
        <div style={{
          padding: '14px 16px', border: `1px solid ${C.hair}`,
          borderRadius: 12, textAlign: 'center', marginTop: 8,
          fontFamily: C.fontBody, fontSize: 14, fontWeight: 600,
          color: C.ink, background: C.card,
        }}>Import schedule</div>
      </div>
      <div style={{ padding: '14px 18px 18px' }}>
        <div style={{
          padding: '14px', borderRadius: 12,
          background: C.bgAlt, textAlign: 'center',
          fontFamily: C.fontBody, fontSize: 14, fontWeight: 500,
          color: C.inkSoft,
        }}>Close</div>
      </div>
    </DirC_ModalShell>
  );
}

// ─── New Schedule ────────────────────────────────────────
function DirC_NewSchedule() {
  return (
    <DirC_ModalShell label="C · New Schedule" backdrop={<GhostSchedule/>}>
      <ModalHeader title="New schedule" />
      <div style={{ padding: '10px 22px 6px' }}>
        <div style={{
          fontFamily: C.fontBody, fontSize: 11, color: C.inkMuted,
          fontWeight: 600, letterSpacing: 1.2, textTransform: 'uppercase',
          marginTop: 14, marginBottom: 6,
        }}>Schedule name</div>
        <div style={{
          padding: '14px 16px', border: `1px solid ${C.hair}`,
          borderRadius: 12, background: C.card, minHeight: 22,
          fontFamily: C.fontDisplay, fontSize: 17, color: C.inkMuted, fontStyle: 'italic',
        }}>Name this routine…</div>

        <div style={{
          fontFamily: C.fontBody, fontSize: 11, color: C.inkMuted,
          fontWeight: 600, letterSpacing: 1.2, textTransform: 'uppercase',
          marginTop: 20, marginBottom: 6,
        }}>Steps</div>
        <div style={{
          padding: '18px 16px', border: `1.5px dashed ${C.hair}`,
          borderRadius: 12, textAlign: 'center',
          fontFamily: C.fontBody, fontSize: 14, fontWeight: 600,
          color: C.accent, background: C.card,
        }}>+ Add first step</div>
      </div>
      <div style={{ padding: '22px 22px 22px', display: 'flex', gap: 10 }}>
        <button style={{
          flex: 1, padding: '13px', borderRadius: 12,
          background: C.bgAlt, border: 'none',
          fontFamily: C.fontBody, fontWeight: 500, fontSize: 14,
          color: C.inkSoft,
        }}>Cancel</button>
        <button style={{
          flex: 1, padding: '13px', borderRadius: 12,
          background: C.accent, border: 'none',
          fontFamily: C.fontBody, fontWeight: 600, fontSize: 14,
          color: '#fff',
        }}>Save</button>
      </div>
    </DirC_ModalShell>
  );
}

// ─── Edit Schedule (scrollable step list) ────────────────────────────────────────
function ScheduleStepRow({ icon, label, showUp = true, showDown = true }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: 8, marginBottom: 8,
      border: `1px solid ${C.hair}`, borderRadius: 12,
      background: C.card,
    }}>
      <div style={{
        width: 42, height: 42, borderRadius: 10,
        background: C.bgAlt, flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>{icon}</div>
      <div style={{
        flex: 1, fontFamily: C.fontBody, fontSize: 14, fontWeight: 500,
        color: C.ink, letterSpacing: -0.1,
      }}>{label}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <button style={{
          width: 26, height: 20, borderRadius: 6, border: `1px solid ${C.hair}`,
          background: C.card, color: showUp ? C.accent : C.inkMuted,
          fontSize: 10, padding: 0, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          opacity: showUp ? 1 : 0.3,
        }}>▲</button>
        <button style={{
          width: 26, height: 20, borderRadius: 6, border: `1px solid ${C.hair}`,
          background: C.card, color: showDown ? C.accent : C.inkMuted,
          fontSize: 10, padding: 0, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          opacity: showDown ? 1 : 0.3,
        }}>▼</button>
      </div>
      <button style={{
        width: 26, height: 44, borderRadius: 8, border: `1px solid ${C.warn}30`,
        background: `${C.warn}12`, color: C.warn,
        fontSize: 13, fontWeight: 700, padding: 0, cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>✕</button>
    </div>
  );
}

function DirC_EditSchedule() {
  const P = C.iconPalette;
  return (
    <DirC_ModalShell label="C · Edit Schedule (top)" backdrop={<GhostSchedule/>} align="top">
      <ModalHeader title="Edit Schedule" />
      <div style={{ padding: '10px 18px 6px', flex: 1, overflowY: 'auto' }}>
        <div style={{
          fontFamily: C.fontBody, fontSize: 11, color: C.inkMuted,
          fontWeight: 600, letterSpacing: 1.2, textTransform: 'uppercase',
          marginTop: 6, marginBottom: 6,
        }}>Schedule name</div>
        <div style={{
          padding: '12px 14px', border: `1px solid ${C.hair}`,
          borderRadius: 12, background: C.card,
          fontFamily: C.fontDisplay, fontSize: 17, color: C.ink,
          marginBottom: 16,
        }}>Full Day</div>

        <div style={{
          fontFamily: C.fontBody, fontSize: 11, color: C.inkMuted,
          fontWeight: 600, letterSpacing: 1.2, textTransform: 'uppercase',
          marginBottom: 8,
        }}>Steps · 10 of 20</div>

        <ScheduleStepRow icon={Icons.sun({ size: 30, ...P })} label="Wake up" showUp={false}/>
        <ScheduleStepRow icon={Icons.toilet({ size: 30, ...P })} label="Go potty"/>
        <ScheduleStepRow icon={Icons.toothbrush({ size: 30, ...P })} label="Brush teeth"/>
        <ScheduleStepRow icon={<div style={{fontSize:22}}>👕</div>} label="Get dressed"/>
        <ScheduleStepRow icon={<div style={{fontSize:22}}>🥣</div>} label="Eat breakfast"/>
        <ScheduleStepRow icon={<div style={{fontSize:22}}>🧱</div>} label="Play inside"/>
        <ScheduleStepRow icon={<div style={{fontSize:22}}>🍎</div>} label="Snack"/>
        <ScheduleStepRow icon={<div style={{fontSize:22}}>🌳</div>} label="Play outside"/>
        <ScheduleStepRow icon={<div style={{fontSize:22}}>🥪</div>} label="Lunch"/>
        <ScheduleStepRow icon={<div style={{fontSize:22}}>📺</div>} label="Screen time"/>

        <div style={{
          padding: '14px 16px', border: `1.5px dashed ${C.hair}`,
          borderRadius: 12, textAlign: 'center', marginTop: 4,
          fontFamily: C.fontBody, fontSize: 14, fontWeight: 600,
          color: C.accent, background: C.card, marginBottom: 6,
        }}>+ Add step</div>
      </div>
      <div style={{
        padding: '14px 16px',
        borderTop: `1px solid ${C.hair}`, background: C.bg,
        display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1.2fr', gap: 8,
      }}>
        <button style={{
          padding: '11px 8px', borderRadius: 10,
          background: C.bgAlt, border: 'none',
          fontFamily: C.fontBody, fontWeight: 500, fontSize: 13,
          color: C.inkSoft,
        }}>Cancel</button>
        <button style={{
          padding: '11px 8px', borderRadius: 10,
          background: `${C.warn}15`, border: `1px solid ${C.warn}40`,
          fontFamily: C.fontBody, fontWeight: 600, fontSize: 13,
          color: C.warn,
        }}>Delete</button>
        <button style={{
          padding: '11px 8px', borderRadius: 10,
          background: C.card, border: `1px solid ${C.hair}`,
          fontFamily: C.fontBody, fontWeight: 600, fontSize: 13,
          color: C.ink,
        }}>Export</button>
        <button style={{
          padding: '11px 8px', borderRadius: 10,
          background: C.accent, border: 'none',
          fontFamily: C.fontBody, fontWeight: 600, fontSize: 13,
          color: '#fff',
        }}>Save</button>
      </div>
    </DirC_ModalShell>
  );
}

Object.assign(window, { DirC_EditTemplates, DirC_NewSchedule, DirC_EditSchedule });
