import fs from 'node:fs';
const lessons=JSON.parse(fs.readFileSync('content/lessons.json','utf8')).slice(1175);
const rows=Object.fromEntries(lessons.map(l=>[l.id,l.id.startsWith('backend-')?
 [l.title,'Understand the browser model limits','Trace the worked example','Break down the code','Follow the function call','Check your understanding']:
 [l.title,'Picture the situation','Study the worked example','Break down the example','Try a changed situation','Check your reasoning']]));
fs.writeFileSync('lib/remaining-lesson-headings.ts','/** Section labels follow existing text:index progress identities; never reorder them. */\nexport const remainingLessonHeadings: Record<string, string[]> = '+JSON.stringify(rows,null,2)+';\n');
