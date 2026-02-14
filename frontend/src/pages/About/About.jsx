// import { Link } from "react-router-dom";

// export default function About() {
//   return (
//     <div className="about-page">
//       <header className="about-page__nav">
//         <Link to="/" className="about-page__back">← Back</Link>
//         <div className="about-page__brand">Smart Expense Tracker</div>
//         <div className="about-page__actions">
//           <Link to="/login" className="about-page__link">Login</Link>
//           <Link to="/register" className="about-page__btn">Create Account</Link>
//         </div>
//       </header>

//       <nav className="about-page__sticky">
//         <a href="#overview">Overview</a>
//         <a href="#features">Features</a>
//         <a href="#limits">Limitations</a>
//       </nav>

//       <section className="about-page__hero">
//         <span id="overview" />
//         <h1>About the App</h1>
//         <p>
//           A clean, private finance workspace built for everyday decisions.
//           Here’s a quick overview of each section.
//         </p>
//       </section>

//       <section className="about-page__why">
//         <h3>Why this app</h3>
//         <ul>
//           <li>Problem: too much noise in finance apps.</li>
//           <li>Solution: quiet UI + clear daily actions.</li>
//           <li>Result: faster decisions, less regret.</li>
//         </ul>
//       </section>

//       <section className="about-page__timeline">
//         <div>
//           <h4>MVP</h4>
//           <p>Basic expenses + budget tracking.</p>
//         </div>
//         <div>
//           <h4>Current</h4>
//           <p>Analytics, planner, leaderboard, privacy mode.</p>
//         </div>
//         <div>
//           <h4>Next</h4>
//           <p>Bank sync, smarter reports, deeper automation.</p>
//         </div>
//       </section>

//       <section className="about-page__strip">
//         <div>
//           <h4>Privacy</h4>
//           <p>Blur or hide amounts instantly.</p>
//         </div>
//         <div>
//           <h4>Insights</h4>
//           <p>Trends, anomalies, and category split.</p>
//         </div>
//         <div>
//           <h4>Speed</h4>
//           <p>Quick actions with minimal clicks.</p>
//         </div>
//       </section>

//       <section className="about-page__grid">
//         <span id="features" />
//         <div className="about-page__card preview dashboard">
//           <h4>Dashboard</h4>
//           <div className="mini-rows">
//             <div className="mini-row"><span>Income</span><strong>₹1.2L</strong></div>
//             <div className="mini-row"><span>Expense</span><strong>₹54k</strong></div>
//             <div className="mini-row"><span>Net</span><strong>₹66k</strong></div>
//           </div>
//           <div className="mini-bars">
//             <span />
//             <span className="short" />
//           </div>
//           <p className="mini-text">Alerts + quick actions</p>
//         </div>
//         <div className="about-page__card preview analytics">
//           <h4>Analytics</h4>
//           <div className="mini-donut" />
//           <p className="mini-text">Category split + monthly trend</p>
//           <p className="mini-text">Top category: Food</p>
//         </div>
//         <div className="about-page__card preview budget">
//           <h4>Budget</h4>
//           <div className="mini-progress"><span /></div>
//           <p className="mini-text">Remaining: ₹18,500</p>
//           <p className="mini-text">Used: 62%</p>
//         </div>
//         <div className="about-page__card preview transactions">
//           <h4>Transactions</h4>
//           <div className="mini-list">
//             <span>Uber</span>
//             <span>Groceries</span>
//             <span>Salary</span>
//           </div>
//           <p className="mini-text">Filters + export</p>
//         </div>
//         <div className="about-page__card preview goals">
//           <h4>Goals</h4>
//           <div className="mini-goal"><span /></div>
//           <p className="mini-text">3 active goals</p>
//           <p className="mini-text">Next target: ₹50k</p>
//         </div>
//         <div className="about-page__card preview planner">
//           <h4>Planner</h4>
//           <div className="mini-calendar">
//             <span />
//             <span />
//             <span />
//           </div>
//           <p className="mini-text">Bills + receipts</p>
//           <p className="mini-text">Cashflow timeline</p>
//         </div>
//         <div className="about-page__card preview lab">
//           <h4>Money Lab</h4>
//           <div className="mini-pill-row">
//             <span>Debt</span>
//             <span>Savings</span>
//           </div>
//           <p className="mini-text">What‑if experiments</p>
//         </div>
//         <div className="about-page__card preview leaderboard">
//           <h4>Leaderboard</h4>
//           <div className="mini-streak">
//             <span />
//             <span />
//             <span />
//             <span />
//           </div>
//           <p className="mini-text">Streaks + milestones</p>
//           <p className="mini-text">Weekly digest</p>
//         </div>
//         <div className="about-page__card preview settings">
//           <h4>Settings</h4>
//           <div className="mini-toggles">
//             <span />
//             <span />
//           </div>
//           <p className="mini-text">Privacy + security</p>
//           <p className="mini-text">Backup + alerts</p>
//         </div>
//         <div className="about-page__card preview profile">
//           <h4>Profile</h4>
//           <div className="mini-avatar" />
//           <p className="mini-text">Account + preferences</p>
//           <p className="mini-text">Activity + security</p>
//         </div>
//       </section>

//       <section className="about-page__cons">
//         <span id="limits" />
//         <div>
//           <h3>Quick notes</h3>
//           <ul>
//             <li>Demo data is local and resets when cleared.</li>
//             <li>Receipts are stored locally (no cloud sync yet).</li>
//             <li>Bank sync is currently a placeholder.</li>
//           </ul>
//         </div>
//       </section>
//     </div>
//   );
// }
import { Link } from "react-router-dom";
import GlassyCalendarIcon from "../../components/ui/GlassyCalendarIcon";

export default function About() {
  return (
    <div className="about-page">

      {/* ================= NAVBAR ================= */}
      <header className="about-page__nav">
        <Link to="/" className="about-page__back">← Back</Link>
        <div className="about-page__brand">Smart Expense Tracker</div>
        <div className="about-page__actions">
          <Link to="/login" className="about-page__link">Login</Link>
          <Link to="/register" className="about-page__btn">
            Create Account
          </Link>
        </div>
      </header>

      {/* ================= STICKY LINKS ================= */}
      <nav className="about-page__sticky">
        <a href="#overview">Overview</a>
        <a href="#features">Features</a>
        <a href="#limits">Limitations</a>
      </nav>

      {/* ================= HERO ================= */}
      <section className="about-page__hero">
        <div id="overview" />
        <h1>About the App</h1>
        <p>
          A clean, private finance workspace built for everyday decisions.
          Here’s a quick overview of each section.
        </p>
      </section>

      {/* ================= WHY ================= */}
      <section className="about-page__why">
        <h3>Why this app</h3>
        <ul>
          <li>Problem: too much noise in finance apps.</li>
          <li>Solution: quiet UI + clear daily actions.</li>
          <li>Result: faster decisions, less regret.</li>
        </ul>
      </section>

      {/* ================= TIMELINE ================= */}
      <section className="about-page__timeline">
        <div>
          <h4>MVP</h4>
          <p>Basic expenses + budget tracking.</p>
        </div>
        <div>
          <h4>Current</h4>
          <p>Analytics, planner, leaderboard, privacy mode.</p>
        </div>
        <div>
          <h4>Next</h4>
          <p>Bank sync, smarter reports, deeper automation.</p>
        </div>
      </section>

      {/* ================= STRIP (3 CARDS) ================= */}
      <section className="about-page__strip">
        <div>
          <h4>Privacy</h4>
          <p>Blur or hide amounts instantly.</p>
        </div>
        <div>
          <h4>Insights</h4>
          <p>Trends, anomalies, and category split.</p>
        </div>
        <div>
          <h4>Speed</h4>
          <p>Quick actions with minimal clicks.</p>
        </div>
      </section>

      {/* ================= FEATURES GRID ================= */}
      <div id="features" />

      <section className="about-page__grid">

        <div className="about-page__card preview dashboard">
          <h4>Dashboard</h4>
          <div className="mini-rows">
            <div className="mini-row"><span>Income</span><strong>₹1.2L</strong></div>
            <div className="mini-row"><span>Expense</span><strong>₹54k</strong></div>
            <div className="mini-row"><span>Net</span><strong>₹66k</strong></div>
          </div>
          <div className="mini-bars">
            <span />
            <span className="short" />
          </div>
          <p className="mini-text">Alerts + quick actions</p>
        </div>

        <div className="about-page__card preview analytics">
          <h4>Analytics</h4>
          <div className="mini-donut" />
          <p className="mini-text">Category split + monthly trend</p>
          <p className="mini-text">Top category: Food</p>
        </div>

        <div className="about-page__card preview budget">
          <h4>Budget</h4>
          <div className="mini-progress"><span /></div>
          <p className="mini-text">Remaining: ₹18,500</p>
          <p className="mini-text">Used: 62%</p>
        </div>

        <div className="about-page__card preview transactions">
          <h4>Transactions</h4>
          <div className="mini-list">
            <span>Uber</span>
            <span>Groceries</span>
            <span>Salary</span>
          </div>
          <p className="mini-text">Filters + export</p>
        </div>

        <div className="about-page__card preview goals">
          <h4>Goals</h4>
          <div className="mini-goal"><span /></div>
          <p className="mini-text">3 active goals</p>
          <p className="mini-text">Next target: ₹50k</p>
        </div>

        <div className="about-page__card preview planner">
          <h4 className="flex items-center gap-2">
            <GlassyCalendarIcon size={20} className="glassy-cal--tiny" />
            Planner
          </h4>
          <div className="mini-calendar">
            <span /><span /><span />
          </div>
          <p className="mini-text">Bills + receipts</p>
          <p className="mini-text">Cashflow timeline</p>
        </div>

        <div className="about-page__card preview lab">
          <h4>Money Lab</h4>
          <div className="mini-pill-row">
            <span>Debt</span>
            <span>Savings</span>
          </div>
          <p className="mini-text">What-if experiments</p>
        </div>

        <div className="about-page__card preview leaderboard">
          <h4>Leaderboard</h4>
          <div className="mini-streak">
            <span /><span /><span /><span />
          </div>
          <p className="mini-text">Streaks + milestones</p>
          <p className="mini-text">Weekly digest</p>
        </div>

        <div className="about-page__card preview settings">
          <h4>Settings</h4>
          <div className="mini-toggles">
            <span /><span />
          </div>
          <p className="mini-text">Privacy + security</p>
          <p className="mini-text">Backup + alerts</p>
        </div>

        <div className="about-page__card preview profile">
          <h4>Profile</h4>
          <div className="mini-avatar" />
          <p className="mini-text">Account + preferences</p>
          <p className="mini-text">Activity + security</p>
        </div>

      </section>

      {/* ================= LIMITATIONS ================= */}
      <div id="limits" />

      <section className="about-page__cons">
        <h3>Quick notes</h3>
        <ul>
          <li>Demo data is local and resets when cleared.</li>
          <li>Receipts are stored locally (no cloud sync yet).</li>
          <li>Bank sync is currently a placeholder.</li>
        </ul>
      </section>

    </div>
  );
}
