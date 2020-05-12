import gameReducer from 'GameLogic/game'
import boardReducer from 'GameLogic/board'
import monumentsReducer from 'GameLogic/monuments'
import figuresReducer from 'GameLogic/figures';

import { getNeutralMonuments, getPlayerFigures } from 'GameLogic/selectors'
import { isAnyAdjacentAndInSameRegion } from 'GameLogic/utils/hexUtils';
import { endEventEffect } from './events';

export const controlMonumentEffect = ({ x, y }) => (dispatch, getState) => {
    // TODO: Check if there are any neutral(or enemy) monuments adjacent to player figures, if not => end turn immediately
    const { game, monuments, board: { hexes }, figures } = getState();
    const selectedMonumentId = hexes[x][y].monumentId;
    const playerId = game.currentPlayerId;

    if (!selectedMonumentId) {
        alert('Select monument');
        return;
    }

    const playerFiguresPositions = getPlayerFigures(figures, playerId);
    if (!isAnyAdjacentAndInSameRegion(x, y, playerFiguresPositions, hexes)) {
        alert('You must have adjacent figure to monument');
        return;
    }

    const monumentOwnerId = hexes[x][y].playerId;
    const neutralMonuments = getNeutralMonuments(monuments);

    if (neutralMonuments.length > 0) {
        if (monumentOwnerId) {
            alert('Select neutral monument');
            return;
        } else {
            // ADD NEUTRAL MONUMENT TO PLAYER
            dispatch(addMonumentToPlayerEffect({ x, y, playerId, monumentId: selectedMonumentId }))
            dispatch(endEventEffect());
        }
    } else {
        if (monumentOwnerId === playerId) {
            alert('Select enemy monument');
            return;
        } else {
            // add enemy monument to player effect
            dispatch(addMonumentToPlayerEffect({ x, y, playerId, monumentId: selectedMonumentId, monumentOwnerId }))
            dispatch(gameReducer.actions.removeMonumentFromPlayer({ monumentId: selectedMonumentId, playerId: monumentOwnerId }))
            dispatch(endEventEffect());
        }
    }

}

export const addMonumentToPlayerEffect = ({ x, y, playerId, monumentId, monumentOwnerId }) => (dispatch, getState) => {
    dispatch(boardReducer.actions.changeMonumentOwner({ x, y, playerId }));
    dispatch(gameReducer.actions.addMonumentToPlayer({ monumentId, playerId }));
    dispatch(monumentsReducer.actions.setMonumentPlayer({ monumentId, playerId }))

    if (monumentId[0] === 't') {
        dispatch(resolveTempleAttunedEffect({ playerId, monumentOwnerId }));
    }
}

const resolveTempleAttunedEffect = ({ playerId, monumentOwnerId }) => (dispatch, getState) => {
    const { game: { players } } = getState();
    const newOwner = players[playerId];
    if (newOwner.god.unlockedPowers.includes('Temple Attuned')) {
        dispatch(figuresReducer.actions.increaseFigureStrength({
            figureId: `g${playerId[1]}`,
            amount: 1
        }));

        if (monumentOwnerId) {
            const oldOwner = players[monumentOwnerId];
            if (oldOwner.god.unlockedPowers.includes('Temple Attuned')) {
                dispatch(figuresReducer.actions.increaseFigureStrength({
                    figureId: `g${playerId[1]}`,
                    amount: 1
                }));
            }
        }
    }
}
