import { useEffect, useState } from "react";
import { Flame, Trophy, Zap } from "lucide-react";
import { completionActivity } from "../lib/learning-activity";
import type { QuestState } from "../lib/types";

export default function ProgressStats({ state }: { state: QuestState }) {
  const [today, setToday] = useState(() =>
    new Date().toISOString().slice(0, 10),
  );
  useEffect(() => {
    const update = () => setToday(new Date().toISOString().slice(0, 10));
    const midnight = new Date(today + "T00:00:00Z");
    midnight.setUTCDate(midnight.getUTCDate() + 1);
    const timer = window.setTimeout(
      update,
      Math.max(0, midnight.getTime() - Date.now()),
    );
    document.addEventListener("visibilitychange", update);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("visibilitychange", update);
    };
  }, [today]);
  const { streak, todayCompleted } = completionActivity(
    state.recentDays,
    today,
  );
  const goal = state.profile.dailyGoal;
  return (
    <>
      <p className="progress-daily-goal">
        <b>Daily goal</b> · {todayCompleted} finished today (UTC) · Goal: {goal}{" "}
        {goal === 1 ? "lesson" : "lessons"}
        {todayCompleted >= goal ? " · Goal met" : ""}
      </p>
      <div className="stats-grid">
        <div className="panel">
          <Trophy />
          <strong>{state.completed}</strong>
          <span>Lessons finished</span>
        </div>
        <div className="panel reward-stat">
          <Zap />
          <strong>{state.xp}</strong>
          <span>Experience points (XP) earned</span>
        </div>
        <div className="panel reward-stat">
          <Flame />
          <strong>{streak}</strong>
          <span>Day streak</span>
        </div>
      </div>
    </>
  );
}
