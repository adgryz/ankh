import gameReducer from 'GameLogic/game'
import boardReducer from 'GameLogic/board'
import monumentsReducer from 'GameLogic/monuments'

import { getNeutralMonuments, getPlayerFigures } from 'GameLogic/selectors'
import { isAnyAdjacentAndInSameRegion } from 'GameLogic/boardUtils';

export const controlMonumentEffect = ({ x, y }) => (dispatch, getState) => {
    // TODO: Check if there are any neutral(or enemy) monuments adjacent to player figures, if not => end turn immediately
    const { game, monuments, board, figures } = getState();
    const selectedMonumentId = board[x][y].monumentId;
    const playerId = game.players[game.currentPlayerId].id;

    if (!selectedMonumentId) {
        alert('Select monument');
        return;
    }

    const playerFiguresPositions = getPlayerFigures(figures, playerId);
    if (!isAnyAdjacentAndInSameRegion(x, y, playerFiguresPositions, board)) {
        alert('You must have adjacent figure to monument');
        return;
    }

    const monumentOwnerId = board[x][y].playerId;
    const neutralMonuments = getNeutralMonuments(monuments);

    if (neutralMonuments.length > 0) {
        if (monumentOwnerId) {
            alert('Select neutral monument');
            return;
        } else {
            // ADD NEUTRAL MONUMENT TO PLAYER
            dispatch(addMonumentToPlayerEffect({ x, y, playerId, monumentId: selectedMonumentId }))
            dispatch(gameReducer.actions.endTurn());
        }
    } else {
        if (monumentOwnerId === playerId) {
            alert('Select enemy monument');
            return;
        } else {
            // add enemy monument to player effect
            dispatch(addMonumentToPlayerEffect({ x, y, playerId, monumentId: selectedMonumentId }))
            dispatch(gameReducer.actions.removeMonumentFromPlayer({ monumentId: selectedMonumentId, playerId: monumentOwnerId }))
            dispatch(gameReducer.actions.endTurn());
        }
    }

}

export const addMonumentToPlayerEffect = ({ x, y, playerId, monumentId }) => (dispatch, getState) => {
    dispatch(boardReducer.actions.changeMonumentOwner({ x, y, playerId }));
    dispatch(gameReducer.actions.addMonumentToCurrentPlayer({ monumentId }));
    dispatch(monumentsReducer.actions.setMonumentPlayer({ monumentId, playerId }))
}
