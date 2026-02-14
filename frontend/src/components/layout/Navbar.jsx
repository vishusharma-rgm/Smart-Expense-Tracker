import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";

export default function Navbar() {
  const { dark, setDark } = useTheme();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const isDemo = localStorage.getItem("demo_mode") === "true";
  const [privacyOn, setPrivacyOn] = useState(() => {
    const stored = localStorage.getItem("app_settings");
    if (!stored) return false;
    try {
      const parsed = JSON.parse(stored);
      return !!(parsed.privacyHideAmounts || parsed.privacyBlurMode);
    } catch {
      return false;
    }
  });

  useEffect(() => {
    document.body.classList.toggle("privacy-hide", !!privacyOn);
    document.body.classList.toggle("privacy-blur", !!privacyOn);

    const stored = localStorage.getItem("app_settings");
    let parsed = {};
    if (stored) {
      try {
        parsed = JSON.parse(stored);
      } catch {
        parsed = {};
      }
    }
    localStorage.setItem(
      "app_settings",
      JSON.stringify({
        ...parsed,
        privacyHideAmounts: !!privacyOn,
        privacyBlurMode: !!privacyOn
      })
    );
  }, [privacyOn]);

  const handlePrivacyToggle = () => {
    if (privacyOn) {
      const stored = JSON.parse(localStorage.getItem("app_settings") || "{}");
      const pass = stored.privacyPass || "";
      if (pass) {
        const entered = window.prompt("Enter privacy passcode to turn off:");
        if (entered !== pass) {
          alert("Incorrect passcode.");
          return;
        }
      }
    }
    setPrivacyOn((v) => !v);
  };

  return (
    <div className="flex justify-between items-center p-6 border-b surface-muted"
      style={{ borderColor: "var(--border-color)" }}
    >
      <h1 className="text-xl font-semibold text-primary brand-title">
        Smart Expense Tracker
      </h1>

      <div className="flex items-center gap-3">
        {isDemo && (
          <span className="demo-badge">Demo</span>
        )}
        {isDemo && (
          <button
            onClick={() => {
              localStorage.removeItem("demo_mode");
              logout();
              navigate("/");
            }}
            className="btn-soft px-3 py-2 text-sm"
          >
            Exit Demo
          </button>
        )}
        <button
          onClick={handlePrivacyToggle}
          className="btn-privacy transition flex items-center gap-2"
        >
          <span className="inline-flex items-center justify-center btn-icon">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </span>
          <span className="tracking-wide">Privacy Mode</span>
          {privacyOn ? <span className="privacy-pill">On</span> : null}
        </button>

        <button
          onClick={() => setDark(!dark)}
          className="btn-primary btn-premium btn-luxe transition flex items-center gap-2"
        >
          <span className="inline-flex items-center justify-center btn-icon">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8Z" />
            </svg>
          </span>
          <span className="tracking-wide">{dark ? "Light Mode" : "Dark Mode"}</span>
        </button>
      </div>
    </div>
  );
}
