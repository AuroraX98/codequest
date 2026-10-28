import { requireChatGPTUser } from "./chatgpt-auth";
import CodeQuestApp from "../components/CodeQuestApp";
export const dynamic = "force-dynamic";
export default async function Home() {
  const user = await requireChatGPTUser("/");
  return (
    <CodeQuestApp
      localMode={user.userId === "codequest-local"}
    />
  );
}
