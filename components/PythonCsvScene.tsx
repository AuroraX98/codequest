"use client";
import { useId, useState } from "react";
import {
  csvPresets,
  makeCsvScenario,
  type CsvPreset,
  type CsvMethod,
  type CsvScenario,
} from "../lib/python-csv-scene";
const C = {
  night: "#1b2030",
  ink: "#f6f0e5",
  muted: "#c2bfce",
  mint: "#9be0cb",
  purple: "#c8a9ff",
  gold: "#ffd08b",
  paper: "#f3dfbc",
  brown: "#493a30",
};
const css = `
.csv-scene{min-width:0;font-size:14px;line-height:1.55}
.csv-scene h4{font-size:20px;line-height:1.3;margin:0 0 8px}
.csv-scene p{max-width:66ch;margin-inline:auto;font-size:13px;text-align:justify;hyphens:auto;overflow-wrap:break-word}
.csv-scene fieldset{min-width:0;padding:12px;border:1px solid var(--border,#626079);border-radius:12px;margin:12px 0}
.csv-scene legend{font-size:13px;font-weight:700}
.csv-scene label{display:grid;gap:6px;font-size:13px}
.csv-scene .csv-controls{display:flex;flex-wrap:wrap;align-items:end;gap:12px}
.csv-scene select,.csv-scene button,.csv-scene a{font:inherit;min-height:42px;max-width:100%;padding:8px 12px;border:1px solid var(--border,#626079);border-radius:8px;color:var(--text,#f6f0e5);background:var(--panel,#252839)}
.csv-scene button,.csv-scene a{cursor:pointer}
.csv-scene button:disabled{cursor:default;opacity:.5}
.csv-scene :is(button,select,a,summary):focus-visible{outline:3px solid #ffd08b;outline-offset:3px}
.csv-scene .csv-status{max-width:66ch;margin:12px auto;padding:10px 12px;border-left:3px solid #9be0cb;font-size:13px;text-align:justify;hyphens:auto}
.csv-scene pre{white-space:pre;overflow:auto;text-align:left;font-size:12px;line-height:1.7;padding:12px}
.csv-scene .csv-small{font-size:12px;color:var(--muted,#c2bfce)}
`;
function Parcel({
  x,
  y,
  width,
  text,
  opened = false,
  color = C.paper,
}: {
  x: number;
  y: number;
  width: number;
  text: string;
  opened?: boolean;
  color?: string;
}) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <ellipse
        cx={width / 2}
        cy="78"
        rx={width / 2}
        ry="7"
        fill="#101522"
        opacity=".6"
      />
      <path
        d={`M0 5L12-5H${width - 8}L${width} 5V67L${width - 10} 77H0Z`}
        fill="#a77954"
        stroke="#694f3e"
        strokeWidth="2"
      />
      <rect
        x="0"
        y="5"
        width={width - 10}
        height="63"
        rx="3"
        fill={color}
        stroke="#b18c64"
      />
      <path
        d={`M${width - 10} 5L${width}-5M${width - 10} 5V68`}
        fill="none"
        stroke="#8d684e"
        strokeWidth="2"
      />
      {opened ? (
        <path
          d={`M0 5L-8-12L${width - 18}-12L${width - 10} 5`}
          fill="#ddbd91"
          stroke="#ac895e"
        />
      ) : (
        <>
          <path d={`M${width * 0.43}-4V68`} stroke="#eacda2" strokeWidth="13" />
          <path
            d={`M${width * 0.43}-3V67`}
            stroke="#b08e64"
            strokeWidth="1"
            strokeDasharray="3 5"
          />
        </>
      )}
      <rect
        x="7"
        y="22"
        width={width - 24}
        height="32"
        rx="4"
        fill="#fff1d5"
        stroke="#bca77e"
      />
      <text
        x={(width - 10) / 2}
        y="43"
        textAnchor="middle"
        fontSize={text.length > 14 ? 12 : 14}
        fontWeight="700"
        fill={C.brown}
      >
        {text}
      </text>
    </g>
  );
}
export function CsvPicture({
  model,
  revealed,
  id,
}: {
  model: CsvScenario;
  revealed: boolean;
  id: string;
}) {
  return (
    <figure className="python-concept-picture">
      <div
        className="drawn-scene-scroll"
        tabIndex={0}
        role="region"
        aria-label="CSV parcel picture, scroll horizontally if needed"
      >
        <svg
          viewBox="0 0 360 430"
          role="img"
          aria-labelledby={`${id}-title ${id}-desc`}
          style={{ fontFamily: "system-ui, sans-serif" }}
        >
          <title id={`${id}-title`}>
            Quotation marks keep a field together
          </title>
          <desc
            id={`${id}-desc`}
          >{`${model.hasRow ? `One stock row: ${model.row}.` : "Only the item and quantity header; there is no stock row."} ${revealed ? `${model.method === "csv" ? "CSV-aware reading" : "Splitting at every comma"} gives ${model.fieldCount} fields: ${model.fields.join("; ")}.` : "Predict the number of fields before opening the parcels."} Parcels are a metaphor for field boundaries, not storage objects.`}</desc>
          <rect width="360" height="430" rx="15" fill={C.night} />
          <text
            x="180"
            y="26"
            textAnchor="middle"
            fill={C.gold}
            fontSize="13.5"
            fontWeight="750"
          >
            KEEP ONE ITEM TOGETHER
          </text>
          <text x="180" y="48" textAnchor="middle" fill={C.muted} fontSize="12">
            The header names the slots: item, quantity
          </text>
          {model.hasRow ? (
            <>
              <Parcel x={23} y={83} width={212} text={model.rawItem} />
              <Parcel x={281} y={83} width={59} text={model.quantity} />
              <text
                x="252"
                y="129"
                textAnchor="middle"
                fill={C.gold}
                fontSize="35"
                fontWeight="700"
              >
                ,
              </text>
              <path
                d="M253 72V94M253 143V166"
                stroke={C.gold}
                strokeWidth="2"
                strokeDasharray="3 4"
              />
              <text
                x="126"
                y="183"
                textAnchor="middle"
                fill={model.quoted ? C.purple : C.muted}
                fontSize="12"
              >
                {model.quoted
                  ? "Paired quotes protect this field"
                  : "No comma inside this item"}
              </text>
              <text
                x="309"
                y="183"
                textAnchor="middle"
                fill={C.muted}
                fontSize="11"
              >
                quantity
              </text>
              <path d="M30 205H330" stroke="#5b566d" />
              <text
                x="180"
                y="230"
                textAnchor="middle"
                fill={model.method === "csv" ? C.mint : C.gold}
                fontSize="13"
                fontWeight="700"
              >
                {model.method === "csv"
                  ? "CSV reader: respect quotation boundaries"
                  : "Naive split: cut at every comma"}
              </text>
              {revealed ? (
                <>
                  {model.fields.map((field, index) => {
                    const width = model.fields.length === 3 ? 98 : 155;
                    const x =
                      model.fields.length === 3
                        ? 21 + index * 111
                        : 21 + index * 168;
                    return (
                      <g key={index}>
                        {model.method === "csv" ? (
                          <Parcel
                            x={x}
                            y={272}
                            width={width}
                            text={field}
                            opened
                          />
                        ) : (
                          <g transform={`translate(${x} 264)`}>
                            <path
                              d={`M0 0H${width}V78L${width - 8} 72L${width - 16} 78L${width - 24} 72L${width - 32} 78L${width - 40} 72L${width - 48} 78L${width - 56} 72L${width - 64} 78L${width - 72} 72L${width - 80} 78L0 74Z`}
                              fill="#e7d2b5"
                              stroke="#b49375"
                            />
                            <path
                              d={`M8 13H${width - 8}`}
                              stroke="#bd9a77"
                              strokeDasharray="3 3"
                            />
                            <text
                              x={width / 2}
                              y="45"
                              textAnchor="middle"
                              fill={C.brown}
                              fontSize={field.length > 13 ? 11 : 14}
                              fontWeight="700"
                            >
                              {field}
                            </text>
                          </g>
                        )}
                        <text
                          x={x + width / 2}
                          y="374"
                          textAnchor="middle"
                          fill={C.muted}
                          fontSize="12"
                        >
                          {model.method === "csv"
                            ? index === 0
                              ? "item · string"
                              : "quantity · string"
                            : `fragment ${index + 1}`}
                        </text>
                      </g>
                    );
                  })}
                  <text
                    x="180"
                    y="407"
                    textAnchor="middle"
                    fill={model.method === "csv" ? C.mint : C.gold}
                    fontSize="13"
                    fontWeight="700"
                  >
                    {model.fieldCount}{" "}
                    {model.method === "csv" ? "fields" : "fragments"} ·{" "}
                    {model.method === "csv"
                      ? "boundaries understood"
                      : model.naiveMatches
                        ? "works for this simple row only"
                        : "the item is not decoded correctly"}
                  </text>
                </>
              ) : (
                <>
                  <path
                    d="M91 272H269V346H91Z"
                    fill="none"
                    stroke="#746e86"
                    strokeWidth="2"
                    strokeDasharray="6 5"
                  />
                  <path
                    d="M91 272L180 300L269 272M180 300V346"
                    fill="none"
                    stroke="#746e86"
                    strokeWidth="2"
                  />
                  <text
                    x="180"
                    y="322"
                    textAnchor="middle"
                    fill={C.ink}
                    fontSize="22"
                  >
                    ?
                  </text>
                  <text
                    x="180"
                    y="383"
                    textAnchor="middle"
                    fill={C.muted}
                    fontSize="13"
                  >
                    How many pieces will you receive?
                  </text>
                </>
              )}
            </>
          ) : (
            <>
              <path
                d="M64 150H296L282 264H78Z"
                fill="none"
                stroke="#b99572"
                strokeWidth="5"
              />
              <path
                d="M64 150L48 125M296 150L313 125"
                stroke="#b99572"
                strokeWidth="5"
              />
              <circle cx="104" cy="283" r="13" fill="#817884" />
              <circle cx="256" cy="283" r="13" fill="#817884" />
              <text
                x="180"
                y="205"
                textAnchor="middle"
                fill={C.ink}
                fontSize="17"
                fontWeight="700"
              >
                No stock parcels
              </text>
              <text
                x="180"
                y="230"
                textAnchor="middle"
                fill={C.muted}
                fontSize="13"
              >
                A header is not an inventory row.
              </text>
              <text
                x="180"
                y="351"
                textAnchor="middle"
                fill={C.mint}
                fontSize="16"
                fontWeight="700"
              >
                {revealed
                  ? "0 records · no fields to unpack"
                  : "What will the reader yield?"}
              </text>
            </>
          )}
        </svg>
      </div>
      <figcaption>
        <strong>Where the picture stops: </strong>Parcels stand for field
        boundaries, not Python containers. CSV parsing does not physically cut
        text. A comma inside a properly quoted field stays in that field; outer
        quotation marks are syntax. A doubled quote inside it becomes one quote
        in the value.
      </figcaption>
    </figure>
  );
}
export default function PythonCsvScene() {
  const id = `csv-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const [preset, setPreset] = useState<CsvPreset>("comma"),
    [method, setMethod] = useState<CsvMethod>("csv"),
    [prediction, setPrediction] = useState(""),
    [revealed, setRevealed] = useState(false);
  const model = makeCsvScenario(preset, method);
  const reset = () => {
    setRevealed(false);
    setPrediction("");
  };
  return (
    <section
      className="csv-scene"
      aria-labelledby={`${id}-heading`}
      data-csv-scene
    >
      <style>{css}</style>
      <h4 id={`${id}-heading`}>Imagine parcels with protected labels</h4>
      <p>
        What if an item’s name contains a comma? Quotation marks tell the reader
        which commas belong inside the item and which separate fields.
      </p>
      <p className="csv-small">
        Authored simulation · no file upload or Python execution · exploring
        does not change completion
      </p>
      <fieldset>
        <legend>Choose your what-if</legend>
        <div className="csv-controls">
          <label>
            Stock row
            <select
              value={preset}
              onChange={(e) => {
                setPreset(e.target.value as CsvPreset);
                reset();
              }}
            >
              {csvPresets.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
            </select>
          </label>
          <label>
            Read it with
            <select
              value={method}
              onChange={(e) => {
                setMethod(e.target.value === "split" ? "split" : "csv");
                reset();
              }}
            >
              <option value="csv">CSV-aware boundaries</option>
              <option value="split">Naive split at every comma</option>
            </select>
          </label>
        </div>
      </fieldset>
      <CsvPicture model={model} revealed={revealed} id={id} />
      <fieldset disabled={revealed}>
        <legend>Predict, or explore without a prediction</legend>
        <label>
          Pieces from the first stock row
          <select
            value={prediction}
            onChange={(e) => setPrediction(e.target.value)}
          >
            <option value="">Choose…</option>
            {[0, 1, 2, 3, 4].map((n) => (
              <option key={n} value={n}>
                {n === 0 ? "No stock row" : n}
              </option>
            ))}
          </select>
        </label>
      </fieldset>
      <div className="csv-controls">
        <button
          type="button"
          disabled={revealed}
          onClick={() => setRevealed(true)}
        >
          Reveal the fields
        </button>
        <button type="button" onClick={reset}>
          Reset prediction
        </button>
      </div>
      <div className="csv-status" role="status" aria-live="polite">
        {revealed ? (
          <>
            <strong>
              {prediction !== ""
                ? Number(prediction) === model.fieldCount
                  ? "Your prediction matches. "
                  : "Compare your prediction with the parcels. "
                : "Here is the consequence. "}
            </strong>
            {!model.hasRow ? (
              "Only headers means no records to process. The header is not stock."
            ) : method === "csv" ? (
              <>
                The item is {JSON.stringify(model.item)} and the quantity is{" "}
                {JSON.stringify(model.quantity)}. Both are strings.{" "}
                {preset === "quote"
                  ? "The outer quotes disappear; the doubled inner quotes become one quote each. "
                  : ""}
                Parsing is not validation or integer conversion.
              </>
            ) : model.naiveMatches ? (
              "This simple row splits into the same two values, but that does not make naive splitting safe for general CSV."
            ) : (
              <>
                Splitting at every comma gives {model.fieldCount} fragments and
                does not decode the quoted item correctly. Switch to CSV-aware
                boundaries to keep the intended field.
              </>
            )}
          </>
        ) : (
          "Change one thing, then reveal what stays together. All supplied cases have valid headers and well-formed quoting."
        )}
      </div>
      <details
        className="lab-technical-workbench"
        key={model.code}
        data-csv-source
      >
        <summary>Reveal the Python CSV reader</summary>
        <p>
          This script always uses the correct CSV reader for your selected row,
          not the intentionally naive comparison.
        </p>
        <pre>
          <code>{model.code}</code>
        </pre>
        <p>Expected printed output:</p>
        <pre>
          {model.expectedOutput.length
            ? model.expectedOutput.join("\n")
            : "(nothing printed)"}
        </pre>
        <a
          href={`data:text/x-python;charset=utf-8,${encodeURIComponent(model.code)}`}
          download="csv-boundaries-what-if.py"
        >
          Download this .py example
        </a>
        <p className="csv-small">
          Run the separate example in Build or PyCharm. Validation belongs to
          the later lesson section; the reader does not decide which quantities
          are allowed.
        </p>
      </details>
    </section>
  );
}
