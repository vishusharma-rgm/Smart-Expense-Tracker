import { useState } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";

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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="w-full max-w-sm bg-white border rounded-lg p-8">
        <Link to="/" className="text-xs text-gray-500 underline">
          ← Back to Home
        </Link>

        <h1 className="text-lg font-semibold mb-6">
          {isDemo ? "Demo Sign in" : "Sign in"}
        </h1>

        {isDemo && (
          <p className="text-xs text-gray-500 mb-4">
            Demo entry requires no credentials. Click Continue to enter demo mode.
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          {!isDemo && (
            <>
              <input
                name="email"
                type="email"
                placeholder="Email"
                onChange={handleChange}
                required
                className="w-full border rounded-md px-3 py-2 text-sm"
              />

              <input
                name="password"
                type="password"
                placeholder="Password"
                onChange={handleChange}
                required
                className="w-full border rounded-md px-3 py-2 text-sm"
              />
            </>
          )}

          {error && (
            <div className="text-red-500 text-sm space-y-1">
              <p>{error}</p>
              <Link to="/forgot-password" className="underline text-xs">
                Forgot password?
              </Link>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded-md"
          >
            Continue
          </button>

        </form>

        <p className="text-sm mt-4 text-gray-500">
          Don’t have an account?{" "}
          <Link to="/register" className="underline">
            Register
          </Link>
        </p>
        <p className="text-xs mt-2 text-gray-500">
          <Link to="/forgot-password" className="underline">
            Forgot password?
          </Link>
        </p>

      </div>
    </div>
  );
}
