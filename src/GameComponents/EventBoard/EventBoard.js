import React from 'react';

import EventField from './EventField';
import { eventBoardConfig } from './eventBoardConfig';

import './EventBoard.scss';

const getCords = (index) => {
    const offsetX = 40;
    const offsetY = 25;
    let y = 10;
    let x = 10 + index * offsetX;
    if (index === 7) {
        y = y + offsetY;
        x = 290;
    } else if (index < 13 && index > 7) {
        y = y + 2 * offsetY;
        x = 290 - (index - 7) * offsetX;
    } else if (index === 13) {
        y = y + 3 * offsetY;
        x = 10 + offsetX;
    } else if (index > 13) {
        y = y + 4 * offsetY;
        x = 10 + offsetX + (index - 13) * offsetX;
    }

    return {
        x,
        y
    }
}

const EventBoard = ({ event }) => {
    return <div className="eventBoard">
        <div className="label">Events</div>
        {
            eventBoardConfig.map((entry, index) =>
                <EventField
                    key={index}
                    isActive={event === index}
                    colorCode={entry}
                    cords={getCords(index)}
                />)
        }
    </div>
}

export default EventBoard;