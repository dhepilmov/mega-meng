// DUMMY BUTTON — IMPORT SECTION
import React from "react";
import { useNavigate } from "react-router-dom";

// DUMMY BUTTON — LOGIC SECTION
type DummyButtonProps = {
  /** Route path to navigate using react-router (recommended) */
  to?: string;
  /** Absolute/relative URL fallback (uses window.location.assign) */
  href?: string;
  /** Extra Tailwind classes if you insist on tinkering */
  className?: string;
  /** Accessible label/title */
  label?: string;
};

/**
 * A round yellow "maintenance" button with a wrench icon.
 * Click → navigates to /yuzha (or provided target).
 */
const DummyButton: React.FC<DummyButtonProps> = ({
  to = "/yuzha",
  href,
  className = "",
  label = "Open Yuzha",
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (to) {
      navigate(to);
    } else if (href) {
      window.location.assign(href);
    }
  };

  // DUMMY BUTTON — UI SECTION
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={handleClick}
      className={[
        "w-24 h-24 mx-auto bg-yellow-500 rounded-full",
        "flex items-center justify-center",
        "text-gray-900 text-4xl font-bold shadow-lg",
        "hover:bg-yellow-400 active:scale-95 transition",
        className,
      ].join(" ")}
    >
      {/* Wrench icon to match the maintenance screen */}
      <span role="img" aria-hidden="true">🔧</span>
    </button>
  );
};

export default DummyButton;
export { DummyButton };
