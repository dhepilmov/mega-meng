// DUMMY BUTTON — IMPORT SECTION
import React from "react";
import { useNavigate } from "react-router-dom";

// DUMMY BUTTON — LOGIC SECTION
type DummyButtonProps = {
  to?: string;        // react-router path (preferred)
  href?: string;      // absolute/relative URL fallback
  className?: string; // extra Tailwind classes
  label?: string;     // accessible label/title
};

const DummyButton: React.FC<DummyButtonProps> = ({
  to = "/yuzha",
  href,
  className = "",
  label = "Open Yuzha",
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (to) navigate(to);
    else if (href) window.location.assign(href);
  };

  // DUMMY BUTTON — UI SECTION
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={handleClick}
      className={[
        "w-24 h-24 mx-auto rounded-full",
        "bg-yellow-500 text-gray-900",
        "flex items-center justify-center",
        "text-4xl font-bold shadow-lg",
        "transition hover:bg-yellow-400 active:scale-95",
        "focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:ring-offset-2 focus:ring-offset-gray-900",
        className,
      ].join(" ")}
    >
      <span role="img" aria-hidden="true">🔧</span>
    </button>
  );
};

export default DummyButton;
export { DummyButton };
