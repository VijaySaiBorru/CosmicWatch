import React, { useState, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useGetAsteroidByIdQuery } from '../redux/features/nasa/nasaApi';
import {
    useAddToWatchlistMutation,
    useRemoveFromWatchlistMutation,
    useGetWatchlistQuery,
} from '../redux/features/user/userApi';
import GlowCard from '../components/GlowCard';
import CosmicButton from '../components/CosmicButton';
import Planet from '../components/Planet';
import AsteroidVis3D from '../components/AsteroidVis3D';
import './AsteroidDetails.css';

const AsteroidDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const visRef = useRef();
    const { isAuthenticated } = useSelector((state) => state.auth);

    const handleResetVis = () => {
        if (visRef.current) {
            visRef.current.resetView();
        }
    };

    const { data: asteroid, isLoading, error } = useGetAsteroidByIdQuery(id);
    const { data: watchlistData } = useGetWatchlistQuery(undefined, {
        skip: !isAuthenticated,
    });
    const [addToWatchlist, { isLoading: addLoading }] = useAddToWatchlistMutation();
    const [removeFromWatchlist, { isLoading: removeLoading }] = useRemoveFromWatchlistMutation();

    const [message, setMessage] = useState({ text: '', type: '' });
    const [is3DExpanded, setIs3DExpanded] = useState(false);

    const isInWatchlist = watchlistData?.watchlist?.some((item) => item.id === id);

    const handleWatchlistToggle = async () => {
        if (!isAuthenticated) {
            navigate('/auth');
            return;
        }

        try {
            if (isInWatchlist) {
                await removeFromWatchlist(id).unwrap();
                setMessage({ text: 'Removed from watchlist', type: 'success' });
            } else {
                await addToWatchlist(id).unwrap();
                setMessage({ text: 'Added to watchlist ⭐', type: 'success' });
            }
            setTimeout(() => setMessage({ text: '', type: '' }), 3000);
        } catch (err) {
            setMessage({ text: err?.data?.message || 'Failed to update watchlist', type: 'error' });
            setTimeout(() => setMessage({ text: '', type: '' }), 3000);
        }
    };

    if (isLoading) {
        return (
            <div className="asteroid-details-page">
                <div className="loading-container">
                    <div className="loading-spinner" />
                    <p>Loading asteroid data...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="asteroid-details-page">
                <div className="error-container container">
                    <h1> Asteroid Not Found</h1>
                    <p>We couldn't find the asteroid you're looking for.</p>
                    <Link to="/">
                        <CosmicButton variant="primary">Go Home</CosmicButton>
                    </Link>
                </div>
            </div>
        );
    }

    if (!asteroid) return null;

    const approach = asteroid.next_close_approach || {};
    const velocity = approach.velocity || {};
    const missDistance = approach.miss_distance || {};

    return (
        <div className="asteroid-details-page">
            <div className="asteroid-planets">
                <Planet size={120} color="blue" className="asteroid-planet-1" />
                <Planet size={80} color="orange" className="asteroid-planet-2" />
                <Planet size={100} color="purple" className="asteroid-planet-3" />
            </div>

            <div className="asteroid-container container">
                <div className="nav-back">
                    <Link to={isAuthenticated ? "/dashboard" : "/"} className="back-link">
                        {isAuthenticated ? "← Back to Dashboard" : "← Back to Home"}
                    </Link>
                </div>

                {message.text && (
                    <div className={`message-banner ${message.type}`}>
                        {message.text}
                    </div>
                )}

                <div className="asteroid-header">
                    <div className="header-content">
                        <h1 className="asteroid-title">{asteroid.name}</h1>
                        <div className="asteroid-badges">
                            {asteroid.is_hazardous && (
                                <span className="badge badge-hazardous">⚠️ Potentially Hazardous</span>
                            )}
                            {!asteroid.is_hazardous && (
                                <span className="badge badge-safe"> Safe</span>
                            )}
                            {asteroid.risk_level && (
                                <span className={`badge badge-${asteroid.risk_level.toLowerCase()}`}>
                                    {asteroid.risk_level} Risk
                                </span>
                            )}
                        </div>
                    </div>

                    {isAuthenticated && (
                        <CosmicButton
                            onClick={handleWatchlistToggle}
                            disabled={addLoading || removeLoading}
                            variant={isInWatchlist ? 'secondary' : 'primary'}
                            size="large"
                        >
                            {addLoading || removeLoading
                                ? 'Updating...'
                                : isInWatchlist
                                    ? '★ In Watchlist'
                                    : '☆ Add to Watchlist'}
                        </CosmicButton>
                    )}
                </div>

                <section className="metrics-section">
                    <h2 className="section-title">📊 Key Metrics</h2>
                    <div className="metrics-grid">
                        <GlowCard glowColor="blue" className="metric-card">
                            <div className="metric-icon">📏</div>
                            <div className="metric-label">Estimated Diameter</div>
                            <div className="metric-value">
                                {asteroid.diameter_km?.min?.toFixed(3) || 'N/A'} - {asteroid.diameter_km?.max?.toFixed(3) || 'N/A'} km
                            </div>
                        </GlowCard>

                        <GlowCard glowColor="purple" className="metric-card">
                            <div className="metric-icon">🚀</div>
                            <div className="metric-label">Relative Velocity</div>
                            <div className="metric-value">
                                {velocity.km_h ? Number(velocity.km_h).toLocaleString() + ' km/h' : 'N/A'}
                            </div>
                        </GlowCard>

                        <GlowCard glowColor="cyan" className="metric-card">
                            <div className="metric-icon">🎯</div>
                            <div className="metric-label">Miss Distance</div>
                            <div className="metric-value">
                                {missDistance.km ? Number(missDistance.km).toLocaleString() + ' km' : 'N/A'}
                            </div>
                        </GlowCard>

                        <GlowCard glowColor="orange" className="metric-card">
                            <div className="metric-icon">🌍</div>
                            <div className="metric-label">Lunar Distance</div>
                            <div className="metric-value">
                                {missDistance.lunar ? Number(missDistance.lunar).toFixed(2) + ' LD' : 'N/A'}
                            </div>
                        </GlowCard>
                    </div>
                </section>

                {approach.date && (
                    <section className="approach-section">
                        <h2 className="section-title">🛸 Next Close Approach</h2>
                        <GlowCard glowColor="purple" className="approach-card">
                            <div className="approach-grid">
                                <div className="approach-item">
                                    <span className="approach-label">Date</span>
                                    <span className="approach-value">
                                        {new Date(approach.date).toLocaleDateString()}
                                    </span>
                                </div>

                                <div className="approach-item">
                                    <span className="approach-label">Orbiting Body</span>
                                    <span className="approach-value">{approach.orbiting_body || 'Earth'}</span>
                                </div>

                                <div className="approach-item">
                                    <span className="approach-label">Velocity (km/s)</span>
                                    <span className="approach-value">
                                        {velocity.km_s ? Number(velocity.km_s).toFixed(2) + ' km/s' : 'N/A'}
                                    </span>
                                </div>

                                <div className="approach-item">
                                    <span className="approach-label">AU Distance</span>
                                    <span className="approach-value">
                                        {missDistance.au ? Number(missDistance.au).toFixed(4) + ' AU' : 'N/A'}
                                    </span>
                                </div>
                            </div>
                        </GlowCard>
                    </section>
                )}

                {missDistance.km && asteroid.diameter_km?.max && (
                    <section className={`visualization-section ${is3DExpanded ? 'visualization-expanded' : ''}`}>
                        <div className="visualization-header">
                            <div className="header-main-info">
                                <h2 className="section-title">
                                    3D Orbital Visualization {asteroid.orbital_data ? '(Keplerian)' : '(Artistic)'}
                                </h2>
                                <p className="vis-usage-desc">
                                    {asteroid.orbital_data 
                                        ? "Visualize using real orbital mechanics (scaled). Earth at center." 
                                        : "Artistic orbital representation. Scales and distances are artistic."}
                                </p>
                            </div>
                            <div className="vis-actions-wrapper">
                                <div className="vis-quick-controls">
                                    <span>Left Click • Rotate</span>
                                    <span>Scroll • Zoom</span>
                                    <span>Right Click • Pan</span>
                                </div>
                                <div className="vis-actions">
                                <button 
                                    className="header-action-btn reset-btn"
                                    onClick={handleResetVis}
                                    title="Reset Visualization View"
                                >
                                    🔄 Reset
                                </button>
                                <button 
                                    className="header-action-btn expand-btn"
                                    onClick={() => setIs3DExpanded(!is3DExpanded)}
                                    title={is3DExpanded ? "Exit Fullscreen" : "Enter Fullscreen"}
                                >
                                    {is3DExpanded ? "✕ Close" : "⛶ Fullscreen"}
                                </button>
                                </div>
                            </div>
                        </div>
                        <GlowCard glowColor="purple" className="visualization-card">
                            <div style={{ height: is3DExpanded ? 'calc(100vh - 4rem)' : '500px', width: '100%' }}>
                                <AsteroidVis3D
                                    ref={visRef}
                                    missDistanceKm={missDistance.km}
                                    diameterMaxKm={asteroid.diameter_km.max}
                                    isHazardous={asteroid.is_hazardous}
                                    orbitalData={asteroid.orbital_data}
                                    showTitle={false}
                                    style={{ height: '100%', minHeight: '0' }}
                                />
                            </div>
                        </GlowCard>
                    </section>
                )}

                <section className="links-section">
                    <h2 className="section-title">🔗 More Information</h2>
                    <div className="links-grid">
                        <a
                            href={asteroid.nasa_jpl_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="nasa-link"
                        >
                            <GlowCard glowColor="blue" className="link-card">
                                <div className="link-icon">🛰️</div>
                                <div className="link-text">
                                    <div className="link-title">NASA JPL</div>
                                    <div className="link-subtitle">View on NASA's Jet Propulsion Laboratory</div>
                                </div>
                                <div className="link-arrow">→</div>
                            </GlowCard>
                        </a>
                    </div>
                </section>

                <section className="technical-section">
                    <h2 className="section-title">🔬 Technical Details</h2>
                    <GlowCard glowColor="cyan" className="technical-card">
                        <div className="technical-grid">
                            <div className="technical-item">
                                <span className="technical-label">NEO Reference ID</span>
                                <span className="technical-value">{asteroid.id}</span>
                            </div>

                            <div className="technical-item">
                                <span className="technical-label">Diameter (meters)</span>
                                <span className="technical-value">
                                    {asteroid.diameter_km?.min && asteroid.diameter_km?.max
                                        ? `${(asteroid.diameter_km.min * 1000).toFixed(0)} - ${(asteroid.diameter_km.max * 1000).toFixed(0)} m`
                                        : 'N/A'}
                                </span>
                            </div>

                            <div className="technical-item">
                                <span className="technical-label">Sentry Object</span>
                                <span className="technical-value">
                                    {asteroid.is_sentry_object ? 'Yes' : 'No'}
                                </span>
                            </div>

                            <div className="technical-item">
                                <span className="technical-label">Risk Level</span>
                                <span className="technical-value">
                                    {asteroid.risk_level || 'LOW'}
                                </span>
                            </div>
                        </div>
                    </GlowCard>
                </section>
            </div>

        </div>
    );
};

export default AsteroidDetails;
