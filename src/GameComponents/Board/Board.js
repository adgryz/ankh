import React from 'react';
import { useSelector } from 'react-redux';

import HexColumn from './HexColumn';
import Borders from './Borders/Borders';
import ConflictOrderTokens from './ConflictOrderTokens/ConflictOrderTokens';
import ConflictOrderTokensToggle from 'GameComponents/UI/ConflictOrderTokensToggle'
import './Board.scss'

// first and last col has offset 1
const Board = ({ hexes, borders }) => {
    const areConflictOrderTokensShown = useSelector(({ board }) => board.areConflictOrderTokensShown);

    return (
        <div className="board">
            <ConflictOrderTokensToggle />
            {
                hexes.map(({ fields }, index) => <HexColumn
                    key={index}
                    yOffset={index % 2 === 0 ? 0 : 0.5}
                    columnNumber={index}
                    columnData={hexes[index]} />)
            }
            <Borders borders={borders} />
            {
                areConflictOrderTokensShown && <ConflictOrderTokens />
            }
        </div>
    )
}

export default Board;
