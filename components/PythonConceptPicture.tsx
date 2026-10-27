"use client";
import { useId } from "react";
import type {
  ConceptId,
  PythonExperiment,
  TraceStep,
} from "../lib/python-concepts";

const ink = "#f1eef8",
  muted = "#bab8ca",
  purple = "#bc9cff",
  green = "#78d8bd",
  gold = "#ffd08b";
const brief = (value: string, max = 17) =>
  Array.from(value).length > max
    ? Array.from(value)
        .slice(0, max - 1)
        .join("") + "…"
    : value;
function Pet({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`} aria-hidden="true">
      <ellipse cx="0" cy="0" rx="25" ry="22" fill="#d9ab7c" />
      <path
        d="M-18-16 Q-43-28-30 12 Q-18 19-17-5 M18-16 Q43-28 30 12 Q18 19 17-5"
        fill="#6d5040"
      />
      <ellipse cx="0" cy="10" rx="14" ry="10" fill="#f6dfc4" />
      <circle cx="-9" cy="-2" r="3" fill="#241d1a" />
      <circle cx="9" cy="-2" r="3" fill="#241d1a" />
      <path d="M-5 7 Q0 3 5 7 L0 12Z" fill="#241d1a" />
      <path
        d="M0 12 Q-5 18-9 12 M0 12 Q5 18 9 12"
        fill="none"
        stroke="#654533"
        strokeWidth="1.5"
      />
    </g>
  );
}
function Strip({
  text,
  x = 30,
  y = 96,
  indices = true,
}: {
  text: string;
  x?: number;
  y?: number;
  indices?: boolean;
}) {
  const letters = Array.from(text),
    shown = letters.slice(0, 8),
    width = 34;
  return (
    <g>
      {shown.map((character, i) => (
        <g key={i} transform={`translate(${x + i * width} ${y})`}>
          <rect width="31" height="38" rx="5" fill="#263e39" stroke={green} />
          <text x="15.5" y="25" textAnchor="middle" fontSize="18" fill={ink}>
            {character === " " ? "␠" : character === "\n" ? "↵" : character}
          </text>
          {indices && (
            <text
              x="15.5"
              y="55"
              textAnchor="middle"
              fontSize="12"
              fill={muted}
            >
              {i}
            </text>
          )}
        </g>
      ))}
      {!shown.length && (
        <text x={x} y={y + 25} fontSize="15" fill={green}>
          empty string: zero characters
        </text>
      )}
      {letters.length > 8 && (
        <text x={x} y={y + 81} fontSize="12" fill={muted}>
          {letters.length - 8} more characters not shown
        </text>
      )}
    </g>
  );
}
export default function PythonConceptPicture({
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
  const id = "picture-" + useId().replace(/:/g, "");
  const names = state.bindings;
  const desc: Record<ConceptId, string> = {
    program:
      "A source document has a moving execution marker. Each instruction is separate from the output screen.",
    values:
      "The pet is a real-world example; the program uses a text value for its name and an integer value for its age.",
    strings:
      "The name is drawn as indexed character cells. The unquoted age is an integer that can be added to, producing a new value.",
    names:
      "Name tags connect to value objects. Multiple tags targeting one object do not make multiple objects.",
    assignment:
      "Evaluate the right-hand integer first. Then attach the left-hand name to that object. Assignment is not an equality test.",
    output:
      "The print call sends characters to a separate terminal screen. Before a print instruction runs, the screen is empty.",
  };
  return (
    <figure className="python-concept-picture">
      <div
        className="drawn-scene-scroll"
        tabIndex={0}
        role="region"
        aria-label="Concept drawing; scroll sideways on a narrow screen"
      >
        <svg
          viewBox="0 0 360 290"
          role="img"
          aria-labelledby={`${id}-title ${id}-desc`}
          xmlns="http://www.w3.org/2000/svg"
          fontFamily="sans-serif"
        >
          <title id={`${id}-title`}>
            {(concept === "strings"
              ? "Strings and numbers"
              : concept[0].toUpperCase() + concept.slice(1)) +
              ": a drawn example"}
          </title>
          <desc id={`${id}-desc`}>{desc[concept]}</desc>
          <defs>
            <marker
              id={id}
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M0 0L10 5L0 10Z" fill={purple} />
            </marker>
          </defs>
          <rect
            x="1"
            y="1"
            width="358"
            height="288"
            rx="15"
            fill="#171b25"
            stroke="#454351"
          />
          {concept === "program" && (
            <g>
              <path
                d="M29 25H277L306 53V205H29Z"
                fill="#242b39"
                stroke="#697287"
              />
              <path d="M277 25V54H306" fill="none" stroke="#697287" />
              <text x="46" y="51" fill={muted} fontSize="12">
                PYTHON SOURCE · {model.lines.length} instructions
              </text>
              {model.lines.map((line, i) => (
                <g key={i} transform={`translate(43 ${68 + i * 25})`}>
                  {step === i + 1 && (
                    <rect
                      x="-8"
                      y="-15"
                      width="253"
                      height="23"
                      rx="4"
                      fill="#372b4b"
                    />
                  )}
                  <text
                    x="0"
                    fill={step === i + 1 ? purple : muted}
                    fontSize="12"
                  >
                    {i + 1}
                  </text>
                  <text
                    x="22"
                    fill={ink}
                    fontSize="11.5"
                    fontFamily="monospace"
                  >
                    {brief(line.map((t) => t.text).join(""), 31)}
                  </text>
                  {step === i + 1 && (
                    <path d="M-29-12L-14-5L-29 2Z" fill={gold} />
                  )}
                </g>
              ))}
              <path
                d="M171 206V230"
                stroke={purple}
                strokeWidth="2"
                markerEnd={`url(#${id})`}
              />
              <rect
                x="36"
                y="235"
                width="288"
                height="35"
                rx="6"
                fill="#10231f"
                stroke={green}
              />
              <text x="49" y="257" fill={green} fontSize="12">
                {state.output.length
                  ? brief(state.output.join(" · "), 37)
                  : "OUTPUT: nothing printed yet"}
              </text>
              <text x="40" y="192" fill={muted} fontSize="11">
                {step
                  ? `Marker: just completed line ${step}`
                  : "Marker: before the first instruction"}
              </text>
            </g>
          )}
          {concept === "values" && (
            <g>
              <Pet x={180} y={49} />
              <text x="180" y="90" fill={ink} textAnchor="middle" fontSize="14">
                Pet example
              </text>
              <path
                d="M160 102L92 131M200 102L268 131"
                stroke={purple}
                strokeWidth="2"
              />
              <rect
                x="22"
                y="138"
                width="151"
                height="96"
                rx="13"
                fill="#213e37"
                stroke={green}
              />
              <text
                x="97"
                y="160"
                fill={green}
                textAnchor="middle"
                fontSize="12"
              >
                str · text value
              </text>
              <text x="97" y="195" fill={ink} textAnchor="middle" fontSize="19">
                {brief(pet, 12)}
              </text>
              <circle cx="267" cy="184" r="49" fill="#473822" stroke={gold} />
              <text
                x="267"
                y="167"
                fill={gold}
                textAnchor="middle"
                fontSize="12"
              >
                int
              </text>
              <text
                x="267"
                y="201"
                fill={ink}
                textAnchor="middle"
                fontSize="29"
              >
                {age}
              </text>
              <text
                x="180"
                y="261"
                fill={muted}
                textAnchor="middle"
                fontSize="12"
              >
                The pet’s name is text. Its age is a quantity.
              </text>
            </g>
          )}
          {concept === "strings" && (
            <g>
              <text x="25" y="31" fill={green} fontSize="13">
                str · character positions start at 0
              </text>
              <Strip text={pet} x={30} y={49} />
              <line x1="24" y1="147" x2="336" y2="147" stroke="#454351" />
              <text x="25" y="172" fill={gold} fontSize="13">
                Numbers: calculate a new value
              </text>
              <circle cx="73" cy="215" r="30" fill="#473822" stroke={gold} />
              <text x="73" y="224" fill={ink} fontSize="25" textAnchor="middle">
                {age}
              </text>
              <text x="132" y="222" fill={ink} fontSize="22">
                + 1
              </text>
              <path
                d="M188 215H227"
                stroke={purple}
                strokeWidth="2"
                markerEnd={`url(#${id})`}
              />
              <circle cx="278" cy="215" r="30" fill="#473822" stroke={gold} />
              <text
                x="278"
                y="224"
                fill={ink}
                fontSize="25"
                textAnchor="middle"
              >
                {age + 1}
              </text>
              <text
                x="180"
                y="271"
                fill={muted}
                fontSize="12"
                textAnchor="middle"
              >
                Text cells are characters, not editable memory slots.
              </text>
            </g>
          )}
          {concept === "names" && (
            <g>
              <text x="24" y="29" fill={purple} fontSize="13">
                NAMES
              </text>
              <text x="215" y="29" fill={green} fontSize="13">
                OBJECTS
              </text>
              {state.objects.map((object, i) => {
                const y = 66 + i * 72;
                return (
                  <g key={object.id}>
                    <rect
                      x="211"
                      y={y - 25}
                      width="126"
                      height="56"
                      rx="18"
                      fill={object.type === "str" ? "#213e37" : "#473822"}
                      stroke={object.type === "str" ? green : gold}
                    />
                    <text
                      x="274"
                      y={y - 7}
                      fill={muted}
                      fontSize="10"
                      textAnchor="middle"
                    >
                      {object.id} · {object.type}
                    </text>
                    <text
                      x="274"
                      y={y + 15}
                      fill={ink}
                      fontSize="16"
                      textAnchor="middle"
                    >
                      {brief(String(object.value), 11)}
                    </text>
                  </g>
                );
              })}
              {names.map((binding, i) => {
                const y = 64 + i * 61;
                const oi = state.objects.findIndex(
                  (o) => o.id === binding.object,
                );
                return (
                  <g key={binding.name}>
                    <path
                      d={`M24 ${y - 17}H126L137 ${y}L126 ${y + 17}H24Z`}
                      fill="#352a4b"
                      stroke={purple}
                    />
                    <circle cx="124" cy={y} r="3" fill={purple} />
                    <text x="31" y={y + 4} fill={ink} fontSize="11">
                      {brief(binding.name, 15)}
                    </text>
                    <path
                      d={`M139 ${y}C169 ${y} 179 ${66 + oi * 72} 208 ${66 + oi * 72}`}
                      fill="none"
                      stroke={purple}
                      strokeWidth="2"
                      markerEnd={`url(#${id})`}
                    />
                  </g>
                );
              })}
              {!names.length && (
                <>
                  <path
                    d="M24 69H126L137 86L126 103H24Z"
                    fill="none"
                    stroke={purple}
                    strokeDasharray="4 4"
                  />
                  <text x="24" y="140" fill={muted} fontSize="13">
                    No names are bound yet.
                  </text>
                  <text x="24" y="163" fill={muted} fontSize="13">
                    Advance one instruction below.
                  </text>
                </>
              )}
              <text
                x="180"
                y="270"
                fill={muted}
                fontSize="12"
                textAnchor="middle"
              >
                Each arrow means “refers to”, not “contains”.
              </text>
            </g>
          )}
          {concept === "assignment" && (
            <g>
              <text
                x="180"
                y="40"
                fill={ink}
                textAnchor="middle"
                fontFamily="monospace"
                fontSize="22"
              >
                pet_age = {age}
              </text>
              <circle cx="278" cy="130" r="42" fill="#473822" stroke={gold} />
              <text
                x="278"
                y="118"
                fill={gold}
                textAnchor="middle"
                fontSize="11"
              >
                int object
              </text>
              <text
                x="278"
                y="148"
                fill={ink}
                textAnchor="middle"
                fontSize="30"
              >
                {age}
              </text>
              <text x="130" y="78" fill={gold} fontSize="12">
                1. Evaluate right
              </text>
              <path
                d="M281 51V84"
                fill="none"
                stroke={purple}
                strokeWidth="2"
                markerEnd={`url(#${id})`}
              />
              <path
                d="M25 112H134L152 130L134 148H25Z"
                fill="#352a4b"
                stroke={purple}
              />
              <text x="40" y="135" fill={ink} fontSize="17">
                pet_age
              </text>
              <path
                d="M155 130H231"
                fill="none"
                stroke={purple}
                strokeWidth="2"
                markerEnd={`url(#${id})`}
              />
              <text x="26" y="189" fill={purple} fontSize="13">
                2. Bind the name to that object
              </text>
              <path d="M41 213H319" stroke="#454351" />
              <text
                x="180"
                y="243"
                fill={muted}
                textAnchor="middle"
                fontSize="13"
              >
                = assigns a reference
              </text>
              <text
                x="180"
                y="265"
                fill={muted}
                textAnchor="middle"
                fontSize="13"
              >
                It does not ask “are these equal?”
              </text>
            </g>
          )}
          {concept === "output" && (
            <g>
              <path
                d="M32 29H110L119 46L110 63H32Z"
                fill="#352a4b"
                stroke={purple}
              />
              <text x="45" y="51" fill={ink} fontSize="14">
                print(…)
              </text>
              <path
                d="M124 46H185Q204 46 204 69V85"
                fill="none"
                stroke={purple}
                strokeWidth="2"
                markerEnd={`url(#${id})`}
              />
              <text x="144" y="33" fill={muted} fontSize="11">
                writes characters
              </text>
              <rect
                x="27"
                y="92"
                width="306"
                height="144"
                rx="12"
                fill="#233127"
                stroke={green}
                strokeWidth="2"
              />
              <rect
                x="38"
                y="104"
                width="284"
                height="117"
                rx="5"
                fill="#101a15"
              />
              <circle cx="48" cy="111" r="2" fill={green} />
              <text x="59" y="115" fill={green} fontSize="10">
                OUTPUT · after line {step}
              </text>
              {(state.output.length
                ? state.output.slice(0, 4)
                : ["(nothing printed yet)"]
              ).map((line, i) => (
                <text
                  key={i}
                  x="49"
                  y={144 + i * 19}
                  fill={ink}
                  fontFamily="monospace"
                  fontSize="12"
                >
                  {brief(line, 34)}
                </text>
              ))}
              <path
                d="M160 237V253H132M200 237V253H228"
                stroke={green}
                fill="none"
                strokeWidth="3"
              />
              <text
                x="180"
                y="276"
                fill={muted}
                textAnchor="middle"
                fontSize="12"
              >
                Output is separate from names and objects.
              </text>
            </g>
          )}
        </svg>
      </div>
      <figcaption>
        {concept === "names" || concept === "output" || concept === "program"
          ? "This drawing changes as you step through the code below."
          : "This illustration uses the pet name and age in your experiment."}
      </figcaption>
    </figure>
  );
}
