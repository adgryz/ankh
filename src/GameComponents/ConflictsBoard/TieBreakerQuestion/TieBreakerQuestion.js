import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import './TieBreakerQuestion.scss'

import { confirmTieBreakerUseEffect, denyTieBreakerUseEffect } from 'GameLogic/conflicts/resolveConflicts'

const TieBreakerQuestion = () => {
    const dispatch = useDispatch();
    const tieBreakerOwnerId = useSelector(({ conflict }) => conflict.tieBreakerOwnerId);
    const players = useSelector(({ game }) => game.players);
    const tieBreakerGodOwner = players[tieBreakerOwnerId].god.name;

    const handleCancel = () => dispatch(denyTieBreakerUseEffect());
    const handleConfirmation = () => dispatch(confirmTieBreakerUseEffect());

    return (
        <div className="tieBreakerQuestion">
            <div className="question">
                <span style={{ textTransform: 'capitalize' }}>{tieBreakerGodOwner}</span>
                , do you want to use your Tie Breaker Token ?
            </div>
            <div className="buttons">
                <div className="cancel" onClick={handleCancel}>NO</div>
                <div className="confirm" onClick={handleConfirmation}>YES</div>
            </div>
        </div>
    )
}

export default TieBreakerQuestion