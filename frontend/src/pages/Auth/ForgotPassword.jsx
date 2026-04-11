import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import AuthShell from "../../components/layout/AuthShell";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");

  const requestToken = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      const res = await api.post("/auth/forgot-password", { email });
      setMsg(res.data?.message || "Reset link sent. Check spam/promotions if needed.");
    } catch (err) {
      setMsg(err.response?.data?.message || "Unable to request reset token.");
    }
  };

  return (
    <AuthShell
      eyebrow="Recovery"
      title="Forgot Password"
      description="Enter your email and we will send the reset flow without changing the rest of your workspace."
      footer={(
        <p className="auth-page__meta">
          <Link to="/login" className="auth-page__text-link">
            Back to sign in
          </Link>
        </p>
      )}
    >
      <form onSubmit={requestToken} className="auth-form">
        <input
          type="email"
          placeholder="Email"
          className="auth-form__input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button className="auth-form__submit">
          Get reset token
        </button>
      </form>

      {msg && <p className="auth-form__message">{msg}</p>}
    </AuthShell>
  );
}
