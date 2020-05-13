import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import './InfoBox.scss';

import gameReducer, { getMessageForGameAction, isDuringAction, GAME_ACTIONS, isEventAction } from 'GameLogic/game';
import { endActionEffect } from 'GameLogic/actions/actions';
import { endEventEffect } from 'GameLogic/events/events';
import { resolveWorshipfulEffect } from 'GameLogic/ankhPowers/worshipful';

const InfoBox = () => {
    const dispatch = useDispatch();
    const players = useSelector(({ game }) => game.players);
    const playedActions = useSelector(({ game }) => game.playedActions);
    const currentPlayerId = useSelector(({ game }) => game.currentPlayerId);
    const currentGameAction = useSelector(({ game }) => game.currentGameAction);
    const information = getMessageForGameAction(currentGameAction);
    const currentPlayer = players[currentPlayerId];

    const endTurn = () => {
        dispatch(resolveWorshipfulEffect());
        dispatch(gameReducer.actions.endTurn());
    }
    const endAction = () => dispatch(endActionEffect());
    const endEvent = () => dispatch(endEventEffect());

    if (currentGameAction === GAME_ACTIONS.battle) {
        return null;
    }

    return (
        <div className="infoBox">
            <div>{`${currentPlayer.name}: ${information}`}</div>
            {
                playedActions > 0
                && !isDuringAction(currentGameAction)
                && !isEventAction(currentGameAction)
                && currentGameAction !== GAME_ACTIONS.selectAction &&
                <div className="endTurnButton" onClick={endAction}>End Action</div>
            }
            {
                playedActions > 0
                && currentGameAction === GAME_ACTIONS.selectAction &&
                <div className="endTurnButton" onClick={endTurn}>End Turn</div>
            }
            {
                playedActions > 0
                && isEventAction(currentGameAction) &&
                <div className="endTurnButton" onClick={endEvent}>End Event</div>
            }
        </div>
    )
}

export default InfoBox;