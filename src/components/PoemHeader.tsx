import Logo from "./Logo";
import "./PoemHeader.css";

interface PoemHeaderProps {
  title: string;
  author: string;
  linecount: number;
  compact?: boolean;
}

const PoemHeader = ({ title, author, linecount, compact = false }: PoemHeaderProps) => {
  const readingTime = Math.max(1, Math.round((linecount * 6) / 200));

  return (
    <header className={`poem-header${compact ? " poem-header--compact" : ""}`}>
      {compact ? (
        <img
          src={`${import.meta.env.BASE_URL}favicon.svg`}
          alt="hooked on poetry"
          className="poem-header__favicon"
        />
      ) : (
        <Logo />
      )}
      <div className="poem-header__poem">
        <h2 className="poem-header__title">{title}</h2>
        <p className="poem-header__byline">
          {author}
          <span className="poem-header__info"> · {linecount} lines · {readingTime} min read</span>
        </p>
        <p className="poem-header__reading-time">{readingTime} min read</p>
      </div>
    </header>
  );
};

export default PoemHeader;
