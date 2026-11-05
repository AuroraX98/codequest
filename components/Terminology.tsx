'use client';
import { useEffect, useId, useMemo, useState } from 'react';
import { ArrowRight, LayoutGrid, List } from 'lucide-react';
import { compareCourseNames } from '../lib/course-order';
import { studyLabel } from '../lib/study-label';
import {
  terminology,
  terminologyCategories,
  terminologyCategoryLabels,
  terminologyMatches,
  terminologyInLanguage,
  termSources,
  courseOfLink,
  type TerminologyEntry,
  readTerminologyState,
  defaultTerminologyState,
  type TermLink,
} from '../lib/terminology';
import { courseTermSense } from '../lib/term-senses';
import type { Lesson } from '../lib/types';
function TermCard({
  term,
  filter,
  category,
  query,
  lessonsById,
  names,
  selected,
  savedCourse,
  onStudy,
}: {
  term: TerminologyEntry;
  filter: string;
  category: string;
  query: string;
  lessonsById: Map<string, Lesson>;
  names: Record<string, string>;
  selected: boolean;
  savedCourse: string;
  onStudy: (link: TermLink) => void;
}) {
  const sources = termSources(term).filter((course) =>
    terminologyMatches(term, query, course, category),
  );
  const [picked, setPicked] = useState('');
  const preferred = picked || savedCourse;
  const course =
    filter === 'all'
      ? sources.includes(preferred)
        ? preferred
        : sources[0]
      : filter;
  const links = (term.links ?? []).filter(
    (link) => courseOfLink(link) === course && lessonsById.has(link.lessonId),
  );
  const sense = courseTermSense(term.id, course ?? '');
  const meaning = sense?.meaning ?? term.meaning;
  const sourceCategory = sense?.category ?? term.category;
  const name = sense?.name ?? term.name;
  const aliases = (sense?.aliases ?? term.aliases).filter(
    (a) => a.toLowerCase() !== name.toLowerCase(),
  );
  // A code example belongs to this card only if the selected idea teaches it.
  const example =
    sense?.example ??
    links.find((link) => link.example)?.example ??
    (!sources.length ? term.example : undefined);
  return (
    <article
      className={
        'panel terminology-entry' + (selected ? ' recently-viewed' : '')
      }
      data-term-id={term.id}
    >
      <div className="terminology-heading">
        <h2>{name}</h2>
        <span className="small-tag">
          {terminologyCategoryLabels[sourceCategory] ?? sourceCategory}
        </span>
        {term.kind === 'slang' && (
          <span className="small-tag">Slang / informal</span>
        )}
        {term.kind === 'acronym' && (
          <span className="small-tag">Abbreviation</span>
        )}
      </div>
      {sources.length > 1 && filter === 'all' ? (
        <label className="terminology-course-source">
          Source course ({sources.length})
          <select
            aria-label={'Source course for ' + term.name}
            value={course}
            onChange={(e) => setPicked(e.target.value)}
          >
            {sources.map((id) => (
              <option key={id} value={id}>
                {names[id] ?? id}
              </option>
            ))}
          </select>
        </label>
      ) : (
        <p className="terminology-source-name">
          {sources.length
            ? (names[course!] ?? course)
            : 'General reference · No linked course lesson'}
        </p>
      )}
      <p>{meaning}</p>
      {!sources.length && term.context && (
        <p className="terminology-context">{term.context}</p>
      )}
      {example && (
        <p className="terminology-example">
          <strong>Example: </strong>
          {example}
        </p>
      )}
      {aliases.length > 0 && (
        <p className="muted terminology-aliases">
          Also look for: {aliases.join(' · ')}
        </p>
      )}
      {links.map((link) => (
        <div
          className="terminology-study-source"
          key={
            link.lessonId + ':' + link.paragraph + ':' + (link.concept ?? '')
          }
        >
          {link.evidence !== meaning && (
            <details>
              <summary>Words from this lesson</summary>
              <p>
                {link.evidence
                  .split(/(`[^`]*`)/g)
                  .map((part, i) =>
                    part.startsWith('`') && part.endsWith('`') ? (
                      <code key={i}>{part.slice(1, -1)}</code>
                    ) : (
                      part
                    ),
                  )}
              </p>
            </details>
          )}
          <button
            type="button"
            className="secondary project-study-button"
            aria-label={
              studyLabel(link.idea) +
              ' in ' +
              (names[course!] ?? course) +
              ' · ' +
              lessonsById.get(link.lessonId)!.title
            }
            onClick={() => onStudy(link)}
          >
            {studyLabel(link.idea)}
            <ArrowRight size={16} />
          </button>
        </div>
      ))}
    </article>
  );
}
export default function Terminology({
  scope,
  lessons,
  languageNames,
  onStudy,
}: {
  scope: string;
  lessons: Lesson[];
  languageNames: Record<string, string>;
  onStudy: (link: TermLink) => void;
}) {
  const uid = useId(),
    key = scope ? `codequest-terminology:${scope}` : '';
  const [state, setState] = useState(defaultTerminologyState),
    [loadedKey, setLoadedKey] = useState('');
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Restore account-specific browser filters after hydration before persisting them.
    setLoadedKey('');
    try {
      setState(readTerminologyState(key ? localStorage.getItem(key) : null));
    } catch {
      setState({ ...defaultTerminologyState });
    }
    setLoadedKey(key);
  }, [key]);
  useEffect(() => {
    if (key && loadedKey === key)
      try {
        localStorage.setItem(key, JSON.stringify(state));
      } catch {}
  }, [key, loadedKey, state]);
  const lessonsById = useMemo(
    () => new Map(lessons.map((lesson) => [lesson.id, lesson])),
    [lessons],
  );
  const visible = terminology.filter(
    (t) =>
      terminologyInLanguage(t, state.language) &&
      terminologyMatches(t, state.query, state.language, state.category),
  );
  return (
    <section className="terminology" aria-labelledby={uid + '-title'}>
      <div className="page-title">
        <p className="eyebrow">LOOK SOMETHING UP</p>
        <h1 id={uid + '-title'}>Terminology</h1>
        <p>
          Choose a course to see the words it teaches. Use Study to open the
          exact idea that explains a word.
        </p>
      </div>
      <div className="terminology-toolbar">
        <label htmlFor={uid + '-search'}>
          Find a term, abbreviation or meaning
          <input
            id={uid + '-search'}
            type="search"
            maxLength={160}
            value={state.query}
            onChange={(e) => setState((s) => ({ ...s, query: e.target.value }))}
            placeholder="Try API, debugging, token…"
          />
        </label>
        <label htmlFor={uid + '-category'}>
          Category
          <select
            id={uid + '-category'}
            value={state.category}
            onChange={(e) =>
              setState((s) => ({ ...s, category: e.target.value }))
            }
          >
            <option value="all">All categories</option>
            {terminologyCategories.map((c) => (
              <option key={c} value={c}>
                {terminologyCategoryLabels[c] ?? c}
              </option>
            ))}
          </select>
        </label>
        <label htmlFor={uid + '-language'}>
          Language or course
          <select
            id={uid + '-language'}
            value={state.language}
            onChange={(e) =>
              setState((s) => ({ ...s, language: e.target.value }))
            }
          >
            <option value="all">All languages and courses</option>
            <option value="reference">General reference only</option>
            {Object.entries(languageNames)
              .sort((a, b) => compareCourseNames(a[1], b[1]))
              .map(([key, name]) => (
                <option key={key} value={key}>
                  {name}
                </option>
              ))}
          </select>
        </label>
        <div
          className="terminology-view"
          role="group"
          aria-label="Terminology display"
        >
          <button
            type="button"
            className="secondary"
            aria-pressed={state.view === 'list'}
            onClick={() => setState((s) => ({ ...s, view: 'list' }))}
          >
            <List size={18} />
            List
          </button>
          <button
            type="button"
            className="secondary"
            aria-pressed={state.view === 'tiles'}
            onClick={() => setState((s) => ({ ...s, view: 'tiles' }))}
          >
            <LayoutGrid size={18} />
            Tiles
          </button>
        </div>
      </div>
      <p className="muted terminology-summary" role="status">
        {visible.length} of {terminology.length} terms
        {state.language !== 'all'
          ? ` · ${state.language === 'reference' ? 'General reference' : (languageNames[state.language] ?? state.language)}`
          : ''}{' '}
        · Search and display choices stay on this device.
      </p>
      <div className={'terminology-results ' + state.view}>
        {visible.map((term) => (
          <TermCard
            key={term.id}
            term={term}
            filter={state.language}
            category={state.category}
            query={state.query}
            names={languageNames}
            lessonsById={lessonsById}
            selected={state.selectedId === term.id}
            savedCourse={
              state.selectedId === term.id ? state.selectedCourse : ''
            }
            onStudy={(link) => {
              setState((s) => ({
                ...s,
                selectedId: term.id,
                selectedCourse: courseOfLink(link) ?? '',
              }));
              onStudy(link);
            }}
          />
        ))}
      </div>
      {!visible.length && (
        <div className="panel">
          <p>
            No term matches those filters. Try a shorter word or another
            category.
          </p>
          <button
            type="button"
            className="secondary"
            onClick={() =>
              setState((s) => ({
                ...s,
                query: '',
                category: 'all',
                language: 'all',
              }))
            }
          >
            Clear filters
          </button>
        </div>
      )}
    </section>
  );
}
