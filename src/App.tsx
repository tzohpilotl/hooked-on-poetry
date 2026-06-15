import { useCallback, useEffect, useState } from "react";
import PoemView from "./views/PoemView";
import AuthorView from "./views/AuthorView";
import "./App.css";

const API = "https://poetrydb.org";
const SHAKE_DURATION = 600;

interface PoemData {
  title: string;
  author: string;
  lines: string[];
  linecount: number;
}

type View = "poem" | "author";

const App = () => {
  const [view, setView] = useState<View>("poem");
  const [poem, setPoem] = useState<PoemData | null>(null);
  const [authors, setAuthors] = useState<string[]>([]);
  const [authorsLoading, setAuthorsLoading] = useState(false);
  const [emptyLetters, setEmptyLetters] = useState<Set<string>>(new Set());
  const [shakingLetter, setShakingLetter] = useState<string | null>(null);
  const [poemLoading, setPoemLoading] = useState(false);
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [selectedAuthor, setSelectedAuthor] = useState<string | null>(null);

  const fetchRandomPoem = useCallback(() => {
    setPoemLoading(true);
    fetch(`${API}/random/1`)
      .then((r) => r.json())
      .then(([p]: PoemData[]) => setPoem(p))
      .catch(console.error)
      .finally(() => setPoemLoading(false));
  }, []);

  const fetchAuthorsByLetter = useCallback((letter: string) => {
    setSelectedLetter(letter);
    setSelectedAuthor(null);
    setAuthors([]);
    setAuthorsLoading(true);
    fetch(`${API}/author/${letter}/author`)
      .then((r) => r.json())
      .then((data: { author: string }[]) => {
        const unique = Array.from(
          new Set(data.map((d) => d.author))
        ).filter((a) => a[0].toLowerCase() === letter);

        if (unique.length === 0) {
          setEmptyLetters((prev) => new Set([...prev, letter]));
          setShakingLetter(letter);
          setTimeout(() => {
            setShakingLetter(null);
            setSelectedLetter((prev) => (prev === letter ? null : prev));
          }, SHAKE_DURATION);
        } else {
          setAuthors(unique);
          setSelectedAuthor(unique[0]);
        }
      })
      .catch(console.error)
      .finally(() => setAuthorsLoading(false));
  }, []);

  const handleReadPoem = useCallback(() => {
    if (!selectedAuthor) return;
    setPoemLoading(true);
    fetch(`${API}/author/${encodeURIComponent(selectedAuthor)}`)
      .then((r) => r.json())
      .then((poems: PoemData[]) => {
        const pick = poems[Math.floor(Math.random() * poems.length)];
        setPoem(pick);
        setView("poem");
      })
      .catch(console.error)
      .finally(() => setPoemLoading(false));
  }, [selectedAuthor]);

  useEffect(fetchRandomPoem, [fetchRandomPoem]);

  return (
    <main id="app">
      {view === "poem" ? (
        <PoemView poem={poem} poemLoading={poemLoading} onRandomPoem={fetchRandomPoem} onBrowseAuthors={() => setView("author")} />
      ) : (
        <AuthorView
          authors={authors}
          authorsLoading={authorsLoading}
          poemLoading={poemLoading}
          emptyLetters={emptyLetters}
          shakingLetter={shakingLetter}
          selectedLetter={selectedLetter}
          selectedAuthor={selectedAuthor}
          onLetterSelect={fetchAuthorsByLetter}
          onAuthorSelect={setSelectedAuthor}
          onReadPoem={handleReadPoem}
        />
      )}
    </main>
  );
};

export default App;
