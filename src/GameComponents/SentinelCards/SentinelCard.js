import React from 'react';
import { useSelector } from 'react-redux'

import Figure from 'GameComponents/Board/Figure';

import './SentinelCard.scss'

const SentinelCard = ({ name, id, image, level, description }) => {
    const count = useSelector(({ figures }) => Object.values(figures.sentinels)
        .filter(sentinel => sentinel.level === level && !sentinel.playerId).length)

    return (
        <div>
            <div className="sentinelCard">
                <div className="imageWrapper">
                    <img alt="guardian" src={image} className={image} />
                </div>
                <div className="info">
                    <div className="level">{level}</div>
                    <div className="name">{name}</div>
                    <div className="description">{description}</div>
                </div>
            </div>
            <div >
                {
                    new Array(count).fill(0).map((x, index) =>
                        <div className="sentinelWrapper" key={index}>
                            <Figure figureId={`${id}_${index + 1}`} />
                        </div>)
                }
            </div>
        </div>


    )
}

export default SentinelCard;