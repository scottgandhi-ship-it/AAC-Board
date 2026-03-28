// ── Grammar Engine ──
// Settings stored in localStorage (on by default except articles)
function grammarEnabled(key) {
  const val = localStorage.getItem('aac-grammar-' + key);
  if (val === null) return key !== 'articles'; // articles off by default
  return val === '1';
}

function getWordCategory(buttonId) {
  if (!buttonId) return 'unknown';
  const btn = buttons.find(b => b.id === buttonId);
  if (!btn) return 'unknown';
  const colorMap = {
    yellow: 'pronoun', green: 'verb', orange: 'noun', blue: 'descriptor',
    pink: 'social', purple: 'preposition', red: 'negation'
  };
  return colorMap[btn.color] || 'unknown';
}

const PLURAL_OVERRIDES = {
  'child': 'children', 'foot': 'feet', 'tooth': 'teeth', 'mouse': 'mice',
  'fish': 'fish', 'sheep': 'sheep', 'man': 'men', 'woman': 'women',
  'person': 'people', 'goose': 'geese', 'dice': 'dice', 'scissors': 'scissors',
  'pants': 'pants', 'shorts': 'shorts', 'pajamas': 'pajamas', 'glasses': 'glasses'
};

function pluralize(word) {
  if (!word || word.length < 2) return word + 's';
  const lower = word.toLowerCase();
  if (PLURAL_OVERRIDES[lower]) return PLURAL_OVERRIDES[lower];
  if (lower.endsWith('s') && !lower.endsWith('ss') && !lower.endsWith('us')) return word;
  if (lower.endsWith('sh') || lower.endsWith('ch') || lower.endsWith('x') || lower.endsWith('z') || lower.endsWith('ss')) return word + 'es';
  if (lower.endsWith('y') && !['a','e','i','o','u'].includes(lower[lower.length - 2])) return word.slice(0, -1) + 'ies';
  if (lower.endsWith('fe')) return word.slice(0, -2) + 'ves';
  if (lower.endsWith('f')) return word.slice(0, -1) + 'ves';
  return word + 's';
}

const VERB_FORMS = {
  'want':   { third: 'wants',   past: 'wanted' },
  'need':   { third: 'needs',   past: 'needed' },
  'help':   { third: 'helps',   past: 'helped' },
  'like':   { third: 'likes',   past: 'liked' },
  'eat':    { third: 'eats',    past: 'ate' },
  'drink':  { third: 'drinks',  past: 'drank' },
  'play':   { third: 'plays',   past: 'played' },
  'read':   { third: 'reads',   past: 'read' },
  'run':    { third: 'runs',    past: 'ran' },
  'jump':   { third: 'jumps',   past: 'jumped' },
  'sit':    { third: 'sits',    past: 'sat' },
  'stand':  { third: 'stands',  past: 'stood' },
  'walk':   { third: 'walks',   past: 'walked' },
  'sleep':  { third: 'sleeps',  past: 'slept' },
  'wash':   { third: 'washes',  past: 'washed' },
  'open':   { third: 'opens',   past: 'opened' },
  'close':  { third: 'closes',  past: 'closed' },
  'push':   { third: 'pushes',  past: 'pushed' },
  'pull':   { third: 'pulls',   past: 'pulled' },
  'give':   { third: 'gives',   past: 'gave' },
  'listen': { third: 'listens', past: 'listened' },
  'draw':   { third: 'draws',   past: 'drew' },
  'sing':   { third: 'sings',   past: 'sang' },
  'dance':  { third: 'dances',  past: 'danced' },
  'hug':    { third: 'hugs',    past: 'hugged' },
  'throw':  { third: 'throws',  past: 'threw' },
  'share':  { third: 'shares',  past: 'shared' },
  'build':  { third: 'builds',  past: 'built' },
  'go':     { third: 'goes',    past: 'went' },
  'stop':   { third: 'stops',   past: 'stopped' },
  'wait':   { third: 'waits',   past: 'waited' },
  'look':   { third: 'looks',   past: 'looked' },
  'is':     { third: 'is',      past: 'was' },
  'have':   { third: 'has',     past: 'had' },
  'catch':  { third: 'catches', past: 'caught' },
  'swim':   { third: 'swims',   past: 'swam' },
  'climb':  { third: 'climbs',  past: 'climbed' },
  'hide':   { third: 'hides',   past: 'hid' },
  'find':   { third: 'finds',   past: 'found' },
  'blow':   { third: 'blows',   past: 'blew' },
  'dig':    { third: 'digs',    past: 'dug' },
  'kick':   { third: 'kicks',   past: 'kicked' },
  'touch':  { third: 'touches', past: 'touched' },
  'watch':  { third: 'watches', past: 'watched' },
  'put':    { third: 'puts',    past: 'put' },
  'cut':    { third: 'cuts',    past: 'cut' },
  'make':   { third: 'makes',   past: 'made' },
  'take':   { third: 'takes',   past: 'took' },
  'get':    { third: 'gets',    past: 'got' },
  'come':   { third: 'comes',   past: 'came' },
  'say':    { third: 'says',    past: 'said' },
  'see':    { third: 'sees',    past: 'saw' },
  'show':   { third: 'shows',   past: 'showed' },
  'pick':   { third: 'picks',   past: 'picked' },
  'hold':   { third: 'holds',   past: 'held' },
  'carry':  { third: 'carries', past: 'carried' },
  'try':    { third: 'tries',   past: 'tried' },
  'cry':    { third: 'cries',   past: 'cried' },
  'fly':    { third: 'flies',   past: 'flew' },
  'fall':   { third: 'falls',   past: 'fell' },
  'shake':  { third: 'shakes',  past: 'shook' },
  'break':  { third: 'breaks',  past: 'broke' },
  'clean':  { third: 'cleans',  past: 'cleaned' },
  'color':  { third: 'colors',  past: 'colored' },
  'paint':  { third: 'paints',  past: 'painted' },
  'pour':   { third: 'pours',   past: 'poured' },
  'mix':    { third: 'mixes',   past: 'mixed' },
  'smile':  { third: 'smiles',  past: 'smiled' },
  'wave':   { third: 'waves',   past: 'waved' },
  'clap':   { third: 'claps',   past: 'clapped' },
  'ride':   { third: 'rides',   past: 'rode' },
  'drive':  { third: 'drives',  past: 'drove' },
  'wear':   { third: 'wears',   past: 'wore' },
  'turn':   { third: 'turns',   past: 'turned' },
  'move':   { third: 'moves',   past: 'moved' },
  'bite':   { third: 'bites',   past: 'bit' },
  'smell':  { third: 'smells',  past: 'smelled' },
  'taste':  { third: 'tastes',  past: 'tasted' },
  'feel':   { third: 'feels',   past: 'felt' },
  'hear':   { third: 'hears',   past: 'heard' },
  'brush':  { third: 'brushes', past: 'brushed' },
  'splash': { third: 'splashes', past: 'splashed' },
  'dry':    { third: 'dries',   past: 'dried' },
  'zip':    { third: 'zips',    past: 'zipped' },
  'wipe':   { third: 'wipes',   past: 'wiped' },
  'fix':    { third: 'fixes',   past: 'fixed' },
  'feed':   { third: 'feeds',   past: 'fed' },
  'squeeze':{ third: 'squeezes', past: 'squeezed' },
};

const THIRD_PERSON_PRONOUNS = new Set(['he', 'she', 'it']);
const UNCOUNTABLE_NOUNS = new Set([
  'water', 'milk', 'juice', 'rice', 'bread', 'cheese', 'soup', 'cereal',
  'yogurt', 'pasta', 'medicine', 'soap', 'paper', 'ice cream',
  'chocolate milk', 'apple juice', 'orange juice', 'hot chocolate',
  'lemonade', 'play-doh'
]);

// Grammar engine strategy pattern
const GRAMMAR_EN = {
  pluralize: pluralize,
  thirdPersonPronouns: THIRD_PERSON_PRONOUNS,
  uncountable: UNCOUNTABLE_NOUNS,
  verbForms: VERB_FORMS,
  moreWord: 'more',
  apply(words, btnIds) {
    if (!words || words.length === 0) return '';
    if (words.length < 2) return words.join(' ');
    const result = [...words];
    for (let i = 0; i < result.length; i++) {
      const id = btnIds[i];
      const cat = getWordCategory(id);
      const lower = result[i].toLowerCase();
      if (grammarEnabled('verbs') && cat === 'verb' && i > 0) {
        const prevLower = result[i - 1].toLowerCase();
        const verbEntry = this.verbForms[lower];
        if (verbEntry && this.thirdPersonPronouns.has(prevLower)) {
          result[i] = verbEntry.third;
        }
      }
      if (grammarEnabled('plurals') && cat === 'noun' && i > 0) {
        const prevLower = result[i - 1].toLowerCase();
        if (prevLower === this.moreWord && !this.uncountable.has(lower)) {
          result[i] = this.pluralize(result[i]);
        }
      }
      if (grammarEnabled('articles') && cat === 'noun') {
        const prevCat = i > 0 ? getWordCategory(btnIds[i - 1]) : 'unknown';
        if (i === 0 || (prevCat !== 'noun' && prevCat !== 'descriptor' &&
            !['more', 'my', 'your', 'the', 'a', 'an', 'some'].includes(result[i - 1].toLowerCase()))) {
          if (!this.uncountable.has(lower) && !result[i].endsWith('s')) {
            const article = ['a','e','i','o','u'].includes(lower[0]) ? 'an' : 'a';
            result[i] = article + ' ' + result[i];
          }
        }
      }
    }
    return result.join(' ');
  }
};

function spanishPluralize(word) {
  if (!word || word.length < 2) return word + 's';
  const lower = word.toLowerCase();
  if (getLangEs().pluralOverrides[lower]) return getLangEs().pluralOverrides[lower];
  if (lower.endsWith('z')) return word.slice(0, -1) + 'ces';
  if (/[aeiou]$/.test(lower)) return word + 's';
  if (/[ln]$/.test(lower) || /[rsdfghjkp]$/.test(lower)) return word + 'es';
  return word + 's';
}

const GRAMMAR_ES = {
  pluralize: spanishPluralize,
  thirdPersonPronouns: new Set(['el', 'ella']),
  uncountable: getLangEs().uncountable,
  verbForms: getLangEs().verbForms,
  moreWord: 'mas',
  apply(words, btnIds) {
    if (!words || words.length === 0) return '';
    if (words.length < 2) return words.join(' ');
    const result = [...words];
    for (let i = 0; i < result.length; i++) {
      const id = btnIds[i];
      const cat = getWordCategory(id);
      const lower = result[i].toLowerCase();
      if (grammarEnabled('verbs') && cat === 'verb' && i > 0) {
        const prevLower = result[i - 1].toLowerCase();
        const verbEntry = this.verbForms[lower];
        if (verbEntry && this.thirdPersonPronouns.has(prevLower)) {
          result[i] = verbEntry.third;
        }
      }
      if (grammarEnabled('plurals') && cat === 'noun' && i > 0) {
        const prevLower = result[i - 1].toLowerCase();
        if (prevLower === this.moreWord && !this.uncountable.has(lower)) {
          result[i] = this.pluralize(result[i]);
        }
      }
      if (grammarEnabled('articles') && cat === 'noun') {
        const prevCat = i > 0 ? getWordCategory(btnIds[i - 1]) : 'unknown';
        if (i === 0 || (prevCat !== 'noun' && prevCat !== 'descriptor' &&
            !['mas', 'mi', 'tu', 'el', 'la', 'un', 'una', 'unos', 'unas'].includes(result[i - 1].toLowerCase()))) {
          if (!this.uncountable.has(lower)) {
            const gender = getLangEs().nounGender[id] || 'm';
            const article = gender === 'f' ? 'una' : 'un';
            result[i] = article + ' ' + result[i];
          }
        }
      }
    }
    return result.join(' ');
  }
};

function getGrammarEngine() {
  return currentLang === 'en' ? GRAMMAR_EN : GRAMMAR_ES;
}

function applyGrammar(words, btnIds) {
  return getGrammarEngine().apply(words, btnIds);
}
