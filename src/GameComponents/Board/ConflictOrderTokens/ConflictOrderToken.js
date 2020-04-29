import React from 'react';
import classnames from 'classnames';
import { useSelector, useDispatch } from 'react-redux';

import { selectRegionToPreserveItsNumberEffect, selectRegionToBeSwappedWithMaxEffect } from 'GameLogic/events/regionNumbersSwapping'
import { GAME_ACTIONS } from 'GameLogic/game'

import './ConflictOrderToken.scss';

const ConflictOrderToken = ({ number }) => {
    const dispatch = useDispatch();

    const canPreserveItsNumber = useSelector(({ board }) => board.regionsToPreserveItsNumber.includes(number))
    const maxRegionNumber = useSelector(({ board }) => board.maxRegionNumber)
    const isSwappingAction = useSelector(({ game }) => game.currentGameAction === GAME_ACTIONS.selectRegionToSwapNumbers)
    const canBeSwappedWithMaxRegion = number !== maxRegionNumber && isSwappingAction;
    const canBeSelected = canPreserveItsNumber || canBeSwappedWithMaxRegion;

    const handleClick = () => {
        if (canPreserveItsNumber) {
            dispatch(selectRegionToPreserveItsNumberEffect({ regionToBeMax: number }));
        }
        if (canBeSwappedWithMaxRegion) {
            dispatch(selectRegionToBeSwappedWithMaxEffect({ regionToBeMax: number }))
        }
    }

    return (
        <div onClick={handleClick} className={classnames('conflictToken', { canBeSelected })}>
            {canPreserveItsNumber ? '?' : number}
        </div>
    )
}

export default ConflictOrderToken;
