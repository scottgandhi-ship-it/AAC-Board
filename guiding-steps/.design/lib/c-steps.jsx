// Storybook Canvas — Steps feature (Task Strips with rewards)
// Rebuilds DirC_Steps (replaces the old schedule-style one),
// adds New Reward Chart, New Task Strip, Edit Task Strip.

// Task strip row — icon tile + label, active gets indigo accent and long-press done ring
function TaskStripRow({ icon, label, active, done }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 14,
      padding: 14, marginBottom: 10,
      background: active ? C.card : C.card,
      border: `1px solid ${active ? C.accent : C.hair}`,
      borderLeft: active ? `4px solid ${C.accent}` : `1px solid ${C.hair}`,
      borderRadius: 16,
      boxShadow: active ? C.shadow : 'none',
      opacity: done ? 0.5 : 1,
    }}>
      <div style={{
        width: 56, height: 56, borderRadius: 12,
        background: active ? C.accentSoft : C.bgAlt, flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>{icon}</div>
      <div style={{
        flex: 1, fontFamily: C.fontDisplay, fontSize: 20, fontWeight: 500,
        color: C.ink, letterSpacing: -0.3,
        textDecoration: done ? 'line-through' : 'none',
      }}>{label}</div>
      {active && (
        <div style={{
          position: 'relative', width: 52, height: 52, flexShrink: 0,
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
      )}
    </div>
  );
}

// Replace DirC_Steps — Steps/Bedtime routine as a Task Strip
function DirC_Steps() {
  const P = C.iconPalette;
  return (
    <Phone bg={C.bg} label="C · Steps (Bedtime task strip)">
      <StatusBar color={C.ink} />
      <DirC_TopBar eyebrow="Bedtime · task strip" title="Bedtime" />
      <div style={{ padding: '0 24px 4px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          fontFamily: C.fontBody, fontSize: 13, fontWeight: 600,
          color: C.accent, letterSpacing: 0.1,
        }}>Step 1 of 6</div>
        <div style={{ flex: 1, height: 1, background: C.hair }}/>
        <div style={{
          fontFamily: C.fontBody, fontSize: 12, color: C.inkMuted,
        }}>Reward: sticker</div>
      </div>
      <div style={{ padding: '14px 24px 200px' }}>
        <TaskStripRow active icon={Icons.pajamas({ size: 40, ...P })} label="Put on pajamas" />
        <TaskStripRow icon={Icons.toothbrush({ size: 40, ...P })} label="Brush teeth" />
        <TaskStripRow icon={Icons.toilet({ size: 40, ...P })} label="Go potty" />
        <TaskStripRow icon={Icons.book({ size: 40, ...P })} label="Read a book" />
        <TaskStripRow icon={Icons.lightbulb({ size: 40, ...P })} label="Lights off" />
        <TaskStripRow icon={Icons.heart({ size: 40, ...P })} label="Goodnight hug" />
      </div>
      {/* action buttons */}
      <div style={{
        position: 'absolute', bottom: 88, left: 24, right: 24,
        zIndex: 25, display: 'grid', gridTemplateColumns: '1fr 1fr 44px', gap: 8,
      }}>
        <button style={{
          padding: '12px', borderRadius: 12,
          background: C.card, border: `1px solid ${C.hair}`,
          fontFamily: C.fontBody, fontWeight: 600, fontSize: 13,
          color: C.ink,
        }}>New chart</button>
        <button style={{
          padding: '12px', borderRadius: 12,
          background: C.card, border: `1px solid ${C.hair}`,
          fontFamily: C.fontBody, fontWeight: 600, fontSize: 13,
          color: C.ink,
        }}>Configure</button>
        <button style={{
          padding: '12px 0', borderRadius: 12,
          background: C.card, border: `1px solid ${C.hair}`,
          fontFamily: C.fontBody, fontWeight: 700, fontSize: 13,
          color: C.ink,
        }}>⋯</button>
      </div>
      <DirC_TabBar active="steps" />
    </Phone>
  );
}

// ─── New Reward Chart ────────────────────────────────────────
function RewardTemplateRow({ title, route, steps }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '14px 16px', background: C.card,
      border: `1px solid ${C.hair}`, borderRadius: 12,
      marginBottom: 8,
    }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: C.fontDisplay, fontSize: 17, fontWeight: 500,
          color: C.ink, letterSpacing: -0.2, lineHeight: 1.1,
        }}>{title}</div>
        <div style={{
          fontFamily: C.fontBody, fontSize: 12, color: C.inkMuted,
          marginTop: 3, fontWeight: 500,
        }}>{route} · {steps} steps</div>
      </div>
      <button style={{
        width: 28, height: 28, borderRadius: 8,
        background: `${C.warn}12`, border: `1px solid ${C.warn}30`,
        color: C.warn, fontSize: 12, fontWeight: 700,
        cursor: 'pointer', padding: 0, flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>✕</button>
    </div>
  );
}

// Ghost of Steps behind a modal
function GhostSteps() {
  const P = C.iconPalette;
  return (
    <div style={{ position: 'absolute', inset: 0, opacity: 0.45 }}>
      <DirC_TopBar eyebrow="Bedtime · task strip" title="Bedtime" />
      <div style={{ padding: '14px 24px' }}>
        <TaskStripRow active icon={Icons.pajamas({ size: 40, ...P })} label="Put on pajamas" />
        <TaskStripRow icon={Icons.toothbrush({ size: 40, ...P })} label="Brush teeth" />
      </div>
    </div>
  );
}

function DirC_NewRewardChart() {
  return (
    <DirC_ModalShell label="C · New Reward Chart" backdrop={<GhostSteps/>} align="top">
      <ModalHeader title="New reward chart" />
      <div style={{
        fontFamily: C.fontBody, fontSize: 13, color: C.inkSoft,
        padding: '0 22px 10px', lineHeight: 1.4,
      }}>Start from a template or build from scratch.</div>
      <div style={{ padding: '6px 18px 6px', flex: 1, overflowY: 'auto' }}>
        <RewardTemplateRow title="Bedtime Routine" route="Bedtime" steps={6}/>
        <RewardTemplateRow title="Getting Dressed" route="Get Dressed → Looking good!" steps={5}/>
        <RewardTemplateRow title="Handwashing" route="Wash Hands → Clean hands!" steps={6}/>
        <RewardTemplateRow title="Potty Training" route="Potty Training → Great job!" steps={7}/>
        <RewardTemplateRow title="Brushing Teeth" route="Brush Teeth → Sparkly teeth!" steps={5}/>

        <div style={{
          padding: '14px 16px', border: `1.5px dashed ${C.hair}`,
          borderRadius: 12, textAlign: 'center', marginTop: 8,
          fontFamily: C.fontBody, fontSize: 14, fontWeight: 600,
          color: C.accent, background: C.card,
        }}>+ Start from scratch</div>
      </div>
      <div style={{ padding: '14px 18px 18px' }}>
        <div style={{
          padding: '14px', borderRadius: 12,
          background: C.bgAlt, textAlign: 'center',
          fontFamily: C.fontBody, fontSize: 14, fontWeight: 500,
          color: C.inkSoft,
        }}>Cancel</div>
      </div>
    </DirC_ModalShell>
  );
}

// ─── Task Strip row in editor (numbered) ────────────────────────────────────────
function EditTaskStripRow({ n, icon, label, placeholder, disableUp, disableDown }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8,
      padding: 8, marginBottom: 10,
      border: `1px solid ${C.hair}`, borderRadius: 14,
      background: C.card,
    }}>
      <div style={{
        width: 28, height: 28, borderRadius: 99,
        background: C.accent, flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: C.fontBody, fontSize: 13, fontWeight: 700, color: '#fff',
      }}>{n}</div>
      <div style={{
        width: 40, height: 40, borderRadius: 10,
        border: `1.5px dashed ${C.hair}`, flexShrink: 0,
        background: icon ? C.bgAlt : 'transparent',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>{icon || <div style={{ fontSize: 18, color: C.inkMuted }}>+</div>}</div>
      <div style={{
        flex: 1,
        padding: '10px 12px', border: `1px solid ${C.hair}`,
        borderRadius: 10, background: C.card,
        fontFamily: C.fontBody, fontSize: 14,
        color: label ? C.ink : C.inkMuted,
        minHeight: 18,
      }}>{label || placeholder || 'Step name…'}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <button style={{
          width: 24, height: 18, borderRadius: 5, border: `1px solid ${C.hair}`,
          background: C.card, color: disableUp ? C.inkMuted : C.accent,
          fontSize: 9, padding: 0, cursor: 'pointer',
          opacity: disableUp ? 0.3 : 1,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>▲</button>
        <button style={{
          width: 24, height: 18, borderRadius: 5, border: `1px solid ${C.hair}`,
          background: C.card, color: disableDown ? C.inkMuted : C.accent,
          fontSize: 9, padding: 0, cursor: 'pointer',
          opacity: disableDown ? 0.3 : 1,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>▼</button>
      </div>
      <button style={{
        width: 26, height: 40, borderRadius: 8,
        background: `${C.warn}12`, border: `1px solid ${C.warn}30`,
        color: C.warn, fontSize: 12, fontWeight: 700,
        cursor: 'pointer', padding: 0, flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>✕</button>
    </div>
  );
}

// ─── New Task Strip ────────────────────────────────────────
function DirC_NewTaskStrip() {
  return (
    <DirC_ModalShell label="C · New Task Strip" backdrop={<GhostSteps/>} align="top">
      <ModalHeader title="New task strip" />
      <div style={{ padding: '10px 18px 6px', flex: 1, overflowY: 'auto' }}>
        <div style={{
          fontFamily: C.fontBody, fontSize: 11, color: C.inkMuted,
          fontWeight: 600, letterSpacing: 1.2, textTransform: 'uppercase',
          marginBottom: 6,
        }}>What is this routine?</div>
        <div style={{
          padding: '12px 14px', border: `1px solid ${C.hair}`,
          borderRadius: 12, background: C.card, marginBottom: 16,
          fontFamily: C.fontDisplay, fontSize: 17, color: C.inkMuted, fontStyle: 'italic',
        }}>e.g. Bedtime</div>

        <div style={{
          fontFamily: C.fontBody, fontSize: 11, color: C.inkMuted,
          fontWeight: 600, letterSpacing: 1.2, textTransform: 'uppercase',
          marginBottom: 8,
        }}>Steps · 2 of 8</div>

        <EditTaskStripRow n="1" disableUp />
        <EditTaskStripRow n="2" disableDown />

        <div style={{
          padding: '14px 16px', border: `1.5px dashed ${C.hair}`,
          borderRadius: 12, textAlign: 'center', marginTop: 4,
          fontFamily: C.fontBody, fontSize: 14, fontWeight: 600,
          color: C.accent, background: C.card, marginBottom: 16,
        }}>+ Add step</div>

        <div style={{
          fontFamily: C.fontBody, fontSize: 11, color: C.inkMuted,
          fontWeight: 600, letterSpacing: 1.2, textTransform: 'uppercase',
          marginBottom: 6,
        }}>Reward (optional)</div>
        <div style={{
          padding: '12px 14px', border: `1px solid ${C.hair}`,
          borderRadius: 12, background: C.card, marginBottom: 14,
          fontFamily: C.fontBody, fontSize: 14, color: C.inkMuted, fontStyle: 'italic',
        }}>e.g. Sticker, extra story…</div>

        <div style={{
          fontFamily: C.fontBody, fontSize: 11, color: C.inkMuted,
          fontWeight: 600, letterSpacing: 1.2, textTransform: 'uppercase',
          marginBottom: 6,
        }}>Reward image</div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
          <button style={{
            flex: 1, padding: '10px 12px', borderRadius: 10,
            background: C.card, border: `1px solid ${C.hair}`,
            fontFamily: C.fontBody, fontWeight: 600, fontSize: 13,
            color: C.accent,
          }}>Upload image</button>
          <button style={{
            flex: 1, padding: '10px 12px', borderRadius: 10,
            background: C.card, border: `1px solid ${C.hair}`,
            fontFamily: C.fontBody, fontWeight: 500, fontSize: 13,
            color: C.inkSoft,
          }}>Remove</button>
        </div>

        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '10px 0', marginBottom: 6,
        }}>
          <div style={{
            fontFamily: C.fontBody, fontSize: 14, fontWeight: 500, color: C.ink,
          }}>Enable countdown timer</div>
          <div style={{
            width: 42, height: 24, borderRadius: 99,
            background: C.bgAlt, border: `1px solid ${C.hair}`,
            position: 'relative',
          }}>
            <div style={{
              position: 'absolute', top: 2, left: 2,
              width: 18, height: 18, borderRadius: 99,
              background: C.card, boxShadow: '0 1px 2px rgba(0,0,0,0.15)',
            }}/>
          </div>
        </div>
      </div>
      <div style={{
        padding: '14px 16px',
        borderTop: `1px solid ${C.hair}`, background: C.bg,
        display: 'flex', gap: 10,
      }}>
        <button style={{
          flex: 1, padding: '13px', borderRadius: 12,
          background: C.bgAlt, border: 'none',
          fontFamily: C.fontBody, fontWeight: 500, fontSize: 14,
          color: C.inkSoft,
        }}>Cancel</button>
        <button style={{
          flex: 1.2, padding: '13px', borderRadius: 12,
          background: C.accent, border: 'none',
          fontFamily: C.fontBody, fontWeight: 600, fontSize: 14,
          color: '#fff',
        }}>Save</button>
      </div>
    </DirC_ModalShell>
  );
}

// ─── Edit Task Strip (existing bedtime strip, 6 of 8 steps) ────────────────────────────────────────
function DirC_EditTaskStrip() {
  const P = C.iconPalette;
  return (
    <DirC_ModalShell label="C · Edit Task Strip" backdrop={<GhostSteps/>} align="top">
      <ModalHeader title="Edit task strip" />
      <div style={{ padding: '10px 18px 6px', flex: 1, overflowY: 'auto' }}>
        <div style={{
          fontFamily: C.fontBody, fontSize: 11, color: C.inkMuted,
          fontWeight: 600, letterSpacing: 1.2, textTransform: 'uppercase',
          marginBottom: 6,
        }}>What is this routine?</div>
        <div style={{
          padding: '12px 14px', border: `1px solid ${C.hair}`,
          borderRadius: 12, background: C.card, marginBottom: 16,
          fontFamily: C.fontDisplay, fontSize: 17, color: C.ink,
        }}>Bedtime</div>

        <div style={{
          fontFamily: C.fontBody, fontSize: 11, color: C.inkMuted,
          fontWeight: 600, letterSpacing: 1.2, textTransform: 'uppercase',
          marginBottom: 8,
        }}>Steps · 6 of 8</div>

        <EditTaskStripRow n="1" icon={Icons.pajamas({ size: 26, ...P })} label="Put on pajamas" disableUp/>
        <EditTaskStripRow n="2" icon={Icons.toothbrush({ size: 26, ...P })} label="Brush teeth"/>
        <EditTaskStripRow n="3" icon={Icons.toilet({ size: 26, ...P })} label="Go potty"/>
        <EditTaskStripRow n="4" icon={Icons.book({ size: 26, ...P })} label="Read a book"/>
        <EditTaskStripRow n="5" icon={Icons.lightbulb({ size: 26, ...P })} label="Lights off"/>
        <EditTaskStripRow n="6" icon={Icons.heart({ size: 26, ...P })} label="Goodnight hug" disableDown/>

        <div style={{
          padding: '14px 16px', border: `1.5px dashed ${C.hair}`,
          borderRadius: 12, textAlign: 'center', marginTop: 4,
          fontFamily: C.fontBody, fontSize: 14, fontWeight: 600,
          color: C.accent, background: C.card, marginBottom: 16,
        }}>+ Add step</div>

        <div style={{
          fontFamily: C.fontBody, fontSize: 11, color: C.inkMuted,
          fontWeight: 600, letterSpacing: 1.2, textTransform: 'uppercase',
          marginBottom: 6,
        }}>Reward</div>
        <div style={{
          padding: '12px 14px', border: `1px solid ${C.hair}`,
          borderRadius: 12, background: C.card, marginBottom: 14,
          fontFamily: C.fontBody, fontSize: 14, color: C.ink,
        }}>Sticker in the kindness jar</div>

        <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 14 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 12,
            background: C.accentSoft, flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>{Icons.heart({ size: 32, ...P })}</div>
          <div style={{ display: 'flex', gap: 8, flex: 1 }}>
            <button style={{
              flex: 1, padding: '10px 12px', borderRadius: 10,
              background: C.card, border: `1px solid ${C.hair}`,
              fontFamily: C.fontBody, fontWeight: 600, fontSize: 13,
              color: C.accent,
            }}>Change</button>
            <button style={{
              flex: 1, padding: '10px 12px', borderRadius: 10,
              background: C.card, border: `1px solid ${C.hair}`,
              fontFamily: C.fontBody, fontWeight: 500, fontSize: 13,
              color: C.inkSoft,
            }}>Remove</button>
          </div>
        </div>
      </div>
      <div style={{
        padding: '14px 16px',
        borderTop: `1px solid ${C.hair}`, background: C.bg,
        display: 'grid', gridTemplateColumns: '1fr 1fr 1.2fr', gap: 8,
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
          background: C.accent, border: 'none',
          fontFamily: C.fontBody, fontWeight: 600, fontSize: 13,
          color: '#fff',
        }}>Save</button>
      </div>
    </DirC_ModalShell>
  );
}

Object.assign(window, {
  DirC_Steps, // override
  DirC_NewRewardChart, DirC_NewTaskStrip, DirC_EditTaskStrip,
});
