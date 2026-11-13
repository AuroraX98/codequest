import type { ReactNode } from "react";
import { BookOpen, Braces, Map, Settings, Trophy, Wrench } from "lucide-react";

const icons = { courses: Map, progress: Trophy, settings: Settings, terminology: BookOpen, tools: Wrench, practice: Braces };

export default function WorkspaceTitle({ section, children }: { section: keyof typeof icons; children: ReactNode }) {
  const Icon = icons[section];
  return (
    <header className="page-title workspace-title">
      <div>{children}</div>
      <span className="workspace-keycap" aria-hidden="true"><Icon size={32} strokeWidth={1.65} /></span>
    </header>
  );
}
