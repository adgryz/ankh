import React from 'react';
import { useSelector } from 'react-redux';

import { GAME_ACTIONS } from 'GameLogic/game'

import { levelOnePowers, levelTwoPowers, levelThreePowers } from './Ankh/ankhPowersConfig';

import AnkhPowerColumn from './Ankh/AnkhPowerColumn';
import FiguresPool from './FiguresPool/FiguresPool';
import TieBreakerToken from './Components/TieBreakerToken';
import FollowersCount from './Components/FollowersCount';
import './GodBoard.scss';

const GodBoard = ({
    godName, godTitle, godImg, color, GodAbilityComponent,
    unlockedPowers, followers, playerId, figuresPool }) => {

    const unlockedCount = unlockedPowers.length;
    const isUnlocking = useSelector(({ game }) => game.currentGameAction === GAME_ACTIONS.unlockAnkhPower && game.currentPlayerId === playerId);
    const hasTieBreaker = useSelector(({ conflict }) => conflict.tieBreakerOwnerId === playerId);

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
            <div className="componentsPool">
                <FollowersCount followers={followers} />
                {hasTieBreaker && <TieBreakerToken />}
                <FiguresPool figuresPool={figuresPool} playerId={playerId} />
            </div>
        </>
    )

}

export default GodBoard;