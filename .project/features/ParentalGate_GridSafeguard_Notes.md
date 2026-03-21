# Parental Gate + Grid Safeguard - Implementation Notes

## Status: IN PROGRESS

## Implementation Checklist

### Step 1: Parental Gate on AAC Board
- [ ] Add SVG ring + tooltip to settings button HTML
- [ ] Add CSS for ring animation, tooltip, reduced-motion
- [ ] Create `openSettingsPanel()` consolidating 3 click handlers
- [ ] Create `initParentalGate()` with pointer/keyboard handlers
- [ ] Remove/replace original click listeners (lines 3324, 3671, 4481)

### Step 2: Parental Gate on Guiding Steps
- [ ] Add SVG ring + tooltip to GS settings button HTML
- [ ] Add CSS (shared or inline)
- [ ] Create GS `openSettingsPanel()` + `initParentalGate()`
- [ ] Replace click listener (line 3282)

### Step 3: Grid Safeguard Storage Layer
- [ ] Bump DB_VERSION 3 -> 4
- [ ] Add STORE_BACKUPS constant
- [ ] Update onupgradeneeded with guard
- [ ] Implement saveGridBackup() using in-memory buttons
- [ ] Implement loadGridBackup()
- [ ] Implement hasGridBackup()
- [ ] Implement restoreGridBackup() (exclude aac-grid-size)
- [ ] Implement deleteGridBackup()

### Step 4: Grid Safeguard UI
- [ ] Build styled modal (reuse export-import-panel)
- [ ] Replace confirm() dialog in grid-size change handler
- [ ] Handle backup-exists vs no-backup flows
- [ ] Handle early learner grid skip
- [ ] Error handling with user-facing feedback
- [ ] Toast feedback for all outcomes

## Steve Review Items (All Addressed)

1. Three click listeners consolidated into openSettingsPanel() -- PLANNED
2. navigator.vibrate() guarded with availability check -- PLANNED
3. IndexedDB upgrade uses objectStoreNames.contains guard -- PLANNED
4. saveGridBackup uses in-memory buttons array, not loadButtons() -- PLANNED
5. restoreGridBackup excludes aac-grid-size from settings restore -- PLANNED

## Issues and Resolutions

(none yet)
