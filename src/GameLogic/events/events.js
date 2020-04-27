import { EVENTS_IDS } from './const';
import { eventBoardConfig } from 'GameComponents/EventBoard/eventBoardConfig';
import gameReducer, { GAME_ACTIONS } from 'GameLogic/game';

export const resolveCurrentEventEffect = () => (dispatch, getState) => {
    const { game } = getState();
    const eventId = eventBoardConfig[game.eventIndex]

    if (eventId === EVENTS_IDS.CONTROL) {
        dispatch(gameReducer.actions.setActiveGameAction({ actionId: GAME_ACTIONS.selectMonumentToControl }));
    }
    if (eventId === EVENTS_IDS.RIVER) {
        dispatch(gameReducer.actions.setActiveGameAction({ actionId: GAME_ACTIONS.selectBorderToPutRiver }));
    }
}