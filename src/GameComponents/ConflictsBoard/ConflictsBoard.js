import React from 'react';
import { useSelector } from 'react-redux';

import ConflictRow from './ConflictRow'
import BattleCardsSelection from './BattleCardsSelection/BattleCardsSelection';
import PlayedCards from './PlayedCards/PlayedCards';
import './ConflictsBoard.scss'
import conflict, { BATTLE_ACTION } from 'GameLogic/conflict';

const ConflictsBoard = () => {
    const conflicts = useSelector(({ conflict }) => conflict.conflicts);
    const activeConflictNumber = useSelector(({ conflict }) => conflict.activeConflictNumber);
    const message = useSelector(({ conflict }) => conflict.message);

    const actionId = useSelector(({ conflict }) => conflict.currentBattleActionId);
    const currentPlayerId = useSelector(({ conflict }) => conflict.currentPlayerId);
    const playerCards = useSelector(({ game }) => currentPlayerId ? game.players[currentPlayerId].battleCards : []);

    const playedCards = useSelector(({ conflict }) => conflict.playedCards);

    return (
        <div className="conflictsBoard">
            <div className="label">Conflicts</div>
            <div>
                {message}
            </div>
            {
                conflicts.map(conflict => <ConflictRow
                    isActive={activeConflictNumber === conflict.regionNumber}
                    conflict={conflict}
                    key={conflict.regionNumber} />)
            }
            {
                actionId === BATTLE_ACTION.SELECT_CARD && <BattleCardsSelection playerCards={playerCards} />
            }
            {
                actionId === BATTLE_ACTION.RESOLVE_CARDS && <PlayedCards playedCards={playedCards} />
            }
            {
                actionId === BATTLE_ACTION.PLAGUE_BID && <div>Plague bidder for player x</div>
            }
            {
                actionId === BATTLE_ACTION.RESOLVE_PLAGUE && <div>Bidding results with marked winner</div>
            }
            {
                (actionId === BATTLE_ACTION.SELECT_MONUMENT || actionId === BATTLE_ACTION.BUILD_MONUMENT)
                && <div>{`[O] [P] [[T]]`}</div>
            }
        </div>
    )
}

export default ConflictsBoard;