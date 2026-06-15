import Poem from "../components/Poem";
import Logo from "../components/Logo";
import PageFooter, { FooterAction } from "../components/PageFooter";
import "./PoemView.css";

interface PoemData {
  title: string;
  author: string;
  lines: string[];
  linecount: number;
}

interface PoemViewProps {
  poem: PoemData | null;
  poemLoading: boolean;
  onRandomPoem: () => void;
  onBrowseAuthors: () => void;
}

const PoemView = ({ poem, poemLoading, onRandomPoem, onBrowseAuthors }: PoemViewProps) => (
  <section className="poem-view">
    <Logo />
    <div className="poem-view__content">
      {poem ? <Poem {...poem} /> : <p className="poem-view__placeholder">Loading poem…</p>}
    </div>
    <PageFooter>
      <FooterAction onClick={onRandomPoem} disabled={poemLoading}>
        {poemLoading ? "Loading poem…" : "Random Poem"}
      </FooterAction>
      <FooterAction onClick={onBrowseAuthors}>
        Browse by Author
      </FooterAction>
    </PageFooter>
  </section>
);

export default PoemView;
