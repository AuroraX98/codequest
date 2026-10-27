import {
  sqliteTable,
  text,
  integer,
  primaryKey,
  index,
} from "drizzle-orm/sqlite-core";
export const profiles = sqliteTable("profiles", {
  userId: text("user_id").primaryKey(),
  settings: text("settings").notNull(),
  encryptedKey: text("encrypted_key"),
  createdAt: text("created_at").notNull(),
});
export const progress = sqliteTable(
  "progress",
  {
    userId: text("user_id").notNull(),
    unitId: text("unit_id").notNull(),
    code: text("code").notNull(),
    quizPassed: integer("quiz_passed").notNull().default(0),
    mathPassed: integer("math_passed").notNull().default(0),
    completedAt: text("completed_at"),
    lastRun: text("last_run"),
    updatedAt: text("updated_at").notNull(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.unitId] })],
);
export const snapshots = sqliteTable("snapshots", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  unitId: text("unit_id").notNull(),
  code: text("code").notNull(),
  createdAt: text("created_at").notNull(),
});
export const activity = sqliteTable(
  "activity",
  {
    userId: text("user_id").notNull(),
    day: text("day").notNull(),
    completed: integer("completed").notNull().default(0),
    tutorUsed: integer("tutor_used").notNull().default(0),
  },
  (t) => [primaryKey({ columns: [t.userId, t.day] })],
);
export const chats = sqliteTable("chats", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  unitId: text("unit_id").notNull(),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  createdAt: text("created_at").notNull(),
});
// Notes are keyed by the authenticated principal, never the browser's draft scope.
// A tombstone prevents stale devices from recreating a deleted note.
export const lessonNotes = sqliteTable(
  "lesson_notes",
  {
    userId: text("user_id").notNull(),
    id: text("id").notNull(),
    lessonId: text("lesson_id").notNull(),
    lessonTitle: text("lesson_title").notNull(),
    sectionKey: text("section_key").notNull(),
    sectionIndex: integer("section_index").notNull(),
    sectionTitle: text("section_title").notNull(),
    sectionFingerprint: text("section_fingerprint").notNull(),
    quote: text("quote").notNull(),
    body: text("body").notNull(),
    createdAt: text("created_at").notNull(),
    updatedAt: text("updated_at").notNull(),
    deletedAt: text("deleted_at"),
  },
  (t) => [
    primaryKey({ columns: [t.userId, t.id] }),
    index("lesson_notes_owner_lesson").on(t.userId, t.lessonId, t.deletedAt),
  ],
);

// Explicit, account-owned reading acknowledgements. Unchecked rows remain so
// stale devices cannot silently recreate a mark after it was removed.
export const lessonReading = sqliteTable(
  "lesson_reading",
  {
    userId: text("user_id").notNull(),
    lessonId: text("lesson_id").notNull(),
    sectionKey: text("section_key").notNull(),
    checked: integer("checked").notNull().default(0),
    markedAt: text("marked_at"),
    updatedAt: text("updated_at").notNull(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.lessonId, t.sectionKey] })],
);
