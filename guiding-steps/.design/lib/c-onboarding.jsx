// Storybook Canvas — Onboarding (3 slides)
// Flat ivory background, one decorative motif per slide, indigo primary.

function DirC_OnbShell({ dotIndex, children }) {
  return (
    <Phone bg={C.bg} label={`C · Onboarding ${dotIndex + 1}/3`}>
      <StatusBar color={C.ink} />
      {children}
      <div style={{
        position: 'absolute', bottom: 70, left: 0, right: 0,
        display: 'flex', justifyContent: 'center', gap: 8,
      }}>
        {[0,1,2].map(i => (
          <div key={i} style={{
            width: i === dotIndex ? 22 : 7, height: 7, borderRadius: 99,
            background: i === dotIndex ? C.accent : C.hair,
            transition: 'all 0.2s',
          }}/>
        ))}
      </div>
    </Phone>
  );
}

// Rising sun with face and rays — clearly reads as sunrise
function OnbMotif1() {
  // 12 rays evenly around the disk
  const rays = Array.from({length: 12}).map((_, i) => {
    const angle = (i * 30 - 90) * Math.PI / 180;
    const cx = 130, cy = 90, r1 = 48, r2 = i % 2 === 0 ? 64 : 58;
    const x1 = cx + Math.cos(angle) * r1;
    const y1 = cy + Math.sin(angle) * r1;
    const x2 = cx + Math.cos(angle) * r2;
    const y2 = cy + Math.sin(angle) * r2;
    return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
      stroke={C.iconPalette.warm} strokeWidth="3" strokeLinecap="round" opacity={i % 2 === 0 ? 1 : 0.7}/>;
  });
  return (
    <svg width="260" height="180" viewBox="0 0 260 180" fill="none">
      {/* horizon line — solid so it clearly reads as ground */}
      <path d="M10 150 Q130 130 250 150" stroke={C.iconPalette.warm} strokeWidth="2" opacity="0.4" fill="none"/>
      {/* sun disk */}
      <circle cx="130" cy="90" r="42" fill={C.iconPalette.warmPale}/>
      <circle cx="130" cy="90" r="42" fill="none" stroke={C.iconPalette.warm} strokeWidth="2.5"/>
      {/* rays */}
      {rays}
      {/* friendly face */}
      <circle cx="116" cy="85" r="3" fill={C.iconPalette.accentDeep}/>
      <circle cx="144" cy="85" r="3" fill={C.iconPalette.accentDeep}/>
      <path d="M113 98 Q130 110 147 98" stroke={C.iconPalette.accentDeep} strokeWidth="2.5" strokeLinecap="round" fill="none"/>
      {/* rosy cheeks */}
      <circle cx="108" cy="98" r="4" fill={C.iconPalette.accent} opacity="0.25"/>
      <circle cx="152" cy="98" r="4" fill={C.iconPalette.accent} opacity="0.25"/>
    </svg>
  );
}

// Friendly child character — head connected to body via neck + shoulder line
function OnbMotif2() {
  return (
    <svg width="200" height="210" viewBox="0 0 200 210" fill="none">
      {/* body: torso shape that meets the head */}
      <path d="M50 200 L55 150 Q60 128 80 124 L120 124 Q140 128 145 150 L150 200 Z"
        fill={C.bgAlt} stroke={C.accent} strokeWidth="2" strokeLinejoin="round"/>
      {/* neck: bridges head and torso so head isn't floating */}
      <rect x="90" y="100" width="20" height="28" fill={C.accentSoft} stroke={C.accent} strokeWidth="2"/>
      {/* head */}
      <circle cx="100" cy="70" r="34" fill={C.accentSoft}/>
      <circle cx="100" cy="70" r="34" fill="none" stroke={C.accent} strokeWidth="2"/>
      {/* hair tuft */}
      <path d="M78 48 Q90 36 100 42 Q108 34 122 48" stroke={C.accent} strokeWidth="2.5" strokeLinecap="round" fill="none"/>
      {/* face */}
      <circle cx="90" cy="68" r="2.5" fill={C.ink}/>
      <circle cx="110" cy="68" r="2.5" fill={C.ink}/>
      <path d="M88 82 Q100 90 112 82" stroke={C.ink} strokeWidth="2" strokeLinecap="round" fill="none"/>
      {/* rosy cheeks */}
      <circle cx="80" cy="78" r="3.5" fill={C.iconPalette.warm} opacity="0.35"/>
      <circle cx="120" cy="78" r="3.5" fill={C.iconPalette.warm} opacity="0.35"/>
      {/* little accent hearts */}
      <path d="M40 150 C35 146 35 140 39 140 C41 140 43 142 43 144 C43 142 45 140 47 140 C51 140 51 146 43 154 Z" fill={C.iconPalette.accent} opacity="0.6"/>
      <path d="M162 60 C157 56 157 50 161 50 C163 50 165 52 165 54 C165 52 167 50 169 50 C173 50 173 56 165 64 Z" fill={C.iconPalette.warm} opacity="0.6"/>
    </svg>
  );
}

function DirC_Onb_Welcome() {
  return (
    <DirC_OnbShell dotIndex={0}>
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        padding: '90px 32px 140px', alignItems: 'center',
      }}>
        <div style={{ flex: 0.4 }}/>
        <OnbMotif1 />
        <div style={{ flex: 0.25 }}/>
        <div style={{
          fontFamily: C.fontDisplay, fontSize: 32, fontWeight: 400,
          color: C.ink, letterSpacing: -0.6, lineHeight: 1.1,
          textAlign: 'center', maxWidth: 320,
        }}>Every day is a little easier when your child knows what's next.</div>
        <div style={{
          fontFamily: C.fontBody, fontSize: 15, color: C.inkSoft,
          lineHeight: 1.5, marginTop: 16, textAlign: 'center', maxWidth: 300,
        }}>Guiding Steps helps your child follow routines, earn rewards, and understand social situations.</div>
        <div style={{ flex: 1 }}/>
        <button style={{
          width: '100%', padding: '16px', borderRadius: 14,
          background: C.accent, border: 'none',
          fontFamily: C.fontBody, fontWeight: 600, fontSize: 16,
          color: '#fff', letterSpacing: 0.1,
        }}>Get started</button>
        <button style={{
          background: 'none', border: 'none', marginTop: 14,
          fontFamily: C.fontBody, fontWeight: 500, fontSize: 14,
          color: C.inkMuted,
        }}>Skip</button>
      </div>
    </DirC_OnbShell>
  );
}

function DirC_Onb_Name() {
  return (
    <DirC_OnbShell dotIndex={1}>
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        padding: '90px 32px 140px', alignItems: 'center',
      }}>
        <div style={{ flex: 0.4 }}/>
        <OnbMotif2 />
        <div style={{ flex: 0.15 }}/>
        <div style={{
          fontFamily: C.fontDisplay, fontSize: 30, fontWeight: 400,
          color: C.ink, letterSpacing: -0.6, lineHeight: 1.1,
          textAlign: 'center',
        }}>Who are we helping today?</div>
        <div style={{
          fontFamily: C.fontBody, fontSize: 14, color: C.inkSoft,
          lineHeight: 1.5, marginTop: 12, textAlign: 'center', maxWidth: 280,
        }}>We'll use their name to make stories and schedules feel personal.</div>
        <div style={{ width: '100%', marginTop: 28 }}>
          <div style={{
            fontFamily: C.fontBody, fontSize: 12, color: C.inkMuted,
            fontWeight: 600, letterSpacing: 1.2, textTransform: 'uppercase',
            marginBottom: 8,
          }}>Child's name</div>
          <div style={{
            padding: '16px 18px', borderRadius: 14,
            background: C.card, border: `1.5px solid ${C.accent}`,
            fontFamily: C.fontDisplay, fontSize: 20,
            color: C.ink, letterSpacing: -0.3, position: 'relative',
          }}>Sadie
            <div style={{
              position: 'absolute', right: 18, top: '50%',
              transform: 'translateY(-50%)',
              width: 1.5, height: 22, background: C.accent,
              animation: 'none',
            }}/>
          </div>
        </div>
        <div style={{ flex: 1 }}/>
        <button style={{
          width: '100%', padding: '16px', borderRadius: 14,
          background: C.accent, border: 'none',
          fontFamily: C.fontBody, fontWeight: 600, fontSize: 16,
          color: '#fff',
        }}>Next</button>
        <button style={{
          background: 'none', border: 'none', marginTop: 14,
          fontFamily: C.fontBody, fontWeight: 500, fontSize: 14,
          color: C.inkMuted,
        }}>Skip for now</button>
      </div>
    </DirC_OnbShell>
  );
}

function OnbToolRow({ icon, title, sub }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 16, padding: '16px 18px',
      background: C.card, borderRadius: 16, marginBottom: 12,
      border: `1px solid ${C.hair}`,
    }}>
      <div style={{
        width: 48, height: 48, borderRadius: 12,
        background: C.accentSoft, flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>{icon}</div>
      <div style={{ flex: 1 }}>
        <div style={{
          fontFamily: C.fontDisplay, fontSize: 19, fontWeight: 500,
          color: C.ink, letterSpacing: -0.3, lineHeight: 1,
        }}>{title}</div>
        <div style={{
          fontFamily: C.fontBody, fontSize: 13, color: C.inkSoft,
          marginTop: 4, lineHeight: 1.35,
        }}>{sub}</div>
      </div>
    </div>
  );
}

function DirC_Onb_Tools() {
  return (
    <DirC_OnbShell dotIndex={2}>
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        padding: '100px 28px 140px',
      }}>
        <div style={{
          fontFamily: C.fontDisplay, fontSize: 30, fontWeight: 400,
          color: C.ink, letterSpacing: -0.6, lineHeight: 1.1,
          textAlign: 'center', marginBottom: 8,
        }}>Three tools, one app.</div>
        <div style={{
          fontFamily: C.fontBody, fontSize: 13, color: C.inkMuted,
          lineHeight: 1.5, textAlign: 'center', marginBottom: 28,
        }}>Use them together or on their own.</div>
        <OnbToolRow icon={TabIcons.schedule(C.accent, 2)}
          title="Schedules" sub="Visual routines your child can follow step by step."/>
        <OnbToolRow icon={TabIcons.steps(C.accent, 2, C.accentSoft)}
          title="Steps" sub="Task strips with rewards for daily routines."/>
        <OnbToolRow icon={TabIcons.stories(C.accent, 2, C.accentSoft)}
          title="Stories" sub="Social stories that teach what to expect."/>
        <div style={{ flex: 1 }}/>
        <button style={{
          width: '100%', padding: '16px', borderRadius: 14,
          background: C.accent, border: 'none',
          fontFamily: C.fontBody, fontWeight: 600, fontSize: 16,
          color: '#fff',
        }}>Let's go</button>
      </div>
    </DirC_OnbShell>
  );
}

Object.assign(window, { DirC_Onb_Welcome, DirC_Onb_Name, DirC_Onb_Tools });
