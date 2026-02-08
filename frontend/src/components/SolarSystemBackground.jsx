import React from 'react';
import './SolarSystemBackground.css';

const SolarSystemBackground = () => {
    return (
        <div className="solar-system-background">
            <div className="stars-layer stars-small">
                {Array.from({ length: 100 }, (_, i) => {
                    const top = Math.random() * 100;
                    const left = Math.random() * 100;
                    const delay = Math.random() * 3;
                    const duration = 2 + Math.random() * 2;

                    return (
                        <div
                            key={`star-small-${i}`}
                            className="star star-small"
                            style={{
                                top: `${top}%`,
                                left: `${left}%`,
                                animationDelay: `${delay}s`,
                                animationDuration: `${duration}s`
                            }}
                        />
                    );
                })}
            </div>

            <div className="stars-layer stars-medium">
                {Array.from({ length: 50 }, (_, i) => {
                    const top = Math.random() * 100;
                    const left = Math.random() * 100;
                    const delay = Math.random() * 3;
                    const duration = 2 + Math.random() * 2;

                    return (
                        <div
                            key={`star-medium-${i}`}
                            className="star star-medium"
                            style={{
                                top: `${top}%`,
                                left: `${left}%`,
                                animationDelay: `${delay}s`,
                                animationDuration: `${duration}s`
                            }}
                        />
                    );
                })}
            </div>

            <div className="nebula nebula-1" />
            <div className="nebula nebula-2" />
            <div className="nebula nebula-3" />

            <div className="solar-system">
                <div className="sun">
                    <div className="sun-core" />
                    <div className="sun-glow" />
                </div>

                <div className="orbit orbit-mercury">
                    <div className="planet-orbit-container mercury-container">
                        <div className="planet planet-mercury">
                            <div className="planet-surface" />
                        </div>
                    </div>
                </div>

                <div className="orbit orbit-venus">
                    <div className="planet-orbit-container venus-container">
                        <div className="planet planet-venus">
                            <div className="planet-surface" />
                        </div>
                    </div>
                </div>

                <div className="orbit orbit-earth">
                    <div className="planet-orbit-container earth-container">
                        <div className="planet planet-earth">
                            <div className="planet-surface" />
                            <div className="planet-clouds" />
                        </div>
                    </div>
                </div>

                <div className="orbit orbit-mars">
                    <div className="planet-orbit-container mars-container">
                        <div className="planet planet-mars">
                            <div className="planet-surface" />
                        </div>
                    </div>
                </div>

                <div className="orbit orbit-jupiter">
                    <div className="planet-orbit-container jupiter-container">
                        <div className="planet planet-jupiter">
                            <div className="planet-surface" />
                            <div className="planet-bands" />
                        </div>
                    </div>
                </div>

                <div className="orbit orbit-saturn">
                    <div className="planet-orbit-container saturn-container">
                        <div className="planet planet-saturn">
                            <div className="planet-surface" />
                            <div className="saturn-ring" />
                        </div>
                    </div>
                </div>

                <div className="orbit orbit-uranus">
                    <div className="planet-orbit-container uranus-container">
                        <div className="planet planet-uranus">
                            <div className="planet-surface" />
                        </div>
                    </div>
                </div>

                <div className="orbit orbit-neptune">
                    <div className="planet-orbit-container neptune-container">
                        <div className="planet planet-neptune">
                            <div className="planet-surface" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SolarSystemBackground;
