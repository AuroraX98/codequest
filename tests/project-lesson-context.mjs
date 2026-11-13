import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';
const source=fs.readFileSync('components/CodeQuest.tsx','utf8');
const tree=ts.createSourceFile('CodeQuest.tsx',source,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
function findHeading(node) {
  if(ts.isJsxElement(node) && node.openingElement.attributes.properties.some(attribute =>
    ts.isJsxAttribute(attribute) && attribute.name.getText()==='className' &&
    attribute.initializer && ts.isStringLiteral(attribute.initializer) && attribute.initializer.text==='lesson-heading')) return node;
  return ts.forEachChild(node,findHeading);
}
const element=findHeading(tree);
assert.ok(element,'Shared lesson heading is present');
const start=element.getStart(), heading=element.getText();
assert.match(heading,/view === "studio" && studioMode === "course" \? "Current lesson · "/);
assert.equal((heading.match(/<h1>\{lesson.title\}<\/h1>/g)||[]).length,1,'Uses the selected lesson title once, not a copied project title');
assert.match(heading,/These projects are for this lesson\. Choose a different lesson to see its projects\./);
assert.match(heading,/view === "studio" && studioMode === "course" &&/);
assert.ok(start<source.indexOf('phase === "build" && isConcept'),'Shared heading precedes local/concept/AI branch');
assert.ok(start<source.indexOf('phase === "build" && !isConcept && selectedProject'),'Shared heading precedes Python project choices');
assert.ok(start<source.indexOf('phase === "build" && !isConcept && !selectedProject'),'Shared heading precedes all ordinary runnable projects');
assert.ok(!heading.includes('onClick')&&!heading.includes('setState'),'Context adds no selection or progress mutation');
console.log('PASS shared current-lesson project context for all course branches; practice workspace excluded');
