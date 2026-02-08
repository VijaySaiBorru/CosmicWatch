import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useResetPasswordMutation } from "../redux/features/auth/authApi";
import GlowCard from "../components/GlowCard";
import CosmicButton from "../components/CosmicButton";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [resetPassword, { isLoading }] =
    useResetPasswordMutation();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      await resetPassword({ token, newPassword }).unwrap();
      navigate("/auth");
    } catch (err) {
      setError(err?.data?.message || "Reset failed");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <GlowCard glowColor="purple" className="auth-card">
          <h1 className="auth-title">
            Reset Password 🔐
          </h1>

          <p className="auth-subtitle">
            Enter your new password
          </p>

          {error && (
            <div className="auth-error">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label className="form-label">
                New Password
              </label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="input"
                placeholder="••••••••"
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                Confirm Password
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(e.target.value)
                }
                className="input"
                placeholder="••••••••"
              />
            </div>

            <CosmicButton
              type="submit"
              disabled={isLoading}
              variant="primary"
              size="large"
              className="submit-button"
            >
              {isLoading ? "Resetting..." : "Reset Password"}
            </CosmicButton>
          </form>
        </GlowCard>
      </div>
    </div>
  );
};

export default ResetPassword;
