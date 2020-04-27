import gameReducer, { GAME_ACTIONS } from 'GameLogic/game';
import boardReducer from 'GameLogic/board';
import figuresReducer, { getFigureById } from 'GameLogic/figures';
import { getInThreeDistance } from 'GameLogic/boardUtils';
import { endActionEffect } from 'GameLogic/actions/actions';

export const selectFigureToMoveEffect = ({ x, y }) => (dispatch, getState) => {
    const { board: { hexes }, game } = getState();
    const hex = hexes[x][y];
    const { figureId, playerId } = hex;

    if (!figureId) {
        alert('No figure')
        return;
    }
    if (playerId !== game.currentPlayerId) {
        alert(`Cannot move opponent's figure`)
        return;
    }
    if (game.movedFiguresIds.find(id => id === figureId)) {
        alert('Cannot move already moved figure');
        return;
    }

    dispatch(gameReducer.actions.setActiveGameAction({ actionId: GAME_ACTIONS.moveFigure }));
    const inThreeDistance = getInThreeDistance(x, y);
    dispatch(boardReducer.actions.setPreview({ previewList: inThreeDistance }))
    dispatch(gameReducer.actions.setSelectedFigureId({ figureId }));
}

export const moveFigureEffect = ({ x, y }) => (dispatch, getState) => {
    const { game, figures, board: { hexes } } = getState();
    if (!hexes[x][y].isPreview) {
        alert('Cannot move figure more than 3 hexes');
        return;
    }
    const selectedFigureId = game.selectedFigureId;
    const selectedFigure = getFigureById(selectedFigureId, figures);
    dispatch(boardReducer.actions.moveFigure({
        from: { x: selectedFigure.x, y: selectedFigure.y },
        to: { x, y }
    }));
    dispatch(figuresReducer.actions.changeFigurePosition({ x, y, figureId: selectedFigureId }));
    dispatch(boardReducer.actions.clearPreview());
    dispatch(gameReducer.actions.setFigureMoved({ figureId: selectedFigureId }));
    dispatch(gameReducer.actions.setSelectedFigureId({ figureId: undefined }));
    dispatch(gameReducer.actions.setActiveGameAction({ actionId: GAME_ACTIONS.selectFigureToMove }));

    const { game: game2 } = getState();
    const playerFigures = game2.players[game2.currentPlayerId].figures;
    const figuresCount = playerFigures.godsIds.length + playerFigures.warriorsIds.length + playerFigures.sentinelsIds.length;
    if (game2.movedFiguresIds.length === figuresCount) {
        dispatch(endActionEffect());
    }
} 