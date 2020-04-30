import React from 'react';

import follower from './follower.svg';
import './FollowersCount.scss';

const FollowersCount = ({ followers }) => {
    return (
        <div className="followersWrapper">
            <div className="count">{followers}</div>
            <div className="followerToken">
                <img className="icon" alt="followers" src={follower} width={15} height={15} />
            </div>
        </div>
    )
}

export default FollowersCount