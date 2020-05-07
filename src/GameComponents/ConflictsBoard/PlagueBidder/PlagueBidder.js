import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { plagueBidEffect } from 'GameLogic/conflicts/resolveConflicts';

import follower from './follower.svg';
import './PlagueBidder.scss';

const PlagueBidder = () => {
    const dispatch = useDispatch();
    const playerId = useSelector(({ conflict }) => conflict.currentPlayerId)
    const playerFollowers = useSelector(({ game }) => game.players[playerId].followers)
    const [bid, setBid] = useState(0);

    useEffect(
        () => {
            setBid(0);
        }, [playerId]
    )

    const handleBid = () => dispatch(plagueBidEffect({ playerId, bid }));

    return (
        <div className="bidderContainer">
            <div className="header">{playerId} place your bid</div>
            <div className="bidder">
                {bid > 0 && <div className="bidButton" onClick={() => setBid(bid - 1)}>-</div>}
                <div className="bidContainer">
                    <div className="followerImgContainer">
                        <img className="followerImg" height={20} width={20} src={follower} alt="follower" />
                    </div>
                    <div className="bidAmount">{bid}</div>
                </div>
                {bid < playerFollowers && <div className="bidButton" onClick={() => setBid(bid + 1)}>+</div>}
            </div>
            <div onClick={handleBid} className="bidButton">Bid Followers</div>
        </div>

    )
}

export default PlagueBidder