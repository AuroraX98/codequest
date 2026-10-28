import assert from 'node:assert/strict';
import fs from 'node:fs';
const css = fs.readFileSync('app/globals.css','utf8');
// Source-cascade regression: calculate specificity, not merely declaration presence.
const specificity = selector => [
 (selector.match(/#[\w-]+/g)||[]).length,
 (selector.match(/\.[\w-]+|:[\w-]+/g)||[]).length,
 (selector.replace(/\.[\w-]+|:[\w-]+/g,'').match(/\b[a-z][\w-]*\b/g)||[]).length,
];
const compare = (a,b) => a.map((n,i)=>n-b[i]).find(n=>n!==0)||0;
const old = '.simple-learning .buddy-visibility button';
const fixed = '.simple-learning .buddy-visibility .buddy-toggle-button';
assert.ok(compare(specificity(fixed),specificity(old))>0);
const rules = [...css.matchAll(/([^{}]+)\{([^{}]*)\}/g)];
const body = selector => rules.filter(([,s])=>s.split(',').map(s=>s.trim()).includes(selector)).at(-1)?.[2];
for (const [property,value] of Object.entries({'min-height':'44px','padding':'11px 15px','border':'1px solid var(--border)','background':'var(--soft)'})) {
 assert.ok(body(fixed)?.includes(`${property}:${value}`), `${property} must override compact simple-learning reset`);
}
for(const state of [':hover',':active',':focus-visible']) assert.ok(body(fixed+state),`${state} uses stronger scoped selector`);
const phase='.simple-learning .phase-nav button';
assert.match(body(phase),/min-height:44px/);
assert.match(body(phase),/border:2px solid/);
assert.ok(body(phase+'.selected').includes('font-weight:750'));
console.log('PASS Buddy base/hover/active/focus specificity exceeds old simple-learning reset; phase controls retain later equal-specificity 44px outlined rules. Source cascade tested, not browser geometry.');
