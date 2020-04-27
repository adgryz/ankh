import gameReducer from 'GameLogic/game';
import { isAnyAdjacentAndInSameRegion } from 'GameLogic/boardUtils';
import { getPlayerAndNeutralMonuments, getPlayerFigures } from '../selectors';
import { endActionEffect } from 'GameLogic/actions/actions';

const calculateFollowers = (monuments, figures, playerId, hexes) => {
    const playerAndNeutralMonumentsPositions = getPlayerAndNeutralMonuments(monuments, playerId).map(({ x, y }) => ({ x, y }));
    const playerFiguresPositions = getPlayerFigures(figures, playerId).map(({ x, y }) => ({ x, y }));
    const followers = playerAndNeutralMonumentsPositions.reduce(
        (followersSum, currMonument) => {
            const newFollower = isAnyAdjacentAndInSameRegion(currMonument.x, currMonument.y, playerFiguresPositions, hexes);
            return newFollower ? followersSum + 1 : followersSum
        }, 0)
    return followers;
}

export const gainFollowersEffect = () => (dispatch, getState) => {
    const { monuments, figures, board: { hexes }, game: { currentPlayerId } } = getState();
    const newFollowers = calculateFollowers(monuments, figures, currentPlayerId, hexes);
    dispatch(gameReducer.actions.increaseFollowers({ count: newFollowers }));
    dispatch(endActionEffect());
}
