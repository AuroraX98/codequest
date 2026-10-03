import type { AIProvider } from "./ai-providers";
export type Runtime =
  | "javascript"
  | "typescript"
  | "python"
  | "sql"
  | "html"
  | "css"
  | "react"
  | "swift";
export type Unit = {
  id: string;
  track: string;
  level: string;
  topic: string;
  origin: string;
  project: { title: string; task: string; done_when: string };
  math: { level: string | null; topic: string | null; task: string | null };
};
export type Question = {
  question: string;
  choices: string[];
  answer: number;
  explanation?: string;
  feedback?: string;
};
export type Lesson = {
  id: string;
  title: string;
  summary: string;
  explanation: string[];
  analogy: { familiar: string; connection: string; limit: string };
  steps: string[];
  starter: string;
  solution: string;
  runtime: Runtime;
  checks: { label: string; expression: string }[];
  quiz: Question;
  hints: string[];
  math: (Question & { explanation: string }) | null;
  filename: string;
  estimatedMinutes: number;
  extraFiles?: { name: string; code: string }[];
  externalNotes?: string;
};
export type Progress = {
  unitId: string;
  code: string;
  quizPassed: number;
  mathPassed: number;
  completedAt: string | null;
  lastRun: string | null;
  updatedAt: string;
};
export type Profile = {
  track: string;
  level: string;
  activeUnit: string;
  calm: boolean;
  theme: string;
  dailyGoal: number;
  runnerUrl: string;
  aiEnabled: boolean;
  hintsEnabled: boolean;
  analogiesEnabled: boolean;
  mathEnabled: boolean;
  rewardsEnabled: boolean;
  largeText: boolean;
  autoSync: boolean;
};
export type QuestState = {
  draftScope: string;
  profile: Profile;
  progress: Progress[];
  xp: number;
  streak: number;
  todayCompleted: number;
  completed: number;
  keyConnected: boolean;
  aiProvider?: AIProvider | null;
  tutorUsed: number;
  recentDays: { day: string; count: number }[];
};
export type RunResult = {
  output: string[];
  checks: { label: string; passed: boolean }[];
  error?: string;
  manual?: boolean;
  source?: string;
};
