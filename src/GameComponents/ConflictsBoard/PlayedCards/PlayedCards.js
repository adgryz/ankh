import React from 'react';
import { useDispatch } from 'react-redux';

import { playBattleCardEffect } from 'GameLogic/conflicts/resolveConflicts';

import Figure from 'GameComponents/Board/Figure'

const PlayedCards = ({ playedCards }) => {
    const dispatch = useDispatch();
    const getPlayerGod = playerId => playerId.replace('p', 'g');

    return (
        <div>
            {
                Object.entries(playedCards).map(([playerId, card]) => <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Figure figureId={getPlayerGod(playerId)} />
                    <img
                        width={40}
                        height={70}
                        onClick={() => dispatch(playBattleCardEffect({ card }))}
                        style={{ margin: 5 }}
                        alt={card}
                        key={card}
                        src={require(`GameComponents/ConflictsBoard/battleCards/${card}.png`)} />
                </div>
                )
            }
        </div>
    )
}

export default PlayedCards