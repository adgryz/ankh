import gameReducer from 'GameLogic/game';
import figuresReducer from 'GameLogic/figures';
import { endActionEffect } from 'GameLogic/actions/actions';

export const unlockAnkhPowerEffect = ({ powerName, powerLevel }) => (dispatch, getState) => {
    const { game: { currentPlayerId } } = getState();
    dispatch(gameReducer.actions.decreasePlayerFollowers({ amount: powerLevel, playerId: currentPlayerId }));
    dispatch(gameReducer.actions.unlockAnkhPower({ powerName }));

    if (powerName === 'Temple Attuned') {
        dispatch(resolveTempleAttunedEffect())
    }

    dispatch(endActionEffect());
}

const resolveTempleAttunedEffect = () => (dispatch, getState) => {
    const { game } = getState();
    const { players, currentPlayerId } = game;
    const player = players[currentPlayerId];
    const amount = player.monuments.templesIds.length;
    const godId = `g${currentPlayerId[1]}`;
    dispatch(figuresReducer.actions.increaseFigureStrength({
        figureId: godId,
        amount
    }));
}