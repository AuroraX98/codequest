# Docked contents, global controls and direct project editor

The Table of Contents is now a nonmodal aside, not a dialog. It has no backdrop or focus trap, and selecting an idea or using the main lesson leaves it open. Close and Escape inside the pane remain available. The global header places its toggle on the left, existing navigation in the middle and Coding Buddy on the right; old duplicate toggles were removed. Current-unit content and Courses data are unchanged.

On wide screens (1440px and up), a240px left dock shares the shell without covering the main lesson; the optional Buddy retains340px. At smaller widths the bounded, scrollable panel sits in normal document flow above the lesson instead of squeezing three columns or covering content. Header controls wrap on smaller screens. Button targets remain44px or greater; text wraps and reduced-motion styling is retained.

Projects has an explicit Editor control beside Course project and AI practice. It opens the selected course editor, preserving the picker, advisory guidance, one editor instance and saved draft. The six reading marks no longer hide the editor or prevent Run. Final Finish still requires those marks, passing checks and existing core quiz/server validation; no marks or completion are fabricated. Concept-only language courses do not gain fake code runners.

Terminology now uses neutral shared examples and course-filtered Study links based on actual catalog tracks.38 examples were neutralized; tuple/indentation meanings and constructor context clarified; three language-specific terms explicitly scoped. One directly taught C# Console.WriteLine entry and11 total Study links added.212 entries/195 valid links. No existing term IDs removed.

## Evidence and limits

Typecheck and production build passed. TOC React/JSDOM tests confirm persistent open state, outside interaction, current highlight, Close/Escape and absence of dialog/modal/inert behavior. Header source assertions ensure exactly one of each toggle in the requested order. Editor test confirms editing/Run before marks, final Finish blocking, retained code and completion after readiness; its runner is mocked, while separate existing project tests run actual Python. Actual all21 Terminology filters/search/List-Tile consistency/Study callbacks and persistence pass.303-lesson TOC mapping, navigation, reading API, concept completion, project storage and offline regressions pass.

A managed-browser screenshot verifies the new header layout. Full lesson preview is blocked by bootstrap/offline-pack readiness (visible message: Open CodeQuest online once and download the offline pack first). Dock/editor measured desktop/mobile geometry is therefore not claimed as browser-verified; no auth bypass or replacement preview was used.

Offline pack `45029889bf5f0aeec20a`:33 artifacts and transports hash-verified.
