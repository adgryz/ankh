import React from 'react';

import './GuardianCard.scss'

const GuardianCard = ({ name, image, level, description }) => {
    return (
        <div className="guardianCard">
            <div className="imageWrapper">
                <img alt="guradian" src={image} className={image} />
            </div>
            <div className="info">
                <div className="level">{level}</div>
                <div className="name">{name}</div>
                <div className="description">{description}</div>
            </div>
        </div>
    )
}

export default GuardianCard;