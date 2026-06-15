import LetterButton from "../components/LetterButton";
import AuthorDropdown from "../components/AuthorDropdown";
import Logo from "../components/Logo";
import PageFooter, { FooterAction } from "../components/PageFooter";
import "./AuthorView.css";

const LETTERS = Array.from({ length: 26 }, (_, i) => String.fromCharCode(97 + i));

interface AuthorViewProps {
  authors: string[];
  authorsLoading: boolean;
  poemLoading: boolean;
  emptyLetters: Set<string>;
  shakingLetter: string | null;
  selectedLetter: string | null;
  selectedAuthor: string | null;
  onLetterSelect: (letter: string) => void;
  onAuthorSelect: (author: string) => void;
  onReadPoem: () => void;
}

const AuthorView = ({
  authors,
  authorsLoading,
  poemLoading,
  emptyLetters,
  shakingLetter,
  selectedLetter,
  selectedAuthor,
  onLetterSelect,
  onAuthorSelect,
  onReadPoem,
}: AuthorViewProps) => {
  const isEmpty = selectedLetter !== null && emptyLetters.has(selectedLetter);

  return (
  <section className="author-view">
    <Logo />

    <div className="letter-grid">
      {LETTERS.map((letter) => (
        <LetterButton
          key={letter}
          letter={letter}
          active={letter === selectedLetter}
          loading={authorsLoading}
          shaking={letter === shakingLetter}
          exhausted={emptyLetters.has(letter)}
          onClick={onLetterSelect}
        />
      ))}
    </div>

    <div className="author-section">
      <h2 className="author-section__title">Authors</h2>
      {authorsLoading ? (
        <p className="author-section__subtitle">
          <span className="authors-spinner" aria-hidden />
          Loading authors…
        </p>
      ) : isEmpty ? (
        <p className="author-section__subtitle author-section__subtitle--empty">
          No authors found for "{selectedLetter!.toUpperCase()}"
        </p>
      ) : (
        <p className="author-section__subtitle">Select an Initial</p>
      )}
      <AuthorDropdown
        authors={authors}
        selected={selectedAuthor}
        onSelect={onAuthorSelect}
        disabled={authorsLoading || isEmpty || !selectedLetter || authors.length === 0}
      />
    </div>

    <PageFooter>
      <FooterAction onClick={onReadPoem} disabled={!selectedAuthor || poemLoading}>
        {poemLoading ? "Loading poem…" : "Read Another Poem"}
      </FooterAction>
    </PageFooter>
  </section>
  );
};

export default AuthorView;
