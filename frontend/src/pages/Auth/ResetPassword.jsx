import { useState } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import api from "../../services/api";
import AuthShell from "../../components/layout/AuthShell";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const [newPass, setNewPass] = useState("");
  const [msg, setMsg] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      const res = await api.post("/auth/reset-password", {
        token,
        newPassword: newPass
      });
      setMsg(res.data?.message || "Password updated.");
      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      setMsg(err.response?.data?.message || "Unable to reset password.");
    }
  };

  return (
    <AuthShell
      eyebrow="Reset access"
      title="Reset Password"
      description="Create a fresh password and return to the same dark workspace without visual jumps."
      footer={(
        <p className="auth-page__meta">
          <Link to="/login" className="auth-page__text-link">
            Back to sign in
          </Link>
        </p>
      )}
    >
      <form onSubmit={handleReset} className="auth-form">
        <input
          type="password"
          placeholder="New password"
          className="auth-form__input"
          value={newPass}
          onChange={(e) => setNewPass(e.target.value)}
          required
        />
        <button className="auth-form__submit">
          Set new password
        </button>
      </form>
      {msg && <p className="auth-form__message">{msg}</p>}
    </AuthShell>
  );
}
