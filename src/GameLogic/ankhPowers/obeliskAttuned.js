import conflictReducer, { BATTLE_ACTION } from 'GameLogic/conflict'
import { selectBattleCardEffect } from 'GameLogic/conflicts/resolveConflicts';
import { getAdjacentList } from 'GameLogic/utils/hexUtils';
import figuresReducer, { getFigureById } from 'GameLogic/figures';
import boardReducer from 'GameLogic/board';
import { getConflicts, CONFLICT_TYPE } from 'GameLogic/conflicts/getConflicts'
import { resolveDominationEffect, finishCurrentConflictEffect } from 'GameLogic/conflicts/resolveConflicts'

export const resolveObeliskAttunedEffect = ({ playerId }) => (dispatch, getState) => {
    const { conflict, game, monuments, board: { hexes } } = getState();
    const { activeConflictNumber } = conflict;

    dispatch(conflictReducer.actions.setObeliskAttunedPlayerId({ playerId }));

    const { obelisks } = monuments;
    const playerObelisksInRegion = Object.values(obelisks)
        .filter(obelisk => obelisk.playerId === playerId)
        .filter(monument => hexes[monument.x][monument.y].region === activeConflictNumber);
    if (game.players[playerId].god.unlockedPowers.includes('Obelisk Attuned') && playerObelisksInRegion.length > 0) {
        console.log(`Obelisk attuned for ${playerId}`)
        dispatch(conflictReducer.actions.setCurrentBattleActionId({ actionId: BATTLE_ACTION.OBELISK_ATTUNED_SELECT_FIGURE }))
    } else {
        dispatch(resolveNextPlayerObeliskAttunedEffect());
    }
}

export const resolveNextPlayerObeliskAttunedEffect = () => (dispatch, getState) => {
    const { conflict, game: { playersIds } } = getState();
    const { obeliskAttunedPlayerId, conflicts, activeConflictNumber } = conflict;
    const currentConflict = conflicts.find(conflict => conflict.regionNumber === activeConflictNumber);
    const currPlayerIndex = playersIds.findIndex(id => id === obeliskAttunedPlayerId);

    if (currPlayerIndex === playersIds.length - 1) {
        if (currentConflict.conflictType === CONFLICT_TYPE.BATTLE) {
            dispatch(conflictReducer.actions.setCurrentPlayerId({ playerId: currentConflict.playersIds[0] }));
            dispatch(selectBattleCardEffect());
        } else if (currentConflict.conflictType === CONFLICT_TYPE.DOMINATION) {
            dispatch(resolveDominationEffect())
        } else if (currentConflict.conflictType === CONFLICT_TYPE.NO_BATTLE) {
            dispatch(finishCurrentConflictEffect())
        }
        // last player
    } else {
        dispatch(resolveObeliskAttunedEffect({ playerId: playersIds[currPlayerIndex + 1] }))
    }
}

export const selectFigureToMoveDuringObeliskAttunedffect = ({ x, y }) => (dispatch, getState) => {
    const { board: { hexes }, conflict } = getState();
    const hex = hexes[x][y];
    const { figureId, playerId } = hex;
    const { obeliskAttunedPlayerId, activeConflictNumber } = conflict;

    if (!figureId) {
        alert('No figure')
        return;
    }
    if (playerId !== obeliskAttunedPlayerId) {
        alert(`Cannot move opponent's figure`)
        return;
    }
    if (hex.region === activeConflictNumber) {
        alert(`Cannot move figures in current conflict region`)
        return;
    }

    dispatch(conflictReducer.actions.setObeliskAttunedSelectedFigureId({ figureId }));
    dispatch(conflictReducer.actions.setCurrentBattleActionId({ actionId: BATTLE_ACTION.OBELISK_ATTUNED_PLACE_FIGURE }));
}

export const moveFigureDuringObeliskAttunedEffect = ({ x, y }) => (dispatch, getState) => {
    const { figures, board: { hexes }, conflict } = getState();
    const { activeConflictNumber, obeliskAttunedPlayerId, obeliskAttunedSelectedFigureId } = conflict;
    const destination = hexes[x][y];

    if (destination.region !== activeConflictNumber) {
        alert('You have to move figure to current region')
        return;
    }
    if (destination.monumentId || destination.figureId) {
        alert('You have to move figure to empty space')
        return;
    }
    const adjacentHexes = getAdjacentList(x, y).map(({ x, y }) => hexes[x][y]);
    const playerObeliskAdjacent = adjacentHexes.some(hex =>
        hex.playerId === obeliskAttunedPlayerId && hex.monumentId && hex.monumentId[0] === 'o');
    if (!playerObeliskAdjacent) {
        alert('You have to move figure to space adjacent to your obelisk')
        return;
    }

    const selectedFigure = getFigureById(obeliskAttunedSelectedFigureId, figures);
    dispatch(boardReducer.actions.moveFigure({
        from: { x: selectedFigure.x, y: selectedFigure.y },
        to: { x, y }
    }));
    dispatch(figuresReducer.actions.changeFigurePosition({ x, y, figureId: obeliskAttunedSelectedFigureId }));
    dispatch(conflictReducer.actions.setObeliskAttunedSelectedFigureId({ figureId: undefined }));
    dispatch(conflictReducer.actions.setCurrentBattleActionId({ actionId: BATTLE_ACTION.OBELISK_ATTUNED_SELECT_FIGURE }));

    // recalculate conflicts
    const { figures: newFigure, board: newBoard } = getState();
    dispatch(conflictReducer.actions.setConflicts({ conflicts: getConflicts(newBoard, newFigure) }))

    const { conflict: newConflict } = getState();
    const { conflicts: newConflicts } = newConflict;
    const newCurrentConflict = newConflicts[activeConflictNumber - 1];
    if (newCurrentConflict.type === CONFLICT_TYPE.DOMINATION) {
        dispatch(conflictReducer.actions.setMessage({ message: `Domination in region ${activeConflictNumber}` }));
    } else if (newCurrentConflict.type === CONFLICT_TYPE.BATTLE) {
        dispatch(conflictReducer.actions.setMessage({ message: `Battle in region ${activeConflictNumber}` }));
    }
} 