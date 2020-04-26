import gameReducer from 'GameLogic/game';
import { endActionEffect } from 'GameLogic/actions/actions';

export const unlockAnkhPowerEffect = ({ powerName, powerLevel }) => (dispatch, getState) => {
    dispatch(gameReducer.actions.decreaseFollowers({ count: powerLevel }));
    dispatch(gameReducer.actions.unlockAnkhPower({ powerName }));
    dispatch(endActionEffect());
}