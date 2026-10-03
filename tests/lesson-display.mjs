import assert from 'node:assert/strict';
import { readFile, writeFile, rm } from 'node:fs/promises';
import ts from 'typescript';
import React from 'react';import { renderToStaticMarkup } from 'react-dom/server';import { JSDOM } from 'jsdom';
// Use a disposable local module bundle so the same renderer is exercised in Node.
const files=['lib/code-language.ts','lib/lesson-markup.ts','components/LessonContent.tsx'];
try {
 for(const file of files){const source=await readFile(file,'utf8');const js=ts.transpileModule(source,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext,jsx:ts.JsxEmit.ReactJSX}}).outputText.replace(/from "(\.\.?\/[^\"]+)"/g,'from "$1.display-test.mjs"');await writeFile(file.replace(/\.tsx?$/,'.display-test.mjs'),js);}
 const {lessonBlocks,codeTokens}=await import('../lib/lesson-markup.display-test.mjs');const {default:LessonContent}=await import('../components/LessonContent.display-test.mjs');
 const python='pet_name = "Milo"\npet_age = 3\nprint(f"{pet_name} is {pet_age} years old.")\n';
 const cases={python, javascript:'for (let i = 0; i < 3; i++) {\n  console.log("ready; go");\n}\n', typescript:'const count: number = 3;\n', react:'const view = <h1>Hello</h1>;\n',html:'<img src="missing" onerror="alert(1)">\n<script>alert("no execution")</script>\n',css:'h1 {\n  color: navy;\n}\n',sql:"SELECT 'ready; go' AS message;\n",swift:'func double(_ n: Int) -> Int {\n    return n * 2\n}\n'};
 for(const [runtime,code] of Object.entries(cases)){
  assert.equal(codeTokens(code,runtime).map(t=>t.text).join(''),code);
  const text='Read the example.\n\n```'+runtime+'\n'+code+'```\n\n`print()` shows a result.';
  const blocks=lessonBlocks(text,runtime);assert.equal(blocks[1].code,code);
  const markup=renderToStaticMarkup(React.createElement(LessonContent,{text,runtime}));const dom=new JSDOM(markup).window.document;
  assert.equal(dom.querySelector('pre code').textContent,code);assert.equal(dom.querySelectorAll('script,img').length,0);
  if(runtime!=='swift')assert.ok(dom.querySelector('pre .tok-keyword, pre .tok-string, pre .tok-typeName, pre .tok-propertyName'));
  assert.equal(dom.querySelector('.inline-code').textContent,'print()');
 }
 const indented='if ready:\n\tlaunch()\n\n    # spaces and blank lines stay intact\n';assert.equal(codeTokens(indented,'python').map(t=>t.text).join(''),indented);
 assert.deepEqual(lessonBlocks('Plain words with <b>text</b>.','python'),[{kind:'prose',text:'Plain words with <b>text</b>.'}]);
 assert.equal(lessonBlocks('```python\nunfinished','python')[0].kind,'prose');
 console.log('Passed exact source/indentation preservation for 8 runtimes, semicolons inside strings/loops, real syntax tokenization, escaped HTML, inline terms, and incomplete-fence fallback.');
} finally {for(const file of files)await rm(file.replace(/\.tsx?$/,'.display-test.mjs'),{force:true});}
