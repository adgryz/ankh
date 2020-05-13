import gameReducer from 'GameLogic/game';
import figuresReducer from 'GameLogic/figures';
import { endActionEffect } from 'GameLogic/actions/actions';
import { unlockSentinelEffect } from 'GameLogic/sentinels/sentinels';

export const unlockAnkhPowerEffect = ({ powerName, powerLevel }) => (dispatch, getState) => {
    const { game: { currentPlayerId } } = getState();
    dispatch(gameReducer.actions.decreasePlayerFollowers({ amount: powerLevel, playerId: currentPlayerId }));
    dispatch(gameReducer.actions.unlockAnkhPower({ powerName }));

    if (powerName === 'Temple Attuned') {
        dispatch(resolveTempleAttunedEffect())
    }

    const { game: newGame } = getState();
    const powersAmount = newGame.players[currentPlayerId].god.unlockedPowers.length;
    if (isUnlockingSentinel(powersAmount)) {
        dispatch(unlockSentinelEffect({ level: getSentinelLevel(powersAmount) }))
    }

    dispatch(endActionEffect());
}

const isUnlockingSentinel = (powersAmount) => [2, 4, 5].includes(powersAmount);
const getSentinelLevel = (powersAmount) => {
    switch (powersAmount) {
        case 2:
            return 1;
        case 4:
            return 2;
        case 5:
            return 3;
        default:
            return 1;
    }
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