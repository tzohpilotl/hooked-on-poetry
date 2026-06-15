import "./Button.css";

interface ButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  fullWidth?: boolean;
}

const Button = ({ onClick, disabled, children, fullWidth }: ButtonProps) => (
  <button
    className={`btn${fullWidth ? " btn--full" : ""}`}
    onClick={onClick}
    disabled={disabled}
  >
    {children}
  </button>
);

export default Button;
