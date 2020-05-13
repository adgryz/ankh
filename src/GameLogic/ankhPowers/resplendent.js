import conflictReducer from 'GameLogic/conflict'

export const resolveResplendentEffect = () => async (dispatch, getState) => {
    const { conflict, game, monuments, board: { hexes } } = getState();
    const { conflicts, activeConflictNumber } = conflict;
    const currentConflict = conflicts.find(conflict => conflict.regionNumber === activeConflictNumber);

    currentConflict.playersIds.forEach(playerId => {
        if (game.players[playerId].god.unlockedPowers.includes('Resplendent')) {
            const { obelisks, temples, pyramids } = monuments;
            const playerMonumentsInRegion = [
                ...Object.values(obelisks),
                ...Object.values(temples),
                ...Object.values(pyramids)
            ].filter(monument => monument.playerId === playerId)
                .filter(monument => hexes[monument.x][monument.y].region === activeConflictNumber);

            dispatch(conflictReducer.actions.increasePlayerStrengthInConflict({
                playerId,
                regionNumber: activeConflictNumber,
                amount: playerMonumentsInRegion.length
            }))
            console.log(`Player ${playerId} strength increased by ${playerMonumentsInRegion.length} because of Resplendent`)
        }
    })
}