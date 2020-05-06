import conflictReducer, { BATTLE_ACTION } from 'GameLogic/conflict'
import gameReducer from 'GameLogic/game'

import { getConflicts, CONFLICT_TYPE } from './getConflicts'
import { endEventEffect } from 'GameLogic/events/events';
import { BATTLE_CARD } from './const';

export const resolveConflictsEffect = () => (dispatch, getState) => {
    const { board } = getState();
    dispatch(conflictReducer.actions.setConflicts({ conflicts: getConflicts(board) }))
    const { conflict: { conflicts } } = getState();
    dispatch(resolveConflictEffect({ conflict: conflicts[0] }))
    // TO DO GO TO NEXT CONFLICTS
}

export const resolveConflictEffect = ({ conflict }) => (dispatch, getState) => {
    const { conflictType, regionNumber, playerId, monumentsInRegion, playersIds } = conflict;
    if (conflictType === CONFLICT_TYPE.NO_BATTLE) {
        dispatch(conflictReducer.actions.setMessage({ message: `No battle in region ${regionNumber}` }));
        dispatch(finishCurrentConflictEffect({ conflict }))
        return;
    }

    if (conflictType === CONFLICT_TYPE.DOMINATION) {
        dispatch(conflictReducer.actions.setMessage({ message: `Domination in region ${regionNumber}` }));
        const devotionAmount = 1 + calculatePlayerDevotionFromRegion(playerId, monumentsInRegion);
        dispatch(gameReducer.actions.increasePlayerDevotion({ playerId, count: devotionAmount }))
        dispatch(finishCurrentConflictEffect({ conflict }))
        return;
    }


    if (conflictType === CONFLICT_TYPE.BATTLE) {
        dispatch(conflictReducer.actions.setMessage({ message: `Battle in region ${regionNumber}` }));
        dispatch(conflictReducer.actions.setCurrentPlayerId({ playerId: playersIds[0] }));
        sleep(1000).then(() => dispatch(selectBattleCardEffect()))

        // 1 card selection
        // 2 resolve plague
        // 3 resolve other cards
        // 4 monuments majority
        // 5 battle resolution
        return;
    }

}

const selectBattleCardEffect = () => (dispatch, getState) => {
    const { conflict } = getState();
    const { currentPlayerId } = conflict;
    dispatch(conflictReducer.actions.setMessage({ message: `${currentPlayerId} choose battle card` }));
    dispatch(conflictReducer.actions.setCurrentBattleActionId({ actionId: BATTLE_ACTION.SELECT_CARD }));
}

export const playBattleCardEffect = ({ card }) => (dispatch, getState) => {
    const { conflict } = getState();
    const { conflicts, activeConflictNumber, currentPlayerId } = conflict;

    dispatch(conflictReducer.actions.setPlayedCard({ playerId: currentPlayerId, card }));


    const currentConflict = conflicts.find(conflict => conflict.regionNumber === activeConflictNumber);
    const players = currentConflict.playersIds;
    const currentPlayerIndex = players.findIndex(p => p === currentPlayerId);
    const nextPlayerId = currentPlayerIndex === players.length - 1 ? null : players[currentPlayerIndex + 1];

    if (nextPlayerId) {
        dispatch(conflictReducer.actions.setCurrentPlayerId({ playerId: nextPlayerId }));
        dispatch(selectBattleCardEffect())
    } else {
        // Last player played battle card => resolve battle cards
        dispatch(conflictReducer.actions.setMessage({ message: `Played cards` }));
        dispatch(conflictReducer.actions.setCurrentBattleActionId({ actionId: BATTLE_ACTION.RESOLVE_CARDS }));
        dispatch(resolveCardsEffect());
    }
}


const resolveCardsEffect = () => (dispatch, getState) => {
    const { conflict } = getState();
    const { playedCards } = conflict;
    const plaguePlayersIds = Object.entries(playedCards)
        .filter(([playerId, card]) => card === BATTLE_CARD.plague)
        .map(([playerId, card]) => playerId)
    const plaguePlayed = plaguePlayersIds.length > 0;

    if (plaguePlayed) {
        dispatch(resolvePlagueEffect({ playersIds: plaguePlayersIds }));
    } else {
        dispatch(resolveOtherCardsEffect())
    }
}

const resolvePlagueEffect = ({ playersIds }) => (dispatch, getState) => {
    const { conflict, game } = getState();
    dispatch(conflictReducer.actions.setCurrentBattleActionId({ actionId: BATTLE_ACTION.PLAGUE_BID }));
    dispatch(conflictReducer.actions.setMessage({ message: `Resolve plague` }));
    console.log('PLAGUE HAPPENS');
    playersIds.forEach(playerId => dispatch(conflictReducer.actions.removePlayerCard({ playerId })));
    playersIds.forEach(playerId => dispatch(gameReducer.actions.playBattleCard({ playerId, card: BATTLE_CARD.plague })));
    dispatch(resolveOtherCardsEffect())
}

const resolveOtherCardsEffect = () => (dispatch, getState) => {
    const { conflict } = getState();
    const { playedCards } = conflict;
    // TO DO resolve cards starting from player with lowest devotion in ascending order (build monument)
    const cardsList = Object.entries(playedCards);

    if (cardsList.length === 0) {
        dispatch(monumentMajorityEffect());
    } else {
        const [playerId, card] = cardsList[0];
        dispatch(resolveCardEffect({ playerId, card }))
    }
}

const resolveCardEffect = ({ playerId, card }) => (dispatch, getState) => {
    dispatch(conflictReducer.actions.setMessage({ message: `Resolve ${card}` }));

    console.log(card, 'happens');

    dispatch(conflictReducer.actions.removePlayerCard({ playerId }))
    dispatch(gameReducer.actions.playBattleCard({ playerId, card }));

    switch (card) {
        case BATTLE_CARD.cycle:
            dispatch(resolveCycleOfMaat({ playerId }))
            break;
        case BATTLE_CARD.flood:
            dispatch(resolveFlood({ playerId }))
            break;
        case BATTLE_CARD.drought:
            dispatch(resolveDrought({ playerId }))
            break;
        case BATTLE_CARD.miracle:
            dispatch(resolveMiracle({ playerId }))
            break;
        case BATTLE_CARD.build:
            dispatch(resolveBuildMonument({ playerId }))
            break;
        default:
            break;
    }

    const { conflict } = getState();
    const { playedCards } = conflict;
    const cardsList = Object.entries(playedCards);
    if (cardsList.length === 0) {
        dispatch(monumentMajorityEffect());
    } else {
        const [nextPlayerId, nextCard] = cardsList[0];
        dispatch(resolveCardEffect({ playerId: nextPlayerId, card: nextCard }))
    }
}

const resolveCycleOfMaat = ({ playerId, card }) => (dispatch, getState) => {
    dispatch(conflictReducer.actions.setMessage({ message: `Player ${playerId} uses Cycle of Ma'at` }));
    dispatch(gameReducer.actions.recoverPlayerBattleCards({ playerId }));
}

const resolveDrought = ({ playerId, card }) => (dispatch, getState) => {
    dispatch(conflictReducer.actions.setMessage({ message: `Player ${playerId} uses Drought` }));
}

const resolveFlood = ({ playerId, card }) => (dispatch, getState) => {
    dispatch(conflictReducer.actions.setMessage({ message: `Player ${playerId} uses Flood` }));
}

const resolveMiracle = ({ playerId, card }) => (dispatch, getState) => {
    dispatch(conflictReducer.actions.setMessage({ message: `Player ${playerId} uses Miracle` }));
}

const resolveBuildMonument = ({ playerId, card }) => (dispatch, getState) => {
    dispatch(conflictReducer.actions.setMessage({ message: `Player ${playerId} uses Build Monument` }));
    dispatch(conflictReducer.actions.setCurrentBattleActionId({ actionId: BATTLE_ACTION.SELECT_MONUMENT }));
}

const monumentMajorityEffect = () => (dispatch, getState) => {
    dispatch(conflictReducer.actions.setMessage({ message: `Monuments majority` }));
    dispatch(finishConflictsEffect());
}


const calculatePlayerDevotionFromRegion = (playerId, monumentsInRegion) => {
    const obelisksInRegion = monumentsInRegion.filter(({ monumentId }) => monumentId[0] === 'o')
    const pyramidsInRegion = monumentsInRegion.filter(({ monumentId }) => monumentId[0] === 'p')
    const templesInRegion = monumentsInRegion.filter(({ monumentId }) => monumentId[0] === 't')
    return calculatePlayerDevotionForMonumentType(playerId, obelisksInRegion) +
        calculatePlayerDevotionForMonumentType(playerId, pyramidsInRegion) +
        calculatePlayerDevotionForMonumentType(playerId, templesInRegion);
}

const calculatePlayerDevotionForMonumentType = (playerId, monuments) => {
    const playerIds = [...(new Set(monuments.map(({ playerId }) => playerId)))];
    const counter = {}
    playerIds.forEach(id => counter[id] = 0);
    monuments.forEach(({ playerId }) => counter[playerId]++);

    let highestPlayerMonumentsCount = 0;
    let topPlayer = undefined;
    Object.entries(counter).forEach(([player, count]) => {
        if (count > highestPlayerMonumentsCount) {
            topPlayer = player;
            highestPlayerMonumentsCount = count;
        }
    })

    return playerId === topPlayer ? highestPlayerMonumentsCount : 0;
}

export const finishCurrentConflictEffect = ({ conflict }) => async (dispatch, getState) => {
    const { board } = getState();

    if (conflict.regionNumber === board.maxRegionNumber) {
        dispatch(finishConflictsEffect());
    } else {
        dispatch(conflictReducer.actions.goToNextConflict());
    }
}

export const finishConflictsEffect = () => (dispatch) => {
    dispatch(conflictReducer.actions.clearAfterConflicts())
    dispatch(endEventEffect());
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
