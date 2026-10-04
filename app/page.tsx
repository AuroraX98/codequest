import { requireChatGPTUser } from "./chatgpt-auth";
import CodeQuest from "../components/CodeQuest";
import catalog from "../content/catalog.json";
import lessons from "../content/lessons.json";
import type { Unit, Lesson } from "../lib/types";
export const dynamic = "force-dynamic";
export default async function Home() {
  const user = await requireChatGPTUser("/");
  return (
    <CodeQuest
      units={catalog.units as Unit[]}
      lessons={lessons as Lesson[]}
      localMode={user.userId === "codequest-local"}
    />
  );
}
