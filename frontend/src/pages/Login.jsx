import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api.js";
import { useAuth } from "../context/AuthContext.jsx";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const payload = {
      email: form.email.trim().toLowerCase(),
      password: form.password
    };
    if (!emailRegex.test(payload.email)) {
      setError("Please enter a valid email address");
      return;
    }
    if (!payload.password) {
      setError("Password is required");
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.post("/api/auth/login", payload);
      login(data);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid place-items-center px-4">
      <div className="card max-w-md w-full p-8">
        <h1 className="text-2xl font-display font-semibold mb-6">Welcome back</h1>
        {error && <p className="text-sm text-red-500 mb-4">{error}</p>}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            className="input"
            placeholder="Email"
            name="email"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            className="input"
            placeholder="Password"
            name="password"
            type="password"
            autoComplete="current-password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <button className="btn-primary w-full" disabled={loading}>
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>
        <p className="text-sm text-slate-500 mt-4">
          New here? <Link to="/register" className="text-ink font-semibold">Create an account</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
