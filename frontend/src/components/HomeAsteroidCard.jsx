import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import GlowCard from './GlowCard';
import { useGetWatchlistQuery, useAddToWatchlistMutation, useRemoveFromWatchlistMutation } from '../redux/features/user/userApi';

const HomeAsteroidCard = ({ asteroid, index }) => {
    const { user } = useSelector((state) => state.auth);
    const { data: watchlistData } = useGetWatchlistQuery(undefined, { skip: !user });
    const [addToWatchlist] = useAddToWatchlistMutation();
    const [removeFromWatchlist] = useRemoveFromWatchlistMutation();

    const isInWatchlist = watchlistData?.watchlist?.some(item => 
        (typeof item === 'string' ? item : item.id) === asteroid.id
    );

    const handleWatchlistToggle = async () => {
        if (isInWatchlist) {
            await removeFromWatchlist(asteroid.id);
        } else {
            await addToWatchlist(asteroid.id);
        }
    };

    return (
        <GlowCard
            glowColor={asteroid.is_hazardous ? 'red' : 'blue'}
            className="asteroid-card animate-fadeInUp"
            style={{ animationDelay: `${index * 0.1}s` }}
        >
            <div className="asteroid-icon">
                {asteroid.is_hazardous ? '☄️' : '🌑'}
            </div>

            <h3 className="asteroid-name">{asteroid.name}</h3>

            <div className="asteroid-details">
                <div className="detail-item">
                    <span className="detail-label">Diameter:</span>
                    <span className="detail-value">
                        {asteroid.diameter_km.min.toFixed(3)} – {asteroid.diameter_km.max.toFixed(3)} km
                    </span>
                </div>

                <div className="detail-item">
                    <span className="detail-label">Miss Distance:</span>
                    <span className="detail-value">
                        {Number(asteroid.miss_distance.km).toLocaleString()} km
                    </span>
                </div>

                <div className="detail-item">
                    <span className="detail-label">Hazardous:</span>
                    <span className={asteroid.is_hazardous ? "hazard-yes" : "hazard-no"}>
                        {asteroid.is_hazardous ? "Yes" : "No"}
                    </span>
                </div>
            </div>

            <div className="asteroid-actions">
                <Link
                    to={`/asteroid/${asteroid.id}`}
                    className="asteroid-link"
                >
                    View Details →
                </Link>

                {user && (
                    <button
                        onClick={handleWatchlistToggle}
                        className={`watch-button ${isInWatchlist ? 'active' : ''}`}
                    >
                        {isInWatchlist ? '✅ Watching' : '⭐ Watch'}
                    </button>
                )}
            </div>
        </GlowCard>
    );
};

export default HomeAsteroidCard;
