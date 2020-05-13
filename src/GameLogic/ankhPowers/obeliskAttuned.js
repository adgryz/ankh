import conflictReducer, { BATTLE_ACTION } from 'GameLogic/conflict'
import { selectBattleCardEffect } from 'GameLogic/conflicts/resolveConflicts';

export const resolveObeliskAttunedEffect = ({ playerId }) => (dispatch, getState) => {
    const { conflict, game, monuments, board: { hexes } } = getState();
    const { activeConflictNumber } = conflict;

    dispatch(conflictReducer.actions.setObeliskAttunedPlayerId({ playerId }));

    if (game.players[playerId].god.unlockedPowers.includes('Obelisk Attuned')) {
        const { obelisks } = monuments;
        const playerObelisksInRegion = Object.values(obelisks)
            .filter(obelisk => obelisk.playerId === playerId)
            .filter(monument => hexes[monument.x][monument.y].region === activeConflictNumber);

        if (playerObelisksInRegion.length > 0) {
            console.log(`Obelisk attuned for ${playerId}`)
            dispatch(conflictReducer.actions.setCurrentBattleActionId({ actionId: BATTLE_ACTION.OBELISK_ATTUNED_SELECT_FIGURE }))
        }
        // dispatch(conflictReducer.actions.increasePlayerStrengthInConflict({
        //     playerId,
        //     regionNumber: activeConflictNumber,
        //     amount: playerMonumentsInRegion.length
        // }))
    } else {
        dispatch(resolveNextPlayerObeliskAttunedEffect());
    }
}

export const resolveNextPlayerObeliskAttunedEffect = () => (dispatch, getState) => {
    const { conflict } = getState();
    const { conflicts, activeConflictNumber, obeliskAttunedPlayerId } = conflict;
    const currentConflict = conflicts.find(conflict => conflict.regionNumber === activeConflictNumber);
    const { playersIds } = currentConflict;
    const currPlayerIndex = playersIds.findIndex(id => id === obeliskAttunedPlayerId);

    if (currPlayerIndex === playersIds.length - 1) {
        // last player
        dispatch(selectBattleCardEffect());
    } else {
        dispatch(resolveObeliskAttunedEffect({ playerId: playersIds[currPlayerIndex + 1] }))
    }

}