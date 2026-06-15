import "./Poem.css";

interface PoemProps {
  title: string;
  author: string;
  lines: string[];
  linecount: number;
}

const Poem = ({ title, author, lines }: PoemProps) => (
  <article className="poem">
    <h2 className="poem__title">{title}</h2>
    <p className="poem__author">{author}</p>
    <div className="poem__body">
      {lines.map((line, i) => (
        <p key={line + i}>{line || " "}</p>
      ))}
    </div>
  </article>
);

export default Poem;
