import { Link } from "react-router-dom";

export default function AuthShell({
  title,
  description,
  eyebrow = "Secure access",
  backTo = "/",
  backLabel = "Back to home",
  footer,
  children,
}) {
  return (
    <div className="auth-page">
      <div className="auth-page__glow auth-page__glow--one" />
      <div className="auth-page__glow auth-page__glow--two" />

      <div className="auth-page__layout">
        <section className="auth-page__intro">
          <div className="auth-page__brand">
            <span className="auth-page__brand-dot" />
            <span>Smart Expense Tracker</span>
          </div>

          <p className="auth-page__eyebrow">{eyebrow}</p>
          <h1 className="auth-page__headline">Private money workflows, without theme glitches.</h1>
          <p className="auth-page__copy">
            One dark workspace for planning, tracking, analytics, and fast daily decisions.
          </p>

          <div className="auth-page__bullets">
            <span>Budget clarity</span>
            <span>Privacy controls</span>
            <span>Fast daily flow</span>
          </div>
        </section>

        <section className="auth-page__panel">
          <Link to={backTo} className="auth-page__back">
            {backLabel}
          </Link>

          <div className="auth-page__panel-head">
            <p className="auth-page__panel-eyebrow">{eyebrow}</p>
            <h2>{title}</h2>
            {description ? <p>{description}</p> : null}
          </div>

          {children}
          {footer ? <div className="auth-page__footer">{footer}</div> : null}
        </section>
      </div>
    </div>
  );
}
