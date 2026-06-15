import "./PageFooter.css";

interface FooterActionProps {
  onClick?: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}

export const FooterAction = ({ onClick, disabled, children }: FooterActionProps) => (
  <button className="footer-action" onClick={onClick} disabled={disabled}>
    {children}
  </button>
);

interface PageFooterProps {
  children: React.ReactNode;
}

const PageFooter = ({ children }: PageFooterProps) => (
  <footer className="page-footer">
    {children}
  </footer>
);

export default PageFooter;
