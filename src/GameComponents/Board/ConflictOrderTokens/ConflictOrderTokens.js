import React from 'react';
import { useSelector } from 'react-redux';

import { getConflictOrderTokensWithPositions } from 'GameLogic/utils/conflictOrderTokens';

import ConflictOrderToken from './ConflictOrderToken';
import './ConflictOrderTokens.scss';

const ConflictOrderTokens = () => {
    const hexes = useSelector(({ board }) => board.hexes)
    const maxRegionNumber = useSelector(({ board }) => board.maxRegionNumber)

    const regionsWithPositions = getConflictOrderTokensWithPositions({ hexes, maxRegionNumber });

    return (
        <div>
            {
                regionsWithPositions.map(({ regionNumber, x, y }) => (
                    <div style={{
                        position: "absolute",
                        left: x * 50 - 5,
                        top: y * 50
                    }} key={regionNumber}>
                        <ConflictOrderToken number={regionNumber} />
                    </div>
                ))
            }
        </div>
    )
}

export default ConflictOrderTokens;
