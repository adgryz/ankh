import gameReducer from 'GameLogic/game'

export const resolveWorshipfulEffect = () => (dispatch, getState) => {
    const { game: { players, currentPlayerId } } = getState();
    const player = players[currentPlayerId];

    const { templesIds, obelisksIds, pyramidsIds } = player.monuments;
    const playerMonumentsCount = [...templesIds, ...obelisksIds, ...pyramidsIds].length;
    if (playerMonumentsCount >= 5) {
        dispatch(gameReducer.actions.increasePlayerDevotion({ playerId: currentPlayerId, amount: 1 }));
        console.log(`Player ${currentPlayerId} gets 1 devotion from Worshipful `)
    }
}
