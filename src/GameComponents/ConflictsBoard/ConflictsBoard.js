import React from 'react';
import { useSelector } from 'react-redux';

import ConflictRow from './ConflictRow'
import BattleCardsSelection from './BattleCardsSelection/BattleCardsSelection';
import PlayedCards from './PlayedCards/PlayedCards';
import './ConflictsBoard.scss'
import { BATTLE_ACTION } from 'GameLogic/conflict';
import PlagueBidder from './PlagueBidder/PlagueBidder';
import BidResults from './BidResults/BidResults';
import BattleResults from './BattleResults/BattleResults';
import MonumentsSelection from './MonumentSelection/MonumentSelection';
import { BATTLE_CARD } from 'GameLogic/conflicts/const';


const ConflictsBoard = () => {
    const conflicts = useSelector(({ conflict }) => conflict.conflicts);
    const activeConflictNumber = useSelector(({ conflict }) => conflict.activeConflictNumber);
    const message = useSelector(({ conflict }) => conflict.message);

    const actionId = useSelector(({ conflict }) => conflict.currentBattleActionId);
    const currentPlayerId = useSelector(({ conflict }) => conflict.currentPlayerId);
    const playerCards = useSelector(({ game }) => currentPlayerId ? game.players[currentPlayerId].battleCards : []);

    const plagueCards = useSelector(({ conflict }) =>
        conflict.plaguePlayersIds.map(id => [id, BATTLE_CARD.plague]));
    const beforeBattleCards = useSelector(({ conflict }) => conflict.beforeBattleCards);
    const miracleCards = useSelector(({ conflict }) =>
        conflict.miraclePlayersIds.map(id => [id, BATTLE_CARD.miracle]));

    const playedCards = [...plagueCards, ...beforeBattleCards, ...miracleCards];

    return (
        <div className="conflictsBoard">
            <div className="label">Conflicts</div>
            {
                conflicts.map(conflict => <ConflictRow
                    isActive={activeConflictNumber === conflict.regionNumber}
                    conflict={conflict}
                    key={conflict.regionNumber} />)
            }
            <div className="message">
                {message}
            </div>
            {
                actionId === BATTLE_ACTION.SELECT_CARD && <BattleCardsSelection playerCards={playerCards} />
            }
            {
                actionId === BATTLE_ACTION.RESOLVE_CARDS && <PlayedCards playedCards={playedCards} />
            }
            {
                actionId === BATTLE_ACTION.PLAGUE_BID && <PlagueBidder />
            }
            {
                actionId === BATTLE_ACTION.RESOLVE_PLAGUE && <BidResults />
            }
            {
                (actionId === BATTLE_ACTION.SELECT_MONUMENT || actionId === BATTLE_ACTION.BUILD_MONUMENT)
                && <MonumentsSelection />
            }
            {
                actionId === BATTLE_ACTION.RESOLVE_BATTLE && <BattleResults />
            }
        </div>
    )
}

export default ConflictsBoard;