import type { Lesson, Unit } from "./types";
import { lessonBlocks } from "./lesson-markup";

export type LocalProjectExample = {
  id: string; code: string; language: string; filename: string;
  paragraph: number; title: string; standalone: boolean; context: string;
};
const extensions: Record<string,string> = {
  csharp:"cs",cpp:"cpp",c:"c",java:"java",kotlin:"kt",go:"go",rust:"rs",
  php:"php",ruby:"rb",r:"R",swift:"swift",python:"py",javascript:"js",
  typescript:"ts",html:"html",css:"css",sql:"sql",bash:"sh",sh:"sh",json:"json"
};
function fingerprint(text: string) {
  let value=2166136261;for(let i=0;i<text.length;i++)value=Math.imul(value^text.charCodeAt(i),16777619);
  return (value>>>0).toString(16);
}
/** Exact authored source only. Unknown/output fences never become executable starters. */
export function localProjectExamples(unit: Unit, lesson: Lesson): LocalProjectExample[] {
  if(lesson.learningMode!=="concept")return [];
  return lesson.explanation.flatMap((text,paragraph) => {
    const blocks=lessonBlocks(text,unit.track);
    let context="";
    return blocks.flatMap((block,index) => {
      if(block.kind==="prose"){context+=block.text;return [];}
      const exampleContext=context;context="";
      const language=block.language.toLowerCase();
      if(!extensions[language])return [];
      const standalone=/\bcomplete\s+(?:local\s+)?(?:[A-Za-z+#0-9.]+\s+)?(?:example|program)\b/i.test(exampleContext);
      const javaName=block.code.match(/public\s+(?:(?:final|abstract)\s+)?(?:class|record|enum|interface)\s+([A-Za-z_$][\w$]*)/)?.[1];
      const namedModule=language==="javascript" ? exampleContext.match(/\bSave\s+([A-Za-z_][A-Za-z0-9_.-]*\.(?:mjs|cjs))\s*:/)?.[1] : undefined;
      const base=language==="java"?(javaName??"Main"):language==="csharp"?"Program":language==="go"?"main":"example";
      return [{id:`p${paragraph}-b${index}-${fingerprint(block.code)}`,code:block.code,language,
        filename:namedModule??`${base}.${extensions[language]}`,paragraph,title:`Example ${paragraph+1}.${index+1}`,
        standalone,context:exampleContext.trim()}];
    });
  });
}
export function localProjectStorageKey(scope:string,lessonId:string){
  return `codequest-local-project-v1:${encodeURIComponent(scope)}:${lessonId}`;
}
