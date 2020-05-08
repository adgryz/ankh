import React from 'react';
import { useSelector } from 'react-redux';

import Figure from 'GameComponents/Board/Figure'

const BattleResults = () => {
    const getPlayerGod = playerId => playerId.replace('p', 'g');
    const conflicts = useSelector(({ conflict }) => conflict.conflicts);
    const activeConflictNumber = useSelector(({ conflict }) => conflict.activeConflictNumber);
    const currentConflict = conflicts.find(conflict => conflict.regionNumber === activeConflictNumber);
    const { playersStrengths } = currentConflict;

    const winnerId = useSelector(({ conflict }) => conflict.winnerId);

    return (
        <div>
            {
                Object.entries(playersStrengths).map(([playerId, strength]) => (
                    <div
                        key={playerId}
                        style={{ display: 'flex', alignItems: 'center', margin: 5 }}
                    >
                        <Figure figureId={getPlayerGod(playerId)} />
                        <div style={{ marginLeft: 5, fontWeight: 'bold', color: playerId === winnerId ? 'red' : 'brown' }}>
                            {strength}
                        </div>
                    </div>
                ))
            }
        </div>
    )
}

export default BattleResults