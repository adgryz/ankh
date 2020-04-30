import React from 'react';
import { useSelector } from 'react-redux';
import './Figure.scss';


const Figure = ({ figureId }) => {
    const players = useSelector(({ game }) => game.players)
    const isGod = figureId.startsWith('g');
    const size = isGod ? 35 : 25;
    return (
        <div style={{ position: 'relative' }}>
            <img width={size} height={size} src={getFigureImg(players, figureId)} alt="figure" />
        </div>
    )
};

const getFigureImg = (players, figureId) => {
    const playerId = 'p' + figureId[1];
    const playerGodName = players[playerId].god.name;
    if (figureId.startsWith('g')) {
        return require(`./figures/${playerGodName}.png`)
    }
    if (figureId.startsWith('w')) {
        return require(`./figures/${playerGodName}Warrior.png`)
    }
    if (figureId.startsWith('s')) {
        return null;
    }
}

export default Figure;