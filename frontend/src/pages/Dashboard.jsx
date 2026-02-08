import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import GlowCard from "../components/GlowCard";
import Planet from "../components/Planet";
import AlertCard from "../components/AlertCard";
import AsteroidCard from "../components/AsteroidCard";
import './Dashboard.css';

import { useGetAsteroidsTodayQuery } from "../redux/features/nasa/nasaApi";
import { useGetWatchlistQuery } from "../redux/features/user/userApi";
import { useGetAlertsQuery } from "../redux/features/nasa/nasaApi";

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const today = new Date().toISOString().split("T")[0];

  const { data: feedData, isLoading: feedLoading } = useGetAsteroidsTodayQuery(today);
  const { data: watchlistData, isLoading: watchlistLoading } = useGetWatchlistQuery();
  const { data: alertsData, isLoading: alertsLoading } = useGetAlertsQuery();

  return (
    <div className="dashboard-page container">
      <div className="dashboard-container">

        <section>
          <h1 className="text-3xl font-bold text-white">
            Dashboard
          </h1>
          <p className="text-slate-400 mt-1">
            Welcome back, {user?.name}. Stay informed about near-Earth objects 🌍
          </p>
        </section>

        <section className="stats-overview">
          <AlertCard
            type="warning"
            icon="🚨"
            title="Active Alerts"
            description="Asteroids requiring attention"
            count={alertsData?.alerts?.length || 0}
          />
          <AlertCard
            type="success"
            icon="⭐"
            title="Watchlist"
            description="Tracked asteroids"
            count={watchlistData?.watchlist?.length || 0}
          />
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-4">
             Active Alerts
          </h2>

          <div className="alert-cards-grid">
            {!alertsData?.alerts?.length ? (
              <AlertCard
                type="success"
                icon="✅"
                title="No Active Alerts"
                description="No upcoming threats based on your alert preferences."
              />
            ) : (
              alertsData?.alerts?.map((alert, index) => (
                <AlertCard
                  key={alert.asteroidId}
                  type="critical"
                  icon="⚠️"
                  title={alert.name}
                  description={alert.message}
                  metadata={{
                    date: alert.close_approach_date,
                    link: alert.nasa_jpl_url
                  }}
                  animationDelay={index * 0.1}
                />
              ))
            )}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-4">
             Your Watchlist
          </h2>

          {watchlistData?.watchlist?.length === 0 && (
            <p className="text-slate-400">
              You haven’t added any asteroids yet.
            </p>
          )}

            <div className="asteroids-grid">
              {watchlistData?.watchlist?.map((a, index) => (
                <AsteroidCard
                  key={a.id}
                  asteroid={{
                    ...a,
                    velocity: a.next_close_approach?.velocity,
                    miss_distance: a.next_close_approach?.miss_distance
                  }}
                  animationDelay={index * 0.08}
                />
              ))}
            </div>
        </section>

      </div>
    </div>
  );
};

export default Dashboard;
