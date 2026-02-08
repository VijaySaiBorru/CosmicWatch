import React, { useState } from "react";
import { useForgotPasswordMutation } from "../redux/features/auth/authApi";
import { Link } from "react-router-dom";
import GlowCard from "../components/GlowCard";
import CosmicButton from "../components/CosmicButton";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [forgotPassword, { isLoading }] =
    useForgotPasswordMutation();

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const res = await forgotPassword(email).unwrap();
      setMessage(res.message || "Reset link sent to your email");
    } catch (err) {
      setError(err?.data?.message || "Failed to send reset email");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <GlowCard glowColor="blue" className="auth-card">
          <h1 className="auth-title">
            Forgot Password 🔑
          </h1>

          <p className="auth-subtitle">
            Enter your email to receive a reset link
          </p>

          {message && (
            <div style={{
              padding: '0.75rem',
              background: 'rgba(34, 197, 94, 0.1)',
              border: '1px solid rgba(34, 197, 94, 0.3)',
              borderRadius: 'var(--radius-sm)',
              color: '#4ade80',
              textAlign: 'center',
              fontSize: '0.875rem',
              marginBottom: '1rem'
            }}>
              {message}
            </div>
          )}

          {error && (
            <div className="auth-error">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label className="form-label">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
                placeholder="you@example.com"
              />
            </div>

            <CosmicButton
              type="submit"
              disabled={isLoading}
              variant="primary"
              size="large"
              className="submit-button"
            >
              {isLoading ? "Sending..." : "Send Reset Link"}
            </CosmicButton>
          </form>

          <div className="auth-toggle">
            <Link
              to="/auth"
              className="toggle-button"
              style={{ display: 'inline-block', textDecoration: 'none' }}
            >
              Back to Login
            </Link>
          </div>
        </GlowCard>
      </div>
    </div>
  );
};

export default ForgotPassword;
