import { Link, useLocation } from "react-router-dom";
import GlassyCalendarIcon from "../ui/GlassyCalendarIcon";

export default function Sidebar() {
  const location = useLocation();

  const linkStyle = (path) => ({
    padding: "10px 16px",
    borderRadius: "8px",
    display: "block",
    marginBottom: "6px",
    background:
      location.pathname === path
        ? "var(--accent-surface)"
        : "transparent",
    color: "var(--text-primary)",
    border:
      location.pathname === path
        ? "1px solid color-mix(in oklab, var(--accent) 40%, transparent)"
        : "1px solid transparent",
  });

  return (
    <div
      className="w-64 p-6"
      style={{
        background: "var(--bg-card)",
        borderRight: "1px solid var(--border-color)"
      }}
    >
      <h2
        className="text-sm font-medium mb-6"
        style={{ color: "var(--text-secondary)" }}
      >
        MENU
      </h2>

      <Link to="/dashboard" style={linkStyle("/dashboard")}>
        Dashboard
      </Link>

      <Link to="/analytics" style={linkStyle("/analytics")}>
        Analytics
      </Link>

      <Link to="/budget" style={linkStyle("/budget")}>
        Budget
      </Link>

      <Link to="/transactions" style={linkStyle("/transactions")}>
        Transactions
      </Link>

      <Link to="/goals" style={linkStyle("/goals")}>
        Goals
      </Link>

      <Link to="/planner" style={linkStyle("/planner")}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
          <GlassyCalendarIcon size={20} className="glassy-cal--tiny" />
          Planner
        </span>
      </Link>

      <Link to="/lab" style={linkStyle("/lab")}>
        Money Lab
      </Link>

      <Link to="/leaderboard" style={linkStyle("/leaderboard")}>
        Leaderboard
      </Link>

      <Link to="/settings" style={linkStyle("/settings")}>
        Settings
      </Link>

      <Link to="/profile" style={linkStyle("/profile")}>
        Profile
      </Link>
    </div>
  );
}
