# Export/Share Boards -- Notes

## Current Status
DONE -- merged via PR #35, validated 2026-03-07

## Agent Input
- Marci: SLP-to-family handoff is the primary use case. Custom images must survive export. Exclude usage data (privacy/HIPAA). Compress images for textable file sizes. OBF format not needed -- no real-world adoption. Template vs Full Backup distinction.
- Pat: Two export modes (Template for SLPs, Full Backup for families). Dead-simple import with preview. Custom .aacboard extension. No merge/conflict resolution for v1. File-based only for now.
- Developer: QR code / link sharing deferred to cloud phase. File-based is fine for pre-app-store. Build the full system so native app release is smooth.

## Scope Decisions
- REMOVED: OBF format (no real-world demand per Marci)
- DEFERRED: QR code / link sharing (requires cloud infrastructure)
- DEFERRED: Partial import / merge (v1 is full replace only)
- DEFERRED: File type association (requires native app shell)
- INCLUDED: Two export modes (Template vs Full Backup)
- INCLUDED: Image compression pipeline (512x512 JPEG 80%)
- INCLUDED: Import preview with board metadata
- INCLUDED: Replace warning before import

## Implementation Checklist

### Phase A: Export
- [x] 4.4.1: Export data builder (JSON schema, image compression, both modes)
- [x] 4.4.2: Export UI (modal, mode selection, board name input)
- [x] 4.4.3: File download mechanism (.aacboard extension)

### Phase B: Import
- [x] 4.4.4: Import file reader and validator
- [x] 4.4.5: Import preview screen (metadata display, replace warning)
- [x] 4.4.6: Import data writer (IndexedDB clear/write, settings apply, re-init)

### Phase C: Testing
- [ ] 4.4.7: Integration and testing (round-trip, cross-browser, accessibility)

## Issues and Resolutions
(none yet)

## Validation Progress
(pending implementation)
