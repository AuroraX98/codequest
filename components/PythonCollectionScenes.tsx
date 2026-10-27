"use client";

import { useId, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  makeCollectionScenario,
  makeRecipeScenario,
  pythonAmount,
  pythonAmounts,
  scaleFactors,
  type Collectible,
  type CollectionScenario,
  type RecipeScenario,
} from "../lib/python-collection-scenes";

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
const row: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  gap: "10px 16px",
  margin: "12px 0",
};
const control: CSSProperties = {
  minHeight: 42,
  border: "1px solid var(--border, #666179)",
  borderRadius: 8,
  background: "var(--panel, #252839)",
  color: "var(--text, #f8f0e4)",
  padding: "8px 12px",
  font: "inherit",
  maxWidth: "100%",
};
const field: CSSProperties = {
  border: "1px solid var(--border, #666179)",
  borderRadius: 10,
  padding: "10px 12px",
  margin: "14px 0",
  minWidth: 0,
};
const copy: CSSProperties = {
  fontSize: 13,
  lineHeight: 1.6,
  margin: "8px auto",
  maxWidth: "66ch",
  textAlign: "justify",
  hyphens: "auto",
  overflowWrap: "break-word",
};
function Choice({
  label,
  value,
  onChange,
  children,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  children: ReactNode;
}) {
  return (
    <label style={{ display: "grid", gap: 6, fontSize: 13 }}>
      {label}
      <select
        style={control}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {children}
      </select>
    </label>
  );
}
function Source({
  code,
  filename,
  expected,
}: {
  code: string;
  filename: string;
  expected: readonly string[];
}) {
  return (
    <details className="lab-technical-workbench" data-collection-source>
      <summary>Reveal the Python</summary>
      <p style={copy}>
        This complete script matches the scene. The picture is an authored
        simulation, not Python execution.
      </p>
      <pre
        style={{
          whiteSpace: "pre",
          overflowX: "auto",
          fontSize: 13,
          lineHeight: 1.6,
          padding: 12,
        }}
      >
        <code>{code}</code>
      </pre>
      <p style={copy}>Expected output when the whole script runs:</p>
      <pre
        style={{
          overflowX: "auto",
          fontSize: 13,
          lineHeight: 1.6,
          padding: 12,
        }}
      >
        {expected.join("\n")}
      </pre>
      <a
        href={`data:text/x-python;charset=utf-8,${encodeURIComponent(code)}`}
        download={filename}
        style={{ ...control, display: "inline-flex", alignItems: "center" }}
      >
        Download this .py example
      </a>
    </details>
  );
}
function Find({
  item,
  x,
  y,
  scale = 1,
}: {
  item: Collectible;
  x: number;
  y: number;
  scale?: number;
}) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <ellipse cx="0" cy="25" rx="24" ry="5" fill="#30251f" opacity=".25" />
      {item === "leaf" && (
        <>
          <path
            d="M-20 20Q-35-18 24-31Q30 10-20 20Z"
            fill="#8fae5d"
            stroke="#4c663f"
            strokeWidth="2"
          />
          <path
            d="M-26 29L18-23M-13 12L-17-3M-3 1L13 1M7-11L6-20"
            fill="none"
            stroke="#e0d497"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </>
      )}
      {item === "stone" && (
        <>
          <path
            d="M-28 10Q-34-7-14-20Q3-31 23-11Q38 10 21 21Q-14 32-28 10Z"
            fill="#a9adb3"
            stroke="#606975"
            strokeWidth="2"
          />
          <path
            d="M-18-8Q-7-21 6-15"
            stroke="#e2e2dc"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
          />
          <path d="M8 8L20 2M-7 16L-2 14" stroke="#7b8590" strokeWidth="2" />
        </>
      )}
      {item === "feather" && (
        <>
          <path
            d="M-17 20Q-31-7 13-34Q32-12 4 12L-9 13Z"
            fill="#e4d7ed"
            stroke="#9885ae"
            strokeWidth="1.5"
          />
          <path
            d="M-22 31L15-29M-13 16L-20 1M-5 4L16-2M3-9L-1-20M-1-2L-11-14"
            fill="none"
            stroke="#aa97bd"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </>
      )}
      {item === "button" && (
        <>
          <circle r="24" fill="#d6a0a4" stroke="#824c61" strokeWidth="2" />
          <circle r="18" fill="none" stroke="#efc4c3" strokeWidth="2" />
          {[-1, 1].flatMap((a) =>
            [-1, 1].map((b) => (
              <circle
                key={`${a}${b}`}
                cx={a * 6}
                cy={b * 6}
                r="3"
                fill="#613e50"
              />
            )),
          )}
          <path d="M-6-6L6 6M6-6L-6 6" stroke="#f7dbbd" strokeWidth="2" />
        </>
      )}
      {item === "shell" && (
        <>
          <path
            d="M-9 22Q-37-4-22-19Q-12-30 0-24Q15-31 26-14Q34 3 9 22Z"
            fill="#f0c39b"
            stroke="#a87359"
            strokeWidth="2"
          />
          <path
            d="M0 20L-20-15M0 20L-10-22M0 20V-23M0 20L12-22M0 20L24-12"
            fill="none"
            stroke="#cc9374"
            strokeWidth="1.5"
          />
          <path d="M-10 20H10L8 27H-8Z" fill="#edbc92" stroke="#a87359" />
        </>
      )}
      {item === "stamp" && (
        <>
          <path
            d="M-23-28H23V28H-23Z"
            fill="#f4e3c4"
            stroke="#aa8c70"
            strokeWidth="2"
            strokeDasharray="3 3"
          />
          <rect x="-17" y="-22" width="34" height="43" rx="2" fill="#7f9ea1" />
          <circle cx="8" cy="-12" r="5" fill="#f4d88d" />
          <path d="M-17 12L-4-6L8 10L15 2L17 21H-17Z" fill="#4a686a" />
          <path d="M-10 25H10" stroke="#ac8d73" strokeWidth="2" />
        </>
      )}
    </g>
  );
}
function TrayPicture({
  model,
  appended,
  id,
}: {
  model: CollectionScenario;
  appended: boolean;
  id: string;
}) {
  const state = model.states[appended ? 1 : 0];
  return (
    <figure className="python-concept-picture">
      <div
        className="drawn-scene-scroll"
        tabIndex={0}
        role="region"
        aria-label="Collector tray picture, scroll horizontally if needed"
      >
        <svg
          viewBox="0 0 360 365"
          role="img"
          aria-labelledby={`${id}-title ${id}-desc`}
          style={{
            fontFamily: "system-ui, sans-serif",
            background: C.night,
            borderRadius: 15,
          }}
        >
          <title
            id={`${id}-title`}
          >{`One collector tray, ${state.count} entries`}</title>
          <desc
            id={`${id}-desc`}
          >{`The items name points to the same wooden tray A before and after adding ${model.chosen}. ${state.items.length ? state.items.map((item, i) => `${item} occupies index ${i}`).join("; ") : "The tray is empty, with no occupied indexes"}. Count ${state.count}; ${state.lastIndex === null ? "no last index" : `last index ${state.lastIndex}`}. ${appended ? "The new entry is at the end. Append returned None." : "The new find waits outside the tray until you press Append."}`}</desc>
          <rect width="360" height="365" rx="15" fill={C.night} />
          <text
            x="180"
            y="27"
            textAnchor="middle"
            fill={C.gold}
            fontSize="14"
            fontWeight="700"
          >
            ONE COLLECTION. ROOM TO GROW.
          </text>
          <path
            d="M34 50H108L119 65L108 80H34Q29 80 29 75V55Q29 50 34 50Z"
            fill={C.mint}
          />
          <text
            x="70"
            y="70"
            textAnchor="middle"
            fill="#25423c"
            fontSize="14"
            fontWeight="700"
          >
            items
          </text>
          <circle cx="106" cy="65" r="3" fill="#25423c" />
          <path
            d="M108 66Q138 76 91 110"
            fill="none"
            stroke={C.mint}
            strokeWidth="2.5"
          />
          <circle cx="91" cy="110" r="4" fill={C.mint} />
          <text x="182" y="64" textAnchor="middle" fill={C.muted} fontSize="12">
            {appended ? "added at the end" : "next find"}
          </text>
          {!appended && (
            <>
              <Find item={model.chosen} x={285} y={66} scale={0.7} />
              <path
                d={`M264 76Q${75 + model.initial.length * 70} 83 ${75 + model.initial.length * 70} 119`}
                stroke={C.gold}
                strokeWidth="2"
                fill="none"
                strokeDasharray="4 5"
              />
              <path
                d={`M${70 + model.initial.length * 70} 113L${75 + model.initial.length * 70} 119L${80 + model.initial.length * 70} 113`}
                stroke={C.gold}
                strokeWidth="2"
                fill="none"
              />
            </>
          )}
          <ellipse
            cx="181"
            cy="265"
            rx="154"
            ry="14"
            fill="#101522"
            opacity=".7"
          />
          <path
            d="M24 118Q24 105 37 105H323Q336 105 336 118V244L325 260H35L24 244Z"
            fill="#9f704c"
            stroke="#5c4236"
            strokeWidth="2"
          />
          <rect
            x="34"
            y="115"
            width="292"
            height="125"
            rx="7"
            fill="#d0a575"
            stroke="#f1c994"
            strokeWidth="2"
          />
          <path
            d="M34 119H326M29 248H330"
            stroke="#e1b584"
            strokeWidth="2"
            opacity=".7"
          />
          {[0, 1, 2, 3].map((index) => {
            const item = state.items[index];
            return (
              <g key={index}>
                <rect
                  x={42 + index * 70}
                  y="124"
                  width="66"
                  height="108"
                  rx="6"
                  fill="#ae835f"
                  fillOpacity=".2"
                  stroke="#966f50"
                  strokeDasharray={item ? undefined : "3 5"}
                />
                {item && (
                  <>
                    <Find
                      item={item}
                      x={75 + index * 70}
                      y={166}
                      scale={0.82}
                    />
                    <text
                      x={75 + index * 70}
                      y="207"
                      textAnchor="middle"
                      fill={C.dark}
                      fontSize="12"
                      fontWeight="700"
                    >
                      {item}
                    </text>
                    <text
                      x={75 + index * 70}
                      y="226"
                      textAnchor="middle"
                      fill={C.dark}
                      fontSize="12"
                    >
                      index {index}
                    </text>
                  </>
                )}
              </g>
            );
          })}
          {!state.count && (
            <>
              <rect
                x="80"
                y="151"
                width="200"
                height="48"
                rx="8"
                fill="#d9b68a"
              />
              <text
                x="180"
                y="171"
                textAnchor="middle"
                fill={C.dark}
                fontSize="14"
                fontWeight="700"
              >
                Nothing collected yet
              </text>
              <text
                x="180"
                y="189"
                textAnchor="middle"
                fill={C.dark}
                fontSize="12"
              >
                No occupied indexes
              </text>
            </>
          )}
          <rect
            x="139"
            y="241"
            width="82"
            height="23"
            rx="4"
            fill={C.gold}
            stroke="#8c6747"
          />
          <text
            x="180"
            y="257"
            textAnchor="middle"
            fill={C.dark}
            fontSize="12"
            fontWeight="700"
          >
            TRAY A
          </text>
          <text
            x="90"
            y="297"
            textAnchor="middle"
            fill={C.mint}
            fontSize="14"
            fontWeight="700"
          >
            Count: {state.count}
          </text>
          <text
            x="264"
            y="297"
            textAnchor="middle"
            fill={C.purple}
            fontSize="14"
            fontWeight="700"
          >
            {state.lastIndex === null
              ? "No last index"
              : `Last index: ${state.lastIndex}`}
          </text>
          <text x="90" y="317" textAnchor="middle" fill={C.muted} fontSize="12">
            How many entries?
          </text>
          <text
            x="264"
            y="317"
            textAnchor="middle"
            fill={C.muted}
            fontSize="12"
          >
            Where is the final one?
          </text>
          <text x="180" y="345" textAnchor="middle" fill={C.ink} fontSize="12">
            {appended
              ? "The tray changed. Its identity did not."
              : "Imagine adding one find. What changes?"}
          </text>
        </svg>
      </div>
      <figcaption>
        <strong>Where the analogy stops: </strong>The tray stands for one list
        object; the name points to it. Each pictured find stands for a reference
        to a string, not a physical object inside Python. Lists are not limited
        to these four spaces.
      </figcaption>
    </figure>
  );
}
function CollectionScene() {
  const id = `collection-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const item = "button";
  const [empty, setEmpty] = useState(false);
  const [appended, setAppended] = useState(false);
  const [countGuess, setCountGuess] = useState("");
  const [indexGuess, setIndexGuess] = useState("");
  const model = makeCollectionScenario(item, empty);
  const reset = () => {
    setAppended(false);
    setCountGuess("");
    setIndexGuess("");
  };
  const answered = countGuess !== "" && indexGuess !== "";
  return (
    <section aria-labelledby={`${id}-heading`} data-collection-scene="list">
      <h4 id={`${id}-heading`}>Imagine a collector’s tray</h4>
      <p style={copy}>
        What if you add one more find? Picture the same tray with one more
        occupied position.
      </p>
      <p style={{ ...copy, color: "var(--muted)" }}>
        Authored simulation · not running Python · no score or progress changes
      </p>
      <fieldset style={field}>
        <legend>Starting collection</legend>
        <div style={row}>
          <label
            style={{
              display: "flex",
              gap: 8,
              alignItems: "center",
              minHeight: 42,
              fontSize: 13,
            }}
          >
            <input
              type="checkbox"
              checked={empty}
              onChange={(event) => {
                setEmpty(event.target.checked);
                reset();
              }}
            />
            Start with an empty tray
          </label>
        </div>
      </fieldset>
      <TrayPicture model={model} appended={appended} id={id} />
      <fieldset style={field} disabled={appended}>
        <legend>Predict before adding</legend>
        <div style={row}>
          <Choice
            label="Count after one append"
            value={countGuess}
            onChange={setCountGuess}
          >
            <option value="">Choose a count</option>
            {[0, 1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </Choice>
          <Choice
            label="Last index after one append"
            value={indexGuess}
            onChange={setIndexGuess}
          >
            <option value="">Choose an index</option>
            <option value="none">No last index</option>
            {[0, 1, 2, 3, 4].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </Choice>
        </div>
        <p style={copy}>You can make a prediction or explore without one.</p>
      </fieldset>
      <div style={row}>
        <button
          type="button"
          style={control}
          onClick={() => setAppended(true)}
          disabled={appended}
        >
          Append {item}
        </button>
        <button type="button" style={control} onClick={reset}>
          Reset tray
        </button>
      </div>
      <div role="status" aria-live="polite" style={copy} data-collection-status>
        {appended ? (
          <>
            <strong>
              {answered
                ? Number(countGuess) === model.prediction.count &&
                  Number(indexGuess) === model.prediction.lastIndex
                  ? "Your prediction matches. "
                  : "Compare your prediction with the tray. "
                : "Here is the consequence. "}
            </strong>
            Count is {model.prediction.count}; the last index is{" "}
            {model.prediction.lastIndex}. {item} is the new final entry. The
            same list changed. append returns None, not the changed list.
          </>
        ) : empty ? (
          "An empty list has count 0 and no last item or last index. Reading a missing index would raise IndexError."
        ) : (
          "The three entries occupy indexes 0, 1, and 2. The count is 3, not the last index."
        )}
      </div>
      <Source
        key={model.code}
        code={model.code}
        expected={model.expectedOutput}
        filename="collector-what-if.py"
      />
    </section>
  );
}

function Vessel({
  x,
  y,
  amount,
  color,
  active = false,
  ghost = false,
}: {
  x: number;
  y: number;
  amount: number;
  color: string;
  active?: boolean;
  ghost?: boolean;
}) {
  const fill = (Math.max(0, Math.min(12, amount)) / 12) * 61;
  return (
    <g transform={`translate(${x} ${y})`} opacity={ghost ? 0.3 : 1}>
      <ellipse cx="0" cy="76" rx="29" ry="5" fill="#101522" opacity=".25" />
      <path
        d="M21 13H30Q40 13 38 29V43Q38 54 22 51"
        fill="none"
        stroke={active ? C.gold : "#9eacb5"}
        strokeWidth="4"
      />
      <path
        d="M-25 0H24L20 68Q20 74 14 74H-16Q-22 74-22 68Z"
        fill="#d0e9e5"
        fillOpacity=".1"
        stroke={active ? C.gold : "#adc1c5"}
        strokeWidth="2"
      />
      {!ghost && fill > 0 && (
        <path
          d={`M-21 ${70 - fill}H20L18 68Q18 71 14 71H-16Q-20 71-20 68Z`}
          fill={color}
          opacity=".85"
        />
      )}
      <path
        d="M-18 14H-10M-18 32H-10M-18 50H-10"
        stroke="#b8c5c5"
        strokeWidth="1.5"
      />
      <path d="M-17 4L-15 60" stroke="#f4ffff" opacity=".3" strokeWidth="3" />
      {active && (
        <path
          d="M-29 83H29"
          stroke={C.gold}
          strokeWidth="3"
          strokeLinecap="round"
        />
      )}
    </g>
  );
}
function RecipePicture({
  model,
  step,
  id,
}: {
  model: RecipeScenario;
  step: number;
  id: string;
}) {
  const state = model.states[step],
    ingredients = ["flour", "oil", "oats"],
    colors = ["#f1ce8b", "#a5d6a1", "#e5aa83"];
  const dialAngles = [-135, -45, 45, 135];
  const angle =
    (dialAngles[scaleFactors.indexOf(model.factor)] * Math.PI) / 180;
  return (
    <figure className="python-concept-picture">
      <div
        className="drawn-scene-scroll"
        tabIndex={0}
        role="region"
        aria-label="Recipe scaling picture, scroll horizontally if needed"
      >
        <svg
          viewBox="0 0 360 495"
          role="img"
          aria-labelledby={`${id}-title ${id}-desc`}
          style={{
            fontFamily: "system-ui, sans-serif",
            background: C.night,
            borderRadius: 15,
          }}
        >
          <title id={`${id}-title`}>
            Keep the recipe; build a separate scaled batch
          </title>
          <desc
            id={`${id}-desc`}
          >{`The original recipe ${pythonAmounts(model.original)} stays unchanged on a paper recipe card. The factor dial is set to ${model.factor}. ${state.processed} of ${model.original.length} ingredients have been processed into the distinct new batch ${pythonAmounts(state.batch)}. ${state.returned ? "The complete batch has been returned to the caller." : "The batch has not returned to the caller yet."} ${state.printed ? "The caller has now printed both lists." : "Nothing has been printed."}`}</desc>
          <rect width="360" height="495" rx="15" fill={C.night} />
          <text
            x="180"
            y="26"
            textAnchor="middle"
            fill={C.gold}
            fontSize="14"
            fontWeight="700"
          >
            KEEP THE RECIPE. MAKE A NEW BATCH.
          </text>
          <path
            d="M31 46H319V191L310 187L301 193L292 187L283 193L274 187L265 193L256 187L247 193L238 187L229 193L220 187L211 193L202 187L193 193L184 187L175 193L166 187L157 193L148 187L139 193L130 187L121 193L112 187L103 193L94 187L85 193L76 187L67 193L58 187L49 193L40 187L31 191Z"
            fill={C.paper}
            stroke="#bda27e"
          />
          <path d="M154 41H194L192 51H156Z" fill="#d4bd97" opacity=".7" />
          <text
            x="175"
            y="68"
            textAnchor="middle"
            fill={C.dark}
            fontSize="13"
            fontWeight="700"
          >
            ORIGINAL RECIPE · unchanged
          </text>
          {model.original.map((amount, index) => (
            <g key={index}>
              <g transform={`translate(${81 + index * 94} 107)`}>
                {index === 0 ? (
                  <>
                    <path
                      d="M-22-13H17L22 27H-24Z"
                      fill="#b7976e"
                      stroke="#8d6a4c"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M-20-14Q-10-30 5-23Q19-25 21-13Z"
                      fill="#fff0cd"
                      stroke="#cfb998"
                    />
                    <path d="M-12-1L10-1L12 16H-14Z" fill="#f5dfb0" />
                    <path d="M-5 11V2M-9 5L-5 8L-1 5" stroke="#a7865e" />
                  </>
                ) : index === 1 ? (
                  <>
                    <path
                      d="M-7-24H7V-7L17 4V29H-17V4L-7-7Z"
                      fill="#a7ba90"
                      stroke="#6a7f65"
                      strokeWidth="1.5"
                    />
                    <rect
                      x="-8"
                      y="-29"
                      width="16"
                      height="7"
                      rx="2"
                      fill="#9a7953"
                    />
                    <path d="M-14 8H14V27H-14Z" fill="#d2bb65" />
                    <path d="M-10 1V21" stroke="#ecf0c5" strokeWidth="3" />
                  </>
                ) : (
                  <>
                    <path
                      d="M-22-14H22V28Q0 35-22 28Z"
                      fill="#bdae98"
                      stroke="#83735d"
                      strokeWidth="1.5"
                    />
                    <rect
                      x="-24"
                      y="-20"
                      width="48"
                      height="8"
                      rx="3"
                      fill="#8c715a"
                    />
                    {[-1, 0, 1].flatMap((r) =>
                      [-1, 0, 1].map((c) => (
                        <ellipse
                          key={`${r}${c}`}
                          cx={c * 12 + (r === 0 ? 3 : 0)}
                          cy={8 + r * 10}
                          rx="5"
                          ry="2.5"
                          fill="#ecd1a3"
                          transform={`rotate(-25 ${c * 12} ${8 + r * 10})`}
                        />
                      )),
                    )}
                  </>
                )}
              </g>
              <text
                x={81 + index * 94}
                y="155"
                textAnchor="middle"
                fill={C.dark}
                fontSize="15"
                fontWeight="700"
              >
                {pythonAmount(amount)}
              </text>
              <text
                x={81 + index * 94}
                y="174"
                textAnchor="middle"
                fill={C.dark}
                fontSize="12"
              >
                {ingredients[index]}
              </text>
            </g>
          ))}
          {!model.original.length && (
            <>
              <path
                d="M70 102H279M70 125H279M70 148H215"
                stroke="#d0ba94"
                strokeWidth="2"
              />
              <text
                x="175"
                y="141"
                textAnchor="middle"
                fill={C.dark}
                fontSize="15"
                fontWeight="700"
              >
                Empty recipe · no amounts
              </text>
            </>
          )}
          <path
            d="M57 198V229H127"
            fill="none"
            stroke={C.mint}
            strokeWidth="2"
            strokeDasharray="4 4"
          />
          <path
            d="M121 224L127 229L121 234"
            fill="none"
            stroke={C.mint}
            strokeWidth="2"
          />
          <text x="171" y="218" textAnchor="middle" fill={C.ink} fontSize="12">
            {state.nextIndex !== null
              ? `Next: ingredient ${state.nextIndex + 1}`
              : "All amounts processed"}
          </text>
          <text
            x="171"
            y="236"
            textAnchor="middle"
            fill={C.muted}
            fontSize="12"
          >
            {state.nextIndex !== null
              ? `${pythonAmount(model.original[state.nextIndex])} × ${model.factor}`
              : `${state.processed} of ${model.original.length} done`}
          </text>
          <g transform="translate(292 230)">
            <circle r="30" fill="#4a4559" stroke="#aaa1b7" strokeWidth="2" />
            <circle r="23" fill="#696072" stroke="#827889" />
            <path
              d={`M0 0L${Math.sin(angle) * 19} ${-Math.cos(angle) * 19}`}
              stroke={C.gold}
              strokeWidth="4"
              strokeLinecap="round"
            />
            <circle r="5" fill={C.gold} />
            <text
              x="0"
              y="47"
              textAnchor="middle"
              fill={C.gold}
              fontSize="13"
              fontWeight="700"
            >
              × {model.factor}
            </text>
          </g>
          <path
            d="M21 374H339L332 388H28Z"
            fill="#a87954"
            stroke="#664c3c"
            strokeWidth="2"
          />
          <path d="M39 387V409M319 387V409" stroke="#805a44" strokeWidth="10" />
          {[0, 1, 2].map((index) => {
            const amount = state.batch[index];
            return (
              <g key={index}>
                <Vessel
                  x={77 + index * 100}
                  y={291}
                  amount={amount?.value ?? 0}
                  color={colors[index]}
                  ghost={!amount}
                  active={!!amount && index === state.processed - 1}
                />
                <text
                  x={77 + index * 100}
                  y="409"
                  textAnchor="middle"
                  fill={amount ? C.ink : C.muted}
                  fontSize="14"
                  fontWeight="700"
                >
                  {amount ? pythonAmount(amount) : "—"}
                </text>
              </g>
            );
          })}
          <text
            x="180"
            y="285"
            textAnchor="middle"
            fill={C.mint}
            fontSize="12"
            fontWeight="700"
          >
            NEW BATCH · {state.batch.length} entries
          </text>
          <path
            d="M63 427H299"
            stroke="#71627c"
            strokeWidth="2"
            strokeDasharray={state.returned ? undefined : "4 5"}
          />
          <path
            d="M292 422L299 427L292 432"
            fill="none"
            stroke={state.returned ? C.mint : C.muted}
            strokeWidth="2"
          />
          <text
            x="180"
            y="451"
            textAnchor="middle"
            fill={state.returned ? C.mint : C.muted}
            fontSize="13"
            fontWeight="700"
          >
            {state.returned
              ? "Returned to caller: the complete new list"
              : "Caller is waiting for return"}
          </text>
          <text
            x="180"
            y="476"
            textAnchor="middle"
            fill={C.muted}
            fontSize="12"
          >
            {state.printed
              ? "Then the caller prints. Return was separate."
              : "Returning a result does not print it."}
          </text>
        </svg>
      </div>
      <figcaption>
        <strong>Where the analogy stops: </strong>These ingredients stand for
        numbers, not food Python moves or consumes. The original recipe is only
        read. Separate vessels represent the new list’s entries; their common
        scale is 0–12, with exact values underneath. Empty outlines are
        placeholders, not list entries. Return gives the complete list to the
        caller; it does not print.
      </figcaption>
    </figure>
  );
}
function RecipeScene() {
  const id = `recipe-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const factor = 3;
  const [empty, setEmpty] = useState(false);
  const [step, setStep] = useState(0);
  const [countGuess, setCountGuess] = useState("");
  const [valueGuess, setValueGuess] = useState("");
  const model = makeRecipeScenario(factor, empty),
    state = model.states[step];
  const reset = () => {
    setStep(0);
    setCountGuess("");
    setValueGuess("");
  };
  const answerValue = model.prediction.firstValue ?? "none";
  const valueOptions = Array.from(
    new Set(["none", "0", "0.0", "0.5", "1", "2", "3", "4", answerValue]),
  );
  const predicted = countGuess !== "" && valueGuess !== "";
  const nextLabel =
    state.nextIndex !== null
      ? `Scale ingredient ${state.nextIndex + 1}`
      : state.readyToReturn
        ? "Return new batch to caller"
        : "Print at caller";
  return (
    <section aria-labelledby={`${id}-heading`} data-collection-scene="recipe">
      <h4 id={`${id}-heading`}>Imagine a recipe-scaling workbench</h4>
      <p style={copy}>
        Read each original amount, make a separate scaled list, then return the
        whole new batch to the caller.
      </p>
      <p style={{ ...copy, color: "var(--muted)" }}>
        Authored simulation · not running Python · no score or progress changes
      </p>
      <fieldset style={field}>
        <legend>Starting recipe</legend>
        <label style={{ ...row, fontSize: 13, minHeight: 42 }}>
          <input
            type="checkbox"
            checked={empty}
            onChange={(event) => {
              setEmpty(event.target.checked);
              reset();
            }}
          />
          Start with an empty recipe
        </label>
      </fieldset>
      <RecipePicture model={model} step={step} id={id} />
      <fieldset style={field} disabled={step > 0}>
        <legend>Predict before scaling</legend>
        <div style={row}>
          <Choice
            label="Number of returned entries"
            value={countGuess}
            onChange={setCountGuess}
          >
            <option value="">Choose a count</option>
            {[0, 1, 2, 3, 6, 9].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </Choice>
          <Choice
            label="First returned value"
            value={valueGuess}
            onChange={setValueGuess}
          >
            <option value="">Choose a value</option>
            {valueOptions.map((value) => (
              <option key={value} value={value}>
                {value === "none" ? "No first value" : value}
              </option>
            ))}
          </Choice>
        </div>
        <p style={copy}>
          Predict the count and first amount, or explore without a prediction.
        </p>
      </fieldset>
      <div style={row}>
        <button
          type="button"
          style={control}
          disabled={state.printed}
          onClick={() =>
            setStep((current) => Math.min(current + 1, model.states.length - 1))
          }
        >
          {state.printed ? "Caller has printed" : nextLabel}
        </button>
        <button type="button" style={control} onClick={reset}>
          Reset recipe
        </button>
      </div>
      <div role="status" aria-live="polite" style={copy} data-collection-status>
        {state.returned ? (
          <>
            <strong>
              {predicted
                ? Number(countGuess) === model.prediction.count &&
                  valueGuess === answerValue
                  ? "Your prediction matches. "
                  : "Compare your prediction with the new batch. "
                : "The whole new list is back. "}
            </strong>
            Returned {pythonAmounts(model.final)} with {model.final.length}{" "}
            entries. Original remains {pythonAmounts(model.original)}.{" "}
            {state.printed
              ? "The caller now prints both lists, below."
              : "Nothing printed yet. Return and print are different actions."}
          </>
        ) : state.readyToReturn ? (
          `${state.processed} of ${model.original.length} amounts processed. ${model.empty ? "The empty recipe makes an empty new list. " : "The new batch is complete. "}Return is after the loop, and still needs its own step.`
        ) : (
          `${state.processed} of ${model.original.length} amounts processed. The caller has no result yet. Each step appends one new multiplied value, without changing the original recipe.`
        )}
      </div>
      {state.printed && (
        <div>
          <p style={copy}>Caller’s printed output:</p>
          <pre
            data-collection-output
            style={{ overflowX: "auto", padding: 12, fontSize: 13 }}
          >
            {state.output.join("\n")}
          </pre>
        </div>
      )}
      <Source
        key={model.code}
        code={model.code}
        expected={model.expectedOutput}
        filename="recipe-what-if.py"
      />
    </section>
  );
}
export default function PythonCollectionScenes({ unitId }: { unitId: string }) {
  if (unitId === "python-05") return <CollectionScene />;
  if (unitId === "python-08") return <RecipeScene />;
  return null;
}
