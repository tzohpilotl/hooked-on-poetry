import { useEffect, useState } from "react";
import Poem from "../components/Poem";
import PoemHeader from "../components/PoemHeader";
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

const PoemView = ({ poem, poemLoading, onRandomPoem, onBrowseAuthors }: PoemViewProps) => {
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    setExpanded(false);
  }, [poem?.title]);

  return (
    <section className="poem-view">
      {poem ? (
        <PoemHeader
          title={poem.title}
          author={poem.author}
          linecount={poem.linecount}
          compact={expanded}
        />
      ) : (
        <PoemHeader title="" author="" linecount={0} />
      )}
      <div className="poem-view__content">
        {poem ? (
          <Poem
            lines={poem.lines}
            linecount={poem.linecount}
            expanded={expanded}
            onToggle={() => setExpanded((e) => !e)}
          />
        ) : (
          <p className="poem-view__placeholder">Loading poem…</p>
        )}
      </div>
      <PageFooter>
        <FooterAction onClick={onRandomPoem} disabled={poemLoading}>
          {poemLoading ? "Loading poem…" : "Next Random Poem"}
        </FooterAction>
        <FooterAction onClick={onBrowseAuthors}>
          Browse by Author
        </FooterAction>
      </PageFooter>
    </section>
  );
};

export default PoemView;
