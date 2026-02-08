import React from 'react';
import './GlowCard.css';

const GlowCard = ({
    children,
    glowColor = 'blue',
    className = '',
    onClick,
    ...props
}) => {
    return (
        <div
            className={`glow-card glow-card-${glowColor} ${className}`}
            onClick={onClick}
            {...props}
        >
            {children}
        </div>
    );
};

export default GlowCard;
