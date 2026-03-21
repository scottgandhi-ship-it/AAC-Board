---
name: Modularization Phase 4 approach
description: Extract remaining JS feature modules incrementally when already working on that feature, not as a dedicated refactoring project
type: feedback
---

Extract Phase 4 feature modules (grid, activities, settings, predictions, etc.) opportunistically -- when already touching that feature, extract its module first, then make the changes. Do not spend dedicated sessions on pure refactoring.

**Why:** Phases 0-3 captured the biggest ROI by separating shared infrastructure. The remaining ~5,600 lines are mostly independent feature code. Extracting them is useful but not urgent.

**How to apply:** When starting work on any feature still inline in index.html (activities, grid/talk, settings, navigation, predictions, message bar, edit modal, export/import, onboarding, routines, guided vocab, insights, folder reorder, word picker, PWA), extract that feature's module into js/ first, update sw.js and tooling, then proceed with the feature work. Follow the ModularizationPlan.md Phase 4 steps and update ModularizationPlan_Notes.md checklist.
