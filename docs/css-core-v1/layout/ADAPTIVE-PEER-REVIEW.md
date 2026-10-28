# Independent read-only adaptive11 review

Scope: CSS43–51 plus54/55; original lesson source, runnable checks/cases, callable contracts and headings. No adaptive files edited and no independent runtime pass claimed.

Hashes reviewed:
- lessons.json: 0db651865030307de7822b1a8d4121639ce999dbb39cce42aedf30efb1629923
- execution-cases.json: fe4e2b48a7b61cca657748e1780c088565f0c779cbf4bba666173da2eeaf91fe
- css-contract-evidence.json: baef9df4e9e88b21a1f1fb1b192611b6ceb1a27c4cff3684654df67270ac889f
- headings.json: 2404efd6acf75634eb6ddd822f96710a25aac6c7dfb5456761842c2f616391c7

## Assessment
Semantics generally sound. One-idea lessons preserve important limitations: computed-value invalidity, actual media preference rather than claimed OS switching, print as an ungraded complete local companion, transparency not disabling controls, important layer reversal within its origin context, and iframe viewport sizing. Explicit CSS function contracts distinguish var/url/format from JS. Original font resource avoids licensed third-party font redistribution.

## Required corrections before coverage signoff
1. **CSS49 likely starter false positive:** fonts.load can load a face even when the sample does not use it. AB at40px in a typical monospace font is ~48px, which falls within the existing48±1 expected custom width. Change to an actually distinctive glyph sequence, e.g. AA with the font’s verified expected advance, plus family/fallback contract. Run starter-negative test. Merely narrowing tolerance is fragile.
2. **CSS45 missing transition behavior:** transition-property plus final opacity passes with zero duration and without reduced-motion support. Check the actual active duration and authored reduced-motion branch; where motion is allowed, verify a real transition is created before awaiting completion.
3. **CSS46 readability contract:** current check omits background, so white text on white background can pass dark branch. Check both foreground and background in actual branch. Preserve honest inactive-branch limits.
4. **CSS54 geometry:** gridTemplateColumns computed token count alone can pass when display remains block. Require grid display and actual item placement, with599/600/601 iframe boundary runs.
5. **CSS51 concept bypass:** a direct teal declaration passes without any important layer ordering. Verify parsed layer/important structure or perform a focused flags-removed comparison to demonstrate later-layer purple.
6. **CSS43 concept bypass:** hardcoded teal passes without var. A reversible --ink:12px mutation should verify navy inheritance, not fallback or earlier purple.
7. **CSS44 declared output:** grid display alone does not establish requested two100px columns. Add actual geometry; condition structure should not be bypassed by unconditional grid.
8. **CSS48 pedagogy:** a blank starter asks transcription rather than diagnosis. Supply the misspelled selector and invalid padding to repair.
9. **CSS55 named-input contract:** verify name="name", not only label and button type, if preserving the named input is part of completion.

## Headings
Replace sentence extraction with concise concept headings, particularly CSS45 ('transition: opacity 0' truncates the decimal),48 (truncated sentence) and51 (truncated sentence). Suggested: 'Transition duration and motion preference'; 'Matching, validity and cascade'; 'Important layer priority'.

Conditional source-review result pending corrections and lead’s actual-browser checks. Print47 is explicitly concept/local-companion only and must not appear as a runnable print pass. Font49 resource loading and actual rendered advance must be established before integration.

## Revised source review — PASS with stated runtime boundaries
Re-read exact revised hashes:
- lessons.json: 7b36ba311e1de85e066bdd9c4f3766cdb790f3f11edd7fdaad11ff268ff6d599
- execution-cases.json: 9f4dcefd04cc5e7337aa346db7dc50e34c91788dc38bb50a01a22b3b16e574b6
- css-contract-evidence.json: baef9df4e9e88b21a1f1fb1b192611b6ceb1a27c4cff3684654df67270ac889f
- headings.json: ed29f9022e0b2f6db783a892c63c20409d323d3e641617041369907dbe0a5d15

Required substantive revisions addressed:43 reversible invalid-variable probe;44 actual track geometry;45 active duration and authored reduced-motion media rule;46 background;48 deliberately broken starter;49 visible AA/task and64px width plus loaded-family/fallback/swap checks;51 reversible important-flag probe;54 display/grid geometry;55 name. All headings now use concise concepts.

The original49 false-positive warning is closed in this revised source, subject to lead’s actual starter-negative run; it is not a current blocker. The AA fixture is consistently visible in HTML and task.

Runtime boundaries retained:45 does not execute an inactive reduced-motion branch merely because CSSOM proves it exists;46 validates only actual active preference;47 is ungraded local print companion; actual browser geometry and starter negatives remain lead-owned. CSS44’s learner checks can still accept an unconditional supported grid; the distinct changed @supports fixture demonstrates condition behavior. Optional parsed condition enforcement was recommended, but there is no remaining semantic content blocker.
