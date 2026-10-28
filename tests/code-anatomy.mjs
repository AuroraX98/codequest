import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, writeFile, rm, symlink } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import ts from 'typescript';
import React, { act } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createRoot } from 'react-dom/client';
import { JSDOM } from 'jsdom';

const cwd = path.resolve(new URL('..', import.meta.url).pathname);
const temp = await mkdtemp(path.join(tmpdir(), 'codequest-anatomy-'));
const files = ['lib/code-language.ts', 'lib/code-anatomy.ts', 'components/CodeAnatomy.tsx', 'components/LessonGlossary.tsx', 'lib/lesson-glossary.ts'];
const reports = [];
const check = async (name, fn) => { await fn(); reports.push(name); };
try {
  await symlink(path.join(cwd, 'node_modules'), path.join(temp, 'node_modules'), 'dir');
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
    assert.equal(document.querySelectorAll('[data-anatomy-plain]').length, 4);
  });

  await check('Python variables, function definitions, named inputs, indexing, dictionaries and grouping differ', () => {
    assert.equal(token('answer = greet(name)', 'answer').label, 'Name');
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

  await check('HTML and JSX distinguish tag boundaries, text, props and JavaScript expressions', () => {
    const html = '<a href="https://example.org?q=(hi)">Read</a>';
    assert.equal(token(html, 'a', 'html').label, 'Element');
    assert.equal(token(html, 'href', 'html').label, 'Attribute');
    assert.equal(token(html, '"https://example.org?q=(hi)"', 'html').label, 'Value');
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
    assert.equal(token(css, 'calc', 'css').label, 'Function');
    assert.equal(token(css, '100%', 'css').label, 'Value');
    assert.equal(token(css, ':', 'css').label, 'Value next');
    const sql = "SELECT name, COUNT(*), (1 + 2) AS n FROM people WHERE id = 2;";
    assert.equal(token(sql, 'SELECT', 'sql').label, 'SQL keyword');
    assert.equal(token(sql, 'name', 'sql').label, 'SQL name');
    assert.equal(token(sql, 'COUNT', 'sql').label, 'Function');
    assert.equal(token(sql, '=', 'sql').label, 'Compare');
    assert.match(token(sql, '*', 'sql').explanation, /counts rows/);
    assert.equal(token('WITH data(n) AS (VALUES (1)) SELECT n FROM data;', 'data', 'sql').label, 'SQL name');
    assert.deepEqual(tokens('UPDATE people SET age = 2 WHERE id = 1;', 'sql').filter(t => t.text === '=').map(t => t.label), ['Assign', 'Compare']);
    assert.equal(token('SELECT changes();', 'changes', 'sql').label, 'Function');
    assert.equal(token('<style>h1 { color: red; }</style>', 'color', 'html').label, 'Property');
    assert.equal(token('<script>console.log("hi");</script>', 'log', 'html').label, 'Method');
  });

  await check('Swift, JSON, TOML and shell have conservative language-aware fallbacks', () => {
    assert.equal(token('func greet(name: String) { print(name) }', 'greet', 'swift').label, 'Function name');
    assert.equal(token('func greet(name: String) { print(name) }', 'print', 'swift').label, 'Function');
    assert.equal(token('let answer = amount', 'amount', 'swift').label, 'Name');
    assert.equal(token('let text = "Hello \\(name)"', '"Hello \\(name)"', 'swift').label, 'Text template');
    assert.equal(token('{"message": "a = (b)", "ready": true}', '"message"', 'json').label, 'Key');
    assert.equal(token('{"message": "a = (b)", "ready": true}', '"a = (b)"', 'json').label, 'Text');
    assert.equal(token('{"ready": true}', 'true', 'json').label, 'Boolean');
    assert.deepEqual(labels('git commit -m "Hello (world)"', 'bash'), [['git', 'Command'], ['commit', 'Argument'], ['-m', 'Option'], ['"Hello (world)"', 'Text']]);
    assert.deepEqual(labels('RELEASE_ID=demo-4 node main.js\nls', 'shell').map(t => t[1]), ['Environment', 'Command', 'Argument', 'Command']);
    assert.equal(token('curl https://example.org/path', 'https://example.org/path', 'sh').label, 'Argument');
    assert.deepEqual(labels('cat file | grep word', 'bash').map(t => t[1]), ['Command', 'Argument', 'Pipe', 'Command', 'Argument']);
    assert.equal(token('name = "demo"', 'name', 'toml').label, 'Key');
    assert.ok(tokens('mystery(value)', 'unrecognized').every(t => t.label === 'Code'));
  });

  let fenceCount = 0, excluded = 0, codeTokenCount = 0, uncertain = 0;
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
          if (item.label) { codeTokenCount++; if (item.label === 'Code' || item.label === 'Symbol') uncertain++; }
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
      assert.equal(dom.window.document.querySelectorAll('button').length, 0, 'part selection resets with line');
      assert.match(dom.window.document.querySelector('svg title').textContent, /parts 1–4/);
      await act(async () => root.render(React.createElement(CodeAnatomy, { code: 'x = 1', language: 'python' })));
      assert.equal(dom.window.document.querySelectorAll('select').length, 0);
      assert.match(dom.window.document.querySelector('svg title').textContent, /line 1/);
    } finally { await act(async () => root.unmount()); globalThis.window = oldWindow; globalThis.document = oldDocument; delete globalThis.IS_REACT_ACT_ENVIRONMENT; dom.window.close(); }
  });
  console.log(`Passed ${reports.length} anatomy checks across ${fenceCount} fences (${excluded} text/output excluded). ${codeTokenCount} labeled parts; ${uncertain} conservatively unclassified Code/Symbol parts. Languages: ${JSON.stringify(byLanguage)}.`);
  for (const report of reports) console.log(`  ✓ ${report}`);
} finally { await rm(temp, { recursive: true, force: true }); }
