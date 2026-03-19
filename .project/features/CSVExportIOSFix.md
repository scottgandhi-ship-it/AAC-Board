# CSV Export - iOS File Download Fix

## Executive Summary

The CSV export feature uses a programmatic anchor click with the `download` attribute to trigger file downloads. This works on desktop browsers but **fails silently on iOS Safari** (and iOS PWAs), which ignores the `download` attribute entirely. The fix is to detect iOS/unsupported environments and fall back to the **Web Share API**, which triggers the native share sheet and allows users to save to Files, AirDrop, Messages, etc.

## Requirements

- CSV export must work on iOS Safari and iOS PWAs (home screen bookmarks)
- Use Web Share API with file sharing as primary fallback on iOS
- Preserve existing anchor-download behavior on desktop browsers (no regression)
- If Web Share API is unavailable (older devices), fall back to opening CSV as blob URL in a new tab
- Show appropriate toast feedback for each path
- No new dependencies

## Architecture Overview

Modify the existing `exportUsageCSV()` function in index.html to:

1. Build the CSV content (unchanged)
2. Detect platform and choose export strategy:
   - **Desktop / Android Chrome**: Use existing anchor-download approach
   - **iOS (Safari, PWA)**: Use `navigator.share({ files: [csvFile] })`
   - **Fallback**: Open blob URL in new tab with guidance toast

## Detection Strategy

Use `navigator.canShare` to check if file sharing is supported. This is the most reliable approach because:
- It directly tests capability rather than sniffing user agents
- `navigator.canShare({ files: [...] })` returns true on iOS Safari 15+ and most modern mobile browsers
- Falls through cleanly to anchor-download on desktop where `canShare` is either absent or returns false for files

Sequence:
1. Try `navigator.canShare({ files: [file] })` -> if true, use `navigator.share()`
2. Else use anchor-download (works on desktop, Android Chrome)

## Task Breakdown

### Task 1: Refactor exportUsageCSV with share fallback

- Extract CSV string building into the top of the function (already exists)
- Create a File object from the CSV blob (needed for Web Share API)
- Check `navigator.canShare({ files: [file] })`
- If supported: call `navigator.share({ files: [file] })` with async/await
- If not supported: use existing anchor-download path
- Toast messages: "CSV exported" on success, "Export cancelled" if share dismissed, "No data to export" if empty

### Task 2: Update QA tests

- Add test for share API path (mock navigator.canShare/share)
- Add test confirming anchor-download still used when canShare unavailable
- Verify empty-data guard still works

## Acceptance Criteria

- [ ] On iOS Safari: tapping Export CSV opens the native share sheet with a .csv file
- [ ] On iOS PWA (home screen): same behavior as Safari
- [ ] On desktop Chrome/Firefox/Edge: file downloads directly (no regression)
- [ ] Empty usage log still shows "No data to export" toast
- [ ] CSV content is identical regardless of export path
- [ ] No new external dependencies
- [ ] QA tests updated and passing
