import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import ActionField from './ActionField';
import './ActionRow.scss';
import { GAME_ACTIONS } from 'GameLogic/game'
import { selectActionEffect } from 'GameLogic/actions/actions';

const ActionRow = ({ currentActionIndex, maxIndex, config, actionId, actionRowIndex }) => {
    const dispatch = useDispatch();
    const fields = new Array(maxIndex + 1).fill(0);
    const isSelecting = useSelector(({ game }) => game.currentGameAction === GAME_ACTIONS.selectAction);
    const playedActionId = useSelector(({ game }) => game.currentActionId);
    const playedActionOrder = useSelector(({ game }) => playedActionId ? game.actions[playedActionId].order : null);
    const isPlayableAction = playedActionOrder ? actionRowIndex > playedActionOrder : true;

    const handleSelect = () => dispatch(selectActionEffect({ actionId }));

    return (<div className="actionRow">
        <div className="title">{config.title}</div>
        {
            isSelecting && isPlayableAction && <div className="choiceButton" onClick={handleSelect}>CHOOSE ACTION</div>
        }
        {
            fields.map((entry, index) => <ActionField
                key={index}
                color={config.color}
                isActive={index === currentActionIndex}
                isEventActivator={index === maxIndex}
                label={index < 4 ? `${5 - index}p` : null} />)
        }
    </div>)
}

export default ActionRow;