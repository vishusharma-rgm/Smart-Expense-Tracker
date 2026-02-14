import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-white border rounded-lg p-8 space-y-6">
        <h1 className="text-lg font-semibold">Forgot Password</h1>
        <form onSubmit={requestToken} className="space-y-3">
          <input
            type="email"
            placeholder="Email"
            className="w-full border rounded-md px-3 py-2 text-sm"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button className="w-full bg-black text-white py-2 rounded-md">
            Get reset token
          </button>
        </form>

        {msg && <p className="text-xs text-gray-600">{msg}</p>}

        <Link to="/login" className="text-xs underline text-gray-500">
          Back to sign in
        </Link>
      </div>
    </div>
  );
}
