import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, writeFile, rm, symlink } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import ts from 'typescript';
import React, { act } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createRoot } from 'react-dom/client';
import { JSDOM } from 'jsdom';

const cwd = fileURLToPath(new URL('..', import.meta.url));
const temp = await mkdtemp(path.join(tmpdir(), 'codequest-anatomy-'));
const files = ['lib/code-language.ts', 'lib/code-anatomy.ts', 'lib/term-lesson-visuals.ts', 'lib/swift-code-words.ts', 'lib/csharp-reviewed-anatomy.ts', 'lib/cpp-reviewed-anatomy.ts', 'lib/java-reviewed-anatomy.ts', 'lib/c-reviewed-anatomy.ts', 'lib/kotlin-reviewed-anatomy.ts', 'lib/rust-reviewed-anatomy.ts', 'lib/php-reviewed-anatomy.ts', 'lib/ruby-reviewed-anatomy.ts', 'lib/r-reviewed-anatomy.ts', 'lib/go-reviewed-anatomy.ts', 'components/CodeAnatomy.tsx', 'components/LessonGlossary.tsx', 'lib/lesson-glossary.ts', 'lib/term-senses.ts'];
const reports = [];
const check = async (name, fn) => { await fn(); reports.push(name); };
try {
  await symlink(path.join(cwd, 'node_modules'), path.join(temp, 'node_modules'), process.platform === 'win32' ? 'junction' : 'dir');
  for (const file of files) {
    const source = await readFile(path.join(cwd, file), 'utf8');
    const js = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext, jsx: ts.JsxEmit.ReactJSX } }).outputText
      .replace(/import styles from "\.\/(?:CodeAnatomy|LessonGlossary)\.module\.css";/, 'const styles = new Proxy({}, { get: (_, name) => String(name) });')
      .replace(/from\s+(['"])(\.\.?\/[^'"]+)\1/g, 'from "$2.mjs"');
    const target = path.join(temp, file.replace(/\.tsx?$/, '.mjs'));
    await mkdir(path.dirname(target), { recursive: true });
    await writeFile(target, js);
  }
  const { codeAnatomy, anatomyPages, anatomyTokenWidth, supportsCodeAnatomy } = await import(pathToFileURL(path.join(temp, 'lib/code-anatomy.mjs')).href);
  const { default: CodeAnatomy } = await import(pathToFileURL(path.join(temp, 'components/CodeAnatomy.mjs')).href);
  const tokens = (code, language = 'python') => codeAnatomy(code, language).lines.flatMap(line => line.tokens).filter(token => token.label);
  const labels = (code, language) => tokens(code, language).map(token => [token.text, token.label]);
  const token = (code, text, language = 'python') => tokens(code, language).find(item => item.text === text);
  const markup = (code, language = 'python') => renderToStaticMarkup(React.createElement(CodeAnatomy, { code, language }));

  await check('All rust examples preserve every labeled code part', async () => {
    const rows=JSON.parse(await readFile(path.join(cwd,'docs/rust-wording-v1/examples.json'),'utf8'));
    assert.equal(rows.length,68);
    for(const row of rows){
      const model=codeAnatomy(row.code,'rust');
      const lines=row.code.split('\n');if(lines.at(-1)==='')lines.pop();
      assert.deepEqual(model.lines.map(l=>l.tokens.map(t=>t.text).join('')),lines,row.id);
      for(const t of model.lines.flatMap(l=>l.tokens)){
        if(!t.text.trim())continue;
        assert.ok(t.explanation && !['Code','Symbol','Unclassified',''].includes(t.label),row.id+': '+t.text);
        assert.equal(row.code.slice(t.from,t.to),t.text,row.id);
      }
    }
  });
  await check('All php examples preserve every labeled code part', async () => {
    const rows=JSON.parse(await readFile(path.join(cwd,'docs/php-wording-v1/examples.json'),'utf8'));
    assert.equal(rows.length,68);
    for(const row of rows){
      const model=codeAnatomy(row.code,'php');
      const lines=row.code.split('\n');if(lines.at(-1)==='')lines.pop();
      assert.deepEqual(model.lines.map(l=>l.tokens.map(t=>t.text).join('')),lines,row.id);
      for(const t of model.lines.flatMap(l=>l.tokens)){
        if(!t.text.trim())continue;
        assert.ok(t.explanation && !['Code','Symbol','Unclassified',''].includes(t.label),row.id+': '+t.text);
        assert.equal(row.code.slice(t.from,t.to),t.text,row.id);
      }
    }
  });
  await check('All ruby examples preserve every labeled code part', async () => {
    const rows=JSON.parse(await readFile(path.join(cwd,'docs/ruby-wording-v1/examples.json'),'utf8'));
    assert.equal(rows.length,64);
    for(const row of rows){
      const model=codeAnatomy(row.code,'ruby');
      const lines=row.code.split('\n');if(lines.at(-1)==='')lines.pop();
      assert.deepEqual(model.lines.map(l=>l.tokens.map(t=>t.text).join('')),lines,row.id);
      for(const t of model.lines.flatMap(l=>l.tokens)){
        if(!t.text.trim())continue;
        assert.ok(t.explanation && !['Code','Symbol','Unclassified',''].includes(t.label),row.id+': '+t.text);
        assert.equal(row.code.slice(t.from,t.to),t.text,row.id);
      }
    }
  });
  await check('All r examples preserve every labeled code part', async () => {
    const rows=JSON.parse(await readFile(path.join(cwd,'docs/r-wording-v1/examples.json'),'utf8'));
    assert.equal(rows.length,68);
    for(const row of rows){
      const model=codeAnatomy(row.code,'r');
      const lines=row.code.split('\n');if(lines.at(-1)==='')lines.pop();
      assert.deepEqual(model.lines.map(l=>l.tokens.map(t=>t.text).join('')),lines,row.id);
      for(const t of model.lines.flatMap(l=>l.tokens)){
        if(!t.text.trim())continue;
        assert.ok(t.explanation && !['Code','Symbol','Unclassified',''].includes(t.label),row.id+': '+t.text);
        assert.equal(row.code.slice(t.from,t.to),t.text,row.id);
      }
    }
  });
  await check('Reviewed Go examples preserve code and distinguish declarations, pointer types, channels, and module files', async () => {
    const rows=JSON.parse(await readFile(path.join(cwd,'docs/go-wording-v1/examples.json'),'utf8'));
    const current=JSON.parse(await readFile(path.join(cwd,'content/lessons.json'),'utf8'));
    assert.equal(rows.length,65);
    const source=id=>rows.find(r=>r.id===`go-${id}`).code;
    for(const row of rows){
      assert.equal(current.find(l=>l.id===row.id).explanation.join('\n').match(/\x60\x60\x60go\n([\s\S]*?)\n\x60\x60\x60/)[1],row.code);
      const model=codeAnatomy(row.code,'go');
      const lines=row.code.split('\n');if(lines.at(-1)==='')lines.pop();
      assert.deepEqual(model.lines.map(l=>l.tokens.map(t=>t.text).join('')),lines,row.id);
      for(const t of model.lines.flatMap(l=>l.tokens)){
        assert.ok(!['Code','Symbol','Unclassified'].includes(t.label),`${row.id}: ${t.text}`);
        assert.equal(row.code.slice(t.from,t.to),t.text,row.id);
      }
    }
    const has=(id,text,label)=>tokens(source(id),'go').some(t=>t.text===text&&t.label===label);
    for(const args of [ ['29','*','Pointer type'], ['26','*','Multiply'], ['55','<-','Send to a channel'], ['55','<-','Receive from a channel'], ['65','<-','Send-only channel'], ['25','...','Pass slice items'], ['25','...','Collect inputs'], ['39','|','Allow either type group'], ['40','comparable','Type: comparable'], ['54','close','Close the channel'], ['58','Add','Register tasks'], ['60','Add','Add atomically'], ['01','main','Package: main'], ['01','main','Define: main'], ['41','// File: helper/helper.go','File: helper/helper.go'], ['42','=>','Redirect to folder'], ['44','// File: main_test.go','File: main_test.go'] ]) assert.ok(has(...args),args.join(' '));
    assert.match(token(source('12'),'"é"','go').explanation,/quotation marks/);
    assert.equal(token(source('01')+'\n','Println','go').label,'Show a line');
    assert.notEqual(token(source('01').replace('Moon','Sun'),'Println','go').label,'Show a line');
  });

  await check('Reviewed Kotlin examples preserve code and distinguish types, calls, spread, and delegation', async () => {
    const rows=JSON.parse(await readFile(path.join(cwd,'docs/kotlin-wording-v1/examples.json'),'utf8'));
    const current=JSON.parse(await readFile(path.join(cwd,'content/lessons.json'),'utf8'));
    assert.equal(rows.length,64);
    const source=id=>rows.find(r=>r.id===`kotlin-${id}`).code;
    for(const row of rows){
      assert.equal(current.find(l=>l.id===row.id).explanation.join('\n').match(/\x60\x60\x60kotlin\n([\s\S]*?)\n\x60\x60\x60/)[1],row.code);
      const model=codeAnatomy(row.code,'kotlin');
      const lines=row.code.split('\n');if(lines.at(-1)==='')lines.pop();
      assert.deepEqual(model.lines.map(l=>l.tokens.map(t=>t.text).join('')),lines,row.id);
      for(const t of model.lines.flatMap(l=>l.tokens)){
        assert.ok(!['Code','Symbol','Unclassified'].includes(t.label),`${row.id}: ${t.text}`);
        assert.equal(row.code.slice(t.from,t.to),t.text,row.id);
      }
    }
    const part=(id,text)=>token(source(id),text,'kotlin');
    const has=(id,text,label)=>tokens(source(id),'kotlin').some(t=>t.text===text&&t.label===label);
    assert.equal(part('23','*').label,'Spread array inputs');
    assert.equal(part('24','*').label,'Multiply');
    assert.ok(has('22','repeat','Read: repeat'));
    assert.ok(has('62','repeat','Repeat a fixed count'));
    assert.equal(part('40','by').label,'Forward interface actions');
    assert.equal(part('41','by').label,'Delegate property setup');
    assert.equal(part('39','<').label,'Type brackets');
    assert.ok(has('39','isA','Call: isA'));
    assert.ok(has('60','CompletableDeferred','Imported name')&&has('60','CompletableDeferred','Create: CompletableDeferred'));
    assert.equal(part('60','<').label,'Type brackets');
    assert.equal(part('53','// File: Labels.kt').label,'File: Labels.kt');
    assert.match(part('50','"é"').explanation,/text inside/);
    assert.ok(has('29','score','Read: score')&&has('29','points','Update: points'));
    assert.equal(part('09','toInt').label,'Convert a number to Int');
    assert.equal(part('56','toInt').label,'Read text as Int');
    assert.equal(token(source('01')+'\n','main','kotlin').label,'Define: main');
    assert.notEqual(token(source('01').replace('Moon','Sun'),'main','kotlin').label,'Define: main');
  });

  await check('Reviewed C examples preserve code and distinguish pointers, bits, storage, and calls', async () => {
    const rows=JSON.parse(await readFile(path.join(cwd,'docs/c-wording-v1/examples.json'),'utf8'));
    const current=JSON.parse(await readFile(path.join(cwd,'content/lessons.json'),'utf8'));
    assert.equal(rows.length,62);
    const source=id=>rows.find(r=>r.id===`c-${id}`).code;
    for(const row of rows){
      const lesson=current.find(l=>l.id===row.id);
      assert.equal(lesson.explanation.join('\n').match(/\x60\x60\x60c\n([\s\S]*?)\n\x60\x60\x60/)[1],row.code);
      const model=codeAnatomy(row.code,'c');
      const lines=row.code.split('\n');if(lines.at(-1)==='')lines.pop();
      assert.deepEqual(model.lines.map(l=>l.tokens.map(t=>t.text).join('')),lines,row.id);
      assert.ok(!model.lines.flatMap(l=>l.tokens).some(t=>['Code','Symbol','Unclassified'].includes(t.label)),row.id);
      for(const t of model.lines.flatMap(l=>l.tokens))assert.equal(row.code.slice(t.from,t.to),t.text,row.id);
    }
    const part=(id,text)=>token(source(id),text,'c');
    const has=(id,text,label)=>tokens(source(id),'c').some(t=>t.text===text&&t.label===label);
    assert.ok(has('23','*','Pointer type')&&has('23','*','Follow the pointer'));
    assert.equal(part('22','*').label,'Multiply');
    assert.equal(part('23','&').label,'Get an address');
    assert.equal(part('12','&').label,'Select shared bits');
    assert.equal(part('12','|=').label,'Set bits and store');
    assert.equal(part('50','<<').label,'Shift bits left');
    assert.equal(part('50','|').label,'Combine set bits');
    assert.equal(part('25','+').label,'Move by array items');
    assert.equal(part('25','-').label,'Distance in items');
    assert.equal(part('26','static').label,'Persistent local storage');
    assert.equal(part('44','static').label,'File-local name');
    assert.ok(has('34','*','Pointed-to type for size'));
    assert.ok(has('17','[','Array size')&&has('17','[','Item type for size'));
    assert.match(part('18',"'A'").explanation,/type int/);
    assert.equal(part('43','// File: score.h').label,'File: score.h');
    assert.ok(has('44','public_value','Function name: public_value')&&has('44','public_value','Call: public_value'));
    assert.equal(part('45','((x) * (x))').label,'Macro replacement');
    assert.equal(part('60','atomic_fetch_add').label,'Add as one atomic update');
    assert.equal(part('59','mtx_unlock').label,'Release the shared lock');
    assert.equal(token(source('01')+'\n','main','c').label,'Program entry');
    assert.notEqual(token(source('01').replace('Map','Trail'),'main','c').label,'Program entry');
  });

  await check('Reviewed Java examples preserve every source range and explain context-dependent syntax', async () => {
    const rows=JSON.parse(await readFile(path.join(cwd,'docs/java-wording-v1/examples.json'),'utf8'));
    const current=JSON.parse(await readFile(path.join(cwd,'content/lessons.json'),'utf8'));
    assert.equal(rows.length,72);
    const source=id=>rows.find(r=>r.id===`java-${id}`).code;
    for(const row of rows){
      const lesson=current.find(l=>l.id===row.id);
      assert.equal(lesson.explanation.join('\n').match(/\x60\x60\x60java\n([\s\S]*?)\n\x60\x60\x60/)[1],row.code);
      const model=codeAnatomy(row.code,'java');
      const lines=row.code.split('\n');if(lines.at(-1)==='')lines.pop();
      assert.deepEqual(model.lines.map(l=>l.tokens.map(t=>t.text).join('')),lines,row.id);
      assert.ok(!model.lines.flatMap(l=>l.tokens).some(t=>['Code','Symbol'].includes(t.label)),row.id);
      for(const t of model.lines.flatMap(l=>l.tokens))assert.equal(row.code.slice(t.from,t.to),t.text,row.id);
    }
    const part=(id,text)=>token(source(id),text,'java');
    const has=(id,text,label)=>tokens(source(id),'java').some(t=>t.text===text&&t.label===label);
    assert.equal(part('15','->').label,'Case result follows');
    assert.equal(part('46','->').label,'Lambda body follows');
    assert.equal(part('47','::').label,'Method reference');
    assert.equal(part('19','<').label,'Generic type brackets');
    assert.equal(part('16','<').label,'Compare values');
    assert.equal(part('11','==').label,'Compare object identity');
    assert.equal(part('16','==').label,'Compare values');
    assert.equal(part('14','!=').label,'Check for a missing reference');
    assert.equal(part('02','+').label,'Add numbers');
    assert.equal(part('45','+').label,'Join text');
    assert.equal(part('56','*').label,'Import package types');
    assert.equal(part('48','*').label,'Multiply');
    assert.ok(has('17','[','Array type') && has('17','[','Array position'));
    assert.ok(has('04','java','Package name part') && has('04','Scanner','Type: Scanner'));
    assert.ok(has('23','values','Gathered input name'));
    assert.ok(has('44','text','Matched object name'));
    assert.ok(has('46','x','Lambda input'));
    assert.ok(has('33','minutes','Record component') && has('33','minutes','Read the minutes component'));
    assert.ok(has('28','get','Declare method') && has('28','get','Read the level'));
    assert.equal(part('19','get').label,'Read by index');
    assert.equal(part('43','get').label,'Read the optional value');
    assert.equal(part('67','get').label,'Wait for the task result');
    assert.equal(part('64','join').label,'Wait for this thread');
    assert.equal(part('69','join').label,'Read the final future result');
    assert.equal(part('58','// File: study/Labels.java').label,'File: study/Labels.java');
    assert.ok(has('59','class','Class metadata'));
    assert.equal(part('12','"\\uD83D\\uDE00"').label,'Text value');
    assert.equal(part('52','"é"').label,'Text value');
    assert.equal(token(source('01')+'\n','main','java').label,'Program entry');
    assert.notEqual(token(source('01').replace('Sky','Cloud'),'main','java').label,'Program entry');
  });

  await check('Reviewed C++ examples keep exact source and distinguish overloaded syntax roles', async () => {
    const rows=JSON.parse(await readFile(path.join(cwd,'docs/cpp-wording-v1/examples.json'),'utf8'));
    const current=JSON.parse(await readFile(path.join(cwd,'content/lessons.json'),'utf8'));
    assert.equal(rows.length,69);
    const source=id=>rows.find(r=>r.id===`cpp-${id}`).code;
    for(const row of rows){
      const lesson=current.find(l=>l.id===row.id);
      const example=lesson.explanation.join('\n').match(/\x60\x60\x60cpp\n([\s\S]*?)\n\x60\x60\x60/)[1];
      assert.equal(example,row.code,row.id+' annotation source is current');
      const model=codeAnatomy(row.code,'cpp');
      const lines=row.code.split('\n');if(lines.at(-1)==='')lines.pop();
      assert.deepEqual(model.lines.map(l=>l.tokens.map(t=>t.text).join('')),lines,row.id);
      assert.ok(!model.lines.flatMap(l=>l.tokens).some(t=>t.label==='Code'||t.label==='Symbol'),row.id);
      for(const t of model.lines.flatMap(l=>l.tokens))assert.equal(row.code.slice(t.from,t.to),t.text,row.id);
    }
    const part=(id,text)=>token(source(id),text,'cpp');
    assert.equal(part('20','*').label,'Pointer type');
    assert.ok(tokens(source('20'),'cpp').some(t=>t.text==='*'&&t.label==='Reach the contained value'));
    assert.equal(part('58','*').label,'Multiply');
    assert.equal(part('18','&').label,'Reference type');
    assert.equal(part('20','&').label,'Get an address');
    assert.equal(part('65','&').label,'Capture by reference');
    assert.equal(part('14','<').label,'Compare values');
    assert.equal(part('15','<').label,'Template bracket');
    assert.equal(part('01','<<').label,'Send to output');
    assert.equal(part('12','>>').label,'Read from input');
    assert.equal(part('44','|').label,'Connect view steps');
    assert.equal(part('38','[').label,'Capture list');
    assert.equal(part('56','[').label,'Item position');
    assert.equal(part('46','[').label,'Names for parts');
    assert.equal(part('40','++').label,'Next iterator position');
    assert.equal(part('14','++').label,'Add one');
    assert.equal(part('68','get').label,'Receive the future result');
    assert.equal(part('50','get').label,'Read the active alternative');
    assert.equal(part('26','const').label,'Read-only member function');
    assert.equal(part('59','// File: score.hpp').label,'File label');
    assert.ok(tokens(source('66'),'cpp').some(t=>t.text==='mutex'&&t.label==='Constructor input'));
    assert.ok(tokens(source('66'),'cpp').some(t=>t.text==='mutex'&&t.label==='Local name'));
    assert.ok(tokens(source('54'),'cpp').some(t=>t.text==='path'&&t.label==='Local name'));
    assert.ok(tokens(source('28'),'cpp').some(t=>t.text==='a'&&t.label==='Named value'));
    assert.equal(token(source('20')+'\n','*','cpp').label,'Pointer type');
    assert.notEqual(token(source('20').replace('score{3}','score{4}'),'*','cpp').label,'Pointer type');
  });

  await check('Reviewed C# examples preserve source and explain syntax by compiler context', async () => {
    const rows=JSON.parse(await readFile(path.join(cwd,'docs/csharp-wording-v1/examples.json'),'utf8'));
    const current=JSON.parse(await readFile(path.join(cwd,'content/lessons.json'),'utf8'));
    assert.equal(rows.length,63);
    const source=id=>rows.find(r=>r.id===`csharp-${id}`).code;
    for(const row of rows){
      const lesson=current.find(l=>l.id===row.id);
      const example=lesson.explanation.join('\n').match(/\x60\x60\x60csharp\n([\s\S]*?)\n\x60\x60\x60/)[1];
      assert.equal(example,row.code,row.id+' annotations must match current lesson');
      const model=codeAnatomy(row.code,'csharp');
      const expectedLines=row.code.split('\n'); if(expectedLines.at(-1)==='') expectedLines.pop();
      assert.deepEqual(model.lines.map(l=>l.tokens.map(t=>t.text).join('')),expectedLines,row.id);
      assert.ok(!model.lines.flatMap(l=>l.tokens).some(t=>t.label==='Code'),row.id);
      for(const t of model.lines.flatMap(l=>l.tokens)) assert.equal(row.code.slice(t.from,t.to),t.text,row.id);
    }
    assert.equal(token(source('60'),'field','csharp').label,'Property storage');
    assert.equal(token(source('60'),'value','csharp').label,'Incoming value');
    assert.equal(token(source('19'),'false','csharp'),undefined);
    assert.equal(token(source('36'),'<','csharp').label,'Generic type bracket');
    assert.equal(token(source('14'),'<','csharp').label,'Compare values');
    assert.equal(token(source('46'),'+=','csharp').label,'Subscribe handler');
    assert.equal(token(source('57'),'+=','csharp').label,'Add and store');
    assert.equal(token(source('41'),'using','csharp').label,'Arrange cleanup');
    assert.equal(token(source('42'),'using','csharp').label,'Use namespace');
    assert.equal(token(source('13'),'=>','csharp').label,'Chosen result');
    assert.equal(token(source('45'),'=>','csharp').label,'Body or result');
    assert.equal(token(source('11'),'??','csharp').label,'Missing-value backup');
    assert.equal(token(source('44'),'Apply','csharp').label,'Call method');
    assert.ok(tokens(source('44'),'csharp').some(t=>t.text==='Apply'&&t.label==='Define method'));
    assert.ok(tokens(source('44'),'csharp').some(t=>t.text==='Double'&&t.label==='Pass method'));
    assert.ok(tokens(source('10'),'csharp').some(t=>t.label==='Insert value'));
    assert.equal(token(source('60')+'\n','field','csharp').label,'Property storage');
    assert.notEqual(token(source('60').replace('session.Minutes = 5','session.Minutes = 6'),'field','csharp').label,'Property storage');
  });

  await check('JavaScript arithmetic explains its own operation and distinguishes other star syntax', () => {
    for(const lang of ['javascript','typescript','react']) {
      assert.equal(token('const score = input * weight + bias;', '*', lang).label,'Multiply');
      assert.doesNotMatch(token('const score = input * weight;', '*', lang).plainExplanation,/SQL|unpack/);
      assert.equal(token('const x = 2 ** 3;', '**', lang).label,'Power');
      assert.equal(token('const x = 4 / 2;', '/', lang).label,'Divide');
      assert.equal(token('const x = 4 - 2;', '-', lang).label,'Subtract');
      assert.equal(token('const x = "a" + "b";', '+', lang).label,'Add or join');
      assert.equal(token('const x = 5 % 2;', '%', lang).label,'Remainder');
      assert.equal(token('function* count() { yield 1; }', '*', lang).label,'Generator');
      assert.equal(tokens('function* count() { yield* items; }',lang).filter(t=>t.text==='*')[1].label,'Yield from');
      assert.equal(token('import * as tools from "tools";', '*', lang).label,'Module namespace');
      assert.equal(token('export * from "tools";', '*', lang).label,'Re-export names');
      assert.equal(token('export * as tools from "tools";', '*', lang).label,'Export namespace');
    }
    assert.equal(token('SELECT * FROM items;', '*', 'sql').label,'All / rows');
    assert.equal(token('* { color: red; }', '*', 'css').label,'Any element');
  });

  await check('Git action labels distinguish commands from filenames and other programs', () => {
    assert.equal(token('git add main.js', 'add', 'bash').label, 'Stage changes');
    assert.equal(token('git stash apply "stash@{0}"', 'apply', 'bash').label, 'Restore and keep');
    assert.equal(token('git diff --cached -- note.txt', '--', 'bash').label, 'File paths next');
    assert.equal(token('git show HEAD', 'show', 'bash').label, 'Inspect a saved object');
    assert.equal(token('echo add', 'add', 'bash').label, 'Argument');
    assert.equal(token('git add -- status', 'status', 'bash').label, 'Argument');
    assert.equal(token('git custom-action', 'custom-action', 'bash').label, 'Argument');
    assert.equal(token('git config user.name "add"', '"add"', 'bash').label, 'Text');
  });

  await check('React tools and built-in props explain their job without guessing custom behavior', () => {
    assert.equal(token('React.useState(0);','useState','react').label,'Remember state');
    assert.equal(token('React.useEffect(() => {}, []);','useEffect','jsx').label,'Connect after rendering');
    assert.match(token('React.useRef(null);','useRef','react').plainExplanation,/does not ask React/);
    assert.equal(token('React.useId();','useId','react').label,'Make a unique ID');
    assert.equal(token('React.lazy(load);','lazy','react').label,'Load a component later');
    assert.equal(token('<button />','button','react').label,'Element');
    assert.equal(token('<React.Suspense />','Suspense','react').label,'Waiting boundary');
    assert.equal(token('<button onClick={go}>Go</button>','onClick','react').label,'When clicked');
    assert.equal(token('<input defaultValue="Map" />','defaultValue','react').label,'Starting field value');
    assert.equal(token('<label htmlFor="name">Name</label>','htmlFor','react').label,'Label this field');
    assert.equal(token('<Row key={id} />','key','react').label,'Keep item identity');
    assert.equal(token('<Card onClick={go} />','onClick','react').label,'Prop');
    assert.equal(token('other.useState(0);','useState','react').label,'Method');
    assert.equal(token('React.useState;','useState','react').label,'Property');
  });

  await check('TypeScript labels distinguish type rules from running expressions', () => {
    const tsToken=(code,text)=>token(code,text,'typescript');
    assert.equal(tsToken('type A<T extends string> = T extends "x" ? true : false;', 'extends').label,'Type requirement');
    assert.equal(tsToken('type A<T> = T extends string ? true : false;', 'extends').label,'Type fits?');
    assert.equal(tsToken('class B extends A {}','extends').label,'Build on class');
    assert.equal(tsToken('interface B extends A {}','extends').label,'Build on a shape');
    assert.equal(tsToken('type T = typeof sample;','typeof').label,'Type of a value');
    assert.equal(tsToken('console.log(typeof sample);','typeof').label,'Kind of value');
    assert.equal(tsToken('type Flags<T> = { [K in keyof T]: boolean };','in').label,'For each field name');
    assert.equal(tsToken('"name" in item;','in').label,'Property in');
    assert.equal(tsToken('type A = string | number;','|').label,'One of these types');
    assert.equal(tsToken('type A = Named & Counted;','&').label,'Both type rules');
    assert.equal(tsToken('type A = string;','=').label,'Type means');
    assert.equal(tsToken('type A = string;',';').label,'End declaration');
    assert.equal(tsToken('let count: number = 1;',':').label,'Type marker');
    assert.equal(tokens('const pair = [1, 2] as const;','typescript').filter(t=>t.text==='const')[1].label,'Keep exact values');
    assert.equal(tsToken('type Event = `${Topic}:saved`;','`${Topic}:saved`').label,'Text pattern type');
    assert.match(tsToken('const pair = [1, 2] as const;','as').plainExplanation,/does not check or convert/);
    assert.match(tsToken('const x = {a:1} satisfies Record<string,number>;','satisfies').plainExplanation,/Checks that this value fits/);
    assert.equal(tsToken('const item = {type: "ok"};','type').label,'Property');
    assert.match(tsToken('type R = ReadonlyArray<string>;','ReadonlyArray').plainExplanation,/does not freeze/);
    assert.match(tsToken('class C { protected go(){} }','protected').plainExplanation,/not runtime secrecy/);
  });

  await check('CSS labels explain selectors, values, conditions, and named values in context', () => {
    const css = '.note { padding: 12px; --ink: teal; color: var(--ink, navy); }';
    assert.equal(token(css,'.note','css').label,'Class selector');
    assert.match(token(css,'padding','css').plainExplanation,/inside the border/);
    assert.equal(token(css,'12px','css').plainExplanation,'12 CSS pixels.');
    const names = tokens(css,'css').filter(t=>t.text==='--ink');
    assert.deepEqual(names.map(t=>t.label),['Name a shared value','Read a shared value']);
    assert.equal(token(css,'var','css').label,'CSS function');
    assert.equal(token('@media (min-width: 600px) { p { color: teal; } }','@media','css').label,'Media rule');
    assert.equal(token(':where(#notice) { color: teal !important; }',':where(#notice)','css').label,'Easy-to-override selector');
    assert.equal(token('p { color: teal !important; }','!important','css').label,'Important flag');
    assert.match(token('.x { transform: rotate(30deg); }','rotate','css').plainExplanation,/Turns/);
    assert.match(token('.x { grid-template-columns: repeat(3, 1fr); }','grid-template-columns','css').plainExplanation,/columns/);
  });
  await check('every reviewed CSS example keeps its exact source and has labeled parts', async () => {
    const lessons=JSON.parse(await readFile(path.join(cwd,'content/lessons.json'),'utf8')).filter(l=>l.id.startsWith('css-'));
    let count=0;
    for(const lesson of lessons) for(const section of lesson.explanation) for(const match of section.matchAll(/```css\n([\s\S]*?)```/g)) {
      const code=match[1],model=codeAnatomy(code,'css');
      assert.equal(model.source,code,lesson.id);
      for(const line of model.lines) assert.equal(line.tokens.map(t=>t.text).join(''),line.text,lesson.id);
      assert.equal(model.lines.map(l=>l.text).join('\n'),code.replace(/\n$/, ''),lesson.id);
      assert.ok(model.lines.some(l=>l.tokens.some(t=>t.label && t.plainExplanation)),lesson.id);
      count++;
    }
    assert.equal(count,67);
  });

  await check('reviewed labels match exact code and fenced final newline, never another example', () => {
    const reviewedExample={code:'print("Hello")',language:'python',parts:[{from:0,text:'print',label:'Show',meaning:'Show Hello on the screen.'}]};
    for(const code of ['print("Hello")','print("Hello")\n']){
      const doc=new JSDOM(renderToStaticMarkup(React.createElement(CodeAnatomy,{code,language:'python',reviewedExample}))).window.document;
      assert.equal(doc.querySelector('[data-active-code-part] strong').textContent,'Show');
      assert.equal(doc.querySelector('[data-anatomy-plain]').textContent,'Show Hello on the screen.');
    }
    const changed=new JSDOM(renderToStaticMarkup(React.createElement(CodeAnatomy,{code:'print("Changed")',language:'python',reviewedExample}))).window.document;
    assert.equal(changed.querySelector('[data-active-code-part] strong').textContent,'Function');
    assert.ok(!changed.querySelector('[data-anatomy-plain]').textContent.includes('Hello'));
    const otherLanguage=new JSDOM(renderToStaticMarkup(React.createElement(CodeAnatomy,{code:reviewedExample.code,language:'javascript',reviewedExample}))).window.document;
    assert.ok(!otherLanguage.querySelector('[data-anatomy-plain]').textContent.includes('Show Hello on the screen.'));
  });

  await check('JavaScript keywords explain their actual jobs in plain language', () => {
    const source = 'class Child extends Parent { static make() { return new Child(); } get value() { try { throw new Error("bad"); } catch (error) { return 0; } finally { log(); } } }';
    for (const [word, label] of [['class','Define class'],['extends','Build on class'],['static','On the class'],['return','Give back'],['new','Create instance'],['get','Read through getter'],['throw','Signal an error'],['catch','Handle error'],['finally','Finish up']]) assert.equal(token(source,word,'javascript').label,label,word);
    assert.equal(token('let n=0; n++;','++','javascript').label,'Add one');
    assert.equal(token('a === b','===','javascript').label,'Strictly equal?');
    assert.match(token('record.value','value','javascript').plainExplanation,/getter/);
  });
  await check('JavaScript and TypeScript BigInt literals remain distinct from Number', () => {
    for (const language of ['javascript','typescript','react']) for (const text of ['2n','0n','0x10n','123_456n','0b10n','0o7n']) {
      assert.equal(token(text,text,language).label,'BigInt');
      assert.match(token(text,text,language).explanation,/distinct from the Number/);
      assert.equal(codeAnatomy(text,language).source,text);
    }
    assert.equal(token('2','2','javascript').label,'Number');
    assert.equal(token('"2n"','"2n"','javascript').label,'Text');
  });
  await check('R quotes are strings, backticks are names and hash comments are notes', () => {
    const source = "\`total cost\` <- 'Ada' # note";
    assert.equal(codeAnatomy(source,'r').source,source);
    assert.equal(token(source,"'Ada'",'r').label,'Text');
    assert.equal(token(source,'\`total cost\`','r').label,'Name');
    assert.equal(token(source,'# note','r').label,'Comment');
    assert.equal(token('"Hi ${name}"','"Hi ${name}"','r').label,'Text');
  });
  await check('Ruby quote styles are strings and double quotes permit interpolation', () => {
    const source="name = 'Ada'; message = \"Hi #{name}\"; literal = '#{name}'";
    assert.equal(codeAnatomy(source,'ruby').source,source);
    assert.equal(token(source,"'Ada'",'ruby').label,'Text');
    assert.equal(token(source,'"Hi #{name}"','ruby').label,'Text template');
    assert.equal(token(source,"'#{name}'",'ruby').label,'Text');
    const escaped = String.raw`literal = "Hi \#{name}"`;
    assert.equal(token(escaped,String.raw`"Hi \#{name}"`,'ruby').label,'Text');
  });
  await check('PHP single and double quotes stay strings, not char literals', () => {
    const source="$name = 'Ada'; $message = \"Hello\"; $object->name; ['name' => $name];";
    assert.equal(codeAnatomy(source,'php').source,source);
    assert.equal(token(source,"'Ada'",'php').label,'Text');
    assert.equal(token(source,'"Hello"','php').label,'Text');
    assert.ok(tokens(source,'php').some(t=>t.text==='$name'));
    assert.equal(tokens(source,'php').some(t=>['Character','Rune','Lifetime / label'].includes(t.label)),false);
  });
  await check('Rust lifetime notation stays distinct from Unicode scalar literals', () => {
    const source="fn borrow<'a>(x: &'a str) -> &'a str { x } let c = '🦀'; let s: &'static str = \"Hi\";";
    assert.equal(codeAnatomy(source,'rust').source,source);
    assert.equal(token(source,"'a",'rust').label,'Lifetime / label');
    assert.equal(token(source,"'static",'rust').label,'Lifetime / label');
    assert.equal(token(source,"'🦀'",'rust').label,'Character');
    assert.match(token(source,"'🦀'",'rust').explanation,/Unicode scalar value/);
    assert.equal(token(source,'"Hi"','rust').label,'Text');
    assert.equal(token("let x = '\\n';","'\\n'",'rust').label,'Character');
  });
  await check('Go single quotes are rune constants, not strings', () => {
    const source="letter := 'é'; word := \"Hello\"";
    assert.equal(codeAnatomy(source,'go').source,source);
    assert.equal(token(source,"'é'",'go').label,'Rune');
    assert.match(token(source,"'é'",'go').explanation,/Unicode code point/);
    assert.equal(token(source,'"Hello"','go').label,'Text');
  });
  await check('Kotlin Char literals are not Strings', () => {
    const source="val initial = 'A'; val word = \"Hello\"";
    assert.equal(codeAnatomy(source,'kotlin').source,source);
    assert.match(token(source,"'A'",'kotlin').explanation,/Kotlin Char literal: one UTF-16 code unit/);
    assert.equal(token(source,'"Hello"','kotlin').label,'Text');
  });
  await check('C ordinary character constants have int type, unlike C++ char', () => {
    assert.match(token("int x = 'A';","'A'",'c').explanation,/type is int, not char/);
    assert.match(token("char x = 'A';","'A'",'cpp').explanation,/has type char/);
  });
  await check('Java char literals are UTF-16 code units, not Strings', () => {
    const source="char initial = 'A'; String word = \"Hello\";";
    assert.equal(codeAnatomy(source,'java').source,source);
    assert.equal(token(source,"'A'",'java').label,'Character');
    assert.match(token(source,"'A'",'java').explanation,/UTF-16 code unit/);
    assert.equal(token(source,'"Hello"','java').label,'Text');
  });
  await check('C/C++ single quotes are characters, not strings', () => {
    for (const language of ['c','cpp']) {
      const source = "char grade = 'A'; char newline = '\\n'; const char* word = \"Hello\";";
      assert.equal(codeAnatomy(source,language).source,source);
      assert.equal(token(source,"'A'",language).label,'Character');
      assert.equal(token(source,"'\\n'",language).label,'Character');
      assert.equal(token(source,'"Hello"',language).label,'Text');
    }
    assert.equal(token("name = 'A'","'A'",'python').label,'Text');
  });
  await check('reference print call has four matching labeled parts', () => {
    assert.deepEqual(labels('print("Hello")', 'python'), [['print', 'Function'], ['(', 'Open'], ['"Hello"', 'Text'], [')', 'Close']]);
    const document = new JSDOM(markup('print("Hello")')).window.document;
    assert.equal(document.querySelectorAll('svg g').length, 4);
    assert.deepEqual([...document.querySelectorAll('svg .partLabel')].map(node => node.textContent), ['Function', 'Open', 'Text', 'Close']);
    assert.equal(document.querySelector('svg').getAttribute('role'), 'img');
    for (const id of document.querySelector('svg').getAttribute('aria-labelledby').split(' ')) assert.ok(document.getElementById(id));
    assert.equal(document.querySelectorAll('svg line').length, 4);
    assert.equal(document.querySelector('details').hasAttribute('open'), true);
    assert.equal(document.querySelectorAll('[data-anatomy-plain]').length, 1);
  });

  await check('Python variables, function definitions, named inputs, indexing, dictionaries and grouping differ', () => {
    assert.equal(token('answer = greet(name)', 'answer').label, 'Name');
    assert.match(token('answer = greet(name)', 'answer').plainExplanation, /Receives the value/);
    assert.match(token('answer = other', 'other').plainExplanation, /Uses the value/);
    assert.match(token('a = b = 3', 'b').plainExplanation, /Receives the value/);
    assert.match(token('total += step', 'total').plainExplanation, /current value.*updated value/);
    assert.equal(token('for item in items:\n    print(item)', 'item').label, 'Item name');
    assert.equal(token('[n * 2 for n in values]', 'n').label, 'Name');
    assert.equal(tokens('[n * 2 for n in values]').filter(t=>t.text==='n')[1].label, 'Item name');
    assert.equal(token('match value:\n    case [name]:\n        print(name)', 'name').label, 'Name matched value');
    assert.equal(token('match value:\n    case _:\n        pass', '_').label, 'Any value');
    assert.equal(token('match value:\n    case _:\n        pass', 'match').label, 'Match shape');
    assert.equal(token('answer = greet(name)', 'greet').label, 'Function');
    assert.equal(token('answer = greet(name)', 'name').label, 'Name');
    assert.equal(token('def greet(name):\n  return name', 'greet').label, 'Function name');
    assert.equal(token('def greet(name):\n  return name', 'name').label, 'Parameter');
    assert.match(token('def greet(name):\n  return name', '(').explanation, /receives/);
    assert.match(token('greet(name)', '(').explanation, /passed/);
    assert.match(token('value = (a + 1)', '(').explanation, /group/);
    assert.equal(token('greet(name="a")', 'name').label, 'Input name');
    assert.equal(token('greet(name="a")', '=').label, 'Named input');
    assert.equal(token('def greet(name="a"):\n  pass', '=').label, 'Default');
    assert.equal(token('person.name', 'name').label, 'Property');
    assert.equal(token('person.greet()', 'greet').label, 'Method');
    assert.equal(token('items[1:3]', ':').label, 'Slice');
    assert.equal(token('data = {"x": 2}', ':').label, 'Value next');
    assert.equal(token('if ready:\n  launch()', ':').label, 'Block next');
    assert.equal(token('class Bird:\n  pass', 'Bird').label, 'Type name');
    assert.equal(tokens('if ready:\n\tlaunch()').find(item => item.label === 'Indent').text, '\t');
  });

  await check('Python labels distinguish loop completion, error-free completion and ordinary choices', () => {
    for(const code of ['b"Hi"', "b'Hi'", 'br"Hi"', 'rb"Hi"', 'B"Hi"'])assert.equal(token(code,code).label,'Bytes');
    assert.equal(token('print(b"Hi")','b"Hi"').label,'Bytes');
    assert.equal(token('r"Hi"','r"Hi"').label,'Text');
    const simpleKeyword=new JSDOM(markup('def greet():\n    return 1')).window.document;
    assert.equal(simpleKeyword.querySelector('[data-active-code-part] details'),null,'Do not add a disclosure that repeats the same plain explanation');
    assert.equal(token('from math import sqrt','from').label,'From module');
    assert.equal(token('from math import sqrt','import').label,'Import');
    assert.equal(token('import math as m','as').label,'Use this name');
    assert.equal(token('with open("x") as handle:\n    print(handle)','as').label,'Name the result');
    assert.equal(token('try:\n    run()\nexcept ValueError as error:\n    print(error)','as').label,'Name the error');
    assert.equal(token('with open("x") as handle:\n    print(handle)','with').label,'Manage cleanup');
    assert.equal(token('async def read():\n    await work()','await').label,'Wait for a result');
    assert.equal(token('raise ValueError("bad")','raise').label,'Signal an error');
    assert.equal(token('yield from values','from').label,'Items from');
    assert.equal(token('raise ValueError() from error','from').label,'Caused by');
    assert.match(token('for item in []:\n    pass\nelse:\n    print("done")','else').plainExplanation,/without break/);
    assert.match(token('while False:\n    pass\nelse:\n    print("done")','else').plainExplanation,/without break/);
    assert.match(token('try:\n    print(1)\nexcept ValueError:\n    pass\nelse:\n    print(2)','else').plainExplanation,/without an error/);
    assert.match(token('if False:\n    pass\nelse:\n    print(2)','else').plainExplanation,/earlier checks/);
    assert.match(token('1 if ready else 2','else').plainExplanation,/value after else/);
    assert.equal(token('for item in items:\n    pass','in').label,'From');
    assert.equal(token('[x for x in items]','in').label,'From');
    assert.equal(token('item in items','in').label,'Contains?');
    assert.match(token('a or b','or').plainExplanation,/left value/);
    assert.match(token('a and b','and').plainExplanation,/left value/);
    assert.equal(token('if ready:\n    pass\nelif later:\n    pass','elif').label,'Next check');
    assert.equal(token('lambda x: x + 1','lambda').label,'Small function');
  });

  await check('quoted punctuation, interpolation, comments and regex are meaningful intact tokens', () => {
    const string = '"look (here): a = 2 < 3"';
    assert.deepEqual(labels(`print(${string})`), [['print', 'Function'], ['(', 'Open'], [string, 'Text'], [')', 'Close']]);
    assert.equal(token('print(f"Hi {name}!")', 'f"Hi {name}!"').label, 'Text template');
    assert.equal(token('const x = `Hi ${name}!`;', '`Hi ${name}!`', 'javascript').label, 'Text template');
    assert.equal(token('const x = /[()]/g;', '/[()]/g', 'javascript').label, 'Pattern');
    assert.equal(tokens('# print("x")')[0].label, 'Comment');
    assert.equal(tokens('/* fake.call() */', 'javascript')[0].label, 'Comment');
    assert.equal(tokens('value = """first\nsecond (line)"""').filter(t => t.label === 'Text').length, 2);
  });

  await check('JavaScript and TypeScript distinguish callable/property names and declaration types', () => {
    assert.equal(token('const answer = console.log(value);', 'answer', 'javascript').label, 'New name');
    assert.equal(token('const answer = console.log(value);', 'console', 'javascript').label, 'Name');
    assert.equal(token('const answer = console.log(value);', 'log', 'javascript').label, 'Method');
    assert.equal(token('const answer = console.log;', 'log', 'javascript').label, 'Property');
    assert.equal(token('function greet(name: string) {}', 'greet', 'typescript').label, 'Function name');
    assert.equal(token('function greet(name: string) {}', 'string', 'typescript').label, 'Type');
    assert.equal(token('const f = n => n + 1;', 'n', 'javascript').label, 'Parameter');
    assert.equal(token('const o = { say() {} };', 'say', 'javascript').label, 'Function name');
  });


  await check('HTML roles distinguish overloaded settings, closing tags and character text', () => {
    const indented = codeAnatomy('<main>\n  <p>Hello</p>\n</main>', 'html');
    assert.equal(indented.lines[1].tokens[0].label, 'Indent');
    assert.equal(indented.lines.flatMap(line=>line.tokens).some(t=>t.label==='Text'&&!t.text.trim()), false);
    assert.equal(token('<input type="email">','type','html').label,'Control kind');
    assert.equal(token('<source type="video/mp4">','type','html').label,'File format');
    assert.equal(token('<script type="module"></script>','type','html').label,'Script kind');
    assert.equal(token('<meta name="description">','name','html').label,'Detail kind');
    assert.equal(token('<input name="email">','name','html').label,'Data name');
    assert.match(token('<input required="false">','"false"','html').plainExplanation,/false does not turn it off/);
    assert.equal(tokens('<p>Hi</p>','html').filter(t=>t.text==='p')[1].label,'End paragraph');
    assert.match(token('<code>&lt;p&gt;</code>','&lt;','html').plainExplanation,/Writes < as text/);
    assert.match(token('<img sizes="100vw">','sizes','html').plainExplanation,/does not set the actual layout/);
    assert.equal(token('<progress value="3" max="8">3 of 8</progress>','value','html').label,'Work completed');
    assert.equal(token('<meter value="3" max="8">3 of 8</meter>','value','html').label,'Measured value');
    assert.equal(token('<Button type="button"/>','type','react').label,'Prop');
  });
  await check('Caption timing is labeled as timing rather than arithmetic', () => {
    const source='WEBVTT\n\n00:00:01.000 --> 00:00:03.500\n[Soft bell] The reading session begins.\n';
    assert.equal(codeAnatomy(source,'vtt').source,source);
    assert.deepEqual(tokens(source,'vtt').filter(t=>t.text.includes(':')||t.text==='-->').map(t=>t.label),['Start time','Until','End time']);
    assert.equal(token(source,'WEBVTT','vtt').label,'Caption file');
    for(const line of codeAnatomy(source,'vtt').lines)assert.equal(line.tokens.map(t=>t.text).join(''),line.text);
  });

  await check('HTML and JSX distinguish tag boundaries, text, props and JavaScript expressions', () => {
    const html = '<a href="https://example.org?q=(hi)">Read</a>';
    assert.equal(token(html, 'a', 'html').label, 'Link');
    assert.equal(token(html, 'href', 'html').label, 'Link target');
    assert.equal(token(html, '"https://example.org?q=(hi)"', 'html').label, 'Link target');
    assert.equal(token(html, '=', 'html').label, 'Set attribute');
    assert.equal(token(html, '</', 'html').label, 'Close tag');
    const jsx = '<Button onClick={() => run()}>Hello {name}</Button>';
    assert.equal(token(jsx, 'Button', 'react').label, 'Component');
    assert.equal(token(jsx, 'onClick', 'react').label, 'Prop');
    assert.equal(token(jsx, 'run', 'react').label, 'Function');
    assert.equal(token(jsx, 'name', 'react').label, 'Name');
    assert.match(token(jsx, '{', 'react').explanation, /JavaScript expression/);
  });

  await check('CSS and SQL syntax never inherit Python/JavaScript meanings for their equals or keywords', () => {
    const css = '.card:hover { color: navy; width: calc(100% - 2px); }';
    assert.equal(token(css, '.card:hover', 'css').label, 'Selector');
    assert.equal(token(css, 'color', 'css').label, 'Property');
    assert.equal(token(css, 'navy', 'css').label, 'Value');
    assert.equal(token(css, 'calc', 'css').label, 'CSS function');
    assert.equal(token(css, '100%', 'css').label, 'Value');
    assert.equal(token(css, ':', 'css').label, 'Value next');
    const sql = "SELECT name, COUNT(*), (1 + 2) AS n FROM people WHERE id = 2;";
    assert.equal(token(sql, 'SELECT', 'sql').label, 'Choose values');
    assert.equal(token(sql, 'name', 'sql').label, 'Column');
    assert.equal(token(sql, 'COUNT', 'sql').label, 'Count');
    assert.equal(token(sql, '=', 'sql').label, 'Compare');
    assert.match(token(sql, '*', 'sql').explanation, /counts rows/);
    assert.equal(token('WITH data(n) AS (VALUES (1)) SELECT n FROM data;', 'data', 'sql').label, 'SQL name');
    assert.deepEqual(tokens('UPDATE people SET age = 2 WHERE id = 1;', 'sql').filter(t => t.text === '=').map(t => t.label), ['Assign', 'Compare']);
    assert.equal(token('SELECT changes();', 'changes', 'sql').label, 'Count last write');
    assert.equal(token('SELECT count FROM data;', 'count', 'sql').label, 'SQL name');
    assert.equal(token('SELECT "SELECT" FROM data;', '"SELECT"', 'sql').label, 'Column');
    assert.equal(token('SELECT title FROM books;', 'books', 'sql').label, 'Table or query');
    assert.equal(token('SELECT range FROM data;', 'range', 'sql').label, 'SQL name');
    assert.equal(token('SELECT id FROM data WHERE id > 0;', 'WHERE', 'sql').label, 'Keep matching rows');
    assert.equal(token('SELECT SUM(n) OVER (PARTITION BY room ORDER BY id) FROM data;', 'PARTITION', 'sql').label, 'Separate lists');
    assert.equal(token('SELECT SUM(n) OVER (ORDER BY id ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) FROM data;', 'ROWS', 'sql').label, 'Count row positions');
    assert.equal(token('<style>h1 { color: red; }</style>', 'color', 'html').label, 'Property');
    assert.equal(token('<script>console.log("hi");</script>', 'log', 'html').label, 'Method');
  });

  await check('Swift, JSON, TOML and shell have conservative language-aware fallbacks', () => {
    assert.equal(token('func greet(name: String) { print(name) }', 'greet', 'swift').label, 'Function name');
    assert.equal(token('func greet(name: String) { print(name) }', 'print', 'swift').label, 'Function');
    assert.equal(token('let answer = amount', 'amount', 'swift').label, 'Name');
    assert.equal(token('let text = "Hello \\(name)"', '"Hello \\(name)"', 'swift').label, 'Text template');
    assert.equal(token('let count = 3', 'let', 'swift').label, 'Fixed name');
    assert.equal(token('var count = 3', 'var', 'swift').label, 'Changeable name');
    assert.equal(token('guard count > 0 else { return }', 'guard', 'swift').label, 'Check before continuing');
    assert.equal(token('actor Store {}', 'actor', 'swift').label, 'Protected state');
    assert.equal(token('actor Store {}', 'Store', 'swift').label, 'Type name');
    assert.equal(token('let values = Array(0..<6)', '..<', 'swift').label, 'Range');
    assert.match(token('let values = Array(0..<6)', '..<', 'swift').explanation, /before the end/);
    assert.equal(token('let `class` = 2', '`class`', 'swift').label, 'Name');
    assert.equal(token('#expect(count == 2)', '#expect', 'swift').label, 'Check a result');
    assert.equal(token('#expect(count == 2)', 'count', 'swift').label, 'Name');
    assert.equal(token('let value = object.set(3)', 'set', 'swift').label, 'Method');
    assert.equal(token('var minutes: Double { get { seconds / 60 } set { seconds = newValue * 60 } }', 'set', 'swift').label, 'Change a property');
    assert.equal(token('func caption() -> some Captioned', 'some', 'swift').label, 'One hidden type');
    assert.equal(token('return { [weak self] in self?.name ?? "Released" }', 'weak', 'swift').label, 'Do not keep alive');
    assert.equal(token('try await load()', 'await', 'swift').label, 'Possible pause');
    assert.equal(token('{"message": "a = (b)", "ready": true}', '"message"', 'json').label, 'Key');
    assert.equal(token('{"message": "a = (b)", "ready": true}', '"a = (b)"', 'json').label, 'Text');
    assert.equal(token('{"ready": true}', 'true', 'json').label, 'Boolean');
    assert.deepEqual(labels('git commit -m "Hello (world)"', 'bash'), [['git', 'Command'], ['commit', 'Save a version'], ['-m', 'Option'], ['"Hello (world)"', 'Text']]);
    assert.deepEqual(labels('RELEASE_ID=demo-4 node main.js\nls', 'shell').map(t => t[1]), ['Environment', 'Command', 'Argument', 'Command']);
    assert.equal(token('curl https://example.org/path', 'https://example.org/path', 'sh').label, 'Argument');
    assert.deepEqual(labels('cat file | grep word', 'bash').map(t => t[1]), ['Command', 'Argument', 'Pipe', 'Command', 'Argument']);
    assert.equal(token('name = "demo"', 'name', 'toml').label, 'Key');
    assert.ok(tokens('mystery(value)', 'unrecognized').every(t => t.label === 'Code'));
  });

  let fenceCount = 0, excluded = 0, codeTokenCount = 0, uncertain = 0;
  await check('Course examples name the role of previously unclear code parts', () => {
    assert.equal(token('@dataclass\nclass Item: pass','@','python').label,'Apply a decorator');
    assert.equal(token('def label(text, /, *, prefix="Note: "): pass','/','python').label,'Positional inputs');
    assert.equal(token('def answer() -> int: return 4','->','python').label,'Return type');
    assert.equal(token('type Pair = [unit: string, amount: number];','amount','typescript').label,'Name this position');
    assert.equal(token('debugger;','debugger','javascript').label,'Pause for debugging');
    assert.equal(token('@layer base, theme;','theme','css').label,'Layer name');
    assert.equal(token('@media print { p {color:black;} }','print','css').label,'Print layout');
    assert.equal(token('<textarea>Hello.</textarea>','Hello.','html').label,'Starting text');
    assert.equal(token('EXPLAIN QUERY PLAN SELECT 1','EXPLAIN','sql').label,'Show the query plan');
  });
  const byLanguage = {};
  await check('every currently authored fenced example preserves exact source and bounded ordered anatomy', async () => {
    const lessons = JSON.parse(await readFile(path.join(cwd, 'content/lessons.json'), 'utf8'));
    const strings = function* (value) { if (typeof value === 'string') yield value; else if (value && typeof value === 'object') for (const child of Object.values(value)) yield* strings(child); };
    for (const text of strings(lessons)) for (const match of text.matchAll(/^```([\w-]*)[^\S\r\n]*\r?\n([\s\S]*?)^```[^\S\r\n]*(?:\r?\n|$)/gm)) {
      fenceCount++;
      const [, language, code] = match;
      const model = codeAnatomy(code, language);
      assert.equal(model.source, code);
      if (!supportsCodeAnatomy(language)) { assert.deepEqual(model.lines, []); excluded++; continue; }
      byLanguage[language] = (byLanguage[language] ?? 0) + 1;
      for (const line of model.lines) {
        assert.equal(line.tokens.map(t => t.text).join(''), line.text, `${language} line ${line.number}`);
        for (const item of line.tokens) {
          assert.equal(item.text, code.slice(item.from, item.to));
          assert.ok(item.to > item.from);
          if (item.label) {
            codeTokenCount++;
            if (item.label === 'Code' || item.label === 'Symbol') {
              uncertain++;
              if (process.env.CODEQUEST_INSPECT_LABELS) console.log('Review label:',language,item.text,JSON.stringify(line.text));
            }
          }
        }
        const pages = anatomyPages(line);
        assert.deepEqual(pages.flat(), line.tokens.filter(t => t.label));
        for (const page of pages) {
          assert.ok(page.length <= 7);
          assert.ok(36 + page.reduce((sum, t) => sum + anatomyTokenWidth(t), 0) <= 740);
        }
      }
      const sampleDOM = new JSDOM(markup(code, language));
      const document = sampleDOM.window.document;
      assert.equal(document.querySelectorAll('script,iframe,img,foreignObject').length, 0);
      assert.ok(document.querySelector('[data-code-anatomy]'));
      sampleDOM.window.close();
      await new Promise(resolve => setImmediate(resolve));
    }
    assert.ok(fenceCount >= 249, `Expected at least the original 249 fences, found ${fenceCount}`);
  });

  await check('malicious HTML is escaped, siblings have unique labels, and output/text fences are excluded', () => {
    const evil = '<img src=x onerror="alert(1)"><script>alert("no")</script>';
    const document = new JSDOM(renderToStaticMarkup(React.createElement('div', null, React.createElement(CodeAnatomy, { code: evil, language: 'html' }), React.createElement(CodeAnatomy, { code: evil, language: 'html' })))).window.document;
    assert.equal(document.querySelectorAll('script,img,iframe,foreignObject').length, 0);
    const ids = [...document.querySelectorAll('[id]')].map(node => node.id);
    assert.equal(new Set(ids).size, ids.length);
    for (const language of ['text', 'output', 'TEXT', 'plaintext']) assert.equal(markup('not executable', language), '');
    const code = '  print("😀")\r\n\tprint("<script>")\r\n';
    assert.equal(codeAnatomy(code, 'python').source, code);
    assert.equal(codeAnatomy(code, 'python').lines.length, 2);
  });

  await check('native controls change one line/part at a time and reset safely when source changes', async () => {
    const dom = new JSDOM('<!doctype html><div id="root"></div>', { url: 'http://localhost' });
    const oldWindow = globalThis.window, oldDocument = globalThis.document;
    globalThis.window = dom.window; globalThis.document = dom.window.document; globalThis.IS_REACT_ACT_ENVIRONMENT = true;
    const root = createRoot(dom.window.document.getElementById('root'));
    try {
      const code = '\nprint("Hello")\nresult = first + second + third + fourth + fifth + sixth + seventh\n';
      await act(async () => root.render(React.createElement(CodeAnatomy, { code, language: 'python' })));
      const select = dom.window.document.querySelector('select');
      assert.equal(select.value, '1', 'first nonblank line is shown');
      assert.equal(dom.window.document.querySelectorAll('svg').length, 1);
      await act(async () => { select.value = '2'; select.dispatchEvent(new dom.window.Event('change', { bubbles: true })); });
      assert.match(dom.window.document.querySelector('svg title').textContent, /line 3/);
      let buttons = [...dom.window.document.querySelectorAll('button')];
      assert.equal(buttons[0].disabled, true);
      await act(async () => buttons[1].dispatchEvent(new dom.window.MouseEvent('click', { bubbles: true })));
      assert.equal(dom.window.document.querySelector('button').disabled, false);
      await act(async () => { select.value = '1'; select.dispatchEvent(new dom.window.Event('change', { bubbles: true })); });
      assert.equal(dom.window.document.querySelectorAll('[aria-pressed]').length, 4, 'each labeled part is selectable');
      assert.equal(dom.window.document.querySelectorAll('[data-active-code-part]').length, 1);
      const choices = [...dom.window.document.querySelectorAll('[aria-pressed]')];
      assert.equal(choices[0].getAttribute('aria-pressed'), 'true', 'part selection resets with line');
      await act(async () => choices[2].click());
      assert.equal(dom.window.document.querySelector('[data-active-code-part] strong').textContent, 'Text');
      assert.equal(dom.window.document.querySelectorAll('[data-anatomy-plain]').length, 1);
      assert.match(dom.window.document.querySelector('svg title').textContent, /parts 1–4/);
      await act(async () => root.render(React.createElement(CodeAnatomy, { code: 'x = 1', language: 'python' })));
      assert.equal(dom.window.document.querySelectorAll('select').length, 0);
      assert.match(dom.window.document.querySelector('svg title').textContent, /line 1/);
    } finally { await act(async () => root.unmount()); globalThis.window = oldWindow; globalThis.document = oldDocument; delete globalThis.IS_REACT_ACT_ENVIRONMENT; dom.window.close(); }
  });
  console.log(`Passed ${reports.length} anatomy checks across ${fenceCount} fences (${excluded} text/output excluded). ${codeTokenCount} labeled parts; ${uncertain} conservatively unclassified Code/Symbol parts. Languages: ${JSON.stringify(byLanguage)}.`);
  for (const report of reports) console.log(`  ✓ ${report}`);
} finally { await rm(temp, { recursive: true, force: true }); }
