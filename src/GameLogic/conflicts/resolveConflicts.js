import conflictReducer from 'GameLogic/conflict'
import gameReducer from 'GameLogic/game'

import { getConflicts, CONFLICT_TYPE } from './getConflicts'
import { endEventEffect } from 'GameLogic/events/events';

export const resolveConflictsEffect = () => async (dispatch, getState) => {
    const { board } = getState();
    dispatch(conflictReducer.actions.setConflicts({ conflicts: getConflicts(board) }))
    const { conflict: { conflicts } } = getState();

    await sleep(1000);
    conflicts.forEach(conflict => dispatch(resolveConflictEffect({ conflict })));
}

export const resolveConflictEffect = ({ conflict }) => (dispatch, getState) => {
    const { conflictType, regionNumber, playerId, monumentsInRegion } = conflict;

    if (conflictType === CONFLICT_TYPE.NO_BATTLE) {
        alert(`No battle in region ${regionNumber}`);
        dispatch(finishCurrentConflictEffect({ conflict }))
        return;
    }

    if (conflictType === CONFLICT_TYPE.DOMINATION) {
        alert(`Domination in region ${regionNumber}`);

        const devotionAmount = 1 + calculatePlayerDevotionFromRegion(playerId, monumentsInRegion);
        dispatch(gameReducer.actions.increasePlayerDevotion({ playerId, count: devotionAmount }))
        console.log(conflict);
        alert(`${playerId} gets ${devotionAmount} devotion`);
        dispatch(finishCurrentConflictEffect({ conflict }))
        return;
    }


    if (conflictType === CONFLICT_TYPE.BATTLE) {
        alert(`Battle in region ${regionNumber}`);
        dispatch(finishCurrentConflictEffect({ conflict }))
        return;
    }

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

export const finishCurrentConflictEffect = ({ conflict }) => (dispatch, getState) => {
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
