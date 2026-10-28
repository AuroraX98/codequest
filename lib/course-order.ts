/** Alphabetize display names, not internal IDs; leave curriculum/prerequisite order alone. */
export function compareCourseNames(a:string,b:string):number {
 return a.localeCompare(b,'en',{sensitivity:'base',ignorePunctuation:false}) || (a<b?-1:a>b?1:0);
}

export const courseNames:Record<string,string>={python:'Python',javascript:'JavaScript',typescript:'TypeScript',html:'HTML',css:'CSS',sql:'SQL',react:'React',swift:'Swift',backend:'Back-end development','developer-toolkit':'Developer toolkit',ai:'AI',csharp:'C#',cpp:'C++',java:'Java',c:'C',kotlin:'Kotlin',go:'Go',rust:'Rust',php:'PHP',ruby:'Ruby',r:'R'};
