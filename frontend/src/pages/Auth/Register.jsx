import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../services/api";
import AuthShell from "../../components/layout/AuthShell";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await api.post("/auth/register", form);
      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed"
      );
    }
  };

  return (
    <AuthShell
      eyebrow="Create account"
      title="Open your workspace"
      description="Set up your account once, then keep the whole product in a stable dark interface."
      footer={(
        <p className="auth-page__meta">
          Already have an account?{" "}
          <Link to="/login" className="auth-page__text-link">
            Sign in
          </Link>
        </p>
      )}
    >
      <form onSubmit={handleSubmit} className="auth-form">
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          className="auth-form__input"
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="auth-form__input"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="auth-form__input"
          required
        />

        {error && <p className="auth-form__message auth-form__message--error">{error}</p>}

        <button type="submit" className="auth-form__submit">
          Create Account
        </button>
      </form>
    </AuthShell>
  );
}
