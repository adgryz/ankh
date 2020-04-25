import React from 'react';
import { useSelector } from 'react-redux';

import AnkhPowerColumn from './AnkhPowerColumn';
import FiguresPool from './FiguresPool';
import followersIcon from './follower.svg';
import './GodBoard.scss';

import { GAME_ACTIONS } from 'GameLogic/game'
import { levelOnePowers, levelTwoPowers, levelThreePowers } from './ankhPowersConfig';

const GodBoard = ({ godName, godTitle, godImg, color, GodAbilityComponent, unlockedPowers, followers, playerId, figuresPool }) => {
    const unlockedCount = unlockedPowers.length;
    const isUnlocking = useSelector(({ game }) => game.currentGameAction === GAME_ACTIONS.unlockAnkhPower && game.currentPlayerId === playerId);

    return (
        <>
            <div style={{ borderColor: color }} className="godBoard">
                <div className="portrait">
                    <div className="description">
                        <div className="name">{godName}</div>
                        <div className="title">{godTitle}</div>
                    </div>
                    <img className="image" src={godImg} alt="portrait" />
                    {GodAbilityComponent && <GodAbilityComponent />}
                    <div className="followers">
                        <div className="count">{followers}</div>
                        <img className="icon" alt="followers" src={followersIcon} width={15} height={15} />
                    </div>
                </div>
                <div className="powers">
                    <AnkhPowerColumn
                        columnNumber={1}
                        guardianIndex={2}
                        firstActive={unlockedCount > 0}
                        secondActive={unlockedCount > 1}
                        unlockedPowers={unlockedPowers}
                        isUnlocking={isUnlocking && unlockedCount < 2}
                        powers={levelOnePowers}
                        color={color} />
                    <AnkhPowerColumn
                        columnNumber={2}
                        guardianIndex={2}
                        firstActive={unlockedCount > 2}
                        secondActive={unlockedCount > 3}
                        unlockedPowers={unlockedPowers}
                        isUnlocking={isUnlocking && unlockedCount < 4 && unlockedCount >= 2}
                        powers={levelTwoPowers}
                        color={color} />
                    <AnkhPowerColumn
                        columnNumber={3}
                        guardianIndex={1}
                        firstActive={unlockedCount > 4}
                        secondActive={unlockedCount > 5}
                        unlockedPowers={unlockedPowers}
                        isUnlocking={isUnlocking && unlockedCount < 6 && unlockedCount >= 4}
                        powers={levelThreePowers}
                        color={color} />
                </div>
            </div>
            <FiguresPool figuresPool={figuresPool} playerId={playerId} />
        </>
    )

}

export default GodBoard;