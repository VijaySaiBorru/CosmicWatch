import React, { useState } from 'react';
import { FaEdit, FaKey, FaTrash, FaSave, FaTimes, FaUser, FaEnvelope, FaInfoCircle, FaBell, FaList } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { useGetProfileQuery, useUpdateProfileMutation, useChangePasswordMutation, useDeleteUserMutation } from '../redux/features/user/userApi';
import { setCredentials, logout } from '../redux/features/auth/authSlice';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import GlowCard from '../components/GlowCard';
import CosmicButton from '../components/CosmicButton';
import Planet from '../components/Planet';
import WatchlistAsteroid from '../components/WatchlistAsteroid';
import './Profile.css';

const Profile = () => {
    const { user, token } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { data: profileData, isLoading, error, refetch } = useGetProfileQuery();
    const [updateProfile, { isLoading: updateLoading }] = useUpdateProfileMutation();

    const [changePassword, { isLoading: passwordLoading }] = useChangePasswordMutation();
    const [deleteUser, { isLoading: deleteLoading }] = useDeleteUserMutation();

    const handleDeleteAccount = async () => {
        try {
            await deleteUser().unwrap();
            dispatch(logout());
            navigate('/');
        } catch (err) {
            setErrorMessage(err?.data?.message || 'Failed to delete account');
        }
    };

    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [viewMode, setViewMode] = useState('view');
    const [formData, setFormData] = useState({
        name: '',
        about: '',
        alertPreferences: {
            daysBeforeApproach: 7,
            maxMissDistanceAU: 0.1,
            minDiameterKM: 0.0,
            notifyRiskLevels: []
        }
    });
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
    });
    const [validationErrors, setValidationErrors] = useState({});

    React.useEffect(() => {
        if (profileData) {
            setFormData({
                name: profileData.name || '',
                about: profileData.about || '',
                alertPreferences: {
                    daysBeforeApproach: profileData.alertPreferences?.daysBeforeApproach ?? 7,
                    maxMissDistanceAU: profileData.alertPreferences?.maxMissDistanceAU ?? 0.1,
                    minDiameterKM: profileData.alertPreferences?.minDiameterKM ?? 0.0,
                    notifyRiskLevels: profileData.alertPreferences?.notifyRiskLevels || []
                }
            });
        }
    }, [profileData]);

    React.useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [viewMode]);

    const handleEdit = () => {
        setViewMode('edit');
        setSuccessMessage('');
        setErrorMessage('');
    };

    const handleCancel = () => {
        setViewMode('view');
        setSuccessMessage('');
        setErrorMessage('');
        setValidationErrors({});
    };

    const handleChangePasswordClick = () => {
        setViewMode('password');
        setSuccessMessage('');
        setErrorMessage('');
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAlertPrefChange = (e) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            alertPreferences: {
                ...prev.alertPreferences,
                [name]: type === 'number' ? parseFloat(value) : value
            }
        }));
    };

    const handleRiskLevelChange = (level) => {
        setFormData(prev => {
            const currentLevels = prev.alertPreferences.notifyRiskLevels || [];
            const newLevels = currentLevels.includes(level)
                ? currentLevels.filter(l => l !== level)
                : [...currentLevels, level];
            return {
                ...prev,
                alertPreferences: {
                    ...prev.alertPreferences,
                    notifyRiskLevels: newLevels
                }
            };
        });
    };

    const validateForm = () => {
        const errors = {};
        if (!formData.name?.trim()) errors.name = 'Name is required';
        if (formData.alertPreferences.daysBeforeApproach < 1) errors.days = 'Must be at least 1 day';
        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const validatePasswordForm = () => {
        const errors = {};
        if (!passwordData.currentPassword) errors.currentPassword = 'Required';
        if (passwordData.newPassword.length < 6) errors.newPassword = 'Must be at least 6 characters';
        if (passwordData.newPassword !== passwordData.confirmNewPassword) errors.confirmNewPassword = 'Passwords do not match';
        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccessMessage('');
        setErrorMessage('');

        if (!validateForm()) {
            return;
        }

        try {
            const updatedData = {
                name: formData.name.trim(),
                about: formData.about.trim(),
                alertPreferences: formData.alertPreferences
            };

            const result = await updateProfile(updatedData).unwrap();

            dispatch(setCredentials({ user: result, token: token }));

            setSuccessMessage('Profile updated successfully! ✨');
            setViewMode('view');
            refetch();

            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
            setErrorMessage(err?.data?.message || 'Failed to update profile');
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setSuccessMessage('');
        setErrorMessage('');

        if (!validatePasswordForm()) {
            return;
        }

        try {
            await changePassword({
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            }).unwrap();

            setSuccessMessage('Password changed successfully! 🔐');
            setViewMode('view');
            setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmNewPassword: '',
            });

            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
            setErrorMessage(err?.data?.message || 'Failed to change password');
        }
    };

    if (isLoading) {
        return (
            <div className="profile-page">
                <div className="profile-container container">
                    <div className="loading-state">
                        <div className="loading-spinner" />
                        <p>Loading profile...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="profile-page">
                <div className="profile-container container">
                    <div className="error-state">
                        <p> Failed to load profile</p>
                        <CosmicButton onClick={() => refetch()} variant="primary">
                            Retry
                        </CosmicButton>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="profile-page">
            <div className="profile-planets">
                <Planet size={100} color="blue" className="profile-planet-1" />
                <Planet size={70} color="purple" className="profile-planet-2" />
                <Planet size={90} color="orange" className="profile-planet-3" />
            </div>

            <div className="profile-container container">
                <div className="profile-header">
                    <h1 className="profile-title"><FaUser /> My Profile</h1>
                    <p className="profile-subtitle">View and manage your account details</p>
                </div>

                {successMessage && (
                    <div className="success-message">
                        {successMessage}
                    </div>
                )}

                {errorMessage && (
                    <div className="error-message">
                        {errorMessage}
                    </div>
                )}

                <GlowCard glowColor="purple" className="profile-card">
                    {viewMode === 'view' && (
                        <div className="profile-view">
                            <div className="profile-avatar">
                                <div className="avatar-circle">
                                    {profileData?.name?.charAt(0).toUpperCase()}
                                </div>
                            </div>

                            <div className="profile-details">
                                <div className="detail-group">
                                    <label className="detail-label"><FaUser /> Name</label>
                                    <p className="detail-value">{profileData?.name}</p>
                                </div>

                                <div className="detail-group">
                                    <label className="detail-label"><FaEnvelope /> Email</label>
                                    <p className="detail-value">{profileData?.email}</p>
                                </div>

                                <div className="detail-group">
                                    <label className="detail-label"><FaInfoCircle /> About</label>
                                    <p className="detail-value">
                                        {profileData?.about || 'No bio added yet'}
                                    </p>
                                </div>

                                <div className="detail-group">
                                    <label className="detail-label"><FaBell /> Alert Preferences</label>
                                    <div className="detail-value alert-prefs-view">
                                        <div className="pref-item">
                                            <span>📅 Days Before:</span>
                                            <strong>{profileData?.alertPreferences?.daysBeforeApproach ?? 7}</strong>
                                        </div>
                                        <div className="pref-item">
                                            <span>📏 Max Distance:</span>
                                            <strong>{profileData?.alertPreferences?.maxMissDistanceAU ?? 0.2} AU</strong>
                                        </div>
                                        <div className="pref-item">
                                            <span>⚠️ Risk Levels:</span>
                                            <strong>{profileData?.alertPreferences?.notifyRiskLevels?.join(', ') || 'None'}</strong>
                                        </div>
                                    </div>
                                </div>

                                <div className="detail-group">
                                    <label className="detail-label"><FaList /> Watchlist</label>
                                    <div className="watchlist-container">
                                        {profileData?.watchlist?.length > 0 ? (
                                            profileData.watchlist.map(id => (
                                                <WatchlistAsteroid key={id} asteroidId={id} />
                                            ))
                                        ) : (
                                            <p className="no-watchlist">No asteroids in watchlist</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="profile-actions">
                                <CosmicButton onClick={handleEdit} variant="primary" size="large">
                                    <FaEdit /> Edit Profile
                                </CosmicButton>
                                <CosmicButton
                                    onClick={handleChangePasswordClick}
                                    variant="secondary"
                                    size="large"
                                >
                                    <FaKey /> Change Password
                                </CosmicButton>
                                <CosmicButton
                                    onClick={() => {
                                        if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
                                            handleDeleteAccount();
                                        }
                                    }}
                                    variant="danger"
                                    size="large"
                                    className="btn-delete-account"
                                >
                                    <FaTrash /> Delete Account
                                </CosmicButton>
                            </div>
                            </div>

                    )}

                    {viewMode === 'edit' && (
                        <form onSubmit={handleSubmit} className="profile-form">
                            <h2 className="form-title">Edit Profile</h2>
                            <div className="form-group">
                                <label className="form-label">
                                    Name <span className="required">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className={`input ${validationErrors.name ? 'input-error' : ''}`}
                                    placeholder="Your name"
                                    maxLength="100"
                                />
                                {validationErrors.name && (
                                    <span className="error-text">{validationErrors.name}</span>
                                )}
                                <span className="char-count">{formData.name.length}/100</span>
                            </div>

                            <div className="form-group">
                                <label className="form-label">About</label>
                                <textarea
                                    name="about"
                                    value={formData.about}
                                    onChange={handleChange}
                                    className={`input textarea ${validationErrors.about ? 'input-error' : ''}`}
                                    placeholder="Tell us about yourself..."
                                    rows="3"
                                    maxLength="300"
                                />
                                {validationErrors.about && (
                                    <span className="error-text">{validationErrors.about}</span>
                                )}
                            </div>

                            <div className="alert-prefs-section">
                                <h3 className="section-title">Alert Preferences</h3>

                                <div className="form-row">
                                    <div className="form-group half">
                                        <label className="form-label">Days Before Approach</label>
                                        <input
                                            type="number"
                                            name="daysBeforeApproach"
                                            value={formData.alertPreferences.daysBeforeApproach}
                                            onChange={handleAlertPrefChange}
                                            className="input"
                                        />
                                        {validationErrors.days && (
                                            <span className="error-text">{validationErrors.days}</span>
                                        )}
                                    </div>

                                    <div className="form-group half">
                                        <label className="form-label">Max Miss Distance (AU)</label>
                                        <input
                                            type="number"
                                            name="maxMissDistanceAU"
                                            value={formData.alertPreferences.maxMissDistanceAU}
                                            onChange={handleAlertPrefChange}
                                            step="0.01"
                                            className="input"
                                        />
                                        {validationErrors.distance && (
                                            <span className="error-text">{validationErrors.distance}</span>
                                        )}
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Min Diameter (KM)</label>
                                    <input
                                        type="number"
                                        name="minDiameterKM"
                                        value={formData.alertPreferences.minDiameterKM}
                                        onChange={handleAlertPrefChange}
                                        step="0.01"
                                        className="input"
                                    />
                                    {validationErrors.diameter && (
                                        <span className="error-text">{validationErrors.diameter}</span>
                                    )}
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Notify for Risk Levels</label>
                                    <div className="checkbox-group">
                                        {['LOW', 'MEDIUM', 'HIGH'].map(level => (
                                            <label key={level} className="checkbox-label">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.alertPreferences.notifyRiskLevels.includes(level)}
                                                    onChange={() => handleRiskLevelChange(level)}
                                                />
                                                <span className="checkbox-text">{level}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="form-actions">
                                <CosmicButton
                                    type="submit"
                                    disabled={updateLoading}
                                    variant="primary"
                                    size="large"
                                >
                                    {updateLoading ? 'Saving...' : <><FaSave /> Save Changes</>}
                                </CosmicButton>

                                <CosmicButton
                                    type="button"
                                    onClick={handleCancel}
                                    variant="secondary"
                                    size="large"
                                    disabled={updateLoading}
                                >
                                    <FaTimes /> Cancel
                                </CosmicButton>
                            </div>
                        </form>
                    )}

                    {viewMode === 'password' && (
                        <form onSubmit={handlePasswordSubmit} className="profile-form">
                            <h2 className="form-title">Change Password</h2>
                            <div className="form-group">
                                <label className="form-label">
                                    Current Password <span className="required">*</span>
                                </label>
                                <input
                                    type="password"
                                    name="currentPassword"
                                    value={passwordData.currentPassword}
                                    onChange={handlePasswordChange}
                                    className={`input ${validationErrors.currentPassword ? 'input-error' : ''}`}
                                    placeholder="••••••••"
                                />
                                {validationErrors.currentPassword && (
                                    <span className="error-text">{validationErrors.currentPassword}</span>
                                )}
                            </div>

                            <div className="form-group">
                                <label className="form-label">
                                    New Password <span className="required">*</span>
                                </label>
                                <input
                                    type="password"
                                    name="newPassword"
                                    value={passwordData.newPassword}
                                    onChange={handlePasswordChange}
                                    className={`input ${validationErrors.newPassword ? 'input-error' : ''}`}
                                    placeholder="••••••••"
                                />
                                {validationErrors.newPassword && (
                                    <span className="error-text">{validationErrors.newPassword}</span>
                                )}
                            </div>

                            <div className="form-group">
                                <label className="form-label">
                                    Confirm New Password <span className="required">*</span>
                                </label>
                                <input
                                    type="password"
                                    name="confirmNewPassword"
                                    value={passwordData.confirmNewPassword}
                                    onChange={handlePasswordChange}
                                    className={`input ${validationErrors.confirmNewPassword ? 'input-error' : ''}`}
                                    placeholder="••••••••"
                                />
                                {validationErrors.confirmNewPassword && (
                                    <span className="error-text">{validationErrors.confirmNewPassword}</span>
                                )}
                            </div>

                            <div className="form-actions">
                                <CosmicButton
                                    type="submit"
                                    disabled={passwordLoading}
                                    variant="primary"
                                    size="large"
                                >
                                    {passwordLoading ? 'Updating...' : <><FaSave /> Update Password</>}
                                </CosmicButton>
                                <CosmicButton
                                    type="button"
                                    onClick={handleCancel}
                                    variant="secondary"
                                    size="large"
                                    disabled={passwordLoading}
                                >
                                    <FaTimes /> Cancel
                                </CosmicButton>
                            </div>
                        </form>
                    )}
                </GlowCard>
            </div>
        </div>
    );
};

export default Profile;
