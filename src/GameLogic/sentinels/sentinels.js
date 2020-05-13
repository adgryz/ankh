import gameReducer from 'GameLogic/game'
import figuresReducer from 'GameLogic/figures';

export const unlockSentinelEffect = ({ level }) => (dispatch, getState) => {
    const { figures: { sentinels }, game: { currentPlayerId } } = getState();
    const unlockedSentinel = Object.values(sentinels).find(sentinel => sentinel.level === level && !sentinel.playerId);

    if (!unlockedSentinel) {
        console.log('No guardian to unlock');
        return;
    }

    dispatch(gameReducer.actions.addFigureToPlayerPool({ figureId: unlockedSentinel.id, playerId: currentPlayerId }))
    dispatch(figuresReducer.actions.giveSentinelToPlayer({ sentinelId: unlockedSentinel.id, playerId: currentPlayerId }))
}