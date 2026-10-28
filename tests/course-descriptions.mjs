import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import ts from 'typescript';
import vm from 'node:vm';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {JSDOM} from 'jsdom';
const read=p=>fs.readFile(p,'utf8');
const descriptions=JSON.parse(await read('content/course-descriptions.json'));
const catalog=JSON.parse(await read('content/catalog.json'));
const reviewed=JSON.parse(await read('docs/course-descriptions/reviewed-wording.json'));
assert.deepEqual(descriptions,reviewed);
assert.deepEqual(Object.keys(descriptions).sort(),[...new Set(catalog.units.map(u=>u.track))].sort());
const mod={exports:{}};const code=ts.transpileModule(await read('components/CourseDescription.tsx'),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX,esModuleInterop:true}}).outputText;
const jsx=await import('react/jsx-runtime');vm.runInNewContext(code,{module:mod,exports:mod.exports,require:id=>id==='react/jsx-runtime'?jsx:descriptions});
for(const [track,text]of Object.entries(descriptions)){
 assert.ok(text.length>70&&text.length<420,track);assert.ok((text.match(/[.!?](?:\s|$)/g)??[]).length<=3,track);
 const dom=new JSDOM(renderToStaticMarkup(React.createElement('button',null,React.createElement(mod.exports.default,{track}))));
 assert.equal(dom.window.document.querySelectorAll('.course-description').length,1);assert.equal(dom.window.document.querySelector('.course-description').textContent,text);assert.equal(dom.window.document.querySelectorAll('button').length,1);dom.window.close();
}
assert.match(descriptions.react,/JavaScript library/);assert.match(descriptions.html,/markup language/);assert.match(descriptions.css,/style-sheet language/);assert.match(descriptions['developer-toolkit'],/not a programming language/);assert.match(descriptions.ruby,/separate things/);
const ui=await read('components/CodeQuest.tsx');assert.equal((ui.match(/<CourseDescription track=\{id\}/g)??[]).length,1);assert.match(ui,/Object.entries\(names\).sort/);
const css=await read('app/globals.css');assert.match(css,/\.track-card \.course-description[\s\S]*white-space: normal;[\s\S]*overflow-wrap: anywhere;/);
console.log('PASS all21 course descriptions: exact reviewed wording, course-ID coverage, accurate kinds, one visible accessible span per card, no nested interaction, wrapped unclipped source styles. DOM tests, not browser geometry.');

const term=await read('components/Terminology.tsx');assert.match(term,/className="muted terminology-summary" role="status"/);assert.match(css,/\.terminology \.terminology-summary \{ margin: 16px 0; line-height: 1.6; \}/);
console.log('PASS shared Terminology helper spacing16px above/below for List/Tiles and all course filters; state/DOM order unchanged.');
