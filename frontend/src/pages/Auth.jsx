import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { setCredentials } from "../redux/features/auth/authSlice";
import {
  useLoginUserMutation, useRegisterUserMutation, useGoogleLoginMutation
} from "../redux/features/auth/authApi";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth, googleProvider } from "../firebase/firebase.config";
import GlowCard from "../components/GlowCard";
import CosmicButton from "../components/CosmicButton";
import Planet from "../components/Planet";
import './Auth.css';

const Auth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);

  const [loginUser, { isLoading: loginLoading }] =
    useLoginUserMutation();
  const [registerUser, { isLoading: registerLoading }] =
    useRegisterUserMutation();
  const [googleLogin, { isLoading: googleLoading }] = useGoogleLoginMutation();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    about: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);

      const credential = GoogleAuthProvider.credentialFromResult(result);
      const idToken = credential.idToken;

      const res = await googleLogin({ idToken }).unwrap();

      dispatch(setCredentials(res));
      navigate("/dashboard");
    } catch (err) {
      console.error("Google Sign-in Error:", err);
      setError(err?.data?.message || err.message || "Google Authentication failed");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (isLogin) {
        const res = await loginUser({
          email: formData.email,
          password: formData.password,
        }).unwrap();
        dispatch(setCredentials(res));
        navigate("/dashboard");
      } else {
        const res = await registerUser(formData).unwrap();
        dispatch(setCredentials(res));
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err?.data?.message || "Authentication failed");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-planets">
        <Planet size={120} color="blue" className="auth-planet-1" />
        <Planet size={80} color="purple" className="auth-planet-2" />
        <Planet size={100} color="orange" className="auth-planet-3" />
        <Planet size={60} color="green" className="auth-planet-4" />
      </div>

      <div className="auth-container">
        <GlowCard glowColor="purple" className="auth-card">
          <div className="auth-header-row">
            <h1 className="auth-title">
              {isLogin ? "Welcome Back " : "Join CosmicWatch "}
            </h1>
            <Link to="/" className="auth-home-btn" title="Back to Home">
              <img 
                src="/lo.png" 
                className="logo-img" 
                alt="CosmicWatch Logo" 
              />
            </Link>
          </div>

          <p className="auth-subtitle">
            {isLogin
              ? "Login to track asteroids and alerts"
              : "Create an account to explore the cosmos"}
          </p>

          {error && (
            <div className="auth-error">
              {error}
            </div>
          )}

          <div className="google-login-container" style={{ marginBottom: '1.5rem' }}>
            <button
              onClick={handleGoogleLogin}
              disabled={googleLoading}
              className="google-btn"
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                background: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                fontSize: '1rem',
                fontWeight: '500'
              }}
            >
              <img
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                alt="Google"
                style={{ width: '20px', height: '20px' }}
              />
              {googleLoading ? "Connecting..." : "Continue with Google"}
            </button>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              margin: '1.5rem 0',
              color: 'rgba(255, 255, 255, 0.5)',
              fontSize: '0.9rem'
            }}>
              <div style={{ flex: 1, height: '1px', background: 'rgba(255, 255, 255, 0.1)' }}></div>
              <span style={{ padding: '0 10px' }}>OR</span>
              <div style={{ flex: 1, height: '1px', background: 'rgba(255, 255, 255, 0.1)' }}></div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {!isLogin && (
              <div className="form-group">
                <label className="form-label">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="input"
                  placeholder="Your name"
                />
              </div>
            )}

            {!isLogin && (
              <div className="form-group">
                <label className="form-label">
                  About (optional)
                </label>
                <textarea
                  name="about"
                  rows="3"
                  value={formData.about}
                  onChange={handleChange}
                  className="input textarea"
                  placeholder="Tell us a bit about yourself (researcher, student, enthusiast...)"
                />
              </div>
            )}


            <div className="form-group">
              <label className="form-label">
                Email
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="input"
                placeholder="you@example.com"
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                Password
              </label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="input password-input"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                      <line x1="1" y1="1" x2="23" y2="23"></line>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <CosmicButton
              type="submit"
              disabled={loginLoading || registerLoading}
              variant="primary"
              size="large"
              className="submit-button"
            >
              {loginLoading || registerLoading
                ? "Processing..."
                : isLogin
                  ? "Login"
                  : "Create Account"}
            </CosmicButton>
          </form>

          <div className="auth-toggle">
            {isLogin ? (
              <>
                Don't have an account?{" "}
                <button
                  onClick={() => setIsLogin(false)}
                  className="toggle-button"
                >
                  Register
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  onClick={() => setIsLogin(true)}
                  className="toggle-button"
                >
                  Login
                </button>
              </>
            )}
          </div>

          {isLogin && (
            <div className="forgot-password-link">
              <Link
                to="/forgot-password"
                className="link-text"
              >
                Forgot password?
              </Link>
            </div>
          )}
        </GlowCard>
      </div>
    </div>
  );
};

export default Auth;
