/** A bounded, authored generator illustration, not a Python interpreter. */
export const generatorModes = ["list", "one-shot", "empty"] as const;
export type GeneratorMode = (typeof generatorModes)[number];
export type GeneratorPhase =
  "ready" | "requested" | "yielded" | "collected" | "exhausted" | "returned";
export type GeneratorState = Readonly<{
  phase: GeneratorPhase;
  call: number;
  cursor: number;
  count: number;
  total: number;
  input: number | null;
  yielded: number | null;
  exhausted: boolean;
  returned: readonly [number, number] | null;
  results: readonly (readonly [number, number])[];
}>;
export const generatorTuple = (pair: readonly [number, number]) =>
  `(${pair[0]}, ${pair[1]})`;

export function makeGeneratorScenario(mode: GeneratorMode = "list") {
  // Do not interpolate untrusted enum values into the downloadable Python.
  const chosen: GeneratorMode = generatorModes.includes(mode) ? mode : "list";
  const source: readonly number[] =
    chosen === "one-shot" ? [3, 5] : chosen === "empty" ? [] : [1, 4, 6];
  const calls = chosen === "one-shot" ? 2 : 1;
  const states: GeneratorState[] = [];
  let cursor = 0;
  const results: (readonly [number, number])[] = [];
  for (let call = 1; call <= calls; call++) {
    let count = 0,
      total = 0;
    const push = (
      phase: GeneratorPhase,
      input: number | null = null,
      yielded: number | null = null,
    ) => {
      states.push({
        phase,
        call,
        cursor,
        count,
        total,
        input,
        yielded,
        exhausted: phase === "exhausted" || phase === "returned" || call === 2,
        returned: phase === "returned" ? [count, total] : null,
        results: [...results],
      });
    };
    push("ready");
    while (cursor < source.length) {
      push("requested");
      const input = source[cursor++],
        value = input * 2;
      push("yielded", input, value);
      count += 1;
      total += value;
      push("collected", input, value);
    }
    // Reaching the last item does not tell the loop it has finished. Its next
    // request discovers exhaustion, after which execution reaches return.
    push("requested");
    push("exhausted");
    results.push([count, total]);
    push("returned");
  }
  const example =
    chosen === "one-shot"
      ? "one_shot = iter([3, 5])\nprint(summarize(one_shot))\nprint(summarize(one_shot))"
      : `print(summarize([${source.join(", ")}]))`;
  return {
    mode: chosen,
    source,
    calls,
    states,
    expectedOutput: results.map(generatorTuple),
    prediction: generatorTuple(results[results.length - 1]),
    code: `def summarize(values):\n    count = total = 0\n    for value in (n * 2 for n in values):\n        count += 1\n        total += value\n    return count, total\n\n${example}\n`,
  };
}
export type GeneratorScenario = ReturnType<typeof makeGeneratorScenario>;

export function generatorStateAt(
  model: GeneratorScenario,
  requestedStep: number = 0,
): GeneratorState {
  const step = Number.isFinite(requestedStep)
    ? Math.max(0, Math.min(model.states.length - 1, Math.trunc(requestedStep)))
    : 0;
  return model.states[step];
}

export function generatorNextLabel(
  model: GeneratorScenario,
  state: GeneratorState,
): string {
  switch (state.phase) {
    case "ready":
    case "collected":
      return "Request next value";
    case "requested":
      return state.cursor < model.source.length
        ? "Let the generator yield"
        : "Check for another value";
    case "yielded":
      return "Add value to tally";
    case "exhausted":
      return "Return count and total";
    case "returned":
      return state.call < model.calls
        ? "Call summarize again"
        : "Summary complete";
  }
}

export function generatorExplanation(
  model: GeneratorScenario,
  state: GeneratorState,
): string {
  switch (state.phase) {
    case "ready":
      return state.call === 2
        ? "Call 2 starts with fresh count and total, both zero. The SAME one-shot iterator is still exhausted; a new generator cannot rewind it."
        : "Count and total start at zero. The generator has not produced a doubled value yet. The loop must request one.";
    case "requested":
      return "The loop requests the next value. The tally has not changed. Now let the generator respond to that request.";
    case "yielded":
      return `${state.input} × 2 yields ${state.yielded}. The iterator bookmark advances, but the source list is unchanged. This value has not entered the tally yet.`;
    case "collected":
      return `The loop adds 1 to count and ${state.yielded} to total: count ${state.count}, total ${state.total}. No new value is produced until the loop asks again.`;
    case "exhausted":
      return "There is no next value. The generator is exhausted, so the loop ends without adding to count or total. Return comes after the loop.";
    case "returned":
      return `Call ${state.call} returns ${generatorTuple(state.returned!)} to its caller.${state.call < model.calls ? " Call again with the SAME iterator to see what survives between calls." : " Returning a tuple is separate from printing it."}`;
  }
}
