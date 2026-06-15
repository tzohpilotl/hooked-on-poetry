import { useState, useRef, useEffect } from "react";
import "./AuthorDropdown.css";

interface AuthorDropdownProps {
  authors: string[];
  selected: string | null;
  onSelect: (author: string) => void;
  disabled?: boolean;
}

const ChevronDown = () => (
  <svg width="12" height="8" viewBox="0 0 12 8" fill="none" aria-hidden>
    <path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const AuthorDropdown = ({ authors, selected, onSelect, disabled }: AuthorDropdownProps) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const toggle = () => {
    if (!disabled) setOpen((o) => !o);
  };

  const handleSelect = (author: string) => {
    onSelect(author);
    setOpen(false);
  };

  return (
    <div
      className={`author-dropdown${disabled ? " author-dropdown--disabled" : ""}${open ? " author-dropdown--open" : ""}`}
      ref={containerRef}
    >
      <div className="author-dropdown__field" onClick={toggle} role="button" aria-expanded={open} aria-haspopup="listbox">
        <span className="author-dropdown__value">{selected ?? "Author"}</span>
        <span className="author-dropdown__expand">
          <ChevronDown />
        </span>
      </div>
      {open && authors.length > 0 && (
        <ul className="author-dropdown__list" role="listbox">
          {authors.map((author) => (
            <li
              key={author}
              className={`author-dropdown__option${author === selected ? " author-dropdown__option--selected" : ""}`}
              role="option"
              aria-selected={author === selected}
              onClick={() => handleSelect(author)}
            >
              {author}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AuthorDropdown;
