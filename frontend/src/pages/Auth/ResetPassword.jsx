import { useState } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import api from "../../services/api";

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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-white border rounded-lg p-8 space-y-4">
        <h1 className="text-lg font-semibold">Reset Password</h1>
        <form onSubmit={handleReset} className="space-y-3">
          <input
            type="password"
            placeholder="New password"
            className="w-full border rounded-md px-3 py-2 text-sm"
            value={newPass}
            onChange={(e) => setNewPass(e.target.value)}
            required
          />
          <button className="w-full bg-black text-white py-2 rounded-md">
            Set new password
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
