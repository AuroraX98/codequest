import styles from "./CssLessonPicture.module.css";

type PictureKind = "spacing" | "selectors" | "grid";
type GridAxis = "row" | "column";

function ButtonSpacing() {
  return (
    <figure className={styles.picture} data-css-picture="spacing">
      <figcaption>Space inside and outside a button</figcaption>
      <div className={styles.spacingFrame} aria-hidden="true">
        <div className={styles.marginSample}>
          <button type="button" disabled className={styles.sampleButton}><span>Start</span></button>
        </div>
      </div>
      <ul className={styles.legend}>
        <li><i className={styles.paddingKey} aria-hidden="true" /><span><b>Padding</b> adds 8px above and below the text and 14px on each side.</span></li>
        <li><i className={styles.marginKey} aria-hidden="true" /><span><b>Margin</b> adds 6px outside the button’s border on every side.</span></li>
      </ul>
    </figure>
  );
}

function SelectorMatches() {
  return (
    <figure className={styles.picture} data-css-picture="selectors">
      <figcaption>Which parts of the page change?</figcaption>
      <p className={styles.intro}>The button and link both have the class <code>action</code>. Only the button has the ID <code>start</code>.</p>
      <dl className={styles.selectorList}>
        <div>
          <dt><code>button</code></dt>
          <dd><b>Button</b><span>Uses the same font as its parent.</span></dd>
        </div>
        <div>
          <dt><code>.action</code></dt>
          <dd><b>Button and link</b><span>Their text turns navy.</span></dd>
        </div>
        <div>
          <dt><code>#start</code></dt>
          <dd><b>Button</b><span>Gets 12px of padding on every side.</span></dd>
        </div>
      </dl>
    </figure>
  );
}

const scenes = [
  { name: "Hills", style: styles.hills },
  { name: "Sea", style: styles.sea },
  { name: "Forest", style: styles.forest },
  { name: "Sunset", style: styles.sunset },
];

function GalleryGrid({ axis }: { axis?: GridAxis }) {
  return (
    <figure className={styles.picture} data-css-picture="grid" data-axis={axis}>
      <figcaption>{axis === "row" ? "Follow the first row across" : axis === "column" ? "Follow the first column down" : "Rows go across. Columns go down."}</figcaption>
      <div className={styles.gallery} aria-hidden="true">
        {scenes.map((scene, index) => (
          <span key={scene.name} className={styles.tile} data-highlighted={(axis === "row" && index < 3) || (axis === "column" && (index === 0 || index === 3)) || undefined}>
            <span className={scene.style} /><b>{scene.name}</b>
          </span>
        ))}
      </div>
      <p className={styles.gridNote}>{axis === "row" ? "Hills, Sea and Forest sit side by side in row 1." : axis === "column" ? "Hills is above Sunset. Both sit in column 1." : "Three pictures fill the first row. The fourth starts a new row under Hills."}</p>
    </figure>
  );
}

export default function CssLessonPicture({ kind, axis }: { kind: PictureKind; axis?: GridAxis }) {
  if (kind === "spacing") return <ButtonSpacing />;
  if (kind === "selectors") return <SelectorMatches />;
  return <GalleryGrid axis={axis} />;
}
