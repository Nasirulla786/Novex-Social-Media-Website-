import axios from "axios";
import React, { useState } from "react";
import { ServelURL } from "../App";
import "../index.css";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";
import { useNavigate } from "react-router-dom";

export const Logo = ({ className = "" }) => (
  <div className={`flex items-center gap-3 ${className}`} aria-hidden>
    <svg
      width="46"
      height="46"
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="flex-none"
    >
      <defs>
        <linearGradient id="novexGradient" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#ff5f7a" />
          <stop offset="100%" stopColor="#ffd166" />
        </linearGradient>
      </defs>
      <rect width="100" height="100" rx="24" fill="#0c1224" />
      <path
        d="M30 70V30L50 52L70 30V70"
        stroke="url(#novexGradient)"
        strokeWidth="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M25 50H75"
        stroke="#ffffff"
        strokeWidth="6"
        strokeLinecap="round"
      />
    </svg>
    <span className="font-semibold text-lg text-yellow-300">Novex</span>
  </div>
);

const Signup = () => {
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const HandleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    if (!username || !name || !email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(
        `${ServelURL}/api/auth/signup`,
        { userName: username, name, email, password },
        { withCredentials: true }
      );

      dispatch(setUserData(res.data));

      setMessage(res?.data?.message || "Account created successfully.");
      setUsername("");
      setName("");
      setEmail("");
      setPassword("");

      // ✅ Redirect to login after successful signup
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(err?.response?.data?.error || err?.message || "Signup failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(circle_at_top_left,_rgba(255,209,102,0.18),_transparent_18%),radial-gradient(circle_at_top_right,_rgba(255,95,122,0.14),_transparent_18%),linear-gradient(180deg,_#02040a,_#070b16)] px-6 py-12">
      <div className="w-full max-w-xl glass-card p-8 sm:p-10 rounded-[28px] border border-white/10 shadow-2xl shadow-black/35">
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <Logo className="text-novex" />
          <p className="text-sm text-slate-300 max-w-xs">
            Welcome to Novex — the social stage for creators, friends, and stories.
          </p>
        </header>

        <h1 className="text-3xl font-semibold text-white mb-6">
          Create your Novex account
        </h1>

        <form onSubmit={HandleSubmit} className="space-y-4" noValidate>
          <div>
            <label className="block text-sm text-yellow-500 mb-2">
              Username
            </label>
            <input
              className="w-full rounded-xl bg-black border border-yellow-500 px-4 py-3 text-yellow-500 placeholder-yellow-500/40 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              placeholder="yourusername"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              aria-required="true"
            />
          </div>

          <div>
            <label className="block text-sm text-yellow-500 mb-2">
              Full name
            </label>
            <input
              className="w-full rounded-xl bg-black border border-yellow-500 px-4 py-3 text-yellow-500 placeholder-yellow-500/40 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm text-yellow-500 mb-2">Email</label>
            <input
              type="email"
              className="w-full rounded-xl bg-black border border-yellow-500 px-4 py-3 text-yellow-500 placeholder-yellow-500/40 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm text-yellow-500 mb-2">
              Password
            </label>
            <input
              type="password"
              className="w-full rounded-xl bg-black border border-yellow-500 px-4 py-3 text-yellow-500 placeholder-yellow-500/40 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              placeholder="Create a secure password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-3 rounded-xl px-4 py-3 bg-yellow-500 text-black font-semibold shadow-md hover:bg-yellow-600 disabled:opacity-70 transition"
          >
            {loading && (
              <svg
                className="w-5 h-5 animate-spin text-black"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden
              >
                <circle
                  className="opacity-20"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-100"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
            )}
            <span>{loading ? "Creating..." : "Create account"}</span>
          </button>

          {message && (
            <div className="rounded-lg p-3 text-sm bg-green-500/10 border border-green-500/20 text-green-500">
              {message}
            </div>
          )}
          {error && (
            <div className="rounded-lg p-3 text-sm bg-red-500/10 border border-red-500/20 text-red-500">
              {error}
            </div>
          )}
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-yellow-500">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-yellow-400 font-semibold hover:underline hover:text-yellow-300 transition"
            >
              Login
            </button>
          </p>
        </div>

        <footer className="mt-4 text-center text-xs text-yellow-500">
          By continuing, you agree to Novex Terms & Conditions.
        </footer>
      </div>
    </div>
  );
};

export default Signup;
