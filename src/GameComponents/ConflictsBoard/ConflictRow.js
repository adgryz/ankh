import React from 'react';
import classnames from 'classnames';

import { CONFLICT_TYPE } from 'GameLogic/conflicts/getConflicts'

import Figure from 'GameComponents/Board/Figure'
import './ConflictRow.scss'

const ConflictRow = ({ conflict, isActive }) => {
    const { regionNumber, conflictType } = conflict;
    const getPlayerGod = playerId => playerId.replace('p', 'g');
    const getPlayerStrength = playerId => conflict.figuresInRegion.filter(figure => figure.playerId === playerId).length;

    return (
        <div className={classnames("conflictRow", { isActive })}>
            <div className="regionNumber">{regionNumber}</div>
            <div className="conflictType">{conflictType}</div>
            {
                conflictType === CONFLICT_TYPE.DOMINATION && <Figure figureId={getPlayerGod(conflict.playerId)} />
            }
            {
                conflictType === CONFLICT_TYPE.BATTLE
                && conflict.playersIds.map(playerId => <div className="player">
                    <Figure key={playerId} figureId={getPlayerGod(playerId)} />
                    <div className="str">: {getPlayerStrength(playerId)}</div>
                </div>)
            }
        </div>
    )
}

export default ConflictRow;