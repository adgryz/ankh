import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import './InfoBox.scss';

import gameReducer, { getMessageForGameAction, isDuringAction, GAME_ACTIONS } from 'GameLogic/game';
import { endActionEffect } from 'GameLogic/actions/actions';

const InfoBox = () => {
    const dispatch = useDispatch();
    const players = useSelector(({ game }) => game.players);
    const playedActions = useSelector(({ game }) => game.playedActions);
    const currentPlayerId = useSelector(({ game }) => game.currentPlayerId);
    const currentGameAction = useSelector(({ game }) => game.currentGameAction);
    const information = getMessageForGameAction(currentGameAction);
    const currentPlayer = players[currentPlayerId];

    const endTurn = () => dispatch(gameReducer.actions.endTurn());
    const endAction = () => dispatch(endActionEffect());

    return (
        <div className="infoBox">
            <div>{`${currentPlayer.name}: ${information}`}</div>
            {
                playedActions > 0 && !isDuringAction(currentGameAction) && currentGameAction !== GAME_ACTIONS.selectAction &&
                <div className="endTurnButton" onClick={endAction}>End Action</div>
            }
            {
                playedActions > 0 && currentGameAction === GAME_ACTIONS.selectAction &&
                <div className="endTurnButton" onClick={endTurn}>End Turn</div>
            }
        </div>
    )
}

export default InfoBox;