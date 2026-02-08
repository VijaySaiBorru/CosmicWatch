import React from 'react';
import './SpaceBackground.css';

const SpaceBackground = () => {
  const generateStars = (count, className) => {
    return Array.from({ length: count }, (_, i) => {
      const top = Math.random() * 100;
      const left = Math.random() * 100;
      const delay = Math.random() * 3;
      const duration = 2 + Math.random() * 2;
      
      return (
        <div
          key={`${className}-${i}`}
          className={className}
          style={{
            top: `${top}%`,
            left: `${left}%`,
            animationDelay: `${delay}s`,
            animationDuration: `${duration}s`
          }}
        />
      );
    });
  };

  return (
    <div className="space-background">
      <div className="stars-layer stars-small">
        {generateStars(100, 'star star-small')}
      </div>
      <div className="stars-layer stars-medium">
        {generateStars(50, 'star star-medium')}
      </div>
      <div className="stars-layer stars-large">
        {generateStars(20, 'star star-large')}
      </div>
      
      <div className="nebula nebula-1" />
      <div className="nebula nebula-2" />
      <div className="nebula nebula-3" />
    </div>
  );
};

export default SpaceBackground;
