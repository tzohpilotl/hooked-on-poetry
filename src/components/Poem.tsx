import "./Poem.css";

interface PoemProps {
  lines: string[];
  linecount: number;
  expanded: boolean;
  onToggle: () => void;
}

const COLLAPSE_THRESHOLD = 20;

const Poem = ({ lines, linecount, expanded, onToggle }: PoemProps) => {
  const isLong = linecount > COLLAPSE_THRESHOLD;

  return (
    <article className="poem">
      <div
        className={`poem__body-wrap${isLong && !expanded ? " poem__body-wrap--collapsed" : ""}`}
      >
        <div className="poem__body">
          {lines.map((line, i) => (
            <p key={line + i}>{line || " "}</p>
          ))}
        </div>
        {isLong && !expanded && <div className="poem__fade" />}
      </div>
      {isLong && (
        <button className="poem__expand" onClick={onToggle}>
          {expanded ? "Read less" : "Read this poem…"}
        </button>
      )}
    </article>
  );
};

export default Poem;
