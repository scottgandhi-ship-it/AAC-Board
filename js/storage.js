/*
 * ═══════════════════════════════════════════════════════════
 * STORAGE CONTRACT — LOCKED POST-LAUNCH (v1.0)
 * ═══════════════════════════════════════════════════════════
 *
 * These keys and schemas are used by live App Store users.
 * NEVER rename, remove, or change the shape of these without
 * adding a migration in DATA_MIGRATIONS[].
 *
 * IndexedDB: "aac-board" v4
 *   - buttons    { keyPath: 'id' }
 *   - images     (out-of-line keys)
 *   - backups    (out-of-line keys)
 *
 * localStorage (static):
 *   aac-grid-size, aac-voice, aac-speed, aac-pitch,
 *   aac-language, aac-grammar-plurals, aac-grammar-verbs,
 *   aac-grammar-articles, aac-auto-speak,
 *   aac-sensory-reduced-motion, aac-sensory-high-contrast,
 *   aac-sensory-quiet, aac-child-name, aac-custom-es-labels,
 *   aac-custom-images, aac-custom-activities,
 *   aac-bigram-counts, aac-usage-log, aac-usage-summary,
 *   aac-activity-level-overrides, aac-vocab-level,
 *   aac-onboarding, aac-getting-started-expanded,
 *   aac-data-version
 *
 * localStorage (dynamic patterns):
 *   aac-activity-positions-{id}, aac-guided-step-{id},
 *   aac-early-words-{size}
 *
 * Adding NEW keys is safe. Changing or removing existing
 * keys requires a migration entry.
 * ═══════════════════════════════════════════════════════════
 */

// ── Parent Mode ──
const PARENT_AUTO_LOCK_MS = 5 * 60 * 1000;
const DB_NAME = 'aac-board';
const DB_VERSION = 4;
const STORE_BUTTONS = 'buttons';
const STORE_IMAGES = 'images';
const STORE_BACKUPS = 'backups';

// ── Data Migration Framework ──
const AAC_DATA_VERSION_KEY = 'aac-data-version';
const AAC_CURRENT_DATA_VERSION = 1;

// Migrations run in order. Each migrates FROM (toVersion - 1) TO toVersion.
const AAC_DATA_MIGRATIONS = [
  // { toVersion: 2, run: async () => { /* rename key, transform data, etc. */ } },
];

async function runDataMigrations() {
  const stored = parseInt(localStorage.getItem(AAC_DATA_VERSION_KEY), 10);
  if (isNaN(stored)) {
    localStorage.setItem(AAC_DATA_VERSION_KEY, String(AAC_CURRENT_DATA_VERSION));
    return;
  }
  if (stored >= AAC_CURRENT_DATA_VERSION) return;
  for (const m of AAC_DATA_MIGRATIONS) {
    if (m.toVersion > stored) {
      try {
        await m.run();
        localStorage.setItem(AAC_DATA_VERSION_KEY, String(m.toVersion));
      } catch (e) { break; }
    }
  }
}

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
      if (!db.objectStoreNames.contains(STORE_BACKUPS)) {
        db.createObjectStore(STORE_BACKUPS);
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
  if (['1', '21', '2', '3', '4', '5', '6'].includes(stored)) return parseInt(stored);
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
  if (size === 3 || size === 4 || size === 5) {
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

// ── Grid Backup (auto-save before grid switch) ──

async function saveGridBackup(gridSize, buttonsArray) {
  const db = await openDB();
  const images = await new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_IMAGES, 'readonly');
    const store = tx.objectStore(STORE_IMAGES);
    const allImages = {};
    const cursorReq = store.openCursor();
    cursorReq.onsuccess = e => {
      const cursor = e.target.result;
      if (cursor) {
        allImages[cursor.key] = cursor.value;
        cursor.continue();
      } else {
        resolve(allImages);
      }
    };
    cursorReq.onerror = () => reject(cursorReq.error);
  });

  const settings = {};
  EXPORTED_SETTINGS_KEYS.forEach(key => {
    const val = localStorage.getItem(key);
    if (val !== null) settings[key] = val;
  });

  const backup = {
    gridSize,
    buttons: buttonsArray,
    images,
    settings,
    savedAt: new Date().toISOString()
  };

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_BACKUPS, 'readwrite');
    tx.objectStore(STORE_BACKUPS).put(backup, gridSize);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

async function loadGridBackup(gridSize) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_BACKUPS, 'readonly');
    const req = tx.objectStore(STORE_BACKUPS).get(gridSize);
    req.onsuccess = () => resolve(req.result || null);
    req.onerror = () => reject(req.error);
  });
}

async function restoreGridBackup(gridSize) {
  const backup = await loadGridBackup(gridSize);
  if (!backup) throw new Error('No backup found for grid size ' + gridSize);

  const db = await openDB();
  await new Promise((resolve, reject) => {
    const tx = db.transaction([STORE_BUTTONS, STORE_IMAGES], 'readwrite');
    const btnStore = tx.objectStore(STORE_BUTTONS);
    const imgStore = tx.objectStore(STORE_IMAGES);
    btnStore.clear();
    imgStore.clear();
    backup.buttons.forEach(b => btnStore.put(b));
    if (backup.images) {
      Object.entries(backup.images).forEach(([key, val]) => imgStore.put(val, key));
    }
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });

  if (backup.settings) {
    Object.entries(backup.settings).forEach(([key, val]) => {
      if (key === 'aac-grid-size') return;
      localStorage.setItem(key, val);
    });
  }

  return backup;
}

async function deleteGridBackup(gridSize) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_BACKUPS, 'readwrite');
    tx.objectStore(STORE_BACKUPS).delete(gridSize);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

async function collectAllImages() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_IMAGES, 'readonly');
    const store = tx.objectStore(STORE_IMAGES);
    const images = {};
    const cursorReq = store.openCursor();
    cursorReq.onsuccess = e => {
      const cursor = e.target.result;
      if (cursor) {
        images[cursor.key] = cursor.value;
        cursor.continue();
      } else {
        resolve(images);
      }
    };
    cursorReq.onerror = () => reject(cursorReq.error);
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
