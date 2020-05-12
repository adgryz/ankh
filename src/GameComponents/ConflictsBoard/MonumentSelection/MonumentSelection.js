import React from 'react';
import classnames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';

import Monument from 'GameComponents/Board/Monument';
import follower from './follower.svg'
import './MonumentsSelection.scss'

import { resolveSelectMonumentToBuildEffect } from 'GameLogic/conflicts/resolveConflicts'

const MonumentsSelection = () => {
    const dispatch = useDispatch();
    const { monumentType: selectedMonumentType } = useSelector(({ conflict }) => conflict.monumentToBeBuilt);
    const [playerId, ...rest] = useSelector(({ conflict }) => conflict.beforeBattleCards[0]);
    const { monuments } = useSelector(({ game }) => game.players[playerId]);

    const obeliskCost = 2 + 2 * monuments.obelisksIds.length;
    const templeCost = 2 + 2 * monuments.templesIds.length;
    const pyramidCost = 2 + 2 * monuments.pyramidsIds.length;

    const monumentsTypes = ['o', 't', 'p'];
    const costs = [obeliskCost, templeCost, pyramidCost];

    const handleSelection = (monumentType) => () => dispatch(resolveSelectMonumentToBuildEffect({ monumentType }));

    return (
        <div className="monumentsSelection">
            {
                costs.map((cost, index) => <div key={index}
                    onClick={handleSelection(monumentsTypes[index])}
                    className={classnames("monumentContainer", {
                        isSelected: selectedMonumentType === monumentsTypes[index],
                        isSelecting: !selectedMonumentType,
                    })}>
                    <Monument monumentId={monumentsTypes[index]} size={35} />
                    <div className="costContainer">
                        <div className="cost">{cost}</div>
                        <div className="followerImgContainer">
                            <img className="followerImg" height={20} width={20} src={follower} alt="follower" />
                        </div>
                    </div>

                </div>)
            }
        </div>
    )
}

export default MonumentsSelection