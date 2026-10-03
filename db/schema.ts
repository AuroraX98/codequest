import {
  sqliteTable,
  text,
  integer,
  primaryKey,
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
