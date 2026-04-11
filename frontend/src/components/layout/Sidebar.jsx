import { Link, useLocation } from "react-router-dom";
import GlassyCalendarIcon from "../ui/GlassyCalendarIcon";

const navItems = [
  { path: "/dashboard", label: "Dashboard", icon: DashboardIcon },
  { path: "/analytics", label: "Analytics", icon: AnalyticsIcon },
  { path: "/budget", label: "Budget", icon: BudgetIcon },
  { path: "/transactions", label: "Transactions", icon: TransactionsIcon },
  { path: "/goals", label: "Goals", icon: GoalsIcon },
  { path: "/planner", label: "Planner", icon: PlannerIcon },
  { path: "/lab", label: "Money Lab", icon: LabIcon },
  { path: "/leaderboard", label: "Leaderboard", icon: LeaderboardIcon },
  { path: "/settings", label: "Settings", icon: SettingsIcon },
  { path: "/profile", label: "Profile", icon: ProfileIcon }
];

export default function Sidebar() {
  const location = useLocation();

  const linkStyle = (path) => ({
    padding: "12px 14px 12px 16px",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "8px",
    background:
      location.pathname === path
        ? "color-mix(in oklab, var(--accent-surface) 85%, transparent)"
        : "color-mix(in oklab, var(--bg-card) 55%, transparent)",
    color: "var(--text-primary)",
    border:
      location.pathname === path
        ? "1px solid color-mix(in oklab, var(--accent) 28%, var(--border-color))"
        : "1px solid color-mix(in oklab, var(--border-color) 45%, transparent)",
    borderLeft:
      location.pathname === path
        ? "3px solid var(--accent)"
        : "3px solid transparent",
    fontWeight: location.pathname === path ? 600 : 500,
  });

  return (
    <div
      className="w-64 p-6 app-sidebar"
      style={{
        background: "color-mix(in oklab, var(--bg-card) 76%, transparent)",
        borderRight: "1px solid color-mix(in oklab, var(--border-color) 70%, transparent)"
      }}
    >
      <h2
        className="text-sm font-medium mb-6"
        style={{ color: "var(--text-secondary)" }}
      >
        MENU
      </h2>

      {navItems.map(({ path, label, icon: Icon }) => (
        <Link key={path} to={path} style={linkStyle(path)}>
          <span className="sidebar-nav__icon" aria-hidden="true">
            <Icon />
          </span>
          <span>{label}</span>
        </Link>
      ))}
    </div>
  );
}

function PlannerIcon() {
  return <GlassyCalendarIcon size={18} className="glassy-cal--tiny" />;
}

function DashboardIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="8" height="8" rx="2" />
      <rect x="13" y="3" width="8" height="5" rx="2" />
      <rect x="13" y="10" width="8" height="11" rx="2" />
      <rect x="3" y="13" width="8" height="8" rx="2" />
    </svg>
  );
}

function AnalyticsIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19V5" />
      <path d="M10 19v-8" />
      <path d="M16 19v-4" />
      <path d="M22 19v-12" />
    </svg>
  );
}

function BudgetIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2.5" y="5" width="19" height="14" rx="3" />
      <path d="M16 12h.01" />
      <path d="M2.5 9h19" />
    </svg>
  );
}

function TransactionsIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 7h11" />
      <path d="M7 12h11" />
      <path d="M7 17h11" />
      <path d="M3 7h.01" />
      <path d="M3 12h.01" />
      <path d="M3 17h.01" />
    </svg>
  );
}

function GoalsIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3a9 9 0 1 0 9 9" />
      <path d="M12 12 20 4" />
      <path d="M16 4h4v4" />
    </svg>
  );
}

function LabIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 3v4l-5 9a3 3 0 0 0 2.6 4.5h8.8A3 3 0 0 0 19 16l-5-9V3" />
      <path d="M8 3h8" />
      <path d="M8.5 13h7" />
    </svg>
  );
}

function LeaderboardIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 20V10" />
      <path d="M12 20V4" />
      <path d="M17 20v-7" />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1 1.54V21a2 2 0 1 1-4 0v-.09a1.7 1.7 0 0 0-1-1.54 1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-1.54-1H3a2 2 0 1 1 0-4h.09a1.7 1.7 0 0 0 1.54-1 1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-1.54V3a2 2 0 1 1 4 0v.09a1.7 1.7 0 0 0 1 1.54 1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.7 1.7 0 0 0 19.4 9c.22.5.9 1 1.54 1H21a2 2 0 1 1 0 4h-.09c-.64 0-1.32.5-1.54 1Z" />
    </svg>
  );
}

function ProfileIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21a8 8 0 0 0-16 0" />
      <circle cx="12" cy="8" r="4" />
    </svg>
  );
}
