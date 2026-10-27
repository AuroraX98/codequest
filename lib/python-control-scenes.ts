/** Authored, bounded teaching models. These functions do not execute Python. */
export type LightComparison = "<" | "<=";
export type LightBranch = "if" | "else";
export type SchedulePreset = "three" | "two" | "empty";

export const schedulePresets: ReadonlyArray<{
  id: SchedulePreset;
  label: string;
  days: readonly string[];
}> = [
  {
    id: "three",
    label: "3 days · Mon, Wed, Fri",
    days: ["Monday", "Wednesday", "Friday"],
  },
  {
    id: "two",
    label: "2 days · Saturday, Sunday",
    days: ["Saturday", "Sunday"],
  },
  { id: "empty", label: "No days · empty list", days: [] },
];

export function boundedBrightness(value: number): number {
  return Number.isFinite(value)
    ? Math.min(80, Math.max(0, Math.trunc(value)))
    : 25;
}

export function makeLightScenario(
  value: number,
  comparison: LightComparison = "<",
) {
  const brightness = boundedBrightness(value);
  // Also validate at runtime so generated source only contains a known operator.
  const operator: LightComparison = comparison === "<=" ? "<=" : "<";
  const condition = operator === "<" ? brightness < 40 : brightness <= 40;
  const branch: LightBranch = condition ? "if" : "else";
  const returned = condition ? "Turn on a lamp" : "Enough light";
  const code = [
    "def light_reminder(brightness):",
    `    if brightness ${operator} 40:`,
    '        return "Turn on a lamp"',
    "    else:",
    '        return "Enough light"',
    "",
    `print(light_reminder(${brightness}))`,
    "",
  ].join("\n");
  return {
    brightness,
    operator,
    condition,
    branch,
    returned,
    code,
    expected: [returned],
    expression: `${brightness} ${operator} 40`,
    why:
      brightness === 40
        ? operator === "<"
          ? "Exactly 40 is not less than 40. Equality takes the else path."
          : "The added equals sign includes 40. Equality now takes the if path."
        : condition
          ? `${brightness} is below 40, so the if path supplies the reminder.`
          : `${brightness} is above 40, so the else path supplies the reminder.`,
  };
}

export function makeLoopScenario(
  preset: SchedulePreset = "three",
  requestedStep = 0,
) {
  const selection =
    schedulePresets.find((item) => item.id === preset) ?? schedulePresets[0];
  const days = [...selection.days];
  const totalSteps = days.length + 1;
  const step = Number.isFinite(requestedStep)
    ? Math.max(0, Math.min(totalSteps, Math.trunc(requestedStep)))
    : 0;
  const visits = Math.min(step, days.length);
  const finished = step === totalSteps;
  const currentIndex = step > 0 && step <= days.length ? step - 1 : null;
  const expected = [
    ...days.map((day) => `${day}: drawing`),
    "Schedule finished",
  ];
  const output = expected.slice(0, finished ? expected.length : visits);
  const code = [
    `days = ${JSON.stringify(days).split('","').join('", "')}`,
    "for day in days:",
    '    print(f"{day}: drawing")',
    'print("Schedule finished")',
    "",
  ].join("\n");
  return {
    preset: selection.id,
    days,
    step,
    totalSteps,
    visits,
    finished,
    currentIndex,
    currentDay: currentIndex === null ? null : days[currentIndex],
    bodyCount: days.length,
    afterCount: 1,
    code,
    expected,
    output,
    cards: days.map((day, index) => ({
      day,
      status:
        index === currentIndex
          ? ("current" as const)
          : index < visits
            ? ("visited" as const)
            : ("future" as const),
    })),
    phase: finished
      ? ("finished" as const)
      : step === 0
        ? ("ready" as const)
        : ("visit" as const),
    nextLabel: finished
      ? "Schedule complete"
      : visits < days.length
        ? `Visit ${days[visits]}`
        : "Continue after the loop",
    why: finished
      ? days.length === 0
        ? "No items means no visits. The print outside the loop still runs once."
        : "Every item has been visited. The print outside the loop now runs once."
      : step === 0
        ? "Each list item gets one visit to the same instruction."
        : `Visit ${step}: day refers to ${days[step - 1]}. The same body prints one new line.`,
  };
}

export type LightScenario = ReturnType<typeof makeLightScenario>;
export type LoopScenario = ReturnType<typeof makeLoopScenario>;
