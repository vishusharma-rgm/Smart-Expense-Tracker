import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import GlassyCalendarIcon from "../../components/ui/GlassyCalendarIcon";

export default function Landing() {
  const [clock, setClock] = useState(() => {
    const now = new Date();
    return now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true
    });
  });

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setClock(
        now.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true
        })
      );
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="landing-human landing-enter">
      <header className="landing-human__nav">
        <div className="landing-human__brand">
          <span className="landing-human__dot" />
          <span className="landing-human__name brand-luxe-title">Smart Expense Tracker</span>
        </div>
        <div className="landing-human__actions">
          <Link to="/about" className="landing-human__link subtle">
            About
          </Link>
          <Link to="/login" className="landing-human__link">
            Login
          </Link>
          <Link to="/register" className="landing-human__btn">
            Create Account
          </Link>
        </div>
      </header>

      <main className="landing-human__hero">
        <div className="landing-human__copy">
          <p className="landing-human__eyebrow">Made to feel calm.</p>
          <div className="landing-human__chips">
            <span className="chip">Production-ready</span>
            <span className="chip">Version 1.0</span>
          </div>
          <h1>Track money without the noise.</h1>
          <p className="landing-human__sub">
            This is a personal finance space that feels clean, private, and
            friendly — built for quick decisions, not busy dashboards.
          </p>
          <div className="landing-human__cta">
            <Link to="/register" className="landing-human__btn">
              Start Free
            </Link>
            <Link to="/login?demo=1" className="landing-human__link demo-link">
              Demo login
            </Link>
          </div>
          <div className="landing-human__note">
            <span>Build date:</span>
            <strong>Feb 14, 2026</strong>
          </div>
        </div>

        <div className="landing-human__notes">
          
          <span className="margin-note note-right">privacy first</span>
          <div className="landing-human__note-card scribble">
            <div className="note-head">
              <span>Build Notes</span>
              <span className="note-time">{clock}</span>
            </div>
            <span className="note-stamp">internal</span>
            <ul>
              <li>Track expenses, income, and budgets in one place.</li>
              <li>Analytics view shows trends and category split.</li>
              <li>Quick actions to add expense/income instantly.</li>
            </ul>
            <div className="note-footer">
              <span className="note-tag">Dashboard</span>
              <span className="note-tag">Analytics</span>
              <span className="note-tag">Budget</span>
            </div>
          </div>


        </div>
      </main>

      <section className="landing-human__grid">
        <div>
          <h4>Quiet UI</h4>
          <p>Less visual noise, more clarity.</p>
        </div>
        <div>
          <h4>Real context</h4>
          <p>Small notes that feel human, not robotic.</p>
        </div>
        <div>
          <h4>Private by default</h4>
          <p>Blur mode when you need it.</p>
        </div>
      </section>

      <div className="landing-human__signature">
        <span className="sig-text">— built by @vishu</span>
      </div>

      <div className="landing-human__scroll">
        <span className="scroll-line" />
        <span>scroll to explore</span>
      </div>

      <section className="landing-human__how">
        <div className="flex items-center gap-2">
          <GlassyCalendarIcon size={20} className="glassy-cal--tiny" />
          <h3>How it works</h3>
        </div>
        <div className="how-grid">
          <div>
            <p className="how-step">1</p>
            <h4>Add</h4>
            <p>Add income or expenses in seconds.</p>
          </div>
          <div>
            <p className="how-step">2</p>
            <h4>See</h4>
            <p>See totals, trends, and category split.</p>
          </div>
          <div>
            <p className="how-step">3</p>
            <h4>Decide</h4>
            <p>Use insights to plan and save.</p>
          </div>
        </div>
      </section>

      <section className="landing-human__extras">
        <div className="extras-card">
          <h3>Key benefits</h3>
          <div className="benefit-list">
            <div>
              <h4>Privacy</h4>
              <p>Hide or blur amounts instantly.</p>
            </div>
            <div>
              <h4>Speed</h4>
              <p>Add income/expense in seconds.</p>
            </div>
            <div>
              <h4>Clarity</h4>
              <p>Trends and categories at a glance.</p>
            </div>
          </div>
        </div>

        <div className="extras-card">
          <h3>Daily Focus</h3>
          <p className="madefor-line">Small wins, repeated daily.</p>
          <p className="mini-muted">Simple habits that compound.</p>
        </div>

        <div className="extras-card">
          <h3>Mini FAQ</h3>
          <div className="faq-item">
            <h4>Is my data safe?</h4>
            <p>Yes — privacy mode hides amounts instantly.</p>
          </div>
          <div className="faq-item">
            <h4>Can I export data?</h4>
            <p>Yes — export transactions in CSV anytime.</p>
          </div>
          <div className="faq-item">
            <h4>Can I use it without login?</h4>
            <p>Demo mode works with local data.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
