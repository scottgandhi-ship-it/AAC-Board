// ── Global State Variables ──
// Extracted from index.html for modularization (Phase 2).
// These remain window-level globals — all existing code references them by name.

let currentLang = localStorage.getItem('aac-language') || 'en';

// ── State ──
let buttons = [];
let currentFolder = null;  // null = home grid
let parentMode = false;
let editingButtonId = null;
let messageWords = [];
let messageButtonIds = [];
let lastTapId = null;
let lastTapTime = 0;
let speechRate = parseFloat(localStorage.getItem('aac-speed')) || 0.85;
let speechPitch = parseFloat(localStorage.getItem('aac-pitch')) || 1.0;
let activeTab = 'talk';

// ── Activity State ──
let activeActivity = null; // null when no activity is active
let _activitySlotOverrides = null;
let vocabLevel = localStorage.getItem('aac-vocab-level') || 'expanded';
let activityLevelOverrides;
try { activityLevelOverrides = JSON.parse(localStorage.getItem('aac-activity-level-overrides') || '{}'); } catch { activityLevelOverrides = {}; }

// ── Parent Mode Timer ──
let parentAutoLockTimer = null;

// ── Word Picker State ──
let _wordPickerState = { maxSelections: 1, selectedIds: [], onConfirm: null, slotIndex: null };

// ── Onboarding State ──
let _gridPickerCallback = null;

// ── Speech State ──
let voices = [];
let selectedVoiceName = localStorage.getItem('aac-voice') || '';

// ── Grid Delegation State ──
let _coreDelegationReady = false;

// ── Icon Lookup State ──
let iconByLabel = {};

// ── Prediction State ──
let coreWordsCache = [];
let bigramCounts = {};
let bigramSavePending = false;
let autoSpeakEnabled = true;

// ── Usage Tracking State ──
let usageLog = [];
let usageSummary = { dailyCounts: {}, wordCounts: {}, totalCount: 0 };
let usageSavePending = false;

// ── Activity Session State ──
let activitySessions;
try { activitySessions = JSON.parse(localStorage.getItem('aac-activity-sessions') || '[]'); } catch { activitySessions = []; }
