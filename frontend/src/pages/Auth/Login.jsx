import { useState } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import AuthShell from "../../components/layout/AuthShell";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [searchParams] = useSearchParams();
  const isDemo = searchParams.get("demo") === "1";

  const [form, setForm] = useState({
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
      localStorage.removeItem("demo_mode");
      if (isDemo) {
        localStorage.setItem("demo_mode", "true");
        localStorage.setItem("token", "demo-token");
        localStorage.setItem("user_email", "demo@smart.expense");
        login("demo-token");
        navigate("/dashboard");
        return;
      }
      const res = await api.post("/auth/login", form);
      localStorage.setItem("user_email", form.email);
      login(res.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed"
      );
    }
  };

  return (
    <AuthShell
      eyebrow={isDemo ? "Demo access" : "Welcome back"}
      title={isDemo ? "Demo Sign in" : "Sign in"}
      description={
        isDemo
          ? "Demo entry requires no credentials. Continue to open the app in demo mode."
          : "Jump back into your finance workspace with the same dark experience across every screen."
      }
      footer={(
        <>
          <p className="auth-page__meta">
            Don’t have an account?{" "}
            <Link to="/register" className="auth-page__text-link">
              Create account
            </Link>
          </p>
          <p className="auth-page__meta">
            <Link to="/forgot-password" className="auth-page__text-link">
              Forgot password?
            </Link>
          </p>
        </>
      )}
    >
      <form onSubmit={handleSubmit} className="auth-form">
        {!isDemo && (
          <>
            <input
              name="email"
              type="email"
              placeholder="Email"
              onChange={handleChange}
              required
              className="auth-form__input"
            />

            <input
              name="password"
              type="password"
              placeholder="Password"
              onChange={handleChange}
              required
              className="auth-form__input"
            />
          </>
        )}

        {error && (
          <div className="auth-form__message auth-form__message--error">
            <p>{error}</p>
            <Link to="/forgot-password" className="auth-page__text-link">
              Forgot password?
            </Link>
          </div>
        )}

        <button type="submit" className="auth-form__submit">
          Continue
        </button>
      </form>
    </AuthShell>
  );
}
