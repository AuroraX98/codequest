/** Render-only regression checks: the authored metaphors must never mutate the trace. */
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import ts from 'typescript';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
async function load(file) {
  let source = ts.transpileModule(await fs.readFile(path.join(root, file), 'utf8'), {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2022,
      jsx: ts.JsxEmit.ReactJSX,
    },
  }).outputText;
  source = source
    .replaceAll('"react/jsx-runtime"', JSON.stringify(pathToFileURL(path.join(root, 'node_modules/react/jsx-runtime.js')).href))
    .replaceAll('"react"', JSON.stringify(pathToFileURL(path.join(root, 'node_modules/react/index.js')).href));
  return import('data:text/javascript;base64,' + Buffer.from(source).toString('base64'));
}
function freeze(value) {
  if (value && typeof value === 'object' && !Object.isFrozen(value)) {
    Object.freeze(value);
    Object.values(value).forEach(freeze);
  }
  return value;
}
const { default: Picture } = await load('components/PythonConceptMetaphor.tsx');
const { makePythonExperiment } = await load('lib/python-concepts.ts');
const concepts = ['program', 'values', 'strings', 'names', 'assignment', 'output'];
let count = 0;
for (const pet of ['Pepper', '', '🙂é<&\nZ', 'a'.repeat(40)]) {
  for (const age of [0, 5, 99]) {
    for (const experiment of ['greeting', 'rebind', 'types']) {
      const model = freeze(makePythonExperiment(experiment, pet, age));
      for (let step = 0; step < model.steps.length; step++) {
        for (const concept of concepts) {
          const props = freeze({ concept, model, state: model.steps[step], step, pet, age });
          const html = renderToStaticMarkup(React.createElement(Picture, props));
          assert(html.includes('<svg'), `${experiment}/${concept}/${step}: SVG missing`);
          assert(html.includes('<title'), 'Accessible title missing');
          assert(html.includes('<desc'), 'Accessible description missing');
          assert(html.includes('What this helps you see:'), 'Concept explanation missing');
          assert(html.includes('Where the analogy stops:'), 'Analogy boundary missing');
          assert(!html.includes('NaN'), 'Invalid geometric or numeric value');
          assert(!html.includes('<script'), 'Unexpected executable content');
          count++;
        }
      }
    }
  }
}

const rebindModel = freeze(makePythonExperiment('rebind', 'Pepper', 5));
const tagScene = (step, concept = 'names') => renderToStaticMarkup(React.createElement(Picture, {
  concept, model: rebindModel, state: rebindModel.steps[step], step, pet: 'Pepper', age: 5,
}));
for (const concept of ['names', 'assignment']) {
  assert(!tagScene(0, concept).includes('pet_name</text>'), 'Initial state must have no tag');
  assert(tagScene(1, concept).includes('pet_name</text>'), 'First assignment must add a tag');
  assert(!tagScene(1, concept).includes('original_name</text>'), 'Second tag appeared early');
  assert(tagScene(2, concept).includes('original_name</text>'), 'Second binding must add its tag');
  assert(!tagScene(2, concept).includes('>PEPPER</text>'), 'Uppercase result appeared early');
  assert(tagScene(3, concept).includes('>PEPPER</text>'), 'Rebind result missing');
  assert(tagScene(3, concept).includes('>Pepper</text>'), 'Original string must remain');
  assert(tagScene(3, concept).includes('original_name</text>'), 'Original name must remain');
}

const typesModel = freeze(makePythonExperiment('types', 'Pepper', 5));
const beadScene = step => renderToStaticMarkup(React.createElement(Picture, {
  concept: 'strings', model: typesModel, state: typesModel.steps[step], step, pet: 'Pepper', age: 5,
}));
assert(beadScene(1).includes('A separate joined result will appear here'), 'Result should be pending before joining');
assert(!beadScene(1).includes('New joined result: one more character'), 'Joined result appeared early');
assert(beadScene(2).includes('New joined result: one more character'), 'Joined result missing after step 2');
assert(beadScene(2).includes('Original digit text: unchanged'), 'Original text must remain');
assert(beadScene(2).includes('Contrast only: numbers would add quantities'), 'Number analogy must be labeled as a contrast');

const pair = renderToStaticMarkup(React.createElement(React.Fragment, null,
  ...['names', 'assignment'].map(concept => React.createElement(Picture, {
    key: concept, concept, model: rebindModel, state: rebindModel.steps[3], step: 3, pet: 'Pepper', age: 5,
  })),
));
const ids = [...pair.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
assert.equal(new Set(ids).size, ids.length, 'Multiple instances must have unique SVG IDs');
for (const match of pair.matchAll(/url\(#([^)]+)\)/g)) assert(ids.includes(match[1]), 'Broken SVG reference');

console.log(`PASS: ${count} frozen-prop renders covering every experiment, step, concept, ages 0/5/99, empty text, Unicode, and long input.`);
console.log('PASS: rebind progression, separate immutable joined-text strand, and unique accessible SVG references.');
