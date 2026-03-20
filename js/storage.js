// ── Parent Mode ──
const PARENT_AUTO_LOCK_MS = 30 * 60 * 1000;
const DB_NAME = 'aac-board';
const DB_VERSION = 3;
const STORE_BUTTONS = 'buttons';
const STORE_IMAGES = 'images';

// ── IndexedDB ──
function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = e => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_BUTTONS)) {
        db.createObjectStore(STORE_BUTTONS, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(STORE_IMAGES)) {
        db.createObjectStore(STORE_IMAGES);
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function loadButtons() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_BUTTONS, 'readonly');
    const store = tx.objectStore(STORE_BUTTONS);
    const req = store.getAll();
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function saveButton(btn) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_BUTTONS, 'readwrite');
    tx.objectStore(STORE_BUTTONS).put(btn);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

async function saveButtons() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_BUTTONS, 'readwrite');
    const store = tx.objectStore(STORE_BUTTONS);
    store.clear();
    buttons.forEach(b => store.put(b));
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

function isEarlyLearnerGrid(size) { return size === 1 || size === 21 || size === 2; }

function getGridSize() {
  const stored = localStorage.getItem('aac-grid-size');
  if (['1', '21', '2', '3', '5', '6'].includes(stored)) return parseInt(stored);
  return 4;
}

function setGridSize(size) {
  localStorage.setItem('aac-grid-size', String(size));
  const cols = size === 21 ? 2 : size;
  document.documentElement.style.setProperty('--grid-cols', cols);
  document.body.classList.remove('grid-1', 'grid-21', 'grid-2', 'grid-3', 'grid-4', 'grid-5', 'grid-6');
  document.body.classList.add(`grid-${size}`);
}

const EARLY_LEARNER_SLOTS = { 1: 1, 21: 2, 2: 4 };

function getEarlyLearnerWords(size) {
  const key = 'aac-early-words-' + size;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch (e) { return []; }
}

function saveEarlyLearnerWords(size, wordIds) {
  const max = EARLY_LEARNER_SLOTS[size] || 1;
  localStorage.setItem('aac-early-words-' + size, JSON.stringify(wordIds.slice(0, max)));
}

const _templateCache = {};
function invalidateTemplateCache() {
  for (const k in _templateCache) delete _templateCache[k];
}

function getTemplate(size) {
  if (isEarlyLearnerGrid(size)) return getEarlyLearnerTemplate(size);
  if (_templateCache[size]) return _templateCache[size].map(b => ({...b}));
  const folderContents = DEFAULT_BUTTONS.filter(b => b.folderId !== null);
  let template;
  if (size === 3) {
    const filtered = folderContents.filter(b => THREE_BY_THREE_FOLDERS.has(b.folderId));
    template = [...CORE_WORD_DEFS, ...HOME_GRID_3X3_FOLDERS, ...filtered];
  } else if (size === 4) {
    const filtered = folderContents.filter(b => FOUR_BY_FOUR_FOLDERS.has(b.folderId));
    template = [...CORE_WORD_DEFS, ...HOME_GRID_4X4_FOLDERS, ...filtered];
  } else if (size === 5) {
    template = [...CORE_WORD_DEFS, ...HOME_GRID_5X5_FOLDERS, ...folderContents];
  } else if (size === 6) {
    const homeFolders = DEFAULT_BUTTONS.filter(b => b.folderId === null && b.type !== 'core');
    template = [...CORE_WORD_DEFS, ...homeFolders, ...HOME_GRID_6X6_EXTRAS, ...folderContents];
  } else {
    template = [...DEFAULT_BUTTONS];
  }
  _templateCache[size] = template;
  return template.map(b => ({...b}));
}

function getEarlyLearnerTemplate(size) {
  const selectedIds = getEarlyLearnerWords(size);
  if (selectedIds.length === 0) return [];
  const allWords = getAllVocabWords();
  return selectedIds.map((id, i) => {
    const found = allWords.find(w => w.id === id);
    if (!found) return null;
    return { ...found, folderId: null, type: 'fringe', position: i };
  }).filter(Boolean);
}

function getAllVocabWords() {
  const words = [];
  const seen = new Set();
  const sources = [...HOME_GRID_6X6_EXTRAS, ...DEFAULT_BUTTONS];
  sources.forEach(b => {
    if (b.type === 'folder') return;
    if (seen.has(b.id)) return;
    seen.add(b.id);
    words.push(b);
  });
  return words;
}

function getPickerWords() {
  const all = getAllVocabWords();
  const seenLabel = new Set();
  return all.filter(w => {
    const key = (w.label || '').toLowerCase();
    if (seenLabel.has(key)) return false;
    seenLabel.add(key);
    return true;
  });
}

const CHOOSER_PRESETS = [
  { name: 'Basics', nameEs: 'Basicos', ids: ['t-yes', 't-no', 'core-more', 't-stop'] },
  { name: 'Requesting', nameEs: 'Peticiones', ids: ['core-want', 'core-help', 'core-more', 'gen-all-done'] },
  { name: 'Play', nameEs: 'Jugar', ids: ['t-go', 't-stop', 'core-more', 'core-help'] },
];

// ── Image & Button Delete ──

async function deleteButton(id) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_BUTTONS, 'readwrite');
    tx.objectStore(STORE_BUTTONS).delete(id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

function blobToDataURL(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

function imageDataToSrc(data) {
  if (typeof data === 'string') return data;
  if (data instanceof Blob) return URL.createObjectURL(data);
  return null;
}

async function saveImage(buttonId, blob) {
  const dataURL = (blob instanceof Blob) ? await blobToDataURL(blob) : blob;
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_IMAGES, 'readwrite');
    tx.objectStore(STORE_IMAGES).put(dataURL, buttonId);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

async function loadImage(buttonId) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_IMAGES, 'readonly');
    const req = tx.objectStore(STORE_IMAGES).get(buttonId);
    req.onsuccess = () => resolve(req.result || null);
    req.onerror = () => reject(req.error);
  });
}

async function deleteImage(buttonId) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_IMAGES, 'readwrite');
    tx.objectStore(STORE_IMAGES).delete(buttonId);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

async function getImageCacheCount() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_IMAGES, 'readonly');
    const req = tx.objectStore(STORE_IMAGES).count();
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function clearImageCache() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_IMAGES, 'readwrite');
    tx.objectStore(STORE_IMAGES).clear();
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

async function clearAllData() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction([STORE_BUTTONS, STORE_IMAGES], 'readwrite');
    tx.objectStore(STORE_BUTTONS).clear();
    tx.objectStore(STORE_IMAGES).clear();
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

// ── Custom Image Tracking ──
// Track which images are user-uploaded (custom photos)
// (ARASAAC symbol library removed -- app uses device emoji + custom photos)
let customImageCache = null;

function loadCustomImageCache() {
  try {
    customImageCache = JSON.parse(localStorage.getItem('aac-custom-images') || '{}');
  } catch (e) {
    customImageCache = {};
  }
}

function markAsCustomImage(buttonId) {
  if (!customImageCache) loadCustomImageCache();
  customImageCache[buttonId] = true;
  localStorage.setItem('aac-custom-images', JSON.stringify(customImageCache));
}

function isCustomImage(buttonId) {
  if (!customImageCache) loadCustomImageCache();
  return !!customImageCache[buttonId];
}
