import { EVENTS_IDS } from './const';
import { eventBoardConfig } from 'GameComponents/EventBoard/eventBoardConfig';
import gameReducer, { GAME_ACTIONS } from 'GameLogic/game';
import boardReducer from 'GameLogic/board';
import conflictReducer from 'GameLogic/conflict';

export const resolveCurrentEventEffect = () => (dispatch, getState) => {
    const { game } = getState();
    const eventId = eventBoardConfig[game.eventIndex]

    if (eventId === EVENTS_IDS.CONTROL) {
        dispatch(gameReducer.actions.setActiveGameAction({ actionId: GAME_ACTIONS.selectMonumentToControl }));
    }
    if (eventId === EVENTS_IDS.RIVER) {
        dispatch(gameReducer.actions.setActiveGameAction({ actionId: GAME_ACTIONS.selectBorderToPutRiver }));
        dispatch(boardReducer.actions.toggleBordersPreview({ isActive: true }))
    }
    if (eventId === EVENTS_IDS.BATTLE) {
        dispatch(gameReducer.actions.setActiveGameAction({ actionId: GAME_ACTIONS.selectMonumentToControl }));
        dispatch(conflictReducer.actions.giveTieBreakerToPlayer({ playerId: game.currentPlayerId }))
        dispatch(conflictReducer.actions.setConflictActive())
    }
}

export const endEventEffect = () => (dispatch, getState) => {
    const { game } = getState();
    if (game.currentGameAction === GAME_ACTIONS.selectBorderToPutRiver) {
        dispatch(boardReducer.actions.toggleBordersPreview({ isActive: false }));
        dispatch(boardReducer.actions.clearProspectRivers());
    }
    dispatch(gameReducer.actions.resetActionIndex());
    dispatch(gameReducer.actions.endTurn());
}