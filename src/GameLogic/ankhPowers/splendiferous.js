import gameReducer from 'GameLogic/game'

export const resolveSplendiferousEffect = () => (dispatch, getState) => {
    const { game: { players, currentPlayerId } } = getState();
    const player = players[currentPlayerId];

    if (player.god.unlockedPowers.includes('Splendiferous')) {
        if (player.followers >= 10) {
            dispatch(gameReducer.actions.increasePlayerDevotion({ playerId: currentPlayerId, amount: 1 }));
            console.log(`Player ${currentPlayerId} gets 1 devotion from Splendiferous `)
        }
    }
}
