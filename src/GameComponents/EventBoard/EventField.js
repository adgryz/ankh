import React from 'react';

import './EventField.scss';
import canoe from './canoe.svg';
import battle from './battle.svg';
import wave from './wave.svg';
import pyramid from './pyramid.svg';


const EventField = ({ isActive, colorCode, cords }) => {
    const color = getColor(colorCode, isActive)
    return <div
        className="eventField"
        style={{
            borderRadius: colorCode === "battle" ? "8px" : '50%',
            backgroundColor: isActive ? 'blue' : color,
            left: cords.x,
            top: cords.y,
        }}>
        {colorCode === 'START' && <img alt="event" src={canoe} width={18} height={18} />}
        {colorCode === 'BATTLE' && <img alt="event" src={battle} width={18} height={18} />}
        {colorCode === 'RIVER' && <img alt="event" src={wave} width={18} height={18} />}
        {colorCode === 'CONTROL' && <img alt="event" src={pyramid} width={18} height={18} />}
    </div>
}

const getColor = (colorCode) => {
    switch (colorCode) {
        case 'BATTLE':
            return 'red';
        case 'START':
            return 'yellow';
        case 'RIVER':
            return 'lightblue';
        case 'CONTROL':
            return 'orange';
        default:
            return 'green';
    }
}

export default EventField;