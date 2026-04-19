// Main app — Guiding Steps · Storybook Canvas working canvas.
// Now organized into 4 sections: Onboarding, Schedule, Steps, Stories+Settings.

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

// Compact artboard wrapper — transparent bg so the device shadow shows.
function AB({ children, label }) {
  return (
    <DCArtboard label={label} width={390} height={900}
      style={{ background: 'transparent', boxShadow: 'none' }}>
      {children}
    </DCArtboard>
  );
}

function App() {
  const [t, update, editMode] = useTweaks();

  const wrapStyle = {
    fontSize: `${16 * (t.textSize || 1)}px`,
    filter: t.darkMode ? 'invert(0.92) hue-rotate(180deg)' : 'none',
  };

  return (
    <div style={wrapStyle}>
      <DesignCanvas>
        <div style={{ padding: '0 60px 40px', width: 1200 }}>
          <div style={{
            fontFamily: 'Fraunces, serif', fontSize: 44, fontWeight: 500,
            color: '#1a1a1a', letterSpacing: -1.2, lineHeight: 1,
          }}>Guiding Steps — Storybook Canvas</div>
          <div style={{
            fontFamily: '-apple-system, system-ui', fontSize: 15, color: '#666',
            marginTop: 10, maxWidth: 760, lineHeight: 1.5,
          }}>
            Locked-in direction. Calm, editorial, dignified — warm ivory canvas, single
            deep-indigo accent, numbered spine progress, long-press confirm. Four feature
            sections below: Onboarding, Schedule, Steps, Stories &amp; Settings.
          </div>
        </div>

        <div style={{ padding: '0 60px' }}>
          <DirHero letter="C" name="Storybook Canvas"
            tagline="Calm, editorial, dignified."
            mood="Quiet · bookish · sensory-safe"
            palette={['#4F46B8', '#E07B3E', '#E2DFF6', '#FBF6EC', '#1B1D2E']}
            fonts="Fraunces display + Inter body"/>
        </div>

        {/* ───── 1 · Onboarding ───── */}
        <DCSection title="1 · Onboarding"
          subtitle="Three screens to set up the child's profile. Flat ivory, one decorative motif per slide."
          gap={40}>
          <AB label="1.1 · Welcome"><DirC_Onb_Welcome /></AB>
          <AB label="1.2 · Name & age"><DirC_Onb_Name /></AB>
          <AB label="1.3 · Tools to turn on"><DirC_Onb_Tools /></AB>
          <DCPostIt top={-20} left={280} rotate={-2} width={200}>
            Onboarding stays on flat ivory — no hero gradients — so it matches the home screens.
          </DCPostIt>
        </DCSection>

        {/* ───── 2 · Schedule ───── */}
        <DCSection title="2 · Schedule"
          subtitle="Main routine view + templates sheet + create/edit modals. Numbered spine progress + long-press confirm."
          gap={40}>
          <AB label="2.1 · Today's schedule"><DirC_Schedule /></AB>
          <AB label="2.2 · Schedule w/ tooltip"><DirC_ScheduleSettings /></AB>
          <AB label="2.3 · Edit Templates sheet"><DirC_EditTemplates /></AB>
          <AB label="2.4 · New Schedule modal"><DirC_NewSchedule /></AB>
          <AB label="2.5 · Edit Schedule modal"><DirC_EditSchedule /></AB>
          <DCPostIt top={420} left={-20} rotate={3} width={180}>
            Long-press ring (0.2–0.4s) on the Done button — quick enough not to annoy, long enough to prevent accidental taps.
          </DCPostIt>
        </DCSection>

        {/* ───── 3 · Steps ───── */}
        <DCSection title="3 · Steps (Task Strips)"
          subtitle="Reward-chart flow. Icon-tile rows, optional reward on completion. Create from template or scratch, then edit."
          gap={40}>
          <AB label="3.1 · Bedtime task strip"><DirC_Steps /></AB>
          <AB label="3.2 · New reward chart"><DirC_NewRewardChart /></AB>
          <AB label="3.3 · New task strip"><DirC_NewTaskStrip /></AB>
          <AB label="3.4 · Edit task strip"><DirC_EditTaskStrip /></AB>
          <DCPostIt top={-30} left={240} rotate={-1} width={200}>
            Rewards are optional — small and contextual, not gamified confetti.
          </DCPostIt>
        </DCSection>

        {/* ───── 4 · Stories, Reader & Settings ───── */}
        <DCSection title="4 · Stories, Reader & Settings"
          subtitle="Social stories library + reader + create/edit flows. Settings as a standalone tab."
          gap={40}>
          <AB label="4.1 · Stories library"><DirC_Stories /></AB>
          <AB label="4.2 · Reader"><DirC_Reader /></AB>
          <AB label="4.3 · Choose a story"><DirC_ChooseStory /></AB>
          <AB label="4.4 · Choose a story · searched"><DirC_ChooseStoryScrolled /></AB>
          <AB label="4.5 · Edit story — details"><DirC_EditStoryDetails /></AB>
          <AB label="4.6 · Edit story — page editor"><DirC_EditStoryPage /></AB>
          <AB label="4.7 · Settings"><DirC_Settings /></AB>
          <DCPostIt top={-30} left={280} rotate={-2} width={200}>
            Page editor shows numbered reel + active page highlighted in indigo.
          </DCPostIt>
        </DCSection>

        <div style={{ height: 80 }}/>
      </DesignCanvas>

      {editMode && <TweakPanel t={t} update={update} />}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
