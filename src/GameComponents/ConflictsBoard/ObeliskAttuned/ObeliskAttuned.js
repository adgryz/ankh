import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import './ObeliskAttuned.scss'

import { resolveNextPlayerObeliskAttunedEffect } from 'GameLogic/ankhPowers/obeliskAttuned'
import { BATTLE_ACTION } from 'GameLogic/conflict'


const ObeliskAttuned = () => {
    const dispatch = useDispatch();
    const obeliskAttunedPlayerId = useSelector(({ conflict }) => conflict.obeliskAttunedPlayerId);
    const battleActionId = useSelector(({ conflict }) => conflict.currentBattleActionId);
    const players = useSelector(({ game }) => game.players);
    const obeliskAttunedGodName = obeliskAttunedPlayerId ? players[obeliskAttunedPlayerId].god.name : '';
    const godColor = obeliskAttunedPlayerId ? players[obeliskAttunedPlayerId].god.color : 'brown';

    const handleFinish = () => dispatch(resolveNextPlayerObeliskAttunedEffect());

    return (
        <div className="obeliskAttuned">
            <div className="info">
                <span style={{ textTransform: 'capitalize', color: godColor }}>
                    {obeliskAttunedGodName}&nbsp;
                </span>
                you can move your figures from other regions to your obelisks in current region
            </div>
            <div className="instruction">
                {
                    battleActionId === BATTLE_ACTION.OBELISK_ATTUNED_SELECT_FIGURE
                        ? 'Select figure'
                        : 'Place figure'
                }
            </div>
            <div className="finish" onClick={handleFinish}>DONE</div>
        </div >
    )
}

export default ObeliskAttuned