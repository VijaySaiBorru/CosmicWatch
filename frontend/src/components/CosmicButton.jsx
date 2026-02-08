import React from 'react';
import './CosmicButton.css';

const CosmicButton = ({
    children,
    variant = 'primary',
    size = 'medium',
    onClick,
    disabled = false,
    className = '',
    ...props
}) => {
    const buttonClass = `cosmic-button cosmic-button-${variant} cosmic-button-${size} ${className}`;

    return (
        <button
            className={buttonClass}
            onClick={onClick}
            disabled={disabled}
            {...props}
        >
            <span className="cosmic-button-content">{children}</span>
            <span className="cosmic-button-glow" />
        </button>
    );
};

export default CosmicButton;
