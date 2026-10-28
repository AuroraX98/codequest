# AI24 staged concept course

Authoritative artifact: `all-twenty-four.json` (24 units + 24 lessons). No existing source lesson was edited.

## Integration contract
- New track `ai`, display label **AI**. IDs `ai-01` through `ai-24`, ordered prerequisite chain.
- Optional Lesson `learningMode: "concept"`, approved by parent and integrator. Existing lessons remain unchanged when field absent.
- `runtime: "javascript"` is an inert legacy schema field ONLY. Empty `starter`, `solution`, `filename`; `checks: []`; `math: null`.
- Concept lessons must never display/run an empty code editor or require code-run/build success. They use visible primary explanations plus authored quiz. Completion must use actual reading state + quiz, not fake successful run rows.
- No API key, account connector, data upload, training service, or execution cost required.
- Do not use old count-only tests to claim these are runnable coding projects. Course totals become225 only if all24 merged after201; the count is not execution coverage.
- Titles and level grouping are supplied; beginner1–9, intermediate10–15, advanced16–24 mean conceptual progression, not professional AI engineering mastery.

## What is taught
1–6 input/output, model/rules/examples, AI/ML/deep learning families, features/labels, train/validation/test, generalization.
7–12 parameters/neuron, activation/layers, prediction/target/loss, gradients/learning rate, backpropagation vs optimizer, batches/epochs.
13–18 tokens, embeddings, attention, Transformer variants, pretraining/self-supervision, post-training/preferences.
19–24 inference/context not weight updates, false confident outputs, task-aware evaluation, fairness/privacy, retrieval/RAG, tools/agent loops/authorization.

No coding knowledge is assumed. The first arithmetic example appears only after six conceptual lessons; multiplication and addition are explained in words. Calculus is explicitly not required. No facts about private current-model architecture, unreleased products, live parameter inspection, or consciousness are invented.

## Evidence
- `support-map.json`: every quiz's exact zero-based visible supporting paragraphs and facts, sources. All prerequisite IDs resolve in earlier lessons; no hidden expansion contains required teaching.
- `sources.json`: primary public sources consulted with web tools on2026-10-27: Google ML curriculum, original Transformer/RAG papers, OpenAI public explainers/docs.
- Original examples, not copied source exercises. Source links are reference material, never a required hidden prerequisite.
- Author structural checks pass24unique IDs,24three-choice quizzes with one indexed answer,123main paragraphs, acyclic chain, no required code/check/math.
- Semantic self-review compared each changed-case question against all preceding teaching. No runtime behavior is claimed: this is a concept-only course.
- App concept-mode navigation/completion/persistence and rendered review are integrator-owned and still required before release.

## Visuals
Primary explanations include simple input→model→output and forward→loss→backward→update sequences. Do not fabricate an animated/interactive neural network or claim a private model's actual neurons are shown.
If the existing renderer can display a plain semantic flow without a new interaction system, those sequences are suitable for an optional diagram. All essential meanings remain in primary text. More complex visual extensions are not included or required for this batch.

## Scope boundary
This is a complete bounded24-lesson concept introduction, not every AI topic. It does not implement a training library, image diffusion, full calculus/linear algebra, optimizer derivations, GPU/distributed training, or a production agent. Future practical coding can build on separately taught Python prerequisites. No further AI lessons are silently committed by this artifact.
