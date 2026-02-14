import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useExpenses } from "../../context/ExpenseContext";
import { useIncome } from "../../context/IncomeContext";
import { formatCurrency } from "../../utils/formatters";

const PROFILE_KEY = "profile_info";

export default function Profile() {
  const { logout } = useAuth();
  const { expenses } = useExpenses();
  const { incomes } = useIncome();
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    bio: "",
    avatar: ""
  });
  const [saved, setSaved] = useState(false);
  const [openSection, setOpenSection] = useState("account");

  const profileScore = useMemo(() => {
    const totalIncome = incomes.reduce((s, i) => s + Number(i.amount || 0), 0);
    const totalExpense = expenses.reduce((s, e) => s + Number(e.amount || 0), 0);
    const net = Math.max(totalIncome - totalExpense, 0);
    const score = Math.min(Math.round(net / 1000), 10);
    return score;
  }, [expenses, incomes]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem(PROFILE_KEY) || "null");
    if (stored) setProfile(stored);
  }, []);

  const handleSave = () => {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    setSaved(true);
    setTimeout(() => setSaved(false), 1200);
  };

  return (
    <div className="space-y-6">
      <div className="surface surface-tint-1 p-6 rounded-2xl flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-secondary">Profile</p>
          <h1 className="text-3xl font-semibold text-primary">My Profile</h1>
          <p className="text-sm text-secondary mt-1">
            Your personal brand and preferences.
          </p>
        </div>
        <button className="btn-soft px-3 py-2 text-sm" onClick={logout}>
          Logout
        </button>
      </div>

      <div className="space-y-4">
        <Section
          title="Account Info"
          open={openSection === "account"}
          onToggle={() =>
            setOpenSection(openSection === "account" ? "" : "account")
          }
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="surface surface-tint-2 p-6 rounded-2xl">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-[color:var(--border-color)] overflow-hidden">
                  {profile.avatar ? (
                    <img
                      src={profile.avatar}
                      alt="avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : null}
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-primary">
                    {profile.name || "Your Name"}
                  </h2>
                  <p className="text-sm text-secondary">
                    {profile.email || "your@email.com"}
                  </p>
                  <p className="text-xs text-secondary mt-1">
                    {profile.city || "City, Country"}
                  </p>
                </div>
              </div>
          <div className="mt-4 space-y-3">
            <input
              type="text"
              placeholder="Avatar URL"
              value={profile.avatar}
              onChange={(e) => setProfile({ ...profile, avatar: e.target.value })}
              className="border px-3 py-2 rounded w-full"
            />
            <label className="btn-ghost px-3 py-2 text-sm cursor-pointer inline-block">
              Upload Avatar
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onload = () => {
                    setProfile((p) => ({ ...p, avatar: String(reader.result || "") }));
                  };
                  reader.readAsDataURL(file);
                }}
              />
            </label>
          </div>
              <div className="mt-4 surface surface-tint-3 p-4 rounded-xl">
                <p className="text-xs text-secondary uppercase tracking-[0.2em]">
                  Profile Score
                </p>
                <p className="text-2xl font-semibold text-primary mt-1">
                  {profileScore} / 10
                </p>
                <p className="text-xs text-secondary mt-1">
                  Based on your savings discipline.
                </p>
              </div>
            </div>

            <div className="surface surface-tint-4 p-6 rounded-2xl lg:col-span-2">
              <h3 className="text-lg font-semibold mb-4">Personal Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  className="border px-3 py-2 rounded"
                  placeholder="Full name"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                />
                <input
                  className="border px-3 py-2 rounded"
                  placeholder="Email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                />
                <input
                  className="border px-3 py-2 rounded"
                  placeholder="Phone"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                />
                <input
                  className="border px-3 py-2 rounded"
                  placeholder="City"
                  value={profile.city}
                  onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                />
              </div>
              <textarea
                className="border px-3 py-2 rounded w-full mt-4"
                rows={4}
                placeholder="Short bio"
                value={profile.bio}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              />
              <div className="flex items-center gap-3 mt-4">
                <button className="btn-primary btn-premium btn-luxe" onClick={handleSave}>
                  Save Profile
                </button>
                {saved && <span className="text-sm text-secondary">Saved.</span>}
              </div>
            </div>
          </div>
        </Section>

        <Section
          title="Net Worth"
          open={openSection === "networth"}
          onToggle={() =>
            setOpenSection(openSection === "networth" ? "" : "networth")
          }
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="surface surface-tint-5 p-6 rounded-2xl">
              <p className="text-xs text-secondary uppercase tracking-[0.2em]">Net Worth</p>
              <p className="text-2xl font-semibold text-primary mt-2">
                <span data-amount>{formatCurrency(102500)}</span>
              </p>
            </div>
            <div className="surface surface-tint-6 p-6 rounded-2xl">
              <p className="text-xs text-secondary uppercase tracking-[0.2em]">Monthly Savings</p>
              <p className="text-2xl font-semibold text-primary mt-2">
                <span data-amount>{formatCurrency(24500)}</span>
              </p>
            </div>
            <div className="surface surface-tint-2 p-6 rounded-2xl">
              <p className="text-xs text-secondary uppercase tracking-[0.2em]">Member Tier</p>
              <p className="text-2xl font-semibold text-primary mt-2">Gold</p>
            </div>
          </div>
        </Section>

        <Section
          title="Preferences"
          open={openSection === "preferences"}
          onToggle={() =>
            setOpenSection(openSection === "preferences" ? "" : "preferences")
          }
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="surface surface-tint-2 p-4 rounded-xl">
              <p className="text-xs text-secondary uppercase tracking-[0.2em]">Theme</p>
              <p className="text-lg font-semibold text-primary mt-2">Dark</p>
            </div>
            <div className="surface surface-tint-3 p-4 rounded-xl">
              <p className="text-xs text-secondary uppercase tracking-[0.2em]">Currency</p>
              <p className="text-lg font-semibold text-primary mt-2">INR</p>
            </div>
            <div className="surface surface-tint-4 p-4 rounded-xl">
              <p className="text-xs text-secondary uppercase tracking-[0.2em]">Language</p>
              <p className="text-lg font-semibold text-primary mt-2">English</p>
            </div>
          </div>
        </Section>

        <Section
          title="Activity"
          open={openSection === "activity"}
          onToggle={() =>
            setOpenSection(openSection === "activity" ? "" : "activity")
          }
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="surface surface-tint-5 p-4 rounded-xl">
              <p className="text-xs text-secondary uppercase tracking-[0.2em]">Last Login</p>
              <p className="text-lg font-semibold text-primary mt-2">Today</p>
            </div>
            <div className="surface surface-tint-6 p-4 rounded-xl">
              <p className="text-xs text-secondary uppercase tracking-[0.2em]">Transactions</p>
              <p className="text-lg font-semibold text-primary mt-2">
                <span data-amount>{formatCurrency(128)}</span>
              </p>
            </div>
            <div className="surface surface-tint-2 p-4 rounded-xl">
              <p className="text-xs text-secondary uppercase tracking-[0.2em]">Status</p>
              <p className="text-lg font-semibold text-primary mt-2">Active</p>
            </div>
          </div>
        </Section>

        <Section
          title="Security"
          open={openSection === "security"}
          onToggle={() =>
            setOpenSection(openSection === "security" ? "" : "security")
          }
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="surface surface-tint-3 p-4 rounded-xl">
              <p className="text-xs text-secondary uppercase tracking-[0.2em]">2FA</p>
              <p className="text-lg font-semibold text-primary mt-2">Disabled</p>
            </div>
            <div className="surface surface-tint-4 p-4 rounded-xl">
              <p className="text-xs text-secondary uppercase tracking-[0.2em]">Password</p>
              <p className="text-lg font-semibold text-primary mt-2">Updated</p>
            </div>
            <div className="surface surface-tint-5 p-4 rounded-xl">
              <p className="text-xs text-secondary uppercase tracking-[0.2em]">Sessions</p>
              <p className="text-lg font-semibold text-primary mt-2">1 Active</p>
            </div>
          </div>
        </Section>
      </div>
    </div>
  );
}

function Section({ title, open, onToggle, children }) {
  return (
    <div className="surface surface-tint-1 p-4 rounded-2xl">
      <button
        className="w-full flex items-center justify-between text-left"
        onClick={onToggle}
        type="button"
      >
        <span className="text-lg font-semibold">{title}</span>
        <span className="text-sm text-secondary">{open ? "Hide" : "Show"}</span>
      </button>
      {open && <div className="mt-4">{children}</div>}
    </div>
  );
}
