import React from 'react';

import HexColumn from './HexColumn';
import Borders from './Borders/Borders';

import './Board.scss'
// first and last col has offset 1
const Board = ({ hexes }) => {

    return (
        <div className="board">
            {
                hexes.map(({ fields }, index) => <HexColumn
                    key={index}
                    yOffset={index % 2 === 0 ? 0 : 0.5}
                    columnNumber={index}
                    columnData={hexes[index]} />)
            }
            <Borders />
        </div>
    )
}

export default Board;
