import React, { useContext, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../auth/AuthContext";
import "../../styles/theme.css";

// PUBLIC_INTERFACE
const Login = () => {
  const { login, loading, error } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const onSubmit = async (e) => {
    e.preventDefault();
    const ok = await login(email, password);
    if (ok) {
      navigate(from, { replace: true });
    }
  };

  return (
    <div style={{ display: "grid", placeItems: "center", minHeight: "100vh", padding: 16 }}>
      <div className="card" style={{ width: 360, maxWidth: "100%" }}>
        <h2 style={{ marginTop: 0, marginBottom: 8 }}>Welcome back</h2>
        <p style={{ marginTop: 0, marginBottom: 16, color: "#6b7280" }}>
          Sign in to your account
        </p>
        {error && (
          <div style={{ marginBottom: 12, color: "var(--color-error)" }}>
            {error}
          </div>
        )}
        <form onSubmit={onSubmit}>
          <div style={{ marginBottom: 12 }}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              className="input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              className="input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          <button className="btn" type="submit" disabled={loading} style={{ width: "100%" }}>
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
        <div style={{ marginTop: 12, fontSize: 14 }}>
          <Link to="/forgot-password">Forgot password?</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
