export function completionActivity(
  days: readonly { day: string; count: number }[],
  today = new Date().toISOString().slice(0, 10),
) {
  const active = new Set(days.filter((d) => d.count > 0).map((d) => d.day));
  const cursor = new Date(today + "T12:00:00Z");
  if (!active.has(today)) cursor.setUTCDate(cursor.getUTCDate() - 1);
  let streak = 0;
  while (active.has(cursor.toISOString().slice(0, 10))) {
    streak++;
    cursor.setUTCDate(cursor.getUTCDate() - 1);
  }
  return {
    streak,
    todayCompleted: days.find((d) => d.day === today)?.count ?? 0,
  };
}
