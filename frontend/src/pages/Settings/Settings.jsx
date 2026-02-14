import { useEffect, useState } from "react";

const SETTINGS_KEY = "app_settings";

const defaultSettings = {
  theme: "system",
  currency: "INR",
  dateFormat: "DD/MM/YYYY",
  alertsBudget80: true,
  alertsBudget90: true,
  remindersBills: true,
  language: "en",
  privacyHideAmounts: false,
  privacyBlurMode: false,
  privacyPass: ""
};

export default function Settings() {
  const [settings, setSettings] = useState(defaultSettings);
  const [saved, setSaved] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [security, setSecurity] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [securityMsg, setSecurityMsg] = useState("");
  const [privacyReset, setPrivacyReset] = useState({
    accountPassword: "",
    newPass: "",
    confirmPass: ""
  });
  const [privacyMsg, setPrivacyMsg] = useState("");

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem(SETTINGS_KEY) || "null");
    if (stored) {
      setSettings({ ...defaultSettings, ...stored });
    } else {
      const existingTheme = localStorage.getItem("theme");
      if (existingTheme === "dark" || existingTheme === "light") {
        setSettings((s) => ({ ...s, theme: existingTheme }));
      }
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    if (settings.theme === "dark") {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else if (settings.theme === "light") {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      document.documentElement.classList.toggle("dark", prefersDark);
      localStorage.setItem("theme", prefersDark ? "dark" : "light");
    }
  }, [settings.theme]);

  const handleSave = () => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    document.body.classList.toggle("privacy-hide", !!settings.privacyHideAmounts);
    document.body.classList.toggle("privacy-blur", !!settings.privacyBlurMode);
    setSaved(true);
    setTimeout(() => setSaved(false), 1200);
  };

  const handlePasswordChange = async () => {
    setSecurityMsg("");
    if (!security.currentPassword || !security.newPassword) {
      setSecurityMsg("Please fill all password fields.");
      return;
    }
    if (security.newPassword !== security.confirmPassword) {
      setSecurityMsg("New passwords do not match.");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:3000/api/auth/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: security.currentPassword,
          newPassword: security.newPassword
        })
      });
      const data = await res.json();
      if (!res.ok) {
        setSecurityMsg(data.message || "Unable to change password.");
        return;
      }
      setSecurityMsg("Password updated.");
      setSecurity({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      setSecurityMsg("Server error.");
    }
  };

  const handleLogoutAll = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const handlePrivacyReset = async () => {
    setPrivacyMsg("");
    if (!privacyReset.newPass || !privacyReset.confirmPass) {
      setPrivacyMsg("Enter and confirm a new privacy passcode.");
      return;
    }
    if (privacyReset.newPass !== privacyReset.confirmPass) {
      setPrivacyMsg("Privacy passcodes do not match.");
      return;
    }
    const isDemo = localStorage.getItem("demo_mode") === "true";
    if (isDemo) {
      setSettings((s) => ({ ...s, privacyPass: privacyReset.newPass }));
      localStorage.setItem(
        SETTINGS_KEY,
        JSON.stringify({ ...settings, privacyPass: privacyReset.newPass })
      );
      setPrivacyMsg("Privacy passcode updated (demo).");
      setPrivacyReset({ accountPassword: "", newPass: "", confirmPass: "" });
      return;
    }
    const email = localStorage.getItem("user_email");
    if (!email) {
      setPrivacyMsg("Email not found. Please sign in again.");
      return;
    }
    if (!privacyReset.accountPassword) {
      setPrivacyMsg("Enter your account password to reset.");
      return;
    }
    try {
      const res = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: privacyReset.accountPassword })
      });
      if (!res.ok) {
        setPrivacyMsg("Account password is incorrect.");
        return;
      }
      setSettings((s) => ({ ...s, privacyPass: privacyReset.newPass }));
      localStorage.setItem(
        SETTINGS_KEY,
        JSON.stringify({ ...settings, privacyPass: privacyReset.newPass })
      );
      setPrivacyMsg("Privacy passcode updated.");
      setPrivacyReset({ accountPassword: "", newPass: "", confirmPass: "" });
    } catch {
      setPrivacyMsg("Unable to verify password.");
    }
  };

  const exportBackup = () => {
    const data = {
      settings: JSON.parse(localStorage.getItem(SETTINGS_KEY) || "{}"),
      bills: JSON.parse(localStorage.getItem("bill_calendar_items") || "[]"),
      receipts: JSON.parse(localStorage.getItem("receipt_vault_items") || "[]"),
      tax: JSON.parse(localStorage.getItem("tax_prep_categories") || "[]"),
      goals: JSON.parse(localStorage.getItem("goals") || "[]"),
      labDebts: JSON.parse(localStorage.getItem("lab_debts") || "[]"),
      labVault: JSON.parse(localStorage.getItem("lab_vault") || "null"),
      labSplits: JSON.parse(localStorage.getItem("lab_split_groups") || "[]")
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json"
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "backup.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const importBackup = async (file) => {
    if (!file) return;
    const text = await file.text();
    try {
      const data = JSON.parse(text);
      if (data.settings) localStorage.setItem(SETTINGS_KEY, JSON.stringify(data.settings));
      if (data.bills) localStorage.setItem("bill_calendar_items", JSON.stringify(data.bills));
      if (data.receipts) localStorage.setItem("receipt_vault_items", JSON.stringify(data.receipts));
      if (data.tax) localStorage.setItem("tax_prep_categories", JSON.stringify(data.tax));
      if (data.goals) localStorage.setItem("goals", JSON.stringify(data.goals));
      if (data.labDebts) localStorage.setItem("lab_debts", JSON.stringify(data.labDebts));
      if (data.labVault) localStorage.setItem("lab_vault", JSON.stringify(data.labVault));
      if (data.labSplits) localStorage.setItem("lab_split_groups", JSON.stringify(data.labSplits));
      window.location.reload();
    } catch {
      alert("Invalid backup file.");
    }
  };

  const handleResetAll = async () => {
    const ok = window.confirm("Reset all app data and server data?");
    if (!ok) return;
    try {
      const token = localStorage.getItem("token");
      await fetch("http://localhost:3000/api/reset", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch {
      // ignore
    }
    localStorage.removeItem("goals");
    localStorage.removeItem("bill_calendar_items");
    localStorage.removeItem("receipt_vault_items");
    localStorage.removeItem("tax_prep_categories");
    localStorage.removeItem("lab_debts");
    localStorage.removeItem("lab_vault");
    localStorage.removeItem("lab_split_groups");
    window.location.reload();
  };

  return (
    <div className="space-y-6">
      <div className="surface surface-tint-1 p-6 rounded-2xl">
        <h1 className="text-2xl font-semibold text-primary">Settings</h1>
        <p className="text-sm text-secondary mt-1">
          Personalize theme, currency, and formatting.
        </p>
      </div>

      <div className="surface surface-tint-2 p-6 rounded-2xl space-y-6">
        <div>
          <h2 className="text-lg font-semibold mb-2">Appearance</h2>
          <div className="flex flex-wrap gap-3">
            {["light", "dark"].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setSettings((s) => ({ ...s, theme: t }))}
                className={`btn-ghost px-3 py-2 text-sm ${settings.theme === t ? "accent-ring" : ""}`}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h2 className="text-lg font-semibold mb-2">Currency</h2>
            <select
              className="border px-3 py-2 rounded w-full"
              value={settings.currency}
              onChange={(e) =>
                setSettings((s) => ({ ...s, currency: e.target.value }))
              }
            >
              <option value="INR">INR (₹)</option>
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
            </select>
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-2">Date Format</h2>
            <select
              className="border px-3 py-2 rounded w-full"
              value={settings.dateFormat}
              onChange={(e) =>
                setSettings((s) => ({ ...s, dateFormat: e.target.value }))
              }
            >
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            </select>
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-2">Language</h2>
            <select
              className="border px-3 py-2 rounded w-full"
              value={settings.language}
              onChange={(e) =>
                setSettings((s) => ({ ...s, language: e.target.value }))
              }
            >
              <option value="en">English</option>
              <option value="hi">Hindi</option>
            </select>
            <p className="text-xs text-secondary mt-2">
              Translations coming soon.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="btn-primary btn-premium btn-luxe" onClick={handleSave}>
            Save Settings
          </button>
          {saved && <span className="text-sm text-secondary">Saved.</span>}
        </div>
      </div>

      <div className="surface surface-tint-3 p-6 rounded-2xl space-y-4">
        <h2 className="text-lg font-semibold">Notifications</h2>
        <label className="flex items-center gap-2 text-sm text-secondary">
          <input
            type="checkbox"
            checked={settings.alertsBudget80}
            onChange={(e) =>
              setSettings((s) => ({ ...s, alertsBudget80: e.target.checked }))
            }
          />
          Budget warning at 80%
        </label>
        <label className="flex items-center gap-2 text-sm text-secondary">
          <input
            type="checkbox"
            checked={settings.alertsBudget90}
            onChange={(e) =>
              setSettings((s) => ({ ...s, alertsBudget90: e.target.checked }))
            }
          />
          Budget alert at 90%
        </label>
        <label className="flex items-center gap-2 text-sm text-secondary">
          <input
            type="checkbox"
            checked={settings.remindersBills}
            onChange={(e) =>
              setSettings((s) => ({ ...s, remindersBills: e.target.checked }))
            }
          />
          Bill reminders
        </label>
      </div>

      <div className="surface surface-tint-4 p-6 rounded-2xl space-y-4">
        <h2 className="text-lg font-semibold">Privacy</h2>
        <label className="flex items-center gap-2 text-sm text-secondary">
          <input
            type="checkbox"
            checked={settings.privacyHideAmounts}
            onChange={(e) =>
              setSettings((s) => ({ ...s, privacyHideAmounts: e.target.checked }))
            }
          />
          Hide amounts (blur)
        </label>
        <label className="flex items-center gap-2 text-sm text-secondary">
          <input
            type="checkbox"
            checked={settings.privacyBlurMode}
            onChange={(e) =>
              setSettings((s) => ({ ...s, privacyBlurMode: e.target.checked }))
            }
          />
          Blur mode (soft blur on cards)
        </label>
        <div>
          <label className="text-sm text-secondary block mb-1">
            Privacy passcode (required to turn off)
          </label>
          <input
            className="border px-3 py-2 rounded w-full"
            type="password"
            placeholder="Set a passcode"
            value={settings.privacyPass}
            onChange={(e) =>
              setSettings((s) => ({ ...s, privacyPass: e.target.value }))
            }
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input
            className="border px-3 py-2 rounded"
            type="password"
            placeholder="Account password"
            value={privacyReset.accountPassword}
            onChange={(e) =>
              setPrivacyReset((s) => ({ ...s, accountPassword: e.target.value }))
            }
          />
          <input
            className="border px-3 py-2 rounded"
            type="password"
            placeholder="New privacy passcode"
            value={privacyReset.newPass}
            onChange={(e) =>
              setPrivacyReset((s) => ({ ...s, newPass: e.target.value }))
            }
          />
          <input
            className="border px-3 py-2 rounded"
            type="password"
            placeholder="Confirm passcode"
            value={privacyReset.confirmPass}
            onChange={(e) =>
              setPrivacyReset((s) => ({ ...s, confirmPass: e.target.value }))
            }
          />
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-ghost px-3 py-2 text-sm" onClick={handlePrivacyReset}>
            Reset Privacy Passcode
          </button>
          {privacyMsg && <span className="text-sm text-secondary">{privacyMsg}</span>}
        </div>
      </div>

      <div className="surface surface-tint-4 p-6 rounded-2xl space-y-4">
        <h2 className="text-lg font-semibold">Security</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input
            className="border px-3 py-2 rounded"
            type="password"
            placeholder="Current password"
            value={security.currentPassword}
            onChange={(e) => setSecurity((s) => ({ ...s, currentPassword: e.target.value }))}
          />
          <input
            className="border px-3 py-2 rounded"
            type="password"
            placeholder="New password"
            value={security.newPassword}
            onChange={(e) => setSecurity((s) => ({ ...s, newPassword: e.target.value }))}
          />
          <input
            className="border px-3 py-2 rounded"
            type="password"
            placeholder="Confirm new password"
            value={security.confirmPassword}
            onChange={(e) => setSecurity((s) => ({ ...s, confirmPassword: e.target.value }))}
          />
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-primary btn-premium btn-luxe" onClick={handlePasswordChange}>
            Change Password
          </button>
          <button className="btn-ghost px-3 py-2 text-sm" onClick={handleLogoutAll}>
            Logout All
          </button>
          {securityMsg && <span className="text-sm text-secondary">{securityMsg}</span>}
        </div>
      </div>

      <div className="surface surface-tint-5 p-6 rounded-2xl space-y-4">
        <h2 className="text-lg font-semibold">Data</h2>
        <div className="flex flex-wrap gap-3">
          <button className="btn-ghost px-3 py-2 text-sm" onClick={exportBackup}>
            Export Backup
          </button>
          <label className="btn-ghost px-3 py-2 text-sm cursor-pointer">
            Import Backup
            <input
              type="file"
              accept="application/json"
              className="hidden"
              onChange={(e) => importBackup(e.target.files?.[0])}
            />
          </label>
          <button className="bg-red-600 text-white px-3 py-2 rounded" onClick={handleResetAll}>
            Reset All Data
          </button>
        </div>
      </div>

      <div className="surface surface-tint-6 p-6 rounded-2xl space-y-4">
        <h2 className="text-lg font-semibold">Integrations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="surface surface-tint-2 p-4 rounded-xl">
            <p className="font-medium">Bank Sync</p>
            <p className="text-xs text-secondary mt-1">
              Coming soon. Connect your bank securely.
            </p>
            <button className="btn-ghost px-3 py-2 text-sm mt-3" disabled>
              Connect
            </button>
          </div>
          <div className="surface surface-tint-3 p-4 rounded-xl">
            <p className="font-medium">UPI Import</p>
            <p className="text-xs text-secondary mt-1">
              Coming soon. Import UPI statements.
            </p>
            <button className="btn-ghost px-3 py-2 text-sm mt-3" disabled>
              Import
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
