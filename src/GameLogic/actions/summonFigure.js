import gameReducer, { GAME_ACTIONS } from 'GameLogic/game';
import figuresReducer from 'GameLogic/figures';
import boardReducer from 'GameLogic/board';

import { isAnyAdjacentAndInSameRegion } from 'GameLogic/utils/hexUtils';
import { getPlayerMonumentsAndFigures } from '../selectors';
import { endActionEffect } from 'GameLogic/actions/actions';

export const selectFigureToSummonEffect = ({ figureId }) => (dispatch, getState) => {
    dispatch(gameReducer.actions.setActiveGameAction({ actionId: GAME_ACTIONS.summonFigure }));
    dispatch(gameReducer.actions.setSelectedFigureFromPool({ figureId }));
}

export const summonFigureEffect = ({ x, y, }) => (dispatch, getState) => {
    const { board: { hexes }, figures, monuments, game } = getState();
    const playerId = game.currentPlayerId;
    const figureId = game.selectedFigureFromPool;
    const hex = hexes[x][y];

    if (hex.areaType === 'W') {
        alert('Cannot summon into water');
        return;
    }
    if (!!hex.figureId || !!hex.monumentId) {
        alert('Cannot summon into occupied area');
        return;
    }
    const playerFiguresAndMonumentsPositions = getPlayerMonumentsAndFigures(monuments, figures, playerId);
    if (!isAnyAdjacentAndInSameRegion(x, y, playerFiguresAndMonumentsPositions, hexes)) {
        alert('Summoned figure has to be adjacent to your monument or figure');
        return;
    }

    dispatch(gameReducer.actions.removeFigureFromPool({ figureId }));
    dispatch(figuresReducer.actions.addFigure({ figureId, playerId: game.currentPlayerId, x, y }));
    dispatch(boardReducer.actions.setFigures({ figures: [{ id: figureId, x, y, playerId }] }))

    dispatch(endActionEffect());
}