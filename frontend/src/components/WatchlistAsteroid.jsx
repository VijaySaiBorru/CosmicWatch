import React from 'react';
import { Link } from 'react-router-dom';
import { useGetAsteroidByIdQuery } from '../redux/features/nasa/nasaApi';
import GlowCard from './GlowCard';
import './WatchlistAsteroid.css';

const WatchlistAsteroid = ({ asteroidId }) => {
    const { data: asteroid, isLoading, error } = useGetAsteroidByIdQuery(asteroidId);

    if (isLoading) {
        return (
            <div className="watchlist-asteroid-loading">
                <div className="loading-spinner-small"></div>
            </div>
        );
    }

    if (error || !asteroid) {
        return null;
    }

    return (
        <Link to={`/asteroid/${asteroidId}`} className="watchlist-asteroid-link">
            <GlowCard glowColor={asteroid.is_hazardous ? "red" : "blue"} className="watchlist-asteroid-card">
                <div className="watchlist-asteroid-content">
                    <span className="watchlist-asteroid-name">{asteroid.name}</span>
                    <span className="watchlist-asteroid-id">ID: {asteroid.id}</span>
                </div>
            </GlowCard>
        </Link>
    );
};

export default WatchlistAsteroid;
