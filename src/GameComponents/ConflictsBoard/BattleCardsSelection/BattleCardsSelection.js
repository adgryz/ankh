import React from 'react';
import { useDispatch } from 'react-redux';

import { playBattleCardEffect } from 'GameLogic/conflicts/resolveConflicts';

const BattleCardsSelection = ({ playerCards }) => {
    const dispatch = useDispatch();
    return (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
            {
                playerCards.map(card => <img
                    width={40}
                    height={70}
                    onClick={() => dispatch(playBattleCardEffect({ card }))}
                    style={{ marginRight: 5, cursor: 'pointer' }}
                    alt={card}
                    key={card}
                    src={require(`GameComponents/ConflictsBoard/battleCards/${card}.png`)} />
                )
            }
        </div>
    )
}

export default BattleCardsSelection