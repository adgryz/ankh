import React from 'react';

import './DevotionField.scss';

import eye from './eye.svg';
import startDevotion from './startDevotion.svg';
import topDevotion from './topDevotion.svg';

const DevotionField = ({ field }) => {
    const { type, x, y, players } = field;
    return <div className="devotionField"
        style={{
            left: x,
            bottom: y,
            borderColor: type,
            backgroundColor: 'white'
        }} >
        {
            players.length > 0 && <div className="playerBackground">
                {players.map(player => <div key={player.color} style={{ flexGrow: 1, backgroundColor: player.color }} />)}
            </div>
        }
        {type === 'orange' && <img src={startDevotion} width={16} height={16} alt="img" />}
        {(type === 'red' || type === 'green') && <img src={eye} width={16} height={16} alt="img" />}
        {type === 'black' && <img src={topDevotion} width={16} height={16} alt="img" style={{ marginTop: '-3px' }} />}
    </div>
}

export default DevotionField;