import React from 'react';

import HexColumn from './HexColumn';

import './Board.scss'
// first and last col has offset 1
const Board = ({ board }) => {

    return (
        <div className="board">
            {
                board.map(({ fields }, index) => <HexColumn
                    key={index}
                    yOffset={index % 2 === 0 ? 0 : 0.5}
                    columnNumber={index}
                    columnData={board[index]} />)
            }
        </div>
    )
}

export default Board;
