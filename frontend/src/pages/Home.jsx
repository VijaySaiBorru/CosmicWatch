import React from "react";
import { useGetAsteroidsTodayQuery } from "../redux/features/nasa/nasaApi";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import HomeAsteroidCard from "../components/HomeAsteroidCard";
import Planet from "../components/Planet";
import CosmicButton from "../components/CosmicButton";
import './Home.css';

const Home = () => {
  const today = new Date().toISOString().split("T")[0];
  const { isAuthenticated } = useSelector((state) => state.auth);

  const { data, isLoading, isError } =
    useGetAsteroidsTodayQuery(today);

  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="hero-planets">
          <Planet size={150} color="blue" className="hero-planet-earth" />
          <Planet size={80} color="orange" className="hero-planet-mars" />
          <Planet size={60} color="purple" className="hero-planet-small" />
        </div>

        <div className="hero-content container">
          <h1 className="hero-title animate-fadeInUp">
            Welcome to <span className="text-gradient">CosmicWatch</span>
          </h1>

          <p className="hero-subtitle animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
            Explore real NASA data to discover near-Earth asteroids,
            understand close approaches, and track celestial objects of interest.
          </p>

          <div className="hero-buttons animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
            <CosmicButton variant="primary" size="large" onClick={() => window.scrollTo({ top: 600, behavior: 'smooth' })}>
               Explore Today
            </CosmicButton>

            {!isAuthenticated && (
              <Link to="/auth">
                <CosmicButton variant="secondary" size="large">
                  ✨ Get Started
                </CosmicButton>
              </Link>
            )}
          </div>
        </div>
      </section>

      <section className="asteroids-section container section-space">
        <h2 className="section-title">
           Asteroids Approaching Earth Today
        </h2>

        {isLoading && (
          <div className="loading-state">
            <div className="loading-spinner" />
            <p>Scanning the cosmos for asteroids...</p>
          </div>
        )}

        {isError && (
          <div className="error-state">
            <p>⚠️ Failed to load asteroid data</p>
          </div>
        )}

        {data?.asteroids && (
          <>
            <p className="asteroids-count">
              Total asteroids detected today:{" "}
              <span className="count-highlight">
                {data.count}
              </span>
            </p>

            <div className="asteroids-grid">
              {data.asteroids.slice(0, 6).map((a, index) => (
                <HomeAsteroidCard 
                  key={a.id} 
                  asteroid={a} 
                  index={index} 
                />
              ))}
            </div>
          </>
        )}
      </section>

      <section className="how-it-works container section-space">
        <h2 className="section-title">
          How CosmicWatch Works
        </h2>

        <div className="orbit-timeline">
          <div className="timeline-step">
            <div className="step-planet">
              <Planet size={60} color="blue" />
            </div>
            <div className="step-content">
              <h3>1. Browse Asteroids</h3>
              <p>Explore near-Earth asteroids by date using NASA's real-time data</p>
            </div>
          </div>

          <div className="timeline-connector" />

          <div className="timeline-step">
            <div className="step-planet">
              <Planet size={60} color="purple" />
            </div>
            <div className="step-content">
              <h3>2. View Details</h3>
              <p>Access comprehensive data on size, velocity, and close approach dates</p>
            </div>
          </div>

          <div className="timeline-connector" />

          <div className="timeline-step">
            <div className="step-planet">
              <Planet size={60} color="orange" />
            </div>
            <div className="step-content">
              <h3>3. Track & Monitor</h3>
              <p>Save asteroids to your watchlist and receive alerts for close approaches</p>
            </div>
          </div>
        </div>

      </section>
    </div>
  );
};

export default Home;
