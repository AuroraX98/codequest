"use client";

import { useId, useState, type ReactNode } from "react";
import {
  makeLightScenario,
  makeLoopScenario,
  schedulePresets,
  type LightBranch,
  type LightComparison,
  type LightScenario,
  type LoopScenario,
  type SchedulePreset,
} from "../lib/python-control-scenes";

const C = {
  ink: "#f6f0e5",
  muted: "#c2bfce",
  mint: "#9be0cb",
  purple: "#c8a9ff",
  gold: "#ffd08b",
  night: "#1b2030",
  edge: "#55576c",
  paper: "#f3dfbc",
  paperInk: "#41382f",
  wood: "#aa7650",
};

const styles = `
.python-control-scene{min-width:0;color:#f6f0e5;font-size:14px;line-height:1.5}
.python-control-scene *{box-sizing:border-box}
.python-control-scene .pcs-eyebrow{font-size:11px;letter-spacing:.13em;color:#9be0cb;font-weight:750;margin:0 0 4px}
.python-control-scene h3{font-size:21px;line-height:1.2;margin:0 0 8px;color:#f6f0e5}
.python-control-scene .pcs-intro{margin:0 0 14px;color:#d5d1de}
.python-control-scene .pcs-picture-scroll{max-width:540px;min-width:0;margin:0 auto;overflow-x:auto;border-radius:18px;scrollbar-width:thin}
.python-control-scene .pcs-picture-scroll:focus-visible{outline:3px solid #ffd08b;outline-offset:3px}
.python-control-scene .pcs-picture{min-width:340px;display:block;width:100%;height:auto;max-width:540px;margin:0 auto 14px;border:1px solid #49485e;border-radius:18px;background:#1b2030}
.python-control-scene .pcs-controls{display:grid;gap:12px;padding:14px;border:1px solid #4e5065;border-radius:14px;background:#242638}
.python-control-scene label,.python-control-scene legend{font-weight:650;color:#f6f0e5}
.python-control-scene fieldset{min-width:0;margin:0;padding:0;border:0}
.python-control-scene legend{margin-bottom:8px;padding:0;font-size:14px}
.python-control-scene input[type=range]{width:100%;accent-color:#9be0cb;min-height:32px;margin:0}
.python-control-scene input[type=number]{width:76px}
.python-control-scene select,.python-control-scene input[type=number]{min-height:42px;border:1px solid #73728b;border-radius:8px;background:#161c2b;color:#f6f0e5;padding:8px;font:inherit;max-width:100%}
.python-control-scene .pcs-select{display:grid;gap:5px}
.python-control-scene .pcs-select select{width:100%}
.python-control-scene .pcs-row{display:flex;align-items:center;flex-wrap:wrap;gap:8px}
.python-control-scene .pcs-between{justify-content:space-between}
.python-control-scene button,.python-control-scene .pcs-download{min-height:42px;border:1px solid #73728b;border-radius:9px;background:#34364c;color:#f6f0e5;font:inherit;font-weight:650;padding:8px 13px;cursor:pointer;text-decoration:none}
.python-control-scene button:hover:not(:disabled),.python-control-scene .pcs-download:hover{background:#45445d}
.python-control-scene button:disabled{cursor:default;opacity:.5}
.python-control-scene button.pcs-primary{background:#9be0cb;border-color:#9be0cb;color:#20372f}
.python-control-scene button.pcs-primary:hover:not(:disabled){background:#c2f1e3}
.python-control-scene :is(input,select,button,a,summary):focus-visible{outline:3px solid #ffd08b;outline-offset:3px}
.python-control-scene .pcs-prediction{display:grid;gap:7px}
.python-control-scene .pcs-choice{display:flex;gap:9px;align-items:center;min-height:42px;padding:8px 10px;border:1px solid #5b5d74;border-radius:9px;font-size:13px;font-weight:500}
.python-control-scene input[type=radio]{accent-color:#9be0cb;flex:none;width:17px;height:17px;margin:0}
.python-control-scene .pcs-small{font-size:12px;color:#c2bfce;margin:0}
.python-control-scene .pcs-hint{margin:0;font-size:13px;color:#d7d2e1}
.python-control-scene .pcs-result{margin:14px 0 0;border-left:3px solid #9be0cb;padding:2px 0 2px 12px}
.python-control-scene .pcs-result p{margin:5px 0}
.python-control-scene .pcs-output{margin-top:12px;padding:12px;background:#131a27;border:1px solid #4e5065;border-radius:10px}
.python-control-scene .pcs-output strong{display:block;font-size:12px;color:#c8a9ff;margin-bottom:6px}
.python-control-scene .pcs-output pre{font-size:13px;line-height:1.6;white-space:pre-wrap;overflow-wrap:anywhere;margin:0;background:transparent;color:#f6f0e5;padding:0;border:0}
.python-control-scene .pcs-code{margin-top:14px;padding:10px 12px;border:1px solid #4e5065;border-radius:10px}
.python-control-scene .pcs-code summary{cursor:pointer;font-weight:650;min-height:24px}
.python-control-scene .pcs-code pre{margin:12px 0;padding:12px;background:#131a27;color:#f6f0e5;white-space:pre;overflow:auto;font-size:12px;line-height:1.7;border-radius:8px}
.python-control-scene .pcs-download{display:inline-flex;align-items:center;margin-bottom:8px}
.python-control-scene .pcs-limit{font-size:12px;color:#c2bfce;margin:13px 0 0}
.python-control-scene .pcs-counts{display:grid;grid-template-columns:1fr 1fr;gap:10px}
@media(prefers-reduced-motion:reduce){.python-control-scene *{scroll-behavior:auto}}
`;

function Picture({
  id,
  title,
  description,
  children,
  height,
}: {
  id: string;
  title: string;
  description: string;
  children: ReactNode;
  height: number;
}) {
  return (
    <div
      className="pcs-picture-scroll"
      tabIndex={0}
      role="region"
      aria-label={`${title}, scroll horizontally if needed`}
    >
      <svg
        className="pcs-picture"
        viewBox={`0 0 360 ${height}`}
        role="img"
        aria-labelledby={`${id}-title ${id}-description`}
      >
        <title id={`${id}-title`}>{title}</title>
        <desc id={`${id}-description`}>{description}</desc>
        <rect width="360" height={height} rx="18" fill={C.night} />
        {children}
      </svg>
    </div>
  );
}

function LightPicture({
  model,
  revealed,
  id,
}: {
  model: LightScenario;
  revealed: boolean;
  id: string;
}) {
  // Use SVG 1.1-compatible RGB so screenshots and exported SVG render alike.
  const daylight = model.brightness / 80;
  const sky = `rgb(${Math.round(31 + 128 * daylight)}, ${Math.round(48 + 157 * daylight)}, ${Math.round(74 + 151 * daylight)})`;
  return (
    <Picture
      id={id}
      height={388}
      title="A room, one question, two reminder paths"
      description={`Imagined daylight represents the supplied brightness ${model.brightness}. The lamp stays off. ${revealed ? `${model.expression} is ${model.condition ? "True" : "False"}. Only the ${model.branch} path returns ${model.returned}.` : "Predict which reminder the comparison will select. No path has been revealed."}`}
    >
      <defs>
        <linearGradient id={`${id}-wall`} x2="0" y2="1">
          <stop stopColor="#34304a" />
          <stop offset="1" stopColor="#242a39" />
        </linearGradient>
        <clipPath id={`${id}-window`}>
          <rect x="38" y="39" width="136" height="110" rx="4" />
        </clipPath>
        <marker
          id={`${id}-arrow`}
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="5"
          markerHeight="5"
          orient="auto-start-reverse"
        >
          <path d="M1 1L9 5L1 9" fill="none" stroke={C.mint} strokeWidth="2" />
        </marker>
      </defs>
      <path
        d="M1 18Q1 1 18 1H342Q359 1 359 18V176H1Z"
        fill={`url(#${id}-wall)`}
      />
      <path
        d="M85 149L194 174H31L38 149Z"
        fill={C.gold}
        opacity={0.04 + model.brightness / 600}
      />
      <rect
        x="29"
        y="30"
        width="154"
        height="128"
        rx="7"
        fill="#a17b66"
        stroke="#4b3e43"
        strokeWidth="2"
      />
      <g clipPath={`url(#${id}-window)`}>
        <rect x="38" y="39" width="136" height="110" fill={sky} />
        <circle
          cx="141"
          cy="64"
          r="17"
          fill="#ffe2a0"
          opacity={0.35 + model.brightness / 125}
        />
        <path
          d="M26 127Q68 93 111 125Q154 101 188 127V160H26Z"
          fill="#5d817b"
        />
        <path
          d="M23 144Q64 119 111 139Q158 122 185 140V160H23Z"
          fill="#355952"
        />
        <path
          d="M43 75Q58 60 70 72Q82 61 97 75"
          fill="none"
          stroke="#d8e3e2"
          strokeWidth="7"
          strokeLinecap="round"
          opacity=".5"
        />
      </g>
      <path d="M106 39V149M38 96H174" stroke="#bb9677" strokeWidth="7" />
      <rect x="24" y="154" width="163" height="8" rx="3" fill="#c39d7d" />
      <path
        d="M254 71V150M238 153H270"
        stroke="#aa947e"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <path
        d="M233 50H275L288 90H220Z"
        fill="#d2c1a6"
        stroke="#7b716c"
        strokeWidth="2"
      />
      <ellipse cx="254" cy="90" rx="33" ry="5" fill="#8c8276" />
      <path d="M276 93V106" stroke="#b49a76" strokeWidth="2" />
      <circle cx="276" cy="108" r="3" fill={C.gold} />
      <path
        d="M209 163H302M220 163V176M291 163V176"
        stroke={C.wood}
        strokeWidth="8"
        strokeLinecap="round"
      />
      <text x="257" y="131" fontSize="11.5" fill={C.muted} textAnchor="middle">
        lamp stays off
      </text>
      <rect x="49" y="167" width="116" height="26" rx="13" fill={C.paper} />
      <text
        x="107"
        y="185"
        fontSize="13"
        fontWeight="750"
        fill={C.paperInk}
        textAnchor="middle"
      >
        brightness: {model.brightness}
      </text>
      <path
        d="M107 194V207H180V216"
        fill="none"
        stroke={C.gold}
        strokeWidth="2.5"
      />
      <path
        d="M180 212L251 245L180 278L109 245Z"
        fill="#393849"
        stroke={C.gold}
        strokeWidth="2"
      />
      <text
        x="180"
        y="244"
        fontSize="17"
        fontWeight="750"
        fill={C.ink}
        textAnchor="middle"
      >
        {model.expression}?
      </text>
      <text x="180" y="262" fontSize="11.5" fill={C.muted} textAnchor="middle">
        {revealed ? (model.condition ? "True" : "False") : "one question"}
      </text>
      {(["if", "else"] as const).map((branch, index) => {
        const selected = revealed && model.branch === branch;
        const x = index === 0 ? 15 : 190;
        return (
          <g key={branch}>
            <path
              d={index === 0 ? "M109 245H94V316" : "M251 245H266V316"}
              fill="none"
              stroke={selected ? C.mint : C.edge}
              strokeWidth={selected ? 4 : 2}
              strokeDasharray={selected ? undefined : "5 5"}
              markerEnd={selected ? `url(#${id}-arrow)` : undefined}
            />
            <rect
              x={index === 0 ? 34 : 216}
              y="281"
              width="96"
              height="25"
              rx="12"
              fill={C.night}
            />
            <text
              x={index === 0 ? 82 : 264}
              y="298"
              fill={selected ? C.mint : C.muted}
              textAnchor="middle"
              fontSize="12.5"
              fontWeight="650"
            >
              {index === 0 ? "True · if" : "False · else"}
            </text>
            <path
              d={`M${x} 323H${x + 155}V365Q${x + 155} 373 ${x + 147} 373H${x + 8}Q${x} 373 ${x} 365Z`}
              fill={selected ? C.paper : "#343546"}
              stroke={selected ? C.mint : C.edge}
              strokeWidth={selected ? 3 : 1.5}
            />
            <path
              d={`M${x} 323L${x + 77.5} 341L${x + 155} 323`}
              fill="none"
              stroke={selected ? "#ae9377" : C.edge}
              strokeWidth="1.5"
            />
            <text
              x={x + 77.5}
              y="360"
              fontSize="13"
              fontWeight="750"
              fill={selected ? C.paperInk : C.ink}
              textAnchor="middle"
            >
              {index === 0 ? "Turn on a lamp" : "Enough light"}
            </text>
            {selected && (
              <g>
                <circle cx={x + 141} cy="322" r="10" fill={C.mint} />
                <path
                  d={`M${x + 136} 322L${x + 140} 326L${x + 147} 318`}
                  fill="none"
                  stroke="#243f35"
                  strokeWidth="2"
                />
              </g>
            )}
          </g>
        );
      })}
      <text x="180" y="22" textAnchor="middle" fontSize="11.5" fill={C.muted}>
        Imagine a room. Supply a number.
      </text>
    </Picture>
  );
}

function CalendarCard({
  x,
  day,
  status,
  index,
}: {
  x: number;
  day: string;
  status: "current" | "visited" | "future";
  index: number;
}) {
  const current = status === "current";
  const visited = status === "visited";
  return (
    <g transform={`translate(${x} 42)`}>
      <rect
        x="2"
        y="5"
        width="98"
        height="98"
        rx="8"
        fill="#101723"
        opacity=".5"
      />
      <rect
        width="98"
        height="98"
        rx="8"
        fill={current ? C.paper : "#e5dac5"}
        stroke={current ? C.mint : visited ? "#8caaa0" : "#776a65"}
        strokeWidth={current ? 4 : 1.5}
        strokeDasharray={status === "future" ? "4 3" : undefined}
      />
      <path
        d="M8 0H90Q98 0 98 8V25H0V8Q0 0 8 0Z"
        fill={current ? "#527c70" : "#7d607f"}
      />
      <path
        d="M24-5V8M74-5V8"
        stroke="#d8c9b7"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <text
        x="49"
        y="21"
        fill="#fff4e4"
        fontSize="11"
        fontWeight="700"
        textAnchor="middle"
      >
        ITEM {index + 1}
      </text>
      <text
        x="49"
        y="45"
        fill={C.paperInk}
        fontSize={day.length > 7 ? 12.5 : 14}
        fontWeight="750"
        textAnchor="middle"
      >
        {day}
      </text>
      <g fill="#b6aa96">
        {[0, 1, 2, 3, 4].map((i) => (
          <rect key={i} x={17 + i * 14} y="55" width="8" height="8" rx="2" />
        ))}
      </g>
      {visited ? (
        <path
          d="M13 81L18 86L27 75"
          fill="none"
          stroke="#3d6558"
          strokeWidth="3"
        />
      ) : current ? (
        <path d="M15 75L25 81L15 87Z" fill="#3d6558" />
      ) : (
        <circle
          cx="20"
          cy="81"
          r="5"
          fill="none"
          stroke="#786a62"
          strokeWidth="2"
        />
      )}
      <text
        x="58"
        y="86"
        fill={C.paperInk}
        fontSize="12"
        fontWeight="650"
        textAnchor="middle"
      >
        {current ? "this visit" : visited ? "visited" : "waiting"}
      </text>
    </g>
  );
}

function LoopPicture({ model, id }: { model: LoopScenario; id: string }) {
  const start = model.days.length === 2 ? 75 : 19;
  const lastDay = model.visits > 0 ? model.days[model.visits - 1] : null;
  return (
    <Picture
      id={id}
      height={392}
      title="Calendar days visit one drawing station"
      description={`${model.days.length} day cards. ${model.cards.map((card) => `${card.day}: ${card.status}`).join(". ")}. ${model.visits} body visits so far. ${model.finished ? "The separate completion flag is raised: Schedule finished prints once." : "The separate completion flag has not been raised."} This pictures printed words, not real drawings.`}
    >
      <defs>
        <linearGradient id={`${id}-floor`} x2="0" y2="1">
          <stop stopColor="#353149" />
          <stop offset="1" stopColor="#1b2030" />
        </linearGradient>
      </defs>
      <rect
        x="1"
        y="175"
        width="358"
        height="216"
        rx="17"
        fill={`url(#${id}-floor)`}
      />
      <text x="180" y="23" fontSize="12" textAnchor="middle" fill={C.muted}>
        The list supplies the visits, in order.
      </text>
      {model.days.length === 0 ? (
        <g>
          <rect
            x="115"
            y="43"
            width="130"
            height="92"
            rx="10"
            fill="none"
            stroke="#858095"
            strokeWidth="2"
            strokeDasharray="6 5"
          />
          <path
            d="M115 65H245M142 36V51M218 36V51"
            stroke="#858095"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <text
            x="180"
            y="96"
            textAnchor="middle"
            fill={C.ink}
            fontSize="17"
            fontWeight="700"
          >
            No day cards
          </text>
          <text
            x="180"
            y="119"
            textAnchor="middle"
            fill={C.muted}
            fontSize="13"
          >
            0 visits
          </text>
        </g>
      ) : (
        model.cards.map((card, index) => (
          <CalendarCard
            key={card.day}
            x={start + index * 112}
            day={card.day}
            status={card.status}
            index={index}
          />
        ))
      )}
      {model.cards.map((card, index) => (
        <path
          key={card.day}
          d={`M${start + 49 + index * 112} 144V160H180V179`}
          fill="none"
          stroke={card.status === "current" ? C.mint : C.edge}
          strokeWidth={card.status === "current" ? 3 : 1.5}
          strokeDasharray={card.status === "current" ? undefined : "4 4"}
        />
      ))}
      <ellipse cx="166" cy="328" rx="96" ry="11" fill="#111622" opacity=".55" />
      <path
        d="M137 205L113 326M195 205L220 326M167 203V322"
        stroke={C.wood}
        strokeWidth="8"
        strokeLinecap="round"
      />
      <path
        d="M130 292H204"
        stroke="#d6ab7d"
        strokeWidth="9"
        strokeLinecap="round"
      />
      <rect
        x="122"
        y="205"
        width="87"
        height="85"
        rx="3"
        fill={C.paper}
        stroke="#bb9775"
        strokeWidth="2"
        transform="rotate(-3 166 245)"
      />
      {lastDay ? (
        <g>
          <path
            d="M137 272Q169 249 194 270"
            fill="none"
            stroke="#86a17b"
            strokeWidth="2"
          />
          <path
            d="M166 266V236M166 250L157 242M166 246L176 237"
            stroke="#967656"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M145 238Q137 225 151 220Q157 208 169 219Q183 213 189 227Q191 241 177 243Q161 249 145 238Z"
            fill="#779d7e"
            stroke="#4b6b59"
            strokeWidth="1.5"
          />
          <circle cx="192" cy="218" r="5" fill="#dfb362" />
        </g>
      ) : (
        <g stroke="#cec0a9" strokeWidth="1.5" strokeDasharray="3 3">
          <path d="M137 224H193M137 239H193M137 254H180" />
        </g>
      )}
      <g transform="translate(222 224) rotate(23)">
        <path d="M0 0H10V60H0Z" fill={C.gold} stroke="#ac7c4d" />
        <path d="M0 60L5 74L10 60" fill={C.paper} />
        <path d="M3 68L5 74L7 68" fill="#3a3841" />
        <rect x="0" y="-8" width="10" height="10" rx="2" fill="#ca9ba4" />
      </g>
      <rect
        x="93"
        y="176"
        width="174"
        height="27"
        rx="13"
        fill={lastDay ? C.mint : "#45465c"}
      />
      <text
        x="180"
        y="194"
        textAnchor="middle"
        fontSize="13"
        fontWeight="700"
        fill={lastDay ? "#243f35" : C.ink}
      >
        {model.currentDay
          ? `day → ${model.currentDay}`
          : model.finished
            ? "All visits finished"
            : "One shared station"}
      </text>
      <path
        d="M284 261V327"
        stroke="#b7a286"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M286 263Q300 254 313 263Q326 270 339 260V288Q326 298 313 289Q300 280 286 289Z"
        fill={model.finished ? C.mint : "#46475a"}
        stroke={model.finished ? C.mint : "#8a8398"}
        strokeWidth="1.5"
        strokeDasharray={model.finished ? undefined : "4 3"}
      />
      {model.finished && (
        <path
          d="M300 273L307 280L320 267"
          fill="none"
          stroke="#254437"
          strokeWidth="3"
          strokeLinecap="round"
        />
      )}
      <text
        x="293"
        y="343"
        textAnchor="middle"
        fill={model.finished ? C.mint : C.muted}
        fontSize="11.5"
      >
        {model.finished ? "raised once" : "not raised yet"}
      </text>
      <text
        x="151"
        y="349"
        textAnchor="middle"
        fill={C.ink}
        fontSize="13"
        fontWeight="700"
      >
        Same body. One visit per day.
      </text>
      <path d="M26 364H334" stroke={C.edge} />
      <text x="180" y="382" textAnchor="middle" fill={C.muted} fontSize="12">
        Then, outside the loop: one finish flag.
      </text>
    </Picture>
  );
}

function RevealCode({ code, filename }: { code: string; filename: string }) {
  return (
    <details className="pcs-code" key={code}>
      <summary>Reveal the Python</summary>
      <pre aria-label="Corresponding Python source">
        <code>{code}</code>
      </pre>
      <a
        className="pcs-download"
        download={filename}
        href={`data:text/x-python;charset=utf-8,${encodeURIComponent(code)}`}
      >
        Download this .py
      </a>
      <p className="pcs-small">
        Run this separate example in Build or PyCharm. These controls show an
        authored simulation, not a live Python run.
      </p>
    </details>
  );
}

function LightScene() {
  const id = useId();
  const [brightness, setBrightness] = useState(25);
  const [comparison, setComparison] = useState<LightComparison>("<");
  const [prediction, setPrediction] = useState<LightBranch | null>(null);
  const [revealed, setRevealed] = useState(false);
  const model = makeLightScenario(brightness, comparison);
  function reset() {
    setPrediction(null);
    setRevealed(false);
  }
  function changeBrightness(value: number) {
    setBrightness(makeLightScenario(value).brightness);
    reset();
  }
  return (
    <section
      className="python-control-scene"
      aria-labelledby={`${id}-heading`}
      data-scene="light-reminder"
    >
      <style>{styles}</style>
      <p className="pcs-eyebrow">IMAGINE · WHAT IF?</p>
      <h3 id={`${id}-heading`}>One reading. Two possible reminders.</h3>
      <p className="pcs-intro">
        Imagine a room getting darker. A question chooses a note to hand back,
        not a switch to flip.
      </p>
      <LightPicture id={`${id}-picture`} model={model} revealed={revealed} />
      <div className="pcs-controls">
        <div>
          <div className="pcs-row pcs-between">
            <label htmlFor={`${id}-brightness`}>
              What if the brightness were…
            </label>
            <input
              id={`${id}-brightness`}
              type="number"
              min="0"
              max="80"
              step="1"
              value={brightness}
              onChange={(event) => changeBrightness(Number(event.target.value))}
            />
          </div>
          <input
            aria-label="Brightness slider"
            type="range"
            min="0"
            max="80"
            step="1"
            value={brightness}
            onChange={(event) => changeBrightness(Number(event.target.value))}
          />
          <div className="pcs-row">
            <span className="pcs-small">Try the boundary:</span>
            {[39, 40, 41].map((value) => (
              <button
                type="button"
                key={value}
                onClick={() => changeBrightness(value)}
                aria-pressed={brightness === value}
              >
                {value}
              </button>
            ))}
          </div>
        </div>
        <label className="pcs-select" htmlFor={`${id}-comparison`}>
          The question
          <select
            id={`${id}-comparison`}
            value={comparison}
            onChange={(event) => {
              setComparison(event.target.value === "<=" ? "<=" : "<");
              reset();
            }}
          >
            <option value="<">brightness &lt; 40 · original rule</option>
            <option value="<=">What if brightness ≤ 40?</option>
          </select>
        </label>
        <fieldset disabled={revealed} className="pcs-prediction">
          <legend>Predict: which path returns the reminder?</legend>
          {(["if", "else"] as const).map((branch) => (
            <label className="pcs-choice" key={branch}>
              <input
                type="radio"
                name={`${id}-prediction`}
                value={branch}
                checked={prediction === branch}
                onChange={() => setPrediction(branch)}
              />
              {branch === "if"
                ? "True → if → “Turn on a lamp”"
                : "False → else → “Enough light”"}
            </label>
          ))}
        </fieldset>
        <div className="pcs-row">
          <button
            type="button"
            className="pcs-primary"
            disabled={prediction === null || revealed}
            onClick={() => setRevealed(true)}
          >
            Reveal decision
          </button>
          <button type="button" onClick={reset}>
            Reset prediction
          </button>
        </div>
        <p className="pcs-small">
          {revealed
            ? "Change one input to make a new prediction."
            : "Choose a prediction before revealing the path."}
        </p>
      </div>
      <div aria-live="polite" aria-atomic="true">
        {revealed && (
          <div className="pcs-result">
            <p>
              <strong>
                {prediction === model.branch
                  ? "You predicted it."
                  : `The ${model.branch} path is chosen.`}
              </strong>{" "}
              {model.expression} is {model.condition ? "True" : "False"}.
            </p>
            <p>{model.why}</p>
            <p>
              The function returns “{model.returned}”. The caller’s print
              displays it below.
            </p>
            <div className="pcs-output">
              <strong>Expected printed output · simulation</strong>
              <pre>{model.expected.join("\n")}</pre>
            </div>
          </div>
        )}
      </div>
      <RevealCode code={model.code} filename="light_reminder_what_if.py" />
      <p className="pcs-limit">
        <strong>Where the picture stops:</strong> The window stands for a
        supplied number. This function reads no sensor and switches on no lamp.
        Exploring here does not mark the lesson complete.
      </p>
    </section>
  );
}

function LoopScene() {
  const id = useId();
  const [preset, setPreset] = useState<SchedulePreset>("three");
  const [step, setStep] = useState(0);
  const [bodyPrediction, setBodyPrediction] = useState("");
  const [afterPrediction, setAfterPrediction] = useState("");
  const model = makeLoopScenario(preset, step);
  const predicted = bodyPrediction !== "" && afterPrediction !== "";
  function reset() {
    setStep(0);
    setBodyPrediction("");
    setAfterPrediction("");
  }
  return (
    <section
      className="python-control-scene"
      aria-labelledby={`${id}-heading`}
      data-scene="drawing-schedule"
    >
      <style>{styles}</style>
      <p className="pcs-eyebrow">IMAGINE · WHAT IF?</p>
      <h3 id={`${id}-heading`}>Different days. The same instruction.</h3>
      <p className="pcs-intro">
        Imagine day cards visiting one drawing station. Each card gets a turn.
        The finish flag waits outside.
      </p>
      <LoopPicture model={model} id={`${id}-picture`} />
      <div className="pcs-controls">
        <label className="pcs-select" htmlFor={`${id}-days`}>
          What if the list had…
          <select
            id={`${id}-days`}
            value={preset}
            onChange={(event) => {
              setPreset(event.target.value as SchedulePreset);
              reset();
            }}
          >
            {schedulePresets.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
        <fieldset disabled={step > 0}>
          <legend>Predict the counts before you step</legend>
          <div className="pcs-counts">
            <label className="pcs-select" htmlFor={`${id}-body`}>
              Body visits
              <select
                id={`${id}-body`}
                value={bodyPrediction}
                onChange={(event) => setBodyPrediction(event.target.value)}
              >
                <option value="">Choose…</option>
                {[0, 1, 2, 3].map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </label>
            <label className="pcs-select" htmlFor={`${id}-after`}>
              Finish prints
              <select
                id={`${id}-after`}
                value={afterPrediction}
                onChange={(event) => setAfterPrediction(event.target.value)}
              >
                <option value="">Choose…</option>
                {[0, 1, 2, 3].map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </fieldset>
        <div className="pcs-row">
          <button
            type="button"
            className="pcs-primary"
            disabled={!predicted || model.finished}
            onClick={() =>
              setStep((value) => Math.min(value + 1, model.totalSteps))
            }
          >
            {model.nextLabel}
          </button>
          <button type="button" onClick={reset}>
            Reset walkthrough
          </button>
        </div>
        <p className="pcs-small">
          One click is a whole loop visit, not one source line. The final click
          is the separate print after the loop.
        </p>
      </div>
      <div className="pcs-result" aria-live="polite" aria-atomic="true">
        <p>
          <strong>
            {model.visits} body visits · {model.finished ? 1 : 0} finish prints
            so far
          </strong>
        </p>
        <p>{model.why}</p>
        {model.finished && (
          <p>
            <strong>
              {Number(bodyPrediction) === model.bodyCount &&
              Number(afterPrediction) === model.afterCount
                ? "You predicted both counts."
                : `Compare your prediction: ${model.bodyCount} body visits, 1 finish print.`}
            </strong>
          </p>
        )}
        <div className="pcs-output">
          <strong>Expected output so far · simulation</strong>
          {model.output.length ? (
            <pre>{model.output.join("\n")}</pre>
          ) : (
            <p className="pcs-small">Nothing printed yet.</p>
          )}
        </div>
      </div>
      <RevealCode code={model.code} filename="drawing_schedule_what_if.py" />
      <p className="pcs-limit">
        <strong>Where the picture stops:</strong> The station stands for the
        repeated print. Python prints words; it does not draw or follow a real
        calendar. Exploring here does not mark the lesson complete.
      </p>
    </section>
  );
}

export default function PythonControlScenes({ unitId }: { unitId: string }) {
  if (unitId === "python-03") return <LightScene />;
  if (unitId === "python-04") return <LoopScene />;
  return null;
}
