import "./LetterButton.css";

interface LetterButtonProps {
  letter: string;
  active: boolean;
  loading?: boolean;
  shaking?: boolean;
  exhausted?: boolean;
  onClick: (letter: string) => void;
}

const LetterButton = ({ letter, active, loading, shaking, exhausted, onClick }: LetterButtonProps) => {
  const classes = [
    "letter-btn",
    active && "letter-btn--active",
    active && loading && !shaking && "letter-btn--loading",
    shaking && "letter-btn--shaking",
    exhausted && "letter-btn--exhausted",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      className={classes}
      onClick={() => onClick(letter)}
      disabled={loading || exhausted}
      aria-pressed={active}
      aria-busy={loading}
      aria-disabled={exhausted}
    >
      {letter.toUpperCase()}
    </button>
  );
};

export default LetterButton;
