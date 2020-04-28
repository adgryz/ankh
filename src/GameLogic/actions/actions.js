import gameReducer, { GAME_ACTIONS } from 'GameLogic/game';
import { ACTIONS_IDS } from './const'
import { gainFollowersEffect } from './gainFollowers';
import { resolveCurrentEventEffect } from 'GameLogic/events/events';

export const selectActionEffect = ({ actionId }) => (dispatch, getState) => {
    dispatch(gameReducer.actions.setCurrentActionId({ actionId }))
    dispatch(gameReducer.actions.increasePlayedActionsNumber())

    const { game } = getState();
    const currentPlayer = game.players[game.currentPlayerId];

    // Summon figure action ends immediately if player has no figures in pool
    if (actionId === ACTIONS_IDS.SUMMON) {
        if (currentPlayer.figuresPool.length === 0) {
            dispatch(endActionEffect());
        }
    }

    if (actionId === ACTIONS_IDS.FOLLOWERS) {
        dispatch(gainFollowersEffect());
    }

    // Unlock Ankh action ends immediately if player has not enough followers or unlocked all
    if (actionId === ACTIONS_IDS.ANKH) {
        const unlockedPowersCount = currentPlayer.god.unlockedPowers.length;
        const powerLevelToUnlock = parseInt(unlockedPowersCount / 2) + 1;
        if (currentPlayer.followers < powerLevelToUnlock || unlockedPowersCount === 6) {
            dispatch(endActionEffect());
        }
    }

}

export const endActionEffect = () => (dispatch, getState) => {
    const { game } = getState();
    const actionId = game.currentActionId;
    dispatch(gameReducer.actions.moveActionIndex({ actionId }));
    dispatch(gameReducer.actions.setActiveGameAction({ actionId: GAME_ACTIONS.selectAction }))
    const { game: nextGame } = getState();

    // Action reached max index
    if (nextGame.actions[actionId].index === nextGame.actions[actionId].maxIndex) {
        dispatch(gameReducer.actions.moveEventIndex());
        dispatch(resolveCurrentEventEffect());
        return;
    }

    // Played 2 actions
    if (nextGame.playedActions === 2) {
        dispatch(gameReducer.actions.endTurn());
        return;
    }

    // Played Ankh action
    if (actionId === ACTIONS_IDS.ANKH) {
        dispatch(gameReducer.actions.endTurn());
        return;
    }
};