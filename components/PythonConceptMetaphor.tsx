"use client";

import { useId } from "react";
import type {
  ConceptId,
  PythonExperiment,
  TraceStep,
} from "../lib/python-concepts";

const C = {
  ink: "#f6f0e5",
  muted: "#c2bfce",
  mint: "#9be0cb",
  purple: "#c8a9ff",
  gold: "#ffd08b",
  night: "#1b2030",
  edge: "#4e5065",
  paper: "#f3dfbc",
  paperInk: "#41382f",
  wood: "#aa7650",
  copper: "#d8a070",
};
const short = (text: string, length = 14) => {
  const characters = Array.from(text.replace(/\n/g, "↵").replace(/\t/g, "⇥"));
  return characters.length > length
    ? characters.slice(0, length - 1).join("") + "…"
    : characters.join("");
};
const shownText = (text: string, length = 14) =>
  text === "" ? "(empty text)" : short(text, length);

function Dog({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <ellipse cx="0" cy="68" rx="45" ry="8" fill="#111622" opacity=".45" />
      <path
        d="M-23 19 Q-41 46-28 65 L-6 65 L0 39 L8 65 L31 65 Q40 44 24 18"
        fill="#c19065"
        stroke="#79543b"
        strokeWidth="2"
      />
      <path
        d="M28 44 Q57 42 50 18"
        fill="none"
        stroke="#c19065"
        strokeWidth="12"
        strokeLinecap="round"
      />
      <ellipse cx="0" cy="0" rx="37" ry="34" fill="#dcaf7f" />
      <path
        d="M-26-25 Q-64-39-47 17 Q-36 35-25 4 M26-25 Q64-39 47 17 Q36 35 25 4"
        fill="#785140"
        stroke="#543c35"
        strokeWidth="2"
      />
      <path d="M-12-28 Q1-36 13-28 L8-6 Q0-12-8-6Z" fill="#f1d7b0" />
      <ellipse cx="0" cy="13" rx="23" ry="17" fill="#f5ddbb" />
      <ellipse cx="-13" cy="-3" rx="4" ry="5" fill="#27252a" />
      <ellipse cx="13" cy="-3" rx="4" ry="5" fill="#27252a" />
      <circle cx="-12" cy="-4" r="1.2" fill="white" />
      <circle cx="14" cy="-4" r="1.2" fill="white" />
      <path d="M-7 8 Q0 4 7 8 Q4 17 0 17 Q-4 17-7 8" fill="#302b2a" />
      <path
        d="M0 16 Q-6 24-13 18 M0 16 Q6 24 13 18"
        fill="none"
        stroke="#755241"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M-26 31 Q0 44 26 31"
        fill="none"
        stroke={C.mint}
        strokeWidth="8"
      />
      <circle
        cx="0"
        cy="43"
        r="7"
        fill={C.gold}
        stroke="#8e6948"
        strokeWidth="1.5"
      />
      <path
        d="M-24 61H-10M13 61H27"
        stroke="#79543b"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </g>
  );
}
function Tag({
  x,
  y,
  text,
  color = C.mint,
  width = 116,
  rotate = 0,
  ghost = false,
}: {
  x: number;
  y: number;
  text: string;
  color?: string;
  width?: number;
  rotate?: number;
  ghost?: boolean;
}) {
  return (
    <g
      transform={`translate(${x} ${y}) rotate(${rotate})`}
      opacity={ghost ? 0.4 : 1}
    >
      <path
        d={`M0 0H${width - 15}L${width} 17L${width - 15} 34H0Q-5 34-5 29V5Q-5 0 0 0Z`}
        fill={ghost ? "none" : color}
        stroke={color}
        strokeWidth="1.5"
        strokeDasharray={ghost ? "4 4" : undefined}
      />
      <circle cx={width - 14} cy="17" r="3.5" fill={C.night} />
      <text
        x={(width - 17) / 2}
        y="22"
        textAnchor="middle"
        fill={ghost ? color : "#25353a"}
        fontSize="12"
        fontWeight="700"
      >
        {text}
      </text>
    </g>
  );
}
function Suitcase({
  x,
  y,
  text,
  color = C.copper,
  small = false,
}: {
  x: number;
  y: number;
  text: string;
  color?: string;
  small?: boolean;
}) {
  return (
    <g transform={`translate(${x} ${y})${small ? " scale(.85)" : ""}`}>
      <ellipse cx="0" cy="65" rx="67" ry="9" fill="#0d1420" opacity=".45" />
      <path
        d="M-22-40V-52Q-22-61-12-61H12Q22-61 22-52V-40"
        fill="none"
        stroke={color}
        strokeWidth="8"
      />
      <rect
        x="-65"
        y="-42"
        width="130"
        height="103"
        rx="16"
        fill={color}
        stroke="#624b40"
        strokeWidth="2"
      />
      <path d="M-65-16H65" stroke="#78594a" strokeWidth="2" />
      <rect
        x="-48"
        y="-41"
        width="12"
        height="100"
        rx="4"
        fill="#78594a"
        opacity=".75"
      />
      <rect
        x="36"
        y="-41"
        width="12"
        height="100"
        rx="4"
        fill="#78594a"
        opacity=".75"
      />
      <rect x="-50" y="-21" width="16" height="12" rx="2" fill={C.gold} />
      <rect x="34" y="-21" width="16" height="12" rx="2" fill={C.gold} />
      <path d="M-48-18H-36M36-18H48" stroke="#846140" />
      <path d="M-39 7L39 5L42 38L-42 40Z" fill={C.paper} stroke="#997955" />
      <text
        x="0"
        y="27"
        textAnchor="middle"
        fontSize={Array.from(text).length > 10 ? "11" : "15"}
        fontWeight="700"
        fill={C.paperInk}
      >
        {shownText(text, 14)}
      </text>
      <path
        d="M-58 45L-50 53M51-33L59-25"
        stroke="#f1c798"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </g>
  );
}
function Beads({ text, y = 104 }: { text: string; y?: number }) {
  const letters = Array.from(text),
    visible = letters.slice(0, 7),
    gap = 39;
  const start = 180 - ((Math.max(visible.length, 1) - 1) * gap) / 2;
  return (
    <g>
      <path
        d={`M28 ${y - 5}Q35 ${y - 26}43 ${y - 5}Q180 ${y + 5}317 ${y - 5}Q325 ${y - 25}331 ${y - 6}`}
        fill="none"
        stroke="#ad8e73"
        strokeWidth="3"
        strokeLinecap="round"
      />
      {visible.map((letter, index) => (
        <g key={index} transform={`translate(${start + index * gap} ${y})`}>
          <circle
            r="17"
            fill={index % 2 ? "#bde7dc" : "#e6d7f9"}
            stroke={index % 2 ? "#6b9c90" : "#ad91cf"}
            strokeWidth="2"
          />
          <circle cx="-5" cy="-7" r="3" fill="#fff" opacity=".35" />
          <text
            y="6"
            textAnchor="middle"
            fill="#343044"
            fontSize="17"
            fontWeight="700"
          >
            {letter === " "
              ? "␠"
              : letter === "\n"
                ? "↵"
                : letter === "\t"
                  ? "⇥"
                  : letter}
          </text>
          <text y="38" textAnchor="middle" fill={C.muted} fontSize="11">
            {index}
          </text>
        </g>
      ))}
      {!visible.length && (
        <text
          x="180"
          y={y + 32}
          fill={C.mint}
          textAnchor="middle"
          fontSize="13"
        >
          An empty string has no characters.
        </text>
      )}
      {letters.length > 7 && (
        <text
          x="180"
          y={y + 59}
          fill={C.muted}
          textAnchor="middle"
          fontSize="11"
        >
          First 7 of {letters.length} characters shown
        </text>
      )}
    </g>
  );
}
function Stones({ amount, x, y }: { amount: number; x: number; y: number }) {
  const count = Math.min(9, Math.max(0, amount));
  return (
    <g transform={`translate(${x} ${y})`}>
      <ellipse cx="0" cy="22" rx="51" ry="14" fill="#253b3d" stroke="#688c82" />
      {Array.from({ length: count }, (_, i) => {
        const row = Math.floor(i / 3),
          column = i % 3;
        return (
          <g
            key={i}
            transform={`translate(${(column - 1) * 23 + (row === 1 ? 5 : 0)} ${18 - row * 14})`}
          >
            <path
              d="M-11 0Q-12-8-4-10Q7-13 11-4Q14 4 2 6Q-10 7-11 0"
              fill={i % 2 ? "#e5ba79" : "#efd29c"}
              stroke="#b08958"
              strokeWidth="1.2"
            />
            <path
              d="M-5-5L1-7"
              stroke="#fff0cf"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </g>
        );
      })}
      {amount > 9 && (
        <text x="0" y="-27" textAnchor="middle" fill={C.gold} fontSize="11">
          9 of {amount} shown
        </text>
      )}
      {amount === 0 && (
        <text x="0" y="20" textAnchor="middle" fill={C.muted} fontSize="11">
          none
        </text>
      )}
    </g>
  );
}

function actionLabel(line: PythonExperiment["lines"][number]) {
  const source = line.map((piece) => piece.text).join("");
  if (source.startsWith("print")) return "Tell someone";
  if (source.includes(".upper")) return "Make new text";
  if (source.startsWith("original_name")) return "Keep a label";
  return source.startsWith("pet_age") ? "Choose an age" : "Choose a name";
}

function RebindingLuggage({
  pet,
  phase,
  arrowId,
}: {
  pet: string;
  phase: number;
  arrowId: string;
}) {
  const hasOriginal = phase >= 1,
    hasSecondName = phase >= 2,
    moved = phase >= 3;
  return (
    <g>
      {hasOriginal ? (
        <>
          <path
            d="M127 102Q112 133 96 148"
            fill="none"
            stroke={C.mint}
            strokeWidth="2"
            strokeDasharray={moved ? "3 4" : undefined}
            opacity={moved ? 0.35 : 1}
          />
          <Tag x={23} y={80} text="pet_name" width={111} ghost={moved} />
          <Suitcase x={89} y={198} text={pet} small />
          <text x="89" y="133" textAnchor="middle" fill={C.muted} fontSize="11">
            original text
          </text>
        </>
      ) : (
        <>
          <path
            d="M36 215H142M47 215V244M131 215V244"
            fill="none"
            stroke="#737083"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <text x="89" y="184" textAnchor="middle" fill={C.muted} fontSize="11">
            No name bound yet.
          </text>
        </>
      )}
      {moved ? (
        <>
          <path
            d="M146 94Q180 64 212 91"
            fill="none"
            stroke={C.purple}
            strokeWidth="2.5"
            markerEnd={`url(#${arrowId})`}
          />
          <Tag x={223} y={80} text="pet_name" width={110} />
          <path
            d="M319 97Q337 136 288 149"
            fill="none"
            stroke={C.mint}
            strokeWidth="2.5"
          />
          <Suitcase
            x={273}
            y={198}
            text={pet.toUpperCase()}
            color="#b9a1ce"
            small
          />
          <text
            x="273"
            y="133"
            textAnchor="middle"
            fill={C.muted}
            fontSize="11"
          >
            uppercase result
          </text>
        </>
      ) : (
        <>
          <path
            d="M223 215H329M234 215V244M318 215V244"
            fill="none"
            stroke="#737083"
            strokeWidth="4"
            strokeLinecap="round"
            opacity=".45"
          />
          <text
            x="276"
            y="170"
            textAnchor="middle"
            fill={C.muted}
            fontSize="11"
          >
            {hasSecondName ? "Two tags now point" : "The next step can"}
          </text>
          <text
            x="276"
            y="187"
            textAnchor="middle"
            fill={C.muted}
            fontSize="11"
          >
            {hasSecondName ? "to the same value." : "change the picture."}
          </text>
        </>
      )}
      {hasSecondName && (
        <>
          <path
            d="M138 273Q157 259 106 151"
            fill="none"
            stroke={C.gold}
            strokeWidth="2"
          />
          <Tag x={30} y={258} text="original_name" width={122} color={C.gold} />
          {moved && (
            <>
              <text
                x="252"
                y="274"
                textAnchor="middle"
                fill={C.ink}
                fontSize="11"
              >
                This tag stays.
              </text>
              <path
                d="M208 270H165"
                fill="none"
                stroke={C.gold}
                strokeWidth="1.5"
              />
            </>
          )}
        </>
      )}
      <text x="180" y="310" textAnchor="middle" fill={C.muted} fontSize="11">
        {moved
          ? "The original text did not change."
          : hasSecondName
            ? "A second name does not copy the text."
            : hasOriginal
              ? "A name is a way to find the value again."
              : "Step forward to attach the first name."}
      </text>
    </g>
  );
}

export default function PythonConceptMetaphor({
  concept,
  model,
  state,
  step,
  pet,
  age,
}: {
  concept: ConceptId;
  model: PythonExperiment;
  state: TraceStep;
  step: number;
  pet: string;
  age: number;
}) {
  const id = "metaphor-" + useId().replace(/[^a-zA-Z0-9_-]/g, "");
  // These authored scenes are analogies, not an interpreter or a memory viewer.
  const safeAge = Math.min(
    99,
    Math.max(0, Math.trunc(Number.isFinite(age) ? age : 5)),
  );
  const safePet = Array.from(pet)
    .slice(0, 40)
    .map((character) =>
      /^[\u0000\uD800-\uDFFF]$/.test(character) ? "\uFFFD" : character,
    )
    .join("");
  const traceStep = Math.min(model.lines.length, Math.max(0, step));
  const isRebind = model.code.includes("original_name");
  const isTextJoin = model.code.includes('pet_age + "1"');
  const latestPrint = model.lines
    .slice(0, traceStep)
    .reverse()
    .find((line) => line[0]?.text === "print");
  const printedName = latestPrint?.find(
    (piece) => piece.concept === "names",
  )?.text;
  const printedObjectId = state.bindings.find(
    (binding) => binding.name === printedName,
  )?.object;
  const firstObject =
    state.objects.find((object) => object.id === printedObjectId) ??
    state.objects[0];
  const outputExists = state.output.length > 0;
  const outputPreview = state.output.slice(0, 3);
  const descriptions: Record<
    ConceptId,
    { title: string; desc: string; helps: string; limit: string }
  > = {
    program: {
      title: "A program is like following a recipe",
      desc: `A paper recipe sits beside a wooden spoon and a mixing bowl. Its ${model.lines.length} numbered actions are in order. A gold bookmark ${traceStep ? `marks the action just completed, number ${traceStep}` : "waits above the first action"}. The recipe uses plain-language summaries, not Python code.`,
      helps:
        "Imagine following a recipe with your finger. Each instruction has a job, and the order matters. The bookmark follows the selected program step.",
      limit:
        "The kitchen is an analogy, not something this program does. This example follows a straight path; later, branches and loops can change the route.",
    },
    values: {
      title: "One pet, different kinds of information",
      desc: `A friendly dog wears a collar. A hanging paper label carries the text ${JSON.stringify(safePet)}; a birthday cake shows the age ${safeAge}. These stand for different kinds of information about the same pet.`,
      helps:
        "Imagine describing a pet: letters give its name; a quantity gives its age. A value has a kind, or type, which affects what you can do with it.",
      limit:
        "Python holds information about the pet, not the dog or cake. A digit written as text is still text; its appearance does not make it a number.",
    },
    strings: {
      title: "Letter beads and counting stones",
      desc: `The pet name is a necklace of ordered character beads, with positions beginning at zero. Separate piles of stones illustrate adding one to the number ${safeAge}, making ${safeAge + 1}. Long strings and large piles are abbreviated and labeled.`,
      helps:
        "Imagine text as beads threaded in order, and a number as a quantity of stones. Joining text extends the sequence; adding numbers combines quantities.",
      limit:
        "Real beads can be moved, but Python strings cannot be changed in place. Changed text is a result to use, not an edit to the original. Quotes mark source-code boundaries, not extra beads.",
    },
    names: {
      title: "Two luggage tags can refer to one suitcase",
      desc: `In a separate mini-example, tags labeled pet_name and original_name both have cords attached to the same suitcase. The suitcase carries the unchanged text ${JSON.stringify(safePet)}. Two labels do not mean two copies of the text.`,
      helps:
        "Imagine a name as a luggage tag and a value object as the suitcase it identifies. Two tags can lead you to the very same object.",
      limit:
        "This is a separate two-name mini-example, not the selected step. Names are references, not containers. The suitcase is not a literal picture of memory or storage size.",
    },
    assignment: {
      title: "Move a name tag, do not rewrite the old suitcase",
      desc: `In a separate mini-example, a faint former pet_name tag leads to the original text ${JSON.stringify(safePet)}. An arrow shows that tag moving to the uppercase result ${JSON.stringify(safePet.toUpperCase())}. The original_name tag stays tied to the unchanged original.`,
      helps:
        "Imagine first getting a result, then attaching a name tag to it. To reassign a name, move its tag. The other tag and the original text stay as they were.",
      limit:
        "This separate mini-example uses uppercase text. The suitcases distinguish original and result roles, not guaranteed object identities. A single = binds a name; it does not ask whether two values are equal.",
    },
    output: {
      title: "A trumpet shares a message without giving away the value",
      desc: outputExists
        ? `A suitcase stands for one input value retained inside the program side of a dotted boundary. A trumpet points outward and a paper speech ribbon carries ${state.output.length} displayed ${state.output.length === 1 ? "line" : "lines"}. The input object is not emptied or moved; the displayed message may combine several inputs.`
        : `A suitcase ${firstObject ? "represents a value already in the program" : "is only a faint outline because no value is bound yet"}. A quiet trumpet faces the outside world. No message has been printed at the selected step.`,
      helps:
        "Imagine speaking through a trumpet. Someone outside hears the message, but you still have the value. The speech ribbon follows what this step has printed.",
      limit:
        "The trumpet stands for display, not sound or sending a message online. Printed text is not a live view: rebinding a name will not rewrite earlier output. print returns None.",
    },
  };
  if (isRebind && (concept === "names" || concept === "assignment")) {
    descriptions[concept] = {
      title:
        traceStep >= 3
          ? "One tag moves and the other stays"
          : traceStep >= 2
            ? "Two tags lead to one suitcase"
            : traceStep
              ? "One tag leads to a suitcase"
              : "No names are bound yet",
      desc:
        traceStep >= 3
          ? `The pet_name luggage tag has moved to the uppercase result ${JSON.stringify(safePet.toUpperCase())}. The original_name tag still leads to the unchanged original text ${JSON.stringify(safePet)}. This illustration follows the selected rebind step.`
          : traceStep >= 2
            ? `The tags pet_name and original_name both lead to one suitcase carrying ${JSON.stringify(safePet)}. The text has not been copied. This follows step ${traceStep}.`
            : traceStep
              ? `A single pet_name tag is attached to a suitcase carrying ${JSON.stringify(safePet)}. No second tag or uppercase result has appeared yet.`
              : "Two empty luggage stands wait. No names are bound in the selected initial step. Stepping forward will reveal a value and attach its name tag.",
      helps:
        concept === "names"
          ? "Imagine a name as a luggage tag. Step forward: attach one tag, add a second to the same value, then move only pet_name to the result. Watch which tag stays."
          : "Imagine first getting a result, then attaching a tag to it. Step forward to see pet_name reattached while original_name still finds the original text.",
      limit:
        "The tags follow this example’s bindings, but the suitcases show original and result roles, not exact memory or guaranteed object identities. Strings do not change in place. A single = binds; it is not an equality question.",
    };
  }
  if (isTextJoin && concept === "strings") {
    descriptions.strings = {
      title: "Joining digit text makes a new strand, not a larger quantity",
      desc: `The original digit text ${JSON.stringify(String(safeAge))} is shown as character beads and stays unchanged. ${traceStep >= 2 ? `A separate new strand shows the joined result ${JSON.stringify(String(safeAge) + "1")}.` : "The space for a joined result is empty until the second step runs."} Below, a separately labeled numeric comparison shows that the number ${safeAge} plus one would make ${safeAge + 1}. That numeric comparison is not the selected text program’s operation.`,
      helps:
        "Step forward to join the digit text with another character, 1. A new strand appears, and the original strand stays. Compare that with counting one more stone below.",
      limit:
        "The quoted age is text, so this program joins characters, not quantities. The stones are only a numeric contrast. Strings are immutable: joining does not add a bead to the original string in place.",
    };
  }
  const copy = descriptions[concept];
  return (
    <figure className="python-concept-picture python-concept-metaphor">
      <div
        className="drawn-scene-scroll"
        tabIndex={0}
        role="region"
        aria-label="Concept illustration; scroll sideways on a narrow screen"
      >
        <svg
          viewBox="0 0 360 320"
          role="img"
          aria-labelledby={`${id}-title ${id}-desc`}
          xmlns="http://www.w3.org/2000/svg"
          fontFamily="Arial, sans-serif"
        >
          <title id={`${id}-title`}>{copy.title}</title>
          <desc id={`${id}-desc`}>{copy.desc}</desc>
          <defs>
            <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#25283a" />
              <stop offset="1" stopColor="#171d29" />
            </linearGradient>
            <linearGradient id={`${id}-bowl`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#b7e7dc" />
              <stop offset="1" stopColor="#4b998b" />
            </linearGradient>
            <marker
              id={`${id}-arrow`}
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto"
            >
              <path d="M0 0L10 5L0 10Z" fill={C.purple} />
            </marker>
          </defs>
          <rect
            x="1"
            y="1"
            width="358"
            height="318"
            rx="18"
            fill={`url(#${id}-sky)`}
            stroke={C.edge}
          />
          <path
            d="M17 277Q180 263 343 277"
            fill="none"
            stroke="#444250"
            strokeWidth="1"
          />

          {concept === "program" && (
            <g>
              <text
                x="180"
                y="29"
                textAnchor="middle"
                fontSize="12"
                fontWeight="700"
                letterSpacing="1"
                fill={C.gold}
              >
                FOLLOW A RECIPE, ONE ACTION AT A TIME
              </text>
              <ellipse
                cx="251"
                cy="259"
                rx="78"
                ry="13"
                fill="#101722"
                opacity=".55"
              />
              <path
                d="M37 57L158 49L173 257L47 268Z"
                fill="#0f1520"
                opacity=".4"
              />
              <path
                d="M27 49L153 44L166 253L37 261Z"
                fill={C.paper}
                stroke="#b99d75"
                strokeWidth="2"
              />
              <path
                d="M35 60L143 55M40 242L153 237"
                stroke="#ccb18b"
                strokeWidth="1"
              />
              <text
                x="91"
                y="81"
                textAnchor="middle"
                fill={C.paperInk}
                fontFamily="Georgia, serif"
                fontSize="20"
                fontStyle="italic"
              >
                The recipe
              </text>
              <path d="M62 88Q92 93 122 86" fill="none" stroke="#b59671" />
              {model.lines.map((line, i) => {
                const y = 112 + i * 27,
                  done = traceStep > i,
                  active = traceStep === i + 1;
                return (
                  <g key={i}>
                    <circle
                      cx="51"
                      cy={y - 4}
                      r="9"
                      fill={done ? "#739d84" : "#e2c9a0"}
                    />
                    <text
                      x="51"
                      y={y}
                      textAnchor="middle"
                      fontSize="11"
                      fontWeight="700"
                      fill={C.paperInk}
                    >
                      {i + 1}
                    </text>
                    <text x="66" y={y} fontSize="10.5" fill={C.paperInk}>
                      {actionLabel(line)}
                    </text>
                    {active && (
                      <path
                        d={`M23 ${y - 13}H36V${y + 9}L29.5 ${y + 4}L23 ${y + 9}Z`}
                        fill="#c67c42"
                      />
                    )}
                  </g>
                );
              })}
              {!traceStep && (
                <path d="M23 63H36V91L29.5 86L23 91Z" fill="#c67c42" />
              )}
              <path
                d="M241 182L275 85"
                stroke="#694a37"
                strokeWidth="12"
                strokeLinecap="round"
              />
              <path
                d="M239 181L273 84"
                stroke="#c49a6e"
                strokeWidth="8"
                strokeLinecap="round"
              />
              <ellipse
                cx="279"
                cy="66"
                rx="13"
                ry="25"
                transform="rotate(19 279 66)"
                fill="#c49a6e"
                stroke="#765139"
                strokeWidth="2"
              />
              <ellipse
                cx="279"
                cy="65"
                rx="7"
                ry="17"
                transform="rotate(19 279 65)"
                fill="#a4754e"
              />
              <path
                d="M190 191Q195 248 253 251Q310 248 319 191Z"
                fill={`url(#${id}-bowl)`}
                stroke="#487a73"
                strokeWidth="2"
              />
              <ellipse
                cx="254"
                cy="190"
                rx="65"
                ry="19"
                fill="#bfebe0"
                stroke="#487a73"
                strokeWidth="2"
              />
              <ellipse cx="254" cy="192" rx="55" ry="12" fill="#e3bb77" />
              <path
                d="M215 191Q244 183 274 193T298 190"
                fill="none"
                stroke="#a97d47"
                strokeWidth="2"
              />
              <path
                d="M239 190L247 184M270 194L279 186"
                stroke="#68956e"
                strokeWidth="5"
                strokeLinecap="round"
              />
              <path
                d="M202 214Q210 234 230 238"
                stroke="#d9f5ec"
                strokeWidth="4"
                fill="none"
                strokeLinecap="round"
                opacity=".65"
              />
              <path
                d="M218 155Q206 144 220 130Q230 119 221 108M250 153Q238 143 251 132"
                fill="none"
                stroke={C.muted}
                strokeWidth="2"
                strokeLinecap="round"
                opacity=".55"
              />
              <text
                x="253"
                y="273"
                textAnchor="middle"
                fill={C.muted}
                fontSize="11"
              >
                Order turns steps into a task.
              </text>
              <text
                x="180"
                y="302"
                textAnchor="middle"
                fill={C.gold}
                fontSize="12"
              >
                {traceStep
                  ? `Bookmark: just completed step ${traceStep} of ${model.lines.length}`
                  : "Bookmark: before the first instruction"}
              </text>
            </g>
          )}

          {concept === "values" && (
            <g>
              <text
                x="180"
                y="29"
                textAnchor="middle"
                fontSize="12"
                fontWeight="700"
                letterSpacing="1"
                fill={C.gold}
              >
                ONE PET. DIFFERENT INFORMATION.
              </text>
              <Dog x={92} y={145} scale={1.1} />
              <path
                d="M123 177Q149 68 233 70"
                fill="none"
                stroke="#737387"
                strokeWidth="1.5"
                strokeDasharray="3 5"
              />
              <path
                d="M129 209Q166 233 209 225"
                fill="none"
                stroke="#737387"
                strokeWidth="1.5"
                strokeDasharray="3 5"
              />
              <text
                x="251"
                y="62"
                textAnchor="middle"
                fill={C.mint}
                fontSize="12"
              >
                Pet’s name: text
              </text>
              <path
                d="M245 78Q249 66 260 81L269 99"
                fill="none"
                stroke="#ad8e73"
                strokeWidth="2"
              />
              <g transform="rotate(-7 252 111)">
                <path
                  d="M197 91L286 87L306 110L289 135L198 140Z"
                  fill={C.paper}
                  stroke="#b49a76"
                  strokeWidth="2"
                />
                <circle cx="288" cy="111" r="4" fill={C.night} />
                <text
                  x="244"
                  y="119"
                  textAnchor="middle"
                  fontSize="15"
                  fontWeight="700"
                  fill={C.paperInk}
                >
                  {shownText(safePet, 12)}
                </text>
              </g>
              <text
                x="253"
                y="163"
                textAnchor="middle"
                fill={C.gold}
                fontSize="12"
              >
                An age is a number
              </text>
              <g transform="translate(0 20)">
                <ellipse cx="254" cy="244" rx="61" ry="10" fill="#0f1723" />
                <ellipse cx="254" cy="237" rx="57" ry="11" fill="#a7c5c8" />
                <path
                  d="M207 199V230Q254 249 301 230V199"
                  fill="#c5916c"
                  stroke="#805e48"
                  strokeWidth="2"
                />
                <path
                  d="M207 207Q217 220 226 208Q234 225 245 211Q257 222 269 210Q281 220 290 207Q298 216 301 206V198H207Z"
                  fill="#f0dbb8"
                />
                <ellipse
                  cx="254"
                  cy="198"
                  rx="47"
                  ry="12"
                  fill="#f0dbb8"
                  stroke="#bda17e"
                />
                <path d="M254 190V176" stroke={C.mint} strokeWidth="6" />
                <path
                  d="M254 174Q245 167 255 159Q264 169 254 174"
                  fill={C.gold}
                />
                <text
                  x="254"
                  y="230"
                  textAnchor="middle"
                  fill="#412d25"
                  fontSize="22"
                  fontWeight="700"
                >
                  {safeAge}
                </text>
              </g>
              <text
                x="92"
                y="251"
                textAnchor="middle"
                fill={C.muted}
                fontSize="11"
              >
                The pet is not the data.
              </text>
              <text
                x="180"
                y="299"
                textAnchor="middle"
                fill={C.ink}
                fontSize="12"
              >
                The kind of information changes what you can do.
              </text>
            </g>
          )}

          {concept === "strings" && isTextJoin && (
            <g>
              <text
                x="180"
                y="29"
                textAnchor="middle"
                fontSize="12"
                fontWeight="700"
                letterSpacing=".6"
                fill={C.gold}
              >
                JOIN TEXT. KEEP THE ORIGINAL.
              </text>
              <text
                x="180"
                y="58"
                textAnchor="middle"
                fontSize="12"
                fill={C.mint}
              >
                Original digit text: unchanged
              </text>
              <Beads text={String(safeAge)} y={88} />
              <text
                x="180"
                y="147"
                textAnchor="middle"
                fontSize="12"
                fill={C.purple}
              >
                {traceStep >= 2
                  ? "New joined result: one more character"
                  : "A separate joined result will appear here"}
              </text>
              {traceStep >= 2 ? (
                <Beads text={String(safeAge) + "1"} y={175} />
              ) : (
                <>
                  <path
                    d="M83 180Q180 196 277 180"
                    fill="none"
                    stroke="#6b697e"
                    strokeWidth="2"
                    strokeDasharray="4 5"
                  />
                  <text
                    x="180"
                    y="207"
                    textAnchor="middle"
                    fill={C.muted}
                    fontSize="11"
                  >
                    Step forward to join the text.
                  </text>
                </>
              )}
              <path d="M29 223H331" stroke="#4e5065" strokeDasharray="3 5" />
              <text
                x="180"
                y="240"
                textAnchor="middle"
                fontSize="11"
                fill={C.gold}
              >
                Contrast only: numbers would add quantities
              </text>
              <Stones amount={safeAge} x={86} y={279} />
              <text
                x="157"
                y="287"
                textAnchor="middle"
                fontSize="25"
                fill={C.muted}
              >
                +
              </text>
              <path
                d="M179 282Q175 269 188 269Q202 271 199 282Q195 290 185 288Z"
                fill="#efd29c"
                stroke="#b08958"
                strokeWidth="1.5"
              />
              <path
                d="M214 280H234"
                stroke={C.purple}
                strokeWidth="2"
                markerEnd={`url(#${id}-arrow)`}
              />
              <Stones amount={safeAge + 1} x={293} y={279} />
              <text
                x="86"
                y="313"
                textAnchor="middle"
                fontSize="15"
                fontWeight="700"
                fill={C.gold}
              >
                {safeAge}
              </text>
              <text
                x="189"
                y="313"
                textAnchor="middle"
                fontSize="15"
                fontWeight="700"
                fill={C.gold}
              >
                1
              </text>
              <text
                x="293"
                y="313"
                textAnchor="middle"
                fontSize="15"
                fontWeight="700"
                fill={C.gold}
              >
                {safeAge + 1}
              </text>
            </g>
          )}

          {concept === "strings" && !isTextJoin && (
            <g>
              <text
                x="180"
                y="29"
                textAnchor="middle"
                fontSize="12"
                fontWeight="700"
                letterSpacing="1"
                fill={C.gold}
              >
                TEXT HAS ORDER. NUMBERS HAVE QUANTITY.
              </text>
              <text
                x="180"
                y="62"
                textAnchor="middle"
                fontSize="12"
                fill={C.mint}
              >
                A string: characters threaded in order
              </text>
              <Beads text={safePet} y={101} />
              <path d="M29 173H331" stroke="#4e5065" strokeDasharray="3 5" />
              <text
                x="180"
                y="197"
                textAnchor="middle"
                fontSize="12"
                fill={C.gold}
              >
                A number: count, then add one
              </text>
              <Stones amount={safeAge} x={86} y={238} />
              <text
                x="157"
                y="246"
                textAnchor="middle"
                fontSize="25"
                fill={C.muted}
              >
                +
              </text>
              <path
                d="M179 241Q175 228 188 228Q202 230 199 241Q195 249 185 247Z"
                fill="#efd29c"
                stroke="#b08958"
                strokeWidth="1.5"
              />
              <path
                d="M214 239H234"
                stroke={C.purple}
                strokeWidth="2"
                markerEnd={`url(#${id}-arrow)`}
              />
              <Stones amount={safeAge + 1} x={293} y={238} />
              <text
                x="86"
                y="285"
                textAnchor="middle"
                fontSize="19"
                fontWeight="700"
                fill={C.gold}
              >
                {safeAge}
              </text>
              <text
                x="189"
                y="285"
                textAnchor="middle"
                fontSize="19"
                fontWeight="700"
                fill={C.gold}
              >
                1
              </text>
              <text
                x="293"
                y="285"
                textAnchor="middle"
                fontSize="19"
                fontWeight="700"
                fill={C.gold}
              >
                {safeAge + 1}
              </text>
              <text
                x="180"
                y="307"
                textAnchor="middle"
                fontSize="11"
                fill={C.muted}
              >
                Text joins characters; numbers combine amounts.
              </text>
            </g>
          )}

          {concept === "names" && !isRebind && (
            <g>
              <text
                x="180"
                y="29"
                textAnchor="middle"
                fontSize="12"
                fontWeight="700"
                letterSpacing="1"
                fill={C.gold}
              >
                TWO TAGS. ONE SUITCASE.
              </text>
              <text
                x="180"
                y="50"
                textAnchor="middle"
                fontSize="11"
                fill={C.muted}
              >
                A separate two-name mini-example
              </text>
              <path
                d="M134 97Q109 129 163 152M321 98Q302 136 198 152"
                fill="none"
                stroke={C.mint}
                strokeWidth="2.5"
              />
              <Tag x={25} y={76} text="pet_name" rotate={-7} />
              <Tag x={211} y={72} text="original_name" width={121} rotate={6} />
              <Suitcase x={180} y={200} text={safePet} />
              <circle cx="163" cy="152" r="3" fill={C.mint} />
              <circle cx="198" cy="152" r="3" fill={C.mint} />
              <path
                d="M57 171Q44 196 57 218M303 171Q316 196 303 218"
                fill="none"
                stroke="#6e6c84"
                strokeWidth="1.5"
              />
              <text
                x="180"
                y="299"
                textAnchor="middle"
                fill={C.ink}
                fontSize="12"
              >
                Another name is not another copy of the value.
              </text>
            </g>
          )}

          {(concept === "names" || concept === "assignment") && isRebind && (
            <g>
              <text
                x="180"
                y="29"
                textAnchor="middle"
                fontSize="12"
                fontWeight="700"
                letterSpacing=".8"
                fill={C.gold}
              >
                {traceStep >= 3
                  ? "ONE TAG MOVES. ONE STAYS."
                  : traceStep >= 2
                    ? "TWO TAGS. ONE SUITCASE."
                    : traceStep
                      ? "ONE TAG. ONE SUITCASE."
                      : "NO NAME TAGS ATTACHED YET."}
              </text>
              <text
                x="180"
                y="50"
                textAnchor="middle"
                fontSize="11"
                fill={C.muted}
              >
                Your selected example · step {traceStep} of {model.lines.length}
              </text>
              <RebindingLuggage
                pet={safePet}
                phase={traceStep}
                arrowId={`${id}-arrow`}
              />
            </g>
          )}
          {concept === "assignment" && !isRebind && (
            <g>
              <text
                x="180"
                y="29"
                textAnchor="middle"
                fontSize="12"
                fontWeight="700"
                letterSpacing=".8"
                fill={C.gold}
              >
                MOVE THE TAG, NOT THE LETTERS.
              </text>
              <text
                x="180"
                y="50"
                textAnchor="middle"
                fontSize="11"
                fill={C.muted}
              >
                A separate uppercase-text mini-example
              </text>
              <path
                d="M127 102Q112 133 96 148"
                fill="none"
                stroke={C.mint}
                strokeWidth="2"
                strokeDasharray="3 4"
                opacity=".4"
              />
              <Tag x={23} y={80} text="pet_name" width={111} ghost />
              <path
                d="M146 94Q180 64 212 91"
                fill="none"
                stroke={C.purple}
                strokeWidth="2.5"
                markerEnd={`url(#${id}-arrow)`}
              />
              <Tag x={223} y={80} text="pet_name" width={110} />
              <path
                d="M319 97Q337 136 288 149"
                fill="none"
                stroke={C.mint}
                strokeWidth="2.5"
              />
              <Suitcase x={89} y={198} text={safePet} small />
              <Suitcase
                x={273}
                y={198}
                text={safePet.toUpperCase()}
                color="#b9a1ce"
                small
              />
              <text
                x="89"
                y="133"
                textAnchor="middle"
                fill={C.muted}
                fontSize="11"
              >
                original text
              </text>
              <text
                x="273"
                y="133"
                textAnchor="middle"
                fill={C.muted}
                fontSize="11"
              >
                uppercase result
              </text>
              <path
                d="M138 273Q157 259 106 151"
                fill="none"
                stroke={C.gold}
                strokeWidth="2"
              />
              <Tag
                x={30}
                y={258}
                text="original_name"
                width={122}
                color={C.gold}
              />
              <text
                x="252"
                y="274"
                textAnchor="middle"
                fill={C.ink}
                fontSize="11"
              >
                This tag stays.
              </text>
              <path
                d="M208 270H165"
                fill="none"
                stroke={C.gold}
                strokeWidth="1.5"
              />
              <text
                x="180"
                y="310"
                textAnchor="middle"
                fill={C.muted}
                fontSize="11"
              >
                First get the result. Then reconnect the name.
              </text>
            </g>
          )}

          {concept === "output" && (
            <g>
              <text
                x="180"
                y="29"
                textAnchor="middle"
                fontSize="12"
                fontWeight="700"
                letterSpacing="1"
                fill={C.gold}
              >
                SAY IT OUT LOUD. KEEP THE VALUE.
              </text>
              <text
                x="79"
                y="60"
                textAnchor="middle"
                fill={C.mint}
                fontSize="11"
              >
                inside the program
              </text>
              <text
                x="266"
                y="60"
                textAnchor="middle"
                fill={C.gold}
                fontSize="11"
              >
                visible to a person
              </text>
              <path
                d="M161 73V268"
                stroke="#67657d"
                strokeWidth="1.5"
                strokeDasharray="4 6"
              />
              <g opacity={firstObject ? 1 : 0.3}>
                <Suitcase
                  x={78}
                  y={194}
                  text={firstObject?.value ?? "no value yet"}
                  small
                />
              </g>
              <path
                d="M169 135L196 128"
                fill="none"
                stroke={C.purple}
                strokeWidth="2"
                strokeDasharray="4 5"
                markerEnd={`url(#${id}-arrow)`}
                opacity={outputExists ? 1 : 0.3}
              />
              <g transform="translate(217 149) rotate(-15)">
                <path
                  d="M-14-8L38-30V30L-14 8Z"
                  fill="#dca56a"
                  stroke="#8f6849"
                  strokeWidth="2"
                />
                <ellipse
                  cx="38"
                  cy="0"
                  rx="11"
                  ry="31"
                  fill="#f1ce8f"
                  stroke="#8f6849"
                  strokeWidth="2"
                />
                <ellipse cx="38" cy="0" rx="6" ry="23" fill="#805a43" />
                <path
                  d="M-15-7H-27Q-33 0-27 7H-15"
                  fill="#d4c2a3"
                  stroke="#8d7d66"
                  strokeWidth="2"
                />
                <path
                  d="M-2 10L6 38L20 35L13 4"
                  fill="#c18c58"
                  stroke="#8f6849"
                  strokeWidth="2"
                />
                {outputExists && (
                  <g
                    fill="none"
                    stroke={C.gold}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  >
                    <path d="M58-12Q66 0 58 12" />
                    <path d="M71-21Q85 0 71 21" />
                  </g>
                )}
              </g>
              {outputExists ? (
                <g>
                  <path
                    d="M179 206H333V277L326 273L318 279L310 273L302 279L294 273L286 279L278 273L270 279L262 273L254 279L246 273L238 279L230 273L222 279L214 273L206 279L198 273L190 279L179 274V206Z"
                    fill={C.paper}
                    stroke="#c0a37c"
                  />
                  <path
                    d="M209 207L220 188L233 207"
                    fill={C.paper}
                    stroke="#c0a37c"
                  />
                  <path d="M210 207H232" stroke={C.paper} strokeWidth="3" />
                  {outputPreview.map((line, i) => (
                    <text
                      key={i}
                      x="256"
                      y={225 + i * 16}
                      textAnchor="middle"
                      fill={C.paperInk}
                      fontSize="10.5"
                    >
                      {line === "" ? "(blank line)" : short(line, 23)}
                    </text>
                  ))}
                  {state.output.length > 3 && (
                    <text
                      x="256"
                      y="271"
                      textAnchor="middle"
                      fontSize="9"
                      fill={C.paperInk}
                    >
                      + {state.output.length - 3} more lines
                    </text>
                  )}
                </g>
              ) : (
                <g>
                  <path
                    d="M191 229Q253 219 320 229"
                    stroke="#66647b"
                    fill="none"
                    strokeDasharray="3 5"
                  />
                  <text
                    x="256"
                    y="253"
                    textAnchor="middle"
                    fill={C.muted}
                    fontSize="12"
                  >
                    No print yet. Quiet outside.
                  </text>
                </g>
              )}
              <text
                x="78"
                y="268"
                textAnchor="middle"
                fill={C.mint}
                fontSize="11"
              >
                {firstObject ? "input value stays" : "no line has run yet"}
              </text>
              <text
                x="180"
                y="305"
                textAnchor="middle"
                fill={C.ink}
                fontSize="12"
              >
                {outputExists
                  ? "Displaying a value does not use it up."
                  : "Having a value is different from displaying it."}
              </text>
            </g>
          )}
        </svg>
      </div>
      <figcaption>
        <p style={{ margin: "8px 0 5px" }}>
          <strong style={{ color: C.ink }}>What this helps you see: </strong>
          {copy.helps}
        </p>
        <p style={{ margin: "5px 0 0" }}>
          <strong style={{ color: C.muted }}>Where the analogy stops: </strong>
          {copy.limit}
        </p>
      </figcaption>
    </figure>
  );
}
