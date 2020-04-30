import React from 'react';

import { CONFLICT_TYPE } from 'GameLogic/conflicts/getConflicts'

import Figure from 'GameComponents/Board/Figure'
import './ConflictRow.scss'

const ConflictRow = ({ conflict, isActive }) => {
    const { regionNumber, conflictType } = conflict;
    const getPlayerGod = playerId => playerId.replace('p', 'g');

    return (
        <div className="conflictRow">
            <div className="regionNumber">{regionNumber}</div>
            <div className="conflictType">{conflictType}</div>
            {
                conflictType === CONFLICT_TYPE.DOMINATION && <Figure figureId={getPlayerGod(conflict.playerId)} />
            }
            {
                conflictType === CONFLICT_TYPE.BATTLE
                && conflict.playersIds.map(playerId => <Figure key={playerId} figureId={getPlayerGod(playerId)} />)
            }
        </div>
    )
}

export default ConflictRow;