// Direction C — "Storybook Canvas"
// Calm, editorial, ultra-readable. Low-stimulation cream, single deep-teal accent,
// Fraunces display + humanist sans. Progress: numbered breadcrumbs + a left "spine" line.
// Done: long-press to confirm (ring fills).

// Revised palette — shifts away from teal "gardening" toward a dusk/cocoa story-time
// vibe. Single indigo accent on a warm ivory canvas. Calm, still low-stim.
const C = {
  bg: '#FBF6EC',           // warm ivory
  bgAlt: '#F0E8D6',
  card: '#FFFFFF',
  ink: '#1B1D2E',          // indigo-black
  inkSoft: '#4A4D63',
  inkMuted: '#8F8FA3',
  accent: '#4F46B8',       // deep indigo
  accentSoft: '#E2DFF6',
  accentDeep: '#2E2782',
  warn: '#C5553A',         // terracotta for delete
  hair: 'rgba(27,29,46,0.1)',
  hairSoft: 'rgba(27,29,46,0.05)',
  shadow: '0 1px 2px rgba(27,29,46,0.04), 0 8px 24px rgba(27,29,46,0.06)',

  iconPalette: {
    warm: '#E07B3E', warmPale: '#F7D9BF',
    cool: '#4F46B8', coolPale: '#E2DFF6',
    accent: '#C5553A', accentDeep: '#8A3520',
    neutral: '#E6DEC9', neutralDeep: '#A69A7B',
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

// ─ SCREEN 2: Steps (Bedtime) ─ [legacy, overridden by c-steps.jsx]
function DirC_Steps_Legacy() {
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
function DirC_StoryRow({ icon, title, reads, bg, when }) {
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
        {(reads || when) && (
          <div style={{
            fontFamily: C.fontBody, fontSize: 12, color: C.inkMuted,
            marginTop: 2, fontWeight: 500,
          }}>
            {reads ? `Read ${reads}× · 7 pages` : '7 pages'}
            {when ? ` · ${when}` : ''}
          </div>
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
  // Full library — 12 stories so the list obviously scrolls. Recency matters; parents
  // keep month-old stories around for repeat trips.
  const library = [
    { icon: Icons.store, title: 'Going to the Grocery Store', reads: '3', bg: C.accentSoft, when: 'Read yesterday' },
    { icon: Icons.house, title: 'First Day of School', reads: '1', bg: '#F0DDD2', when: 'Read last week' },
    { icon: Icons.scissors, title: 'Getting a Haircut', bg: '#EDE5D5', when: 'Not yet read' },
    { icon: Icons.store, title: 'Visiting the Dentist', reads: '4', bg: '#E3E7DE', when: 'Read 3 days ago' },
    { icon: Icons.house, title: "Going to Grandma's House", reads: '7', bg: '#F0DDE7', when: 'Read last Sunday' },
    { icon: Icons.store, title: 'Trip to the Library', reads: '2', bg: '#E7E2F0', when: 'Read last week' },
    { icon: Icons.scissors, title: 'Getting a Flu Shot', reads: '1', bg: '#F2DCDC', when: 'Read 2 weeks ago' },
    { icon: Icons.house, title: 'Family Car Ride to Auntie Jo', bg: '#E5E5D9', when: 'Not yet read' },
    { icon: Icons.store, title: 'Ordering at a Restaurant', reads: '2', bg: '#EDE5D5', when: 'Read 3 weeks ago' },
    { icon: Icons.heart, title: 'Saying Goodbye at Drop-off', reads: '9', bg: C.accentSoft, when: 'Read yesterday' },
    { icon: Icons.book, title: 'Quiet Time at the Doctor', reads: '2', bg: '#F0DDD2', when: 'Read 2 weeks ago' },
    { icon: Icons.heart, title: "When Dad Goes on a Trip", reads: '1', bg: '#F0DDE7', when: 'Read 3 weeks ago' },
  ];
  return (
    <Phone bg={C.bg} label="C · Stories">
      <StatusBar color={C.ink} />
      <DirC_TopBar eyebrow={`Social stories · ${library.length} saved`} title="Stories" />
      {/* Scroll region between the header and the sticky bottom bar */}
      <div style={{
        position: 'absolute', top: 140, bottom: 170, left: 0, right: 0,
        overflowY: 'auto', padding: '0 24px 8px',
        WebkitOverflowScrolling: 'touch',
      }}>
        {/* Section label: recents */}
        <div style={{
          fontFamily: C.fontBody, fontSize: 10.5, color: C.inkMuted,
          fontWeight: 600, letterSpacing: 1.2, textTransform: 'uppercase',
          margin: '6px 2px 8px',
        }}>Recent</div>
        {library.slice(0, 3).map((s, i) => (
          <DirC_StoryRow key={i} icon={s.icon({ size: 60, ...P })} title={s.title} reads={s.reads} bg={s.bg} when={s.when}/>
        ))}
        <div style={{
          fontFamily: C.fontBody, fontSize: 10.5, color: C.inkMuted,
          fontWeight: 600, letterSpacing: 1.2, textTransform: 'uppercase',
          margin: '14px 2px 8px',
        }}>This month</div>
        {library.slice(3).map((s, i) => (
          <DirC_StoryRow key={i} icon={s.icon({ size: 60, ...P })} title={s.title} reads={s.reads} bg={s.bg} when={s.when}/>
        ))}
        {/* create row lives at the end of the list */}
        <div style={{
          display: 'flex', gap: 14, alignItems: 'center',
          padding: 14, borderRadius: 18, marginTop: 10,
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
      {/* Soft fade at the bottom so rows bleed under the sticky bar */}
      <div style={{
        position: 'absolute', bottom: 158, left: 0, right: 0, height: 28,
        background: `linear-gradient(to top, ${C.bg}, rgba(0,0,0,0))`,
        pointerEvents: 'none', zIndex: 24,
      }}/>
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
  DirC_Schedule, DirC_Stories, DirC_Reader, DirC_ScheduleSettings,
});
