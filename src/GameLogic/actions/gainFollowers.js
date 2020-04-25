import gameReducer from 'GameLogic/game';
import { isAnyAdjacent } from 'GameLogic/boardUtils';
import { getPlayerAndNeutralMonuments, getPlayerFigures } from '../selectors';
import { endActionEffect } from 'GameLogic/actions/actions';

const calculateFollowers = (monuments, figures, playerId) => {
    const playerAndNeutralMonumentsPositions = getPlayerAndNeutralMonuments(monuments, playerId).map(({ x, y }) => ({ x, y }));
    const playerFiguresPositions = getPlayerFigures(figures, playerId).map(({ x, y }) => ({ x, y }));
    const followers = playerAndNeutralMonumentsPositions.reduce(
        (followersSum, currMonument) => {
            const newFollower = isAnyAdjacent(currMonument.x, currMonument.y, playerFiguresPositions);
            return newFollower ? followersSum + 1 : followersSum
        }, 0)
    return followers;
}

export const gainFollowersEffect = () => (dispatch, getState) => {
    const { monuments, figures, game: { currentPlayerId } } = getState();
    const newFollowers = calculateFollowers(monuments, figures, currentPlayerId);
    dispatch(gameReducer.actions.increaseFollowers({ count: newFollowers }));
    dispatch(endActionEffect());
}
