import { deviceDB, readDevice } from "./device-db";
import {
  validatePracticeProject,
  type PracticeProject,
} from "./practice-project";
export const maxPracticeProjects = 20;
export const maxPracticeVersions = 20;
export type PracticeVersion = {
  id: string;
  code: string;
  files: Record<string, string>;
  savedAt: string;
};
export type PracticeDraft = {
  project: PracticeProject;
  code: string;
  files: Record<string, string>;
  updatedAt: string;
  versions: PracticeVersion[];
  reference: "verified" | "unverified";
  completed?: { sourceHash: string; completedAt: string; manual: boolean };
};
export type PracticeRecord = {
  scope: string;
  activeId: string | null;
  drafts: PracticeDraft[];
};
export const practiceStorageKey = (scope: string) =>
  `practice-projects:${scope}`;
export function practiceSource(code: string, files: Record<string, string>) {
  return JSON.stringify([
    code,
    Object.keys(files)
      .sort()
      .map((name) => [name, files[name]]),
  ]);
}
export async function practiceSourceHash(
  code: string,
  files: Record<string, string>,
) {
  const value = new TextEncoder().encode(practiceSource(code, files));
  const hash = new Uint8Array(await crypto.subtle.digest("SHA-256", value));
  return Array.from(hash, (byte) => byte.toString(16).padStart(2, "0")).join(
    "",
  );
}
const emptyRecord = (scope: string): PracticeRecord => ({
  scope,
  activeId: null,
  drafts: [],
});
function sourceFields(value: unknown, project: PracticeProject) {
  const source = value as { code?: unknown; files?: unknown };
  if (!source || typeof source.code !== "string" || source.code.length > 60000)
    throw new Error("Choose a practice backup with valid project code.");
  const allowed = new Set(
    (project.project.extraFiles ?? []).map((file) => file.name),
  );
  const files: Record<string, string> = {};
  if (
    source.files &&
    (typeof source.files !== "object" || Array.isArray(source.files))
  )
    throw new Error("Choose a practice backup with valid files.");
  for (const [name, code] of Object.entries(
    (source.files ?? {}) as Record<string, unknown>,
  )) {
    if (!allowed.has(name) || typeof code !== "string" || code.length > 60000)
      throw new Error("Choose a practice backup with known project files.");
    files[name] = code;
  }
  for (const file of project.project.extraFiles ?? [])
    files[file.name] ??= file.code;
  return { code: source.code, files };
}
export function cleanPracticeDraft(value: unknown): PracticeDraft {
  const input = value as Partial<PracticeDraft>;
  if (!input || typeof input !== "object")
    throw new Error("Choose a valid practice backup.");
  const project = validatePracticeProject(input.project);
  const source = sourceFields(input, project);
  const versions = Array.isArray(input.versions)
    ? input.versions.slice(-maxPracticeVersions).map((version) => ({
        ...sourceFields(version, project),
        id:
          typeof version.id === "string"
            ? version.id.slice(0, 100)
            : crypto.randomUUID(),
        savedAt:
          typeof version.savedAt === "string" &&
          !Number.isNaN(Date.parse(version.savedAt))
            ? version.savedAt
            : new Date().toISOString(),
      }))
    : [];
  const completed =
    input.completed &&
    /^[a-f0-9]{64}$/.test(input.completed.sourceHash) &&
    !Number.isNaN(Date.parse(input.completed.completedAt))
      ? {
          sourceHash: input.completed.sourceHash,
          completedAt: input.completed.completedAt,
          manual: input.completed.manual === true,
        }
      : undefined;
  return {
    project,
    ...source,
    versions,
    updatedAt:
      typeof input.updatedAt === "string" &&
      !Number.isNaN(Date.parse(input.updatedAt))
        ? input.updatedAt
        : new Date().toISOString(),
    reference: input.reference === "verified" ? "verified" : "unverified",
    ...(completed ? { completed } : {}),
  };
}
function cleanRecord(value: unknown, scope: string): PracticeRecord {
  const stored = value as PracticeRecord | undefined;
  if (!stored || stored.scope !== scope || !Array.isArray(stored.drafts))
    return emptyRecord(scope);
  const drafts: PracticeDraft[] = [];
  for (const draft of stored.drafts.slice(-maxPracticeProjects)) {
    try {
      drafts.push(cleanPracticeDraft(draft));
    } catch {
      /* Ignore malformed device records without exposing their contents. */
    }
  }
  return {
    scope,
    drafts,
    activeId: drafts.some((draft) => draft.project.id === stored.activeId)
      ? stored.activeId
      : (drafts.at(-1)?.project.id ?? null),
  };
}
export async function loadPractices(scope: string) {
  if (!scope) return emptyRecord(scope);
  return cleanRecord(
    await readDevice("meta", practiceStorageKey(scope)),
    scope,
  );
}
// One transaction merges concurrent tab writes and their version histories.
export async function editPractices(
  scope: string,
  edit: (record: PracticeRecord) => PracticeRecord,
) {
  if (!scope) throw new Error("Sign in before saving practice projects.");
  const database = await deviceDB();
  return new Promise<PracticeRecord>((resolve, reject) => {
    const transaction = database.transaction("meta", "readwrite");
    const store = transaction.objectStore("meta");
    const request = store.get(practiceStorageKey(scope));
    let result: PracticeRecord;
    request.onsuccess = () => {
      try {
        result = edit(cleanRecord(request.result, scope));
        if (result.scope !== scope)
          throw new Error("This practice belongs to another account.");
        result.drafts = result.drafts.slice(-maxPracticeProjects);
        store.put(result, practiceStorageKey(scope));
      } catch (error) {
        transaction.abort();
        reject(error);
      }
    };
    transaction.oncomplete = () => resolve(result);
    transaction.onabort = () =>
      reject(
        transaction.error ??
          new Error(
            "Your browser could not save this practice. Download a backup before closing it.",
          ),
      );
  });
}
export function starterPractice(
  project: PracticeProject,
  reference: PracticeDraft["reference"],
): PracticeDraft {
  return {
    project,
    code: project.project.starter,
    files: Object.fromEntries(
      (project.project.extraFiles ?? []).map((file) => [file.name, file.code]),
    ),
    versions: [],
    reference,
    updatedAt: new Date().toISOString(),
  };
}
export function addPractice(scope: string, draft: PracticeDraft) {
  const clean = cleanPracticeDraft(draft);
  return editPractices(scope, (record) => ({
    ...record,
    activeId: clean.project.id,
    drafts: [
      ...record.drafts.filter(
        (previous) => previous.project.id !== clean.project.id,
      ),
      clean,
    ],
  }));
}
export function savePractice(
  scope: string,
  id: string,
  code: string,
  files: Record<string, string>,
) {
  return editPractices(scope, (record) => {
    const draft = record.drafts.find((item) => item.project.id === id);
    if (!draft)
      throw new Error(
        "This practice is no longer saved. Download your code before choosing another.",
      );
    const source = sourceFields({ code, files }, draft.project);
    if (
      practiceSource(draft.code, draft.files) !==
      practiceSource(source.code, source.files)
    ) {
      draft.versions = [
        ...draft.versions,
        {
          id: crypto.randomUUID(),
          code: draft.code,
          files: draft.files,
          savedAt: draft.updatedAt,
        },
      ].slice(-maxPracticeVersions);
      draft.code = source.code;
      draft.files = source.files;
      draft.updatedAt = new Date().toISOString();
    }
    record.activeId = id;
    return record;
  });
}
export function selectPractice(scope: string, id: string) {
  return editPractices(scope, (record) => {
    if (!record.drafts.some((draft) => draft.project.id === id))
      throw new Error("This practice is no longer saved on this device.");
    record.activeId = id;
    return record;
  });
}
export async function completePractice(
  scope: string,
  id: string,
  code: string,
  files: Record<string, string>,
  manual: boolean,
) {
  const sourceHash = await practiceSourceHash(code, files);
  return editPractices(scope, (record) => {
    const draft = record.drafts.find((item) => item.project.id === id);
    if (
      !draft ||
      practiceSource(draft.code, draft.files) !== practiceSource(code, files)
    )
      throw new Error(
        "Your code changed. Run the current version before finishing.",
      );
    draft.completed = {
      sourceHash,
      completedAt: new Date().toISOString(),
      manual,
    };
    return record;
  });
}
export function exportPracticeBackup(record: PracticeRecord) {
  return JSON.stringify(
    {
      format: "codequest-practice-1",
      practices: record.drafts.map(cleanPracticeDraft),
    },
    null,
    2,
  );
}
export function parsePracticeBackup(text: string) {
  if (new TextEncoder().encode(text).length > 12000000)
    throw new Error("Choose a practice backup smaller than 12 MB.");
  let value;
  try {
    value = JSON.parse(text);
  } catch {
    throw new Error("Choose a valid practice JSON backup.");
  }
  if (
    value?.format !== "codequest-practice-1" ||
    !Array.isArray(value.practices) ||
    value.practices.length > maxPracticeProjects
  )
    throw new Error(
      "Choose a CodeQuest practice backup with at most 20 projects.",
    );
  // Imported validation/completion claims are not trusted as run evidence.
  return value.practices.map((item: unknown) => ({
    ...cleanPracticeDraft(item),
    reference: "unverified" as const,
    completed: undefined,
  }));
}
export function importPractices(scope: string, drafts: PracticeDraft[]) {
  return editPractices(scope, (record) => {
    for (let draft of drafts) {
      const existing = record.drafts.find(
        (item) => item.project.id === draft.project.id,
      );
      if (existing) {
        // Give the imported copy a fresh identity so current work survives.
        draft = {
          ...draft,
          project: { ...draft.project, id: crypto.randomUUID() },
        };
      }
      record.drafts.push(draft);
    }
    record.drafts = record.drafts.slice(-maxPracticeProjects);
    record.activeId = record.drafts.at(-1)?.project.id ?? null;
    return record;
  });
}
