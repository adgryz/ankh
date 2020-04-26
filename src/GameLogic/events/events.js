import { EVENTS_IDS } from './const';
import { eventBoardConfig } from 'GameComponents/EventBoard/eventBoardConfig';
import gameReducer, { GAME_ACTIONS } from 'GameLogic/game';

export const resolveCurrentEventEffect = () => (dispatch, getState) => {
    const { game } = getState();
    const eventId = eventBoardConfig[game.eventIndex]

    // Summon figure action ends immediately if player has no figures in pool
    if (eventId === EVENTS_IDS.CONTROL) {
        dispatch(gameReducer.actions.setActiveGameAction({ actionId: GAME_ACTIONS.selectMonumentToControl }));
    }
}