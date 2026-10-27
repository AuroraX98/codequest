/** Bounded, authored illustrations of two lesson examples, not a Python runtime. */
export const collectibleChoices = ["button", "shell", "stamp"] as const;
export type AddedCollectible = (typeof collectibleChoices)[number];
export type Collectible = "leaf" | "stone" | "feather" | AddedCollectible;
export const scaleFactors = [0, 0.5, 2, 3] as const;
export type ScaleFactor = (typeof scaleFactors)[number];
export type PythonAmount = Readonly<{ value: number; kind: "int" | "float" }>;
const number = (value: number, kind: PythonAmount["kind"]): PythonAmount => ({
  value,
  kind,
});
export const pythonAmount = ({ value, kind }: PythonAmount): string =>
  kind === "float" && Number.isInteger(value) ? `${value}.0` : String(value);
export const pythonAmounts = (values: readonly PythonAmount[]) =>
  `[${values.map(pythonAmount).join(", ")}]`;
export const pythonItems = (values: readonly Collectible[]) =>
  `[${values.map((value) => `'${value}'`).join(", ")}]`;

export function makeCollectionScenario(
  item: AddedCollectible = "button",
  empty = false,
) {
  const chosen = collectibleChoices.includes(item) ? item : "button";
  const initial: readonly Collectible[] = empty
    ? []
    : ["leaf", "stone", "feather"];
  const final: readonly Collectible[] = [...initial, chosen];
  const states = [initial, final].map((items, step) => ({
    items,
    count: items.length,
    lastIndex: items.length ? items.length - 1 : null,
    lastItem: items.length ? items[items.length - 1] : null,
    trayId: "tray-A" as const,
    appended: step === 1,
    appendReturn: step === 1 ? "None" : null,
    // The illustration stops after append; printing is not implied by drawing it.
    output: [] as readonly string[],
  }));
  const expectedOutput = [pythonItems(final), String(final.length), chosen];
  return {
    chosen,
    empty,
    initial,
    final,
    states,
    prediction: {
      count: final.length,
      lastIndex: final.length - 1,
      lastItem: chosen,
    },
    expectedOutput,
    code: `items = ${pythonItems(initial)}\nitems.append('${chosen}')\nprint(items)\nprint(len(items))\nprint(items[len(items) - 1])\n`,
  };
}

export function makeRecipeScenario(factor: ScaleFactor = 3, empty = false) {
  const chosen: ScaleFactor = scaleFactors.includes(factor) ? factor : 3;
  const original: readonly PythonAmount[] = empty
    ? []
    : [number(1, "int"), number(0.5, "float"), number(4, "int")];
  const final = original.map((amount) =>
    number(
      amount.value * chosen,
      amount.kind === "float" || chosen === 0.5 ? "float" : "int",
    ),
  );
  const expectedOutput = [pythonAmounts(final), pythonAmounts(original)];
  const states = Array.from({ length: original.length + 3 }, (_, step) => {
    const processed = Math.min(step, original.length);
    const returned = step > original.length;
    const printed = step > original.length + 1;
    return {
      step,
      original,
      originalId: "original-recipe" as const,
      batchId: "new-batch" as const,
      batch: final.slice(0, processed),
      processed,
      nextIndex: processed < original.length ? processed : null,
      readyToReturn: processed === original.length && !returned,
      returned,
      printed,
      callerResult: returned ? final : null,
      output: printed ? expectedOutput : [],
    };
  });
  return {
    factor: chosen,
    empty,
    original,
    final,
    states,
    prediction: {
      count: final.length,
      firstValue: final.length ? pythonAmount(final[0]) : null,
      values: pythonAmounts(final),
    },
    expectedOutput,
    code: `def scale(amounts, factor):\n    scaled = []\n    for amount in amounts:\n        scaled.append(amount * factor)\n    return scaled\n\noriginal = ${pythonAmounts(original)}\nresult = scale(original, ${chosen})\nprint(result)\nprint(original)\n`,
  };
}
export type CollectionScenario = ReturnType<typeof makeCollectionScenario>;
export type RecipeScenario = ReturnType<typeof makeRecipeScenario>;
