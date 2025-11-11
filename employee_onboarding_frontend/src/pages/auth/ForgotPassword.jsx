import React, { useState } from "react";
import api from "../../api/axios";
import endpoints from "../../api/endpoints";
import "../../styles/theme.css";

// PUBLIC_INTERFACE
const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage("");
    try {
      await api.post(endpoints.auth.forgotPassword, { email });
      setMessage("If an account exists, a password reset link has been sent.");
    } catch (e) {
      setMessage(e?.response?.data?.message || "Request failed. Try again later.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ display: "grid", placeItems: "center", minHeight: "100vh", padding: 16 }}>
      <div className="card" style={{ width: 360, maxWidth: "100%" }}>
        <h2 style={{ marginTop: 0, marginBottom: 8 }}>Reset password</h2>
        <p style={{ marginTop: 0, marginBottom: 16, color: "#6b7280" }}>
          Enter your email to receive a reset link.
        </p>
        {message && (
          <div style={{ marginBottom: 12 }}>
            {message}
          </div>
        )}
        <form onSubmit={onSubmit}>
          <div style={{ marginBottom: 16 }}>
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
          <button className="btn" type="submit" disabled={submitting} style={{ width: "100%" }}>
            {submitting ? "Sending..." : "Send reset link"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
