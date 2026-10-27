"use client";

import { useId, useState } from "react";
import type { CSSProperties } from "react";
import {
  generatorExplanation,
  generatorNextLabel,
  generatorStateAt,
  generatorTuple,
  makeGeneratorScenario,
  type GeneratorMode,
  type GeneratorScenario,
  type GeneratorState,
} from "../lib/python-generator-scene";

const C = {
  ink: "#f8f0e4",
  muted: "#c6c1d5",
  mint: "#a1e5cf",
  gold: "#ffd28c",
  purple: "#ccafff",
  night: "#1b2030",
  paper: "#f3dfbc",
  dark: "#493a30",
};
const copy: CSSProperties = {
  fontSize: 13,
  lineHeight: 1.65,
  textAlign: "justify",
  hyphens: "auto",
  overflowWrap: "break-word",
  margin: "10px auto",
  maxWidth: "66ch",
};
const control: CSSProperties = {
  minHeight: 44,
  border: "1px solid var(--border, #666179)",
  borderRadius: 8,
  background: "var(--panel, #252839)",
  color: "var(--text, #f8f0e4)",
  padding: "8px 12px",
  font: "inherit",
  maxWidth: "100%",
};
const row: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  gap: 10,
  margin: "12px 0",
};

/** Pure picture export for visual QA; pass an instance-unique id. */
export function PythonGeneratorPicture({
  model,
  state,
  id,
}: {
  model: GeneratorScenario;
  state: GeneratorState;
  id: string;
}) {
  const bookmarkX =
    state.cursor < model.source.length ? 68 + state.cursor * 76 : 296;
  const yielding = state.phase === "yielded";
  const collecting = state.phase === "collected";
  const requesting = state.phase === "requested";
  const returned = state.phase === "returned";
  const engineLabel = yielding
    ? `${state.input} × 2 = ${state.yielded}`
    : state.phase === "exhausted" || returned
      ? "No next value"
      : requesting
        ? "Request received"
        : "Waiting for a request";
  return (
    <figure className="python-concept-picture" style={{ margin: "16px 0" }}>
      <div
        className="drawn-scene-scroll"
        tabIndex={0}
        role="region"
        aria-label="Generator station picture, scroll horizontally if needed"
        style={{ maxWidth: 540, margin: "0 auto" }}
      >
        <svg
          viewBox="0 0 360 548"
          fontFamily="system-ui, sans-serif"
          width="360"
          role="img"
          aria-labelledby={`${id}-title ${id}-desc`}
          style={{ display: "block", width: "100%", height: "auto" }}
          data-generator-picture
        >
          <title id={`${id}-title`}>
            {`Generator request station, call ${state.call}, ${state.phase}`}
          </title>
          <desc id={`${id}-desc`}>
            {`The source list [${model.source.join(", ")}] remains unchanged. The iterator bookmark has passed ${state.cursor} entries. Count is ${state.count}, total is ${state.total}. ${generatorExplanation(model, state)}`}
          </desc>
          <rect width="360" height="548" rx="16" fill={C.night} />
          <text x="24" y="30" fill={C.paper} fontSize="13" fontWeight="700">
            SOURCE LIST · unchanged
          </text>
          <text x="334" y="30" fill={C.muted} fontSize="12" textAnchor="end">
            call {state.call}
          </text>
          {/* A paper strip is retained; only the bookmark moves. */}
          <path
            d="M27 52H326Q340 52 340 67V114Q340 128 326 128H27Q14 128 14 115V66Q14 52 27 52Z"
            fill={C.paper}
            stroke="#b49674"
            strokeWidth="2"
          />
          <path d="M23 58V122M331 58V122" stroke="#c1a47d" strokeWidth="3" />
          {model.source.map((value, index) => (
            <g key={index} data-source-entry={index}>
              <rect
                x={42 + index * 76}
                y="67"
                width="52"
                height="43"
                rx="5"
                fill="#fff2d9"
                stroke="#a78b67"
              />
              <text
                x={68 + index * 76}
                y="96"
                textAnchor="middle"
                fontSize="24"
                fontWeight="700"
                fill={C.dark}
              >
                {value}
              </text>
            </g>
          ))}
          {!model.source.length && (
            <text
              x="151"
              y="95"
              fill={C.dark}
              fontSize="16"
              textAnchor="middle"
            >
              Empty list · no entries
            </text>
          )}
          <path d="M279 64V115" stroke="#b39a78" strokeDasharray="3 3" />
          <text x="297" y="95" fill={C.dark} fontSize="12" textAnchor="middle">
            end
          </text>
          <g transform={`translate(${bookmarkX} 121)`}>
            <path
              d="M-11 0H11V31L0 24L-11 31Z"
              fill={C.gold}
              stroke="#916c38"
              strokeWidth="1.5"
            />
            <path
              d="M-4 9L0 5L4 9"
              fill="none"
              stroke={C.dark}
              strokeWidth="2"
            />
          </g>
          <text x="180" y="173" fill={C.gold} fontSize="13" textAnchor="middle">
            {state.cursor < model.source.length
              ? `Iterator bookmark: next is ${model.source[state.cursor]}`
              : "Iterator bookmark: past the last entry"}
          </text>
          <path
            d="M180 182V207"
            stroke={C.muted}
            strokeWidth="2"
            strokeDasharray="3 4"
          />
          <path d="M175 201L180 207L185 201" fill="none" stroke={C.muted} />
          {/* The crank only makes one transformed token per request. */}
          <rect
            x="102"
            y="211"
            width="156"
            height="106"
            rx="13"
            fill="#53526e"
            stroke="#a89cbb"
            strokeWidth="2"
          />
          <rect x="115" y="223" width="130" height="24" rx="4" fill="#232837" />
          <text x="180" y="240" fill={C.ink} fontSize="12" textAnchor="middle">
            DOUBLE ON REQUEST
          </text>
          <g transform="translate(180 278)">
            <path
              d="M-23-10L-28-16L-19-26L-12-21L-5-24V-31H8V-24L15-20L23-24L31-13L25-8L27 0L34 3L31 16L23 15L18 21L19 29L6 33L3 25L-5 24L-12 30L-22 21L-17 14L-22 7L-30 6L-31-6Z"
              fill={yielding ? C.mint : "#b6a6c8"}
              stroke="#37354b"
              strokeWidth="2"
              transform="scale(.78)"
            />
            <circle r="18" fill="#302e42" stroke="#e7d3b2" strokeWidth="2" />
            <text
              y="6"
              textAnchor="middle"
              fontSize="20"
              fill={C.gold}
              fontWeight="700"
            >
              ×2
            </text>
          </g>
          <path d="M258 271H278" stroke={C.muted} strokeWidth="3" />
          <path
            d="M272 266L278 271L272 276"
            fill="none"
            stroke={C.muted}
            strokeWidth="2"
          />
          <circle
            cx="304"
            cy="271"
            r="23"
            fill={yielding ? C.mint : "#252b3e"}
            stroke={yielding ? C.mint : "#6c7187"}
            strokeWidth="2"
            strokeDasharray={yielding ? undefined : "3 3"}
          />
          <text
            x="304"
            y="278"
            fill={yielding ? C.dark : C.muted}
            textAnchor="middle"
            fontSize="21"
            fontWeight="700"
          >
            {yielding ? state.yielded : "·"}
          </text>
          <text
            x="303"
            y="310"
            fill={C.muted}
            textAnchor="middle"
            fontSize="12"
          >
            {yielding ? "one yield" : "no token"}
          </text>
          <text
            x="180"
            y="339"
            fill={yielding ? C.mint : C.ink}
            textAnchor="middle"
            fontSize="13"
          >
            {engineLabel}
          </text>
          {/* The loop asks upstream, then receives and counts downstream. */}
          <path
            d="M70 410H44V272H100"
            fill="none"
            stroke={requesting ? C.gold : "#697388"}
            strokeWidth="3"
          />
          <path
            d="M92 266L100 272L92 278"
            fill="none"
            stroke={requesting ? C.gold : "#697388"}
            strokeWidth="3"
          />
          <circle
            cx="44"
            cy="272"
            r="7"
            fill={requesting ? C.gold : "#697388"}
          />
          <text
            x="48"
            y="244"
            fill={requesting ? C.gold : C.muted}
            textAnchor="middle"
            fontSize="12"
          >
            loop asks
          </text>
          <path
            d="M304 321V371H268"
            fill="none"
            stroke={collecting ? C.mint : "#697388"}
            strokeWidth="3"
            strokeDasharray={collecting ? undefined : "4 4"}
          />
          <path
            d="M275 365L268 371L275 377"
            fill="none"
            stroke={collecting ? C.mint : "#697388"}
            strokeWidth="2"
          />
          <path
            d="M70 357H265V445H70Z"
            fill="#c3a578"
            stroke="#806347"
            strokeWidth="2"
          />
          <path d="M92 350H243V363H92Z" fill="#806347" stroke="#d7bf98" />
          <text
            x="168"
            y="382"
            fill={C.dark}
            fontSize="12"
            textAnchor="middle"
            fontWeight="700"
          >
            RUNNING TALLY
          </text>
          <rect x="82" y="393" width="78" height="41" rx="4" fill="#fff1d6" />
          <rect x="170" y="393" width="82" height="41" rx="4" fill="#fff1d6" />
          <text x="121" y="406" fill={C.dark} fontSize="12" textAnchor="middle">
            count
          </text>
          <text x="211" y="406" fill={C.dark} fontSize="12" textAnchor="middle">
            total
          </text>
          <text
            x="121"
            y="428"
            fill={C.dark}
            fontSize="23"
            fontWeight="700"
            textAnchor="middle"
          >
            {state.count}
          </text>
          <text
            x="211"
            y="428"
            fill={C.dark}
            fontSize="23"
            fontWeight="700"
            textAnchor="middle"
          >
            {state.total}
          </text>
          <text
            x="180"
            y="466"
            fill={state.exhausted ? C.gold : C.muted}
            fontSize="12"
            textAnchor="middle"
          >
            {state.phase === "exhausted"
              ? "EXHAUSTED · loop ends before return"
              : returned
                ? "Return hands the tally to the caller"
                : collecting
                  ? `Added 1 to count; added ${state.yielded} to total`
                  : "Only a collected value changes the tally"}
          </text>
          <path
            d="M168 475V489"
            stroke={returned ? C.mint : "#697388"}
            strokeWidth="2"
          />
          <path
            d="M163 483L168 489L173 483"
            fill="none"
            stroke={returned ? C.mint : "#697388"}
            strokeWidth="2"
          />
          <rect
            x="38"
            y="493"
            width="284"
            height="35"
            rx="7"
            fill={returned ? "#25483f" : "#292d42"}
            stroke={returned ? C.mint : "#697388"}
          />
          <text
            x="180"
            y="516"
            fill={returned ? C.mint : C.muted}
            fontSize="13"
            textAnchor="middle"
          >
            {returned
              ? `Caller receives ${generatorTuple(state.returned!)}`
              : "Caller waits for the returned tuple"}
          </text>
        </svg>
      </div>
      <figcaption style={copy}>
        The bookmark is the iterator’s position, not a change to the list. The
        station represents a generator producing one value when asked; the tally
        represents the loop body. This picture does not measure memory. The
        source list still exists, and shallow object sizes are not a complete
        memory benchmark.
      </figcaption>
    </figure>
  );
}

export default function PythonGeneratorScene() {
  const id = `generator-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const [mode, setMode] = useState<GeneratorMode>("list");
  const [step, setStep] = useState(0);
  const [guess, setGuess] = useState("");
  const model = makeGeneratorScenario(mode);
  const state = generatorStateAt(model, step);
  const complete = step >= model.states.length - 1;
  const reset = () => {
    setStep(0);
    setGuess("");
  };
  const feedback =
    complete && guess
      ? guess === model.prediction
        ? "Your prediction matches."
        : `Compare your prediction: the final call returns ${model.prediction}.`
      : "";
  return (
    <section aria-labelledby={`${id}-heading`} data-generator-scene>
      <h4 id={`${id}-heading`}>
        Imagine a doubling station that waits to be asked
      </h4>
      <p style={copy}>
        What if the same iterator is asked to start again? Move the bookmark and
        tally one request at a time, then try the one-shot input twice.
      </p>
      <p style={{ ...copy, color: "var(--muted)" }}>
        Authored simulation · not running Python · no score or progress changes
      </p>
      <label style={{ display: "grid", gap: 7, maxWidth: 390, fontSize: 13 }}>
        Choose your what-if
        <select
          style={control}
          value={mode}
          onChange={(event) => {
            setMode(
              makeGeneratorScenario(event.target.value as GeneratorMode).mode,
            );
            reset();
          }}
        >
          <option value="list">Reusable list: [1, 4, 6]</option>
          <option value="one-shot">Same iterator [3, 5]: call twice</option>
          <option value="empty">Empty list: []</option>
        </select>
      </label>
      <fieldset
        style={{
          border: "1px solid var(--border, #666179)",
          borderRadius: 10,
          padding: 12,
          margin: "12px 0",
          minWidth: 0,
        }}
      >
        <legend>Optional prediction</legend>
        <label style={{ display: "grid", gap: 7, fontSize: 13 }}>
          {mode === "one-shot"
            ? "What will call 2 return?"
            : "What tuple will return?"}
          <select
            style={control}
            value={guess}
            disabled={step !== 0}
            onChange={(event) => setGuess(event.target.value)}
          >
            <option value="">Explore without guessing</option>
            {["(0, 0)", "(2, 16)", "(3, 11)", "(3, 22)"].map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </label>
      </fieldset>
      <PythonGeneratorPicture model={model} state={state} id={id} />
      <div style={row}>
        <button
          type="button"
          data-generator-next
          style={{ ...control, opacity: complete ? 0.65 : 1 }}
          disabled={complete}
          onClick={() =>
            setStep((value) => Math.min(value + 1, model.states.length - 1))
          }
        >
          {generatorNextLabel(model, state)}
        </button>
        <button type="button" style={control} onClick={reset}>
          Reset scene
        </button>
      </div>
      <p
        role="status"
        aria-live="polite"
        aria-atomic="true"
        style={{ ...copy, minHeight: 66 }}
        data-generator-status
      >
        {generatorExplanation(model, state)} {feedback}
      </p>
      {state.results.length > 0 && (
        <div data-generator-results>
          <p style={copy}>Returned so far, not console output:</p>
          <pre
            style={{
              whiteSpace: "pre",
              textAlign: "left",
              overflowX: "auto",
              fontSize: 13,
            }}
          >
            {state.results
              .map(
                (result, index) =>
                  `Call ${index + 1}: ${generatorTuple(result)}`,
              )
              .join("\n")}
          </pre>
        </div>
      )}
      <details
        key={mode}
        data-generator-source
        className="lab-technical-workbench"
      >
        <summary>Reveal the matching Python</summary>
        <p style={copy}>
          This complete script matches the selected what-if. Its print calls
          display the returned tuples; the illustration itself does not execute
          Python.
        </p>
        <pre
          style={{
            whiteSpace: "pre",
            textAlign: "left",
            overflowX: "auto",
            padding: 12,
            fontSize: 13,
            lineHeight: 1.6,
          }}
        >
          <code>{model.code}</code>
        </pre>
        <p style={copy}>Expected output when the complete script runs:</p>
        <pre
          style={{
            whiteSpace: "pre",
            textAlign: "left",
            overflowX: "auto",
            padding: 12,
            fontSize: 13,
          }}
        >
          {model.expectedOutput.join("\n")}
        </pre>
        <a
          href={`data:text/x-python;charset=utf-8,${encodeURIComponent(model.code)}`}
          download="generator-what-if.py"
          style={{ ...control, display: "inline-flex", alignItems: "center" }}
        >
          Download this .py example
        </a>
      </details>
    </section>
  );
}
