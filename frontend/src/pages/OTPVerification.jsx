import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useVerifyEmailMutation, useResendVerificationCodeMutation } from '../redux/features/auth/authApi';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../redux/features/auth/authSlice';
import GlowCard from '../components/GlowCard';
import CosmicButton from '../components/CosmicButton';
import Planet from '../components/Planet';
import { toast } from 'react-hot-toast';
import './Auth.css';

const OTPVerification = () => {
    const [otp, setOtp] = useState('');
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    

    const email = location.state?.email || localStorage.getItem('pendingVerificationEmail');

    const [verifyEmail, { isLoading: isVerifying }] = useVerifyEmailMutation();
    const [resendCode, { isLoading: isResending }] = useResendVerificationCodeMutation();

    useEffect(() => {
        if (!email) {
            toast.error("No email found for verification. Please register again.");
            navigate('/auth');
        }
    }, [email, navigate]);

    const handleVerify = async (e) => {
        e.preventDefault();
        if (!otp || otp.length !== 6) {
            toast.error("Please enter a valid 6-digit code");
            return;
        }

        try {
            const res = await verifyEmail({ email, code: otp }).unwrap();
            dispatch(setCredentials(res));
            localStorage.removeItem('pendingVerificationEmail');
            toast.success("Email verified successfully!");
            navigate('/dashboard');
        } catch (err) {
            toast.error(err?.data?.message || "Verification failed");
        }
    };

    const handleResend = async () => {
        try {
            await resendCode(email).unwrap();
            toast.success("Verification code resent!");
        } catch (err) {
            toast.error(err?.data?.message || "Failed to resend code");
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-planets">
                <Planet size={120} color="blue" className="auth-planet-1" />
                <Planet size={80} color="purple" className="auth-planet-2" />
            </div>

            <div className="auth-container">
                <GlowCard glowColor="blue" className="auth-card">
                    <div className="auth-header-row" style={{ justifyContent: 'center' }}>
                        <h1 className="auth-title">Verify Email 🔐</h1>
                    </div>

                    <p className="auth-subtitle" style={{ marginBottom: '2rem' }}>
                        We've sent a 6-digit code to <strong>{email}</strong>. <br/>
                        Please enter it below to access your account.
                    </p>

                    <form onSubmit={handleVerify} className="auth-form">
                        <div className="form-group">
                            <label className="form-label">Verification Code</label>
                            <input
                                type="text"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
                                className="input"
                                placeholder="123456"
                                style={{ textAlign: 'center', letterSpacing: '0.5rem', fontSize: '1.5rem' }}
                                maxLength="6"
                                required
                            />
                        </div>

                        <CosmicButton
                            type="submit"
                            disabled={isVerifying}
                            variant="primary"
                            size="large"
                            className="submit-button"
                        >
                            {isVerifying ? "Verifying..." : "Verify & Login"}
                        </CosmicButton>
                    </form>

                    <div className="auth-toggle">
                        Didn't receive the code?{" "}
                        <button
                            onClick={handleResend}
                            className="toggle-button"
                            disabled={isResending}
                        >
                            {isResending ? "Sending..." : "Resend Code"}
                        </button>
                    </div>
                </GlowCard>
            </div>
        </div>
    );
};

export default OTPVerification;
