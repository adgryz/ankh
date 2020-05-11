import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Monument from 'GameComponents/Board/Monument';
import follower from './follower.svg'
import './MonumentsSelection.scss'

import { resolveSelectMonumentToBuildEffect } from 'GameLogic/conflicts/resolveConflicts'

const MonumentsSelection = () => {
    const dispatch = useDispatch();
    const costs = [4, 6, 8]
    const monuments = ['o', 't', 'p']

    const handleSelection = () => dispatch(resolveSelectMonumentToBuildEffect());

    return (
        <div className="monumentsSelection">
            {
                costs.map((cost, index) => <div key={index} onClick={handleSelection} className="monumentContainer">
                    <Monument monumentId={monuments[index]} size={35} />
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