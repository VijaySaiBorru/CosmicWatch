import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useGetWatchlistQuery, useAddToWatchlistMutation, useRemoveFromWatchlistMutation } from '../redux/features/user/userApi';
import './AsteroidCard.css';

const AsteroidCard = ({ asteroid, animationDelay = 0 }) => {
    const { user } = useSelector((state) => state.auth);
    const { data: watchlistData } = useGetWatchlistQuery(undefined, { skip: !user });
    const [addToWatchlist] = useAddToWatchlistMutation();
    const [removeFromWatchlist] = useRemoveFromWatchlistMutation();

    const isInWatchlist = watchlistData?.watchlist?.some(item => 
        (typeof item === 'string' ? item : item.id) === asteroid.id
    );

    const handleWatchlistToggle = async (e) => {
        e.preventDefault(); 
        e.stopPropagation();
        
        if (isInWatchlist) {
            await removeFromWatchlist(asteroid.id);
        } else {
            await addToWatchlist(asteroid.id);
        }
    };

    const getRiskColor = (riskLevel) => {
        switch (riskLevel) {
            case 'HIGH':
                return 'risk-high';
            case 'MEDIUM':
                return 'risk-medium';
            default:
                return 'risk-low';
        }
    };

    const getRiskIcon = (riskLevel) => {
        switch (riskLevel) {
            case 'HIGH':
                return '🔴';
            case 'MEDIUM':
                return '🟡';
            default:
                return '🟢';
        }
    };

    const style = animationDelay ? { animationDelay: `${animationDelay}s` } : {};

    return (
        <article className={`asteroid-card ${getRiskColor(asteroid.risk_level)}`} style={style}>
            <div className="asteroid-card-header">
                <div className="asteroid-icon">
                    {getRiskIcon(asteroid.risk_level)}
                </div>
                <div className="asteroid-risk-badge">
                    {asteroid.risk_level}
                </div>
            </div>

            <h3 className="asteroid-card-title">{asteroid.name}</h3>

            <div className="asteroid-stats-grid">
                <div className="asteroid-stat">
                    <span className="stat-icon">⚡</span>
                    <div className="stat-content">
                        <span className="stat-label">Velocity</span>
                        <span className="stat-value">
                            {asteroid.velocity?.km_h ?
                                `${Number(asteroid.velocity.km_h).toLocaleString()} km/h` :
                                'N/A'
                            }
                        </span>
                    </div>
                </div>

                <div className="asteroid-stat">
                    <span className="stat-icon">📏</span>
                    <div className="stat-content">
                        <span className="stat-label">Miss Distance</span>
                        <span className="stat-value">
                            {asteroid.miss_distance?.km ?
                                `${Number(asteroid.miss_distance.km).toLocaleString()} km` :
                                'N/A'
                            }
                        </span>
                    </div>
                </div>
            </div>

            <div className="asteroid-card-actions">
                <Link
                    to={`/asteroid/${asteroid.id}`}
                    className="asteroid-card-link"
                >
                    View Details →
                </Link>

                {user && (
                    <button 
                        className={`watch-button ${isInWatchlist ? 'active' : ''}`}
                        onClick={handleWatchlistToggle}
                    >
                        {isInWatchlist ? '✅ Watching' : '⭐ Watch'}
                    </button>
                )}
            </div>
        </article>
    );
};

export default AsteroidCard;
