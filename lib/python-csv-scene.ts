/** Fixed, valid CSV teaching cases. This is an authored model, not a CSV parser. */
export const csvPresets = [
  {
    id: "comma",
    label: "A comma inside the item",
    row: '"Pens, blue",2',
    item: "Pens, blue",
    quantity: "2",
  },
  {
    id: "plain",
    label: "An item without a comma",
    row: "Pens,2",
    item: "Pens",
    quantity: "2",
  },
  {
    id: "quote",
    label: "Quotation marks inside the item",
    row: '"Pen ""blue""",2',
    item: 'Pen "blue"',
    quantity: "2",
  },
  {
    id: "empty",
    label: "Only the header, no stock rows",
    row: "",
    item: "",
    quantity: "",
  },
] as const;
export type CsvPreset = (typeof csvPresets)[number]["id"];
export type CsvMethod = "csv" | "split";
export function makeCsvScenario(
  preset: CsvPreset = "comma",
  method: CsvMethod = "csv",
) {
  const selected =
    csvPresets.find((item) => item.id === preset) ?? csvPresets[0];
  const chosen: CsvMethod = method === "split" ? "split" : "csv";
  const hasRow = selected.id !== "empty";
  const text = `item,quantity\n${hasRow ? selected.row + "\n" : ""}`;
  const csvFields = hasRow ? [selected.item, selected.quantity] : [];
  const naiveFields = hasRow ? selected.row.split(",") : [];
  const fields = chosen === "csv" ? csvFields : naiveFields;
  const rows = hasRow
    ? [{ item: selected.item, quantity: selected.quantity }]
    : [];
  const expectedOutput = rows.map((row) => `${row.item} ${row.quantity}`);
  const code = [
    "import csv",
    "import io",
    "",
    `text = ${JSON.stringify(text)}`,
    "for row in csv.DictReader(io.StringIO(text)):",
    '    print(row["item"], row["quantity"])',
    "",
  ].join("\n");
  return {
    preset: selected.id,
    method: chosen,
    hasRow,
    text,
    row: selected.row,
    rawItem: hasRow ? selected.row.slice(0, selected.row.lastIndexOf(",")) : "",
    item: selected.item,
    quantity: selected.quantity,
    fields,
    csvFields,
    naiveFields,
    rows,
    expectedOutput,
    code,
    fieldCount: fields.length,
    naiveMatches: JSON.stringify(csvFields) === JSON.stringify(naiveFields),
    quoted: selected.id === "comma" || selected.id === "quote",
  };
}
export type CsvScenario = ReturnType<typeof makeCsvScenario>;
