import data from '../content/terminology.json';
import catalog from '../content/catalog.json';
import type { Lesson } from './types';
import type { ConceptId } from './python-concepts';
import { courseTermSense } from './term-senses';

export type TermLink = {
  lessonId: string;
  paragraph: number;
  concept?: ConceptId;
  idea: string;
  evidence: string;
  example?: string;
  exampleParagraph?: number;
};
export type TerminologyEntry = {
  id: string;
  name: string;
  aliases: string[];
  category: string;
  kind: 'term' | 'acronym' | 'slang';
  meaning: string;
  example?: string;
  context?: string;
  links?: TermLink[];
  languages?: string[];
};
export const terminology = data as TerminologyEntry[];
export const terminologyCategoryLabels: Record<string, string> = {
  basics: 'Basics',
  collections: 'Collections & objects',
  data: 'Data & databases',
  flow: 'Program flow',
  software: 'Software & teamwork',
  'language-tools': 'Language features',
  web: 'Web & interfaces',
  security: 'Security & access',
  ai: 'AI & machine learning',
};
export const terminologyCategories = [
  ...new Set(terminology.map((t) => t.category)),
].sort();
const lessonCourses = new Map(
  catalog.units.map((unit) => [unit.id, unit.track]),
);
export function courseOfLink(link: TermLink) {
  return lessonCourses.get(link.lessonId);
}
export function termSources(term: TerminologyEntry): string[] {
  return [
    ...new Set(
      (term.links ?? [])
        .map(courseOfLink)
        .filter((course): course is string => !!course),
    ),
  ];
}
export function terminologyInLanguage(
  term: TerminologyEntry,
  language: string,
) {
  if (language === 'all') return true;
  const sources = termSources(term);
  return language === 'reference'
    ? sources.length === 0
    : sources.includes(language);
}
const normalize = (s: string) =>
  s.normalize('NFKC').toLowerCase().replace(/[()]/g, '').trim();
const courseNamesForSearch: Record<string, string> = {
  csharp: 'C#', cpp: 'C++', backend: 'Back-end development'
};
export function terminologyMatches(
  term: TerminologyEntry,
  query: string,
  language = 'all',
  category = 'all',
) {
  if (!query.trim() && category === 'all') return terminologyInLanguage(term, language);
  const sources = termSources(term);
  const selected =
    language === 'all' ? sources : sources.filter((c) => c === language);
  const words = normalize(query).split(/\s+/).filter(Boolean);
  const matches = (fields: string[]) => {
    const text = normalize(fields.join(' '));
    return words.every((word) => text.includes(word));
  };
  const common = [term.name];
  if (!sources.length)
    return (
      (category === 'all' || category === term.category) &&
      matches([
        ...common,
        term.category,
        ...term.aliases,
        term.meaning,
        term.context ?? '',
      ])
    );
  return selected.some((course) => {
    const sourceName = courseNamesForSearch[course] ?? course;
    const sense = courseTermSense(term.id, course);
    const sourceCategory = sense?.category ?? term.category;
    if (category !== 'all' && sourceCategory !== category) return false;
    return matches([
      sourceCategory,
      ...common,
      sense?.name ?? term.name,
      ...(sense?.aliases ?? term.aliases),
      course.replace(/-/g, ' '),
      sourceName,
      sense?.meaning ?? term.meaning,
    ]);
  });
}
export function taughtTermLinks(
  term: TerminologyEntry,
  lessons: Lesson[],
  language = 'all',
): TermLink[] {
  return (term.links ?? []).filter((link) => {
    if (language !== 'all' && courseOfLink(link) !== language) return false;
    const lesson = lessons.find((l) => l.id === link.lessonId);
    return (
      lesson &&
      Number.isInteger(link.paragraph) &&
      link.paragraph >= 0 &&
      link.paragraph < lesson.explanation.length
    );
  });
}
export type TerminologyState = {
  query: string;
  category: string;
  language: string;
  view: 'list' | 'tiles';
  selectedId: string;
  selectedCourse: string;
};
export const defaultTerminologyState: TerminologyState = {
  query: '',
  category: 'all',
  language: 'all',
  view: 'tiles',
  selectedId: '',
  selectedCourse: '',
};
export function readTerminologyState(raw: string | null): TerminologyState {
  try {
    const s = JSON.parse(raw ?? 'null');
    if (!s || typeof s !== 'object') return { ...defaultTerminologyState };
    return {
      query: typeof s.query === 'string' ? s.query.slice(0, 160) : '',
      category: terminologyCategories.includes(s.category) ? s.category : 'all',
      language:
        typeof s.language === 'string' && /^[a-z-]{1,30}$/.test(s.language)
          ? s.language
          : 'all',
      view: s.view === 'list' ? 'list' : 'tiles',
      selectedCourse:
        typeof s.selectedCourse === 'string' &&
        /^[a-z-]{1,30}$/.test(s.selectedCourse)
          ? s.selectedCourse
          : '',
      selectedId: terminology.some((t) => t.id === s.selectedId)
        ? s.selectedId
        : '',
    };
  } catch {
    return { ...defaultTerminologyState };
  }
}
