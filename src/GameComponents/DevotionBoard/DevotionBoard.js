import React from 'react';

import DevotionField from './DevotionField';
import './DevotionBoard.scss';

const getType = index => {
    if (index === 0) {
        return 'orange';
    }
    if (index === 27) {
        return 'black';
    }
    if (index <= 20) {
        return 'red';
    }
    return 'green';
}

const getCords = index => {
    const isRowAsc = parseInt(index / 4) % 2 === 0;
    const itemInRowNo = index % 4;

    return {
        x: isRowAsc ? 10 + itemInRowNo * 26 : 115 - itemInRowNo * 26,
        y: 20 + index * 14,
    }
}

const DevotionBoard = ({ devotion }) => {
    const fields = new Array(28).fill(0).map((field, index) => ({
        type: getType(index),
        ...getCords(index),
        players: devotion.filter(player => player.devotion === index)
    }))
    return <div className="devotionBoard">
        <div className="devotionTitle">Devotion</div>
        {
            fields.map(
                (field, index) => <DevotionField key={index} field={field} />
            )
        }
    </div>
}

export default DevotionBoard;