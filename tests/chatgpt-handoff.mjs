import assert from 'node:assert/strict';
import {readFile,access} from 'node:fs/promises';
for(const file of ['components/CodeQuest.tsx','components/SelectionClarifier.tsx']) {
 const text=await readFile(new URL('../'+file,import.meta.url),'utf8');
 assert.ok(!/AskChatGPT|Ask ChatGPT|onAskChatGPT|data-ask-chatgpt/.test(text),file+' must not expose removed handoff');
}
for(const file of ['components/AskChatGPT.tsx','lib/chatgpt-handoff.ts'])await assert.rejects(access(new URL('../'+file,import.meta.url)));
console.log('Requested Ask ChatGPT removal verified: no UI, selection action, handoff prompts or sender.');
