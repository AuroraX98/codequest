# AI wording review

All 32 lessons were reviewed individually in course order. Each has short explanations and one labeled JavaScript teaching example. The 171 sections, lesson IDs, prerequisite order, quiz answer positions, and concept-only assessments remain intact. The other 1,189 lessons and units are unchanged. Review receipts preserve before/after wording.

The examples are explicitly bounded: records, arithmetic, filters, and decision models do not pretend to train or run a real AI model. Tokens, embeddings, attention values, policy records, and evaluation counts are identified as illustrative when invented. No account, API key, data upload, or paid AI call is needed.

## Improvements

- Define terms before using them; separate inputs from outputs, training from inference, backpropagation from optimizer updates, and precision from recall.
- Replace multiple competing examples and repeated quiz-answer paragraphs with one worked example and a separate understanding check.
- Correct centering versus full standardization in the preprocessing lesson.
- Point five terminology links to their matching explanations after the wording review.
- Explain JavaScript arithmetic in its own syntax. Multiplication no longer mentions SQL columns or Python unpacking. Generator, module import, and module re-export stars retain separate meanings.

## Verification

- Preservation gate: 32 lessons, 171 sections, 32 examples; other courses unchanged.
- All 32 exact examples produced expected outputs in Node 26.13.0 and in the actual browser runner.
- All 32 contents lists match reviewed section headings. Five corrected terminology destinations passed.
- Shared step-flow checks: 19 passed. Shared code-anatomy checks: 31 passed across 1,699 fenced examples. TypeScript checking passed.
- Browser at 360x640 and 402x874: one reading step and one selected code part, with no horizontal page overflow.
- Contents selection closed the phone panel and reached the requested idea. Escape restored focus. Desktop contents and reading did not overlap.
- A wrong quiz answer gave a retry and explanation; the correct answer was accepted. Completion stayed blocked until reading sections were marked. No console errors observed.

## Scope

The 32-lesson introductory scope covers model/data basics, training calculations, language-model concepts, evaluation, privacy, retrieval, and tool boundaries. This is not exhaustive AI coverage or a model-performance benchmark. The browser checks are not physical-iPhone or VoiceOver tests. No live model was trained or evaluated.

Technical references checked: [backpropagation](https://developers.google.com/machine-learning/crash-course/neural-networks/backpropagation), [precision and recall](https://developers.google.com/machine-learning/crash-course/classification/accuracy-precision-recall), [preprocessing leakage](https://scikit-learn.org/stable/common_pitfalls.html), [embeddings](https://developers.google.com/machine-learning/crash-course/embeddings/embedding-space), [Transformer paper](https://arxiv.org/abs/1706.03762), [in-context use without gradient updates](https://arxiv.org/abs/2005.14165), and [retrieval-augmented generation](https://arxiv.org/abs/2005.11401).
