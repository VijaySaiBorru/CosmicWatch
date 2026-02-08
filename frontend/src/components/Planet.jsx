import React from 'react';
import './Planet.css';

const Planet = ({
    size = 100,
    color = 'blue',
    withOrbit = false,
    orbitRadius = 150,
    orbitDuration = 20,
    className = '',
    style = {}
}) => {
    const planetClass = `planet planet-${color} ${className}`;

    return (
        <div className="planet-container" style={style}>
            {withOrbit && (
                <div
                    className="orbit-path"
                    style={{
                        width: orbitRadius * 2,
                        height: orbitRadius * 2,
                    }}
                />
            )}
            <div
                className={planetClass}
                style={{
                    width: size,
                    height: size,
                    ...(withOrbit && {
                        animation: `orbit ${orbitDuration}s linear infinite`,
                    })
                }}
            >
                <div className="planet-surface" />
                <div className="planet-glow" />
            </div>
        </div>
    );
};

export default Planet;
