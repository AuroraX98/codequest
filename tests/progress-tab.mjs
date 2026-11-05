import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { DatabaseSync } from "node:sqlite";
import { webcrypto } from "node:crypto";
import vm from "node:vm";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { JSDOM } from "jsdom";
import ts from "typescript";

const require = createRequire(import.meta.url);
async function load(file, externals = {}) {
  const raw = await readFile(new URL("../"+file, import.meta.url), "utf8");
  const source = ts.transpileModule(raw, {compilerOptions:{
    target:ts.ScriptTarget.ES2022, module:ts.ModuleKind.CommonJS, jsx:ts.JsxEmit.ReactJSX
  }}).outputText;
  const fixture = {exports:{}};
  vm.runInNewContext(source, {
    module:fixture, exports:fixture.exports, require:id=>externals[id]??require(id),
    TextEncoder, Date, crypto:webcrypto
  });
  return fixture.exports;
}

const completion = await load("lib/lesson-completion.ts");
const {default:SavedLearning} = await load("components/SavedLearning.tsx", {"../lib/lesson-completion":completion});
const lessons = [{id:"r-01",title:"R lesson",learningMode:"concept",explanation:["one","two"]},
  {id:"python-01",title:"Python Basics",starter:"",explanation:["first"]}];
const at = (day)=>`2026-06-${day}T12:00:00.000Z`;
const mark = (lessonId,sectionKey,day,checked=true) =>
  ({lessonId,sectionKey,checked,markedAt:checked?at(day):null,updatedAt:at(day)});
const progress = [{unitId:"r-01",completedAt:at("02"),updatedAt:at("02"),quizPassed:1,code:""}];
const marks = [mark("r-01","text:0","01"),mark("python-01","concept:program","03"),
  mark("python-01","concept:values","02"),mark("python-01","concept:values","04",false),
  mark("python-01","text:0","04"),mark("retired","text:0","04")];
function rows(records,work=progress,extra={}) {
  const html=renderToStaticMarkup(React.createElement(SavedLearning,{lessons,units:[{id:"r-01",track:"r"},{id:"python-01",track:"python"}],
    progress:work, reading:{records,loaded:true,...extra},courseNames:{r:"R",python:"Python"}}));
  const doc=new JSDOM(html).window.document;
  return {rows:[...doc.querySelectorAll(".portfolio-row")].map(row=>row.textContent),text:doc.body.textContent};
}
const result=rows(marks);
assert.equal(result.rows.length,2);
assert.match(result.rows[0],/Python Basics.*In progress.*1 of 6 ideas/);
assert.match(result.rows[1],/R lesson.*Finished.*1 of 2 ideas/);
assert.equal(rows([mark("python-01","concept:program","01",false)],[]).rows.length,0);
assert.match(rows([],[],{loaded:false,error:"Reading unavailable"}).text,/Reading unavailable/);
assert.doesNotMatch(rows([],[],{loaded:false,error:"Reading unavailable"}).text,/Your lesson list starts/);

const db=new DatabaseSync(":memory:");
try {
  db.exec(`CREATE TABLE profiles(user_id TEXT PRIMARY KEY,settings TEXT,encrypted_key TEXT,created_at TEXT);
    CREATE TABLE progress(user_id TEXT, unit_id TEXT, code TEXT,quiz_passed INTEGER,math_passed INTEGER,completed_at TEXT,last_run TEXT,updated_at TEXT);
    CREATE TABLE activity(user_id TEXT,day TEXT,completed INTEGER,tutor_used INTEGER);`);
  const d1={prepare(sql){const stmt=db.prepare(sql);return {bind(...args){return {
    run:async()=>stmt.run(...args),first:async()=>stmt.get(...args),all:async()=>({results:stmt.all(...args)})
  }}}}};
  const server=await load("lib/server.ts",{
    "./learning-activity": await load("lib/learning-activity.ts"),
    "cloudflare:workers":{env:{DB:d1}}, "../app/chatgpt-auth":{}, "./ai-keys":{},
    "./profile":{defaultProfile:{},normalizeProfile:v=>v}
  });
  const day = n=>new Date(Date.now()-n*86400000).toISOString().slice(0,10);
  const insert=db.prepare("INSERT INTO activity VALUES(?,?,?,?)");
  // Each day represents one different completed lesson. Today's tutor use preserves yesterday's ongoing streak.
  const save=db.prepare("INSERT INTO progress VALUES(?,?,?,1,0,?,NULL,?)");
  for (let i=1;i<=375;i++) {
    insert.run("learner",day(i),1,0);
    save.run("learner","lesson-"+i,"",day(i),day(i));
  }
  insert.run("learner",day(0),0,2);
  insert.run("other",day(376),1,0);
  const state=await server.state("learner");
  assert.equal(state.streak,375);
  assert.equal(state.completed,375);
  assert.equal(state.xp,37500);
  assert.equal(state.todayCompleted,0);
  assert.equal(state.tutorUsed,2);
  db.prepare("DELETE FROM activity WHERE user_id=? AND day=?").run("learner",day(3));
  assert.equal((await server.state("learner")).streak,2);
} finally {db.close();}
console.log("PASS Progress: reading-only lessons, undo, deduplication, latest-first order, Python's six ideas, unavailable reading, saved finishes, account isolation, and a 375-day streak with a gap.");
