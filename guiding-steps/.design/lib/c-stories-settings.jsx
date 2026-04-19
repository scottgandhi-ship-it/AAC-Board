// Storybook Canvas — Stories modals + Settings sheet
// Choose a Story sheet (2 states), Edit Story (Details + Page editor), Settings

// ─── Ghosted Stories backdrop ────────────────────────────────────────
function GhostStories() {
  const P = C.iconPalette;
  return (
    <div style={{ position: 'absolute', inset: 0, opacity: 0.45 }}>
      <DirC_TopBar eyebrow="Social stories · 3 saved" title="Stories" />
      <div style={{ padding: '8px 24px' }}>
        <DirC_StoryRow icon={Icons.store({ size: 60, ...P })} title="Going to the Grocery Store" reads="3" bg={C.accentSoft}/>
        <DirC_StoryRow icon={Icons.house({ size: 60, ...P })} title="First Day of School" reads="1" bg="#F0DDD2"/>
      </div>
    </div>
  );
}

// ─── Choose a Story row — icon + title + right action ────────────────
function ChooseStoryRow({ icon, title, meta, action = 'Open', bg, danger }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: 12, marginBottom: 8,
      background: C.card, borderRadius: 14,
      border: `1px solid ${C.hair}`,
    }}>
      <div style={{
        width: 52, height: 52, borderRadius: 10,
        background: bg || C.accentSoft, flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>{icon}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: C.fontDisplay, fontSize: 16, fontWeight: 500,
          color: C.ink, letterSpacing: -0.2, lineHeight: 1.15,
        }}>{title}</div>
        {meta && (
          <div style={{
            fontFamily: C.fontBody, fontSize: 11, color: C.inkMuted,
            marginTop: 3, fontWeight: 500,
          }}>{meta}</div>
        )}
      </div>
      <div style={{
        fontFamily: C.fontBody, fontSize: 13, fontWeight: 600,
        color: danger ? C.warn : C.accent, padding: '6px 10px',
      }}>{action}</div>
    </div>
  );
}

// ─── Choose a Story — top variant (newly opened sheet) ────────────────
function DirC_ChooseStory() {
  const P = C.iconPalette;
  // Full library — month's worth of stories so the sheet scrolls.
  const yours = [
    { icon: Icons.store, title: 'Going to the Grocery Store', meta: 'Read 3× · 7 pages', bg: C.accentSoft },
    { icon: Icons.house, title: 'First Day of School', meta: 'Read 1× · 9 pages', bg: '#F0DDD2' },
    { icon: Icons.scissors, title: 'Getting a Haircut', meta: 'Not yet read · 6 pages', bg: '#EDE5D5' },
    { icon: Icons.store, title: 'Visiting the Dentist', meta: 'Read 4× · 8 pages', bg: '#E3E7DE' },
    { icon: Icons.house, title: "Going to Grandma's House", meta: 'Read 7× · 7 pages', bg: '#F0DDE7' },
    { icon: Icons.book, title: 'Quiet Time at the Doctor', meta: 'Read 2× · 6 pages', bg: '#F0DDD2' },
    { icon: Icons.heart, title: 'Saying Goodbye at Drop-off', meta: 'Read 9× · 5 pages', bg: C.accentSoft },
    { icon: Icons.store, title: 'Ordering at a Restaurant', meta: 'Read 2× · 8 pages', bg: '#EDE5D5' },
  ];
  const templates = [
    { icon: Icons.toothbrush, title: 'Going to the Dentist', meta: '8 pages · ready to read', bg: '#E3E7DE' },
    { icon: Icons.heart, title: 'Visiting a New Place', meta: '6 pages · ready to read', bg: '#F0DDE7' },
    { icon: Icons.store, title: 'Waiting in Line', meta: '5 pages · ready to read', bg: '#F2DCDC' },
    { icon: Icons.house, title: 'Sleeping at a Friend’s House', meta: '10 pages · ready to read', bg: '#E7E2F0' },
  ];
  return (
    <DirC_ModalShell label="C · Choose a Story" backdrop={<GhostStories/>} align="top">
      {/* sticky header */}
      <div style={{ padding: '20px 20px 10px', borderBottom: `1px solid ${C.hair}`, background: C.bg }}>
        <div style={{
          fontFamily: C.fontDisplay, fontSize: 22, fontWeight: 400,
          color: C.ink, letterSpacing: -0.4, lineHeight: 1,
        }}>Choose a story</div>
        <div style={{
          fontFamily: C.fontBody, fontSize: 12, color: C.inkMuted,
          marginTop: 3, fontWeight: 500,
        }}>{yours.length} yours · {templates.length} templates · scroll for more</div>
      </div>

      {/* Scroll region */}
      <div style={{ position: 'relative', flex: 1, minHeight: 0 }}>
        <div style={{
          position: 'absolute', inset: 0, overflowY: 'auto',
          padding: '8px 16px 10px', WebkitOverflowScrolling: 'touch',
        }}>
          <div style={{
            fontFamily: C.fontBody, fontSize: 10.5, color: C.inkMuted,
            fontWeight: 600, letterSpacing: 1.2, textTransform: 'uppercase',
            margin: '4px 6px 8px',
          }}>Your stories</div>
          {yours.map((s, i) => (
            <ChooseStoryRow key={i} icon={s.icon({ size: 30, ...P })} title={s.title} meta={s.meta} bg={s.bg}/>
          ))}

          <div style={{
            fontFamily: C.fontBody, fontSize: 10.5, color: C.inkMuted,
            fontWeight: 600, letterSpacing: 1.2, textTransform: 'uppercase',
            margin: '16px 6px 8px',
          }}>Templates</div>
          {templates.map((s, i) => (
            <ChooseStoryRow key={i} icon={s.icon({ size: 30, ...P })} title={s.title} meta={s.meta} bg={s.bg} action="Add"/>
          ))}

          <div style={{
            padding: '14px 16px', border: `1.5px dashed ${C.hair}`,
            borderRadius: 12, textAlign: 'center', marginTop: 10,
            fontFamily: C.fontBody, fontSize: 14, fontWeight: 600,
            color: C.accent, background: C.card,
          }}>+ Start from scratch</div>
        </div>

        {/* fade at bottom fold — signals more content below */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: 28,
          background: `linear-gradient(to top, ${C.bg}, rgba(0,0,0,0))`,
          pointerEvents: 'none',
        }}/>
        {/* scroll track indicator (static; hints scroll affordance) */}
        <div style={{
          position: 'absolute', right: 4, top: 10, bottom: 34,
          width: 3, borderRadius: 2, background: 'rgba(79,70,184,0.08)',
          pointerEvents: 'none',
        }}>
          <div style={{
            position: 'absolute', top: 6, left: 0, width: 3, height: 60,
            borderRadius: 2, background: C.accent, opacity: 0.35,
          }}/>
        </div>
      </div>

      <div style={{
        padding: '14px 18px', borderTop: `1px solid ${C.hair}`,
        background: C.bg,
      }}>
        <div style={{
          padding: '12px', borderRadius: 12,
          background: C.bgAlt, textAlign: 'center',
          fontFamily: C.fontBody, fontSize: 14, fontWeight: 500,
          color: C.inkSoft,
        }}>Cancel</div>
      </div>
    </DirC_ModalShell>
  );
}

// ─── Choose a Story — scrolled variant (shows bottom, sticky search) ────
function DirC_ChooseStoryScrolled() {
  const P = C.iconPalette;
  return (
    <DirC_ModalShell label="C · Choose a Story (scrolled)" backdrop={<GhostStories/>} align="top">
      {/* sticky header with search */}
      <div style={{
        padding: '18px 18px 12px',
        borderBottom: `1px solid ${C.hair}`, background: C.bg,
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: 10,
        }}>
          <div style={{
            fontFamily: C.fontDisplay, fontSize: 20, fontWeight: 400,
            color: C.ink, letterSpacing: -0.3,
          }}>Choose a story</div>
          <div style={{
            fontFamily: C.fontBody, fontSize: 12, color: C.inkMuted,
            fontWeight: 500,
          }}>8 total</div>
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '10px 12px', borderRadius: 10,
          background: C.card, border: `1px solid ${C.hair}`,
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="6" stroke={C.inkMuted} strokeWidth="2"/>
            <path d="M20 20 L16 16" stroke={C.inkMuted} strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <div style={{
            fontFamily: C.fontBody, fontSize: 13, color: C.ink, flex: 1,
          }}>haircut</div>
          <div style={{
            width: 16, height: 16, borderRadius: 99,
            background: C.bgAlt, display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 10, color: C.inkMuted, fontWeight: 700,
          }}>✕</div>
        </div>
      </div>

      {/* Scrolled list — results section + templates */}
      <div style={{ padding: '10px 16px', flex: 1, overflowY: 'auto' }}>
        <div style={{
          fontFamily: C.fontBody, fontSize: 10.5, color: C.inkMuted,
          fontWeight: 600, letterSpacing: 1.2, textTransform: 'uppercase',
          margin: '4px 6px 8px',
        }}>1 match in your stories</div>
        <ChooseStoryRow icon={Icons.scissors({ size: 30, ...P })} title="Getting a Haircut" meta="Not yet read · 6 pages" bg="#EDE5D5"/>

        <div style={{
          fontFamily: C.fontBody, fontSize: 10.5, color: C.inkMuted,
          fontWeight: 600, letterSpacing: 1.2, textTransform: 'uppercase',
          margin: '16px 6px 8px',
        }}>2 matches in templates</div>
        <ChooseStoryRow icon={Icons.scissors({ size: 30, ...P })} title="First Haircut" meta="5 pages · ready to add" bg="#F0DDE7" action="Add"/>
        <ChooseStoryRow icon={Icons.scissors({ size: 30, ...P })} title="Salon Visit" meta="7 pages · ready to add" bg="#E3E7DE" action="Add"/>

        <div style={{ height: 20 }}/>

        {/* recently removed inline */}
        <div style={{
          padding: 14, borderRadius: 12,
          background: C.bgAlt, border: `1px dashed ${C.hair}`,
          marginTop: 6,
        }}>
          <div style={{
            fontFamily: C.fontBody, fontSize: 11, color: C.inkMuted,
            fontWeight: 600, letterSpacing: 1.2, textTransform: 'uppercase',
            marginBottom: 4,
          }}>Recently removed</div>
          <div style={{
            fontFamily: C.fontBody, fontSize: 13, color: C.inkSoft,
            lineHeight: 1.4,
          }}>"Visiting Grandma's" · removed yesterday · <span style={{ color: C.accent, fontWeight: 600 }}>Restore</span></div>
        </div>
      </div>

      <div style={{
        padding: '14px 18px', borderTop: `1px solid ${C.hair}`,
        background: C.bg,
      }}>
        <div style={{
          padding: '12px', borderRadius: 12,
          background: C.bgAlt, textAlign: 'center',
          fontFamily: C.fontBody, fontSize: 14, fontWeight: 500,
          color: C.inkSoft,
        }}>Cancel</div>
      </div>
    </DirC_ModalShell>
  );
}

// ─── Edit Story — Details tab ────────────────────────────────────────
function DirC_EditStoryDetails() {
  const P = C.iconPalette;
  return (
    <DirC_ModalShell label="C · Edit Story — Details" backdrop={<GhostStories/>} align="top">
      <div style={{
        padding: '18px 22px 10px',
        borderBottom: `1px solid ${C.hair}`,
      }}>
        <div style={{
          fontFamily: C.fontBody, fontSize: 11, color: C.inkMuted,
          fontWeight: 600, letterSpacing: 1.4, textTransform: 'uppercase',
          marginBottom: 4,
        }}>Edit story · 7 pages</div>
        <div style={{
          fontFamily: C.fontDisplay, fontSize: 24, fontWeight: 400,
          color: C.ink, letterSpacing: -0.5, lineHeight: 1,
        }}>Going to the Grocery Store</div>
        {/* tab bar */}
        <div style={{
          display: 'flex', gap: 0, marginTop: 14, borderBottom: `1px solid transparent`,
        }}>
          <div style={{
            padding: '8px 0', marginRight: 24,
            borderBottom: `2px solid ${C.accent}`,
            fontFamily: C.fontBody, fontSize: 13, fontWeight: 600,
            color: C.accent,
          }}>Details</div>
          <div style={{
            padding: '8px 0',
            fontFamily: C.fontBody, fontSize: 13, fontWeight: 500,
            color: C.inkMuted,
          }}>Pages · 7</div>
        </div>
      </div>
      <div style={{ padding: '14px 18px 6px', flex: 1, overflowY: 'auto' }}>
        <div style={{
          fontFamily: C.fontBody, fontSize: 11, color: C.inkMuted,
          fontWeight: 600, letterSpacing: 1.2, textTransform: 'uppercase',
          marginBottom: 6,
        }}>Title</div>
        <div style={{
          padding: '12px 14px', border: `1px solid ${C.hair}`,
          borderRadius: 12, background: C.card, marginBottom: 14,
          fontFamily: C.fontDisplay, fontSize: 18, color: C.ink,
        }}>Going to the Grocery Store</div>

        <div style={{
          fontFamily: C.fontBody, fontSize: 11, color: C.inkMuted,
          fontWeight: 600, letterSpacing: 1.2, textTransform: 'uppercase',
          marginBottom: 6,
        }}>Description (optional)</div>
        <div style={{
          padding: '12px 14px', border: `1px solid ${C.hair}`,
          borderRadius: 12, background: C.card, marginBottom: 14,
          fontFamily: C.fontBody, fontSize: 13, color: C.inkSoft,
          lineHeight: 1.4, minHeight: 56,
        }}>A story about our regular Tuesday trip to Foodco with Mommy.</div>

        <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
          <div style={{ flex: 1 }}>
            <div style={{
              fontFamily: C.fontBody, fontSize: 11, color: C.inkMuted,
              fontWeight: 600, letterSpacing: 1.2, textTransform: 'uppercase',
              marginBottom: 6,
            }}>Cover</div>
            <div style={{
              width: '100%', aspectRatio: '1', borderRadius: 12,
              background: C.accentSoft, border: `1px solid ${C.hair}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>{Icons.store({ size: 60, ...P })}</div>
          </div>
          <div style={{ flex: 2, display: 'flex', flexDirection: 'column', gap: 8, paddingTop: 22 }}>
            <div style={{
              padding: '10px 12px', borderRadius: 10,
              background: C.card, border: `1px solid ${C.hair}`,
              fontFamily: C.fontBody, fontWeight: 600, fontSize: 13,
              color: C.accent, textAlign: 'center',
            }}>Choose icon</div>
            <div style={{
              padding: '10px 12px', borderRadius: 10,
              background: C.card, border: `1px solid ${C.hair}`,
              fontFamily: C.fontBody, fontWeight: 500, fontSize: 13,
              color: C.inkSoft, textAlign: 'center',
            }}>Upload photo</div>
          </div>
        </div>

        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '10px 0', marginBottom: 4,
        }}>
          <div>
            <div style={{
              fontFamily: C.fontBody, fontSize: 14, fontWeight: 500, color: C.ink,
            }}>Read aloud on open</div>
            <div style={{
              fontFamily: C.fontBody, fontSize: 11.5, color: C.inkMuted, marginTop: 2,
            }}>Voice starts when first page appears</div>
          </div>
          <div style={{
            width: 42, height: 24, borderRadius: 99,
            background: C.accent, position: 'relative',
          }}>
            <div style={{
              position: 'absolute', top: 2, right: 2,
              width: 20, height: 20, borderRadius: 99,
              background: '#fff', boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
            }}/>
          </div>
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '10px 0',
        }}>
          <div>
            <div style={{
              fontFamily: C.fontBody, fontSize: 14, fontWeight: 500, color: C.ink,
            }}>Share with co-parent</div>
            <div style={{
              fontFamily: C.fontBody, fontSize: 11.5, color: C.inkMuted, marginTop: 2,
            }}>Dana · read-only access</div>
          </div>
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
        padding: '14px 16px', borderTop: `1px solid ${C.hair}`, background: C.bg,
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

// ─── Edit Story — Page editor ────────────────────────────────────────
function DirC_EditStoryPage() {
  const P = C.iconPalette;
  return (
    <DirC_ModalShell label="C · Edit Story — Page 3" backdrop={<GhostStories/>} align="top">
      <div style={{
        padding: '18px 22px 10px',
        borderBottom: `1px solid ${C.hair}`,
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: 4,
        }}>
          <div style={{
            fontFamily: C.fontBody, fontSize: 11, color: C.inkMuted,
            fontWeight: 600, letterSpacing: 1.4, textTransform: 'uppercase',
          }}>Going to the Grocery Store</div>
          <div style={{
            fontFamily: C.fontBody, fontSize: 11, color: C.accent,
            fontWeight: 600,
          }}>‹ Back to story</div>
        </div>
        <div style={{
          fontFamily: C.fontDisplay, fontSize: 22, fontWeight: 400,
          color: C.ink, letterSpacing: -0.4, lineHeight: 1,
        }}>Page 3 of 7</div>
        {/* page reel */}
        <div style={{
          display: 'flex', gap: 6, marginTop: 12, overflowX: 'auto', paddingBottom: 4,
        }}>
          {[1,2,3,4,5,6,7].map(i => (
            <div key={i} style={{
              width: 36, height: 44, borderRadius: 8,
              background: i === 3 ? C.accentSoft : C.card,
              border: `1px solid ${i === 3 ? C.accent : C.hair}`,
              flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: C.fontBody, fontSize: 11, fontWeight: 600,
              color: i === 3 ? C.accent : C.inkMuted,
            }}>{i}</div>
          ))}
          <div style={{
            width: 36, height: 44, borderRadius: 8,
            border: `1.5px dashed ${C.hair}`, flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: C.inkMuted, fontSize: 18, fontWeight: 400,
          }}>+</div>
        </div>
      </div>
      <div style={{ padding: '14px 18px 6px', flex: 1, overflowY: 'auto' }}>
        <div style={{
          fontFamily: C.fontBody, fontSize: 11, color: C.inkMuted,
          fontWeight: 600, letterSpacing: 1.2, textTransform: 'uppercase',
          marginBottom: 6,
        }}>Image</div>
        <div style={{
          width: '100%', aspectRatio: '16/10', borderRadius: 12,
          background: C.accentSoft, border: `1px solid ${C.hair}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: 8, position: 'relative',
        }}>
          {Icons.store({ size: 80, ...P })}
          <div style={{
            position: 'absolute', bottom: 8, right: 8,
            padding: '5px 10px', borderRadius: 8,
            background: C.card, border: `1px solid ${C.hair}`,
            fontFamily: C.fontBody, fontSize: 11, fontWeight: 600,
            color: C.accent,
          }}>Replace</div>
        </div>

        <div style={{
          fontFamily: C.fontBody, fontSize: 11, color: C.inkMuted,
          fontWeight: 600, letterSpacing: 1.2, textTransform: 'uppercase',
          marginBottom: 6, marginTop: 14,
        }}>Text</div>
        <div style={{
          padding: '14px 16px', border: `1.5px solid ${C.accent}`,
          borderRadius: 12, background: C.card, marginBottom: 6,
          fontFamily: C.fontDisplay, fontSize: 17, color: C.ink,
          lineHeight: 1.35, minHeight: 70,
        }}>
          When we get inside, I can ride in the cart or walk next to Mommy.<span style={{ display: 'inline-block', width: 2, height: 18, background: C.accent, verticalAlign: 'text-bottom', marginLeft: 1, animation: 'none' }}/>
        </div>
        <div style={{
          fontFamily: C.fontBody, fontSize: 11, color: C.inkMuted,
          marginBottom: 14, paddingLeft: 4,
        }}>13 words · reads in about 7 seconds</div>

        <div style={{
          fontFamily: C.fontBody, fontSize: 11, color: C.inkMuted,
          fontWeight: 600, letterSpacing: 1.2, textTransform: 'uppercase',
          marginBottom: 6,
        }}>Voice note (optional)</div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12,
          padding: '12px 14px', borderRadius: 12,
          background: C.card, border: `1px solid ${C.hair}`,
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: 99,
            background: C.accent, flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <div style={{ width: 10, height: 10, borderRadius: 2, background: '#fff' }}/>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{
              fontFamily: C.fontBody, fontSize: 13, fontWeight: 500, color: C.ink,
            }}>Tap to record Mommy's voice</div>
            <div style={{
              fontFamily: C.fontBody, fontSize: 11, color: C.inkMuted, marginTop: 2,
            }}>Plays instead of read-aloud on this page</div>
          </div>
        </div>
      </div>

      <div style={{
        padding: '14px 16px', borderTop: `1px solid ${C.hair}`, background: C.bg,
        display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1.2fr', gap: 6,
      }}>
        <button style={{
          padding: '11px 4px', borderRadius: 10,
          background: C.bgAlt, border: 'none',
          fontFamily: C.fontBody, fontWeight: 500, fontSize: 12,
          color: C.inkSoft,
        }}>Cancel</button>
        <button style={{
          padding: '11px 4px', borderRadius: 10,
          background: C.card, border: `1px solid ${C.hair}`,
          fontFamily: C.fontBody, fontWeight: 500, fontSize: 12,
          color: C.inkSoft,
        }}>Duplicate</button>
        <button style={{
          padding: '11px 4px', borderRadius: 10,
          background: `${C.warn}12`, border: `1px solid ${C.warn}30`,
          fontFamily: C.fontBody, fontWeight: 600, fontSize: 12,
          color: C.warn,
        }}>Delete</button>
        <button style={{
          padding: '11px 4px', borderRadius: 10,
          background: C.accent, border: 'none',
          fontFamily: C.fontBody, fontWeight: 600, fontSize: 12,
          color: '#fff',
        }}>Save page</button>
      </div>
    </DirC_ModalShell>
  );
}

// ─── Settings sheet ────────────────────────────────────────
function SettingsRow({ label, value, trailing = 'chevron', icon, meta }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '14px 16px',
      background: C.card, borderBottom: `1px solid ${C.hairSoft}`,
    }}>
      {icon && (
        <div style={{
          width: 32, height: 32, borderRadius: 8,
          background: C.accentSoft, flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: C.accent,
        }}>{icon}</div>
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: C.fontBody, fontSize: 14, fontWeight: 500, color: C.ink,
        }}>{label}</div>
        {meta && (
          <div style={{
            fontFamily: C.fontBody, fontSize: 11.5, color: C.inkMuted,
            marginTop: 2,
          }}>{meta}</div>
        )}
      </div>
      {value && (
        <div style={{
          fontFamily: C.fontBody, fontSize: 13, color: C.inkSoft, fontWeight: 500,
        }}>{value}</div>
      )}
      {trailing === 'chevron' && (
        <div style={{ color: C.inkMuted }}>{TabIcons.chevronR(C.inkMuted, 2)}</div>
      )}
      {trailing === 'toggleOn' && (
        <div style={{
          width: 42, height: 24, borderRadius: 99,
          background: C.accent, position: 'relative',
        }}>
          <div style={{
            position: 'absolute', top: 2, right: 2,
            width: 20, height: 20, borderRadius: 99,
            background: '#fff', boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
          }}/>
        </div>
      )}
      {trailing === 'toggleOff' && (
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
      )}
    </div>
  );
}

function SettingsSection({ title, children }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{
        fontFamily: C.fontBody, fontSize: 11, color: C.inkMuted,
        fontWeight: 600, letterSpacing: 1.4, textTransform: 'uppercase',
        padding: '0 18px 6px',
      }}>{title}</div>
      <div style={{
        borderRadius: 14, overflow: 'hidden', marginInline: 14,
        border: `1px solid ${C.hair}`,
      }}>
        {children}
      </div>
    </div>
  );
}

function DirC_Settings() {
  return (
    <Phone bg={C.bg} label="C · Settings">
      <StatusBar color={C.ink} />
      <DirC_TopBar eyebrow="Account · Dana's family" title="Settings" />

      <div style={{ overflowY: 'auto', paddingBottom: 120 }}>
        <SettingsSection title="Child">
          <SettingsRow label="Leo's profile" meta="Age 5 · reading level: emerging" trailing="chevron"/>
          <SettingsRow label="Voice for read-aloud" value="Soft · female" trailing="chevron"/>
          <SettingsRow label="Text size in stories" value="Large" trailing="chevron"/>
        </SettingsSection>

        <SettingsSection title="Routines & rewards">
          <SettingsRow label="Show reward charts" trailing="toggleOn" meta="Hide stickers if overwhelming"/>
          <SettingsRow label="Countdown timer" trailing="toggleOff" meta="Show minutes remaining on each step"/>
          <SettingsRow label="Celebration sounds" trailing="toggleOn"/>
        </SettingsSection>

        <SettingsSection title="Accessibility">
          <SettingsRow label="Reduce motion" trailing="toggleOn"/>
          <SettingsRow label="High-contrast mode" trailing="toggleOff"/>
          <SettingsRow label="Long-press duration" value="0.3s" trailing="chevron" meta="Range: 0.2–0.4s · prevents accidental Done taps"/>
        </SettingsSection>

        <SettingsSection title="Sharing & backup">
          <SettingsRow label="Co-parent access" value="Dana · viewing" trailing="chevron"/>
          <SettingsRow label="Export routines & stories" trailing="chevron" meta="PDF or printable flashcards"/>
          <SettingsRow label="Backup to iCloud" trailing="toggleOn" meta="Last backup · yesterday 9:41pm"/>
        </SettingsSection>

        <SettingsSection title="About">
          <SettingsRow label="Send feedback" trailing="chevron"/>
          <SettingsRow label="Privacy" trailing="chevron"/>
          <SettingsRow label="Version" value="1.4.2" trailing={null}/>
        </SettingsSection>
      </div>

      <DirC_TabBar active="settings" />
    </Phone>
  );
}

Object.assign(window, {
  DirC_ChooseStory, DirC_ChooseStoryScrolled,
  DirC_EditStoryDetails, DirC_EditStoryPage,
  DirC_Settings,
});
