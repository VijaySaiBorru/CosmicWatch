import React from 'react';
import { Link } from 'react-router-dom';
import './AlertCard.css';

const AlertCard = ({
    type = 'info',
    icon,
    title,
    description,
    count,
    metadata,
    animationDelay = 0,
    onClick
}) => {
    const cardClass = `alert-card alert-card-${type}`;
    const style = animationDelay ? { animationDelay: `${animationDelay}s` } : {};

    return (
        <article
            className={cardClass}
            style={style}
            onClick={onClick}
            role={onClick ? 'button' : 'article'}
            tabIndex={onClick ? 0 : undefined}
        >
            {count !== undefined && count > 0 && (
                <div className="alert-card-badge" aria-label={`${count} items`}>
                    {count}
                </div>
            )}

            <div className="alert-card-icon-wrapper">
                <div className="alert-card-icon">
                    <span className="alert-icon-symbol" aria-hidden="true">
                        {icon}
                    </span>
                </div>
            </div>

            <div className="alert-card-content">
                <h3 className="alert-card-title">{title}</h3>

                {description && (
                    <p className="alert-card-description">{description}</p>
                )}

                {metadata && (
                    <div className="alert-card-metadata">
                        {metadata.date && (
                            <span className="alert-metadata-item">
                                📅 {metadata.date}
                            </span>
                        )}
                        {metadata.link && (
                            <a
                                href={metadata.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="alert-metadata-link"
                                onClick={(e) => e.stopPropagation()}
                            >
                                View on NASA →
                            </a>
                        )}
                    </div>
                )}
            </div>
        </article>
    );
};

export default AlertCard;
