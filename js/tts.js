// ── Speech ──

function initSpeech() {
  if (!('speechSynthesis' in window)) return;
  const load = () => {
    voices = speechSynthesis.getVoices();
    populateVoiceSelect();
  };
  load();
  speechSynthesis.onvoiceschanged = load;
}

// Novelty/joke voices that should never appear in an AAC board
const NOVELTY_VOICES = /\b(bells|jester|bad news|good news|whisper|zarvox|trinoids|organ|cellos|boing|bahh|albert|bubbles|superstar|wobble|junior|kathy|princess|ralph|fred)\b/i;

// Known good human-sounding voice names across platforms
const GOOD_VOICE_NAMES = /\b(samantha|alex|allison|ava|susan|tom|kate|daniel|karen|fiona|moira|tessa|google|zira|david|jenny|aria|guy|mark|cortana|siri|eloquence)\b/i;

function getUSVoices() {
  return voices.filter(v => v.lang === 'en-US');
}

function getESVoices() {
  return voices.filter(v => /^es[-_]/.test(v.lang));
}

function getActiveVoices() {
  if (currentLang === 'en') return getUSVoices();
  return getESVoices();
}

function isNoveltyVoice(v) {
  return NOVELTY_VOICES.test(v.name);
}

function isHighQualityVoice(v) {
  return /enhanced|premium|natural|neural|wavenet/i.test(v.name);
}

function getUsableVoices(usVoices) {
  // Filter out novelty voices first
  const real = usVoices.filter(v => !isNoveltyVoice(v));

  // Score and rank: higher = better
  const scored = real.map(v => {
    let score = 0;
    if (isHighQualityVoice(v)) score += 20;
    if (GOOD_VOICE_NAMES.test(v.name)) score += 10;
    // Prefer non-compact voices (localService tends to be better on mobile)
    if (/compact/i.test(v.name)) score -= 5;
    return { voice: v, score };
  });

  scored.sort((a, b) => b.score - a.score);

  // Return top 5, or all if 5 or fewer
  return scored.slice(0, 5).map(s => s.voice);
}

function populateVoiceSelect() {
  const select = document.getElementById('voice-select');
  const langVoices = getActiveVoices();
  select.innerHTML = '';
  if (langVoices.length === 0) {
    const opt = document.createElement('option');
    opt.textContent = currentLang !== 'en' ? t('noVoices', 'No Spanish voices found') : 'No US English voices found';
    select.appendChild(opt);
    return;
  }

  const usable = getUsableVoices(langVoices);
  // Fallback: if aggressive filtering removed everything, show first 5 non-novelty
  const displayVoices = usable.length > 0 ? usable : langVoices.filter(v => !isNoveltyVoice(v)).slice(0, 5);
  // Last resort: if still nothing (all novelty?), just show first 3 raw
  const finalVoices = displayVoices.length > 0 ? displayVoices : langVoices.slice(0, 3);

  finalVoices.forEach(v => {
    const opt = document.createElement('option');
    opt.value = v.name;
    // Show a cleaner display name
    let display = v.name;
    if (isHighQualityVoice(v)) display += ' *';
    opt.textContent = display;
    if (v.name === selectedVoiceName) opt.selected = true;
    select.appendChild(opt);
  });

  // If no saved selection or saved voice isn't in the list, auto-select best
  if (!selectedVoiceName || !finalVoices.find(v => v.name === selectedVoiceName)) {
    const best = pickDefaultVoice(finalVoices);
    if (best) {
      select.value = best.name;
      selectedVoiceName = best.name;
      localStorage.setItem('aac-voice', best.name);
    }
  }
}

function pickDefaultVoice(voiceList) {
  const prefs = [
    v => /samantha\s*\(enhanced\)|samantha\s*\(premium\)/i.test(v.name),
    v => isHighQualityVoice(v),
    v => /google.*us.*female/i.test(v.name),
    v => /jenny|zira|aria|samantha|ava|allison/i.test(v.name),
  ];
  for (const test of prefs) {
    const found = voiceList.find(test);
    if (found) return found;
  }
  return voiceList[0] || null;
}

function getVoice() {
  if (selectedVoiceName) {
    const match = voices.find(v => v.name === selectedVoiceName);
    if (match) return match;
  }
  const langVoices = getActiveVoices();
  const activeLang = currentLang === 'en' ? 'en' : 'es';
  return pickDefaultVoice(langVoices) || langVoices[0] || voices.find(v => v.lang.startsWith(activeLang)) || voices[0] || null;
}
// Pronunciation overrides for TTS
const SPEAK_OVERRIDES = {
  'I': 'eye',
  'help': 'help.',
  'want': 'wont.',
  'wait': 'wayt.',
  'play': 'play.',
  'soup': 'soop.',
  'fruit snacks': 'froot snacks.',
  'ice cream': 'ice creem.',
  'peanut butter': 'penut butter.',
  'hamburger': 'ham burger.',
  'orange juice': 'ornge juice.',
  'apple juice': 'apple juice.',
};

function getSpeakOverrides() {
  if (currentLang === 'en') return SPEAK_OVERRIDES;
  return getLangEs().speakOverrides;
}

function haptic() {
  if (window.Capacitor?.isNativePlatform() && window.Capacitor.Plugins?.Haptics) {
    window.Capacitor.Plugins.Haptics.impact({ style: 'light' });
  }
}

function speak(text) {
  if (!text || !('speechSynthesis' in window)) return;
  haptic();
  speechSynthesis.cancel();
  const overrides = getSpeakOverrides();
  let spoken = overrides[text] || text;
  if (!spoken.endsWith('.') && !spoken.endsWith('!') && !spoken.endsWith('?')) {
    spoken += '.';
  }
  const utter = new SpeechSynthesisUtterance(spoken);
  const voice = getVoice();
  if (voice) utter.voice = voice;
  utter.rate = speechRate;
  utter.pitch = speechPitch;
  utter.onerror = () => { speechSynthesis.cancel(); };
  speechSynthesis.speak(utter);
}
