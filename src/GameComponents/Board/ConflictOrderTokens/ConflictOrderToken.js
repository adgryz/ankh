import React from 'react';
import classnames from 'classnames';
import { useSelector, useDispatch } from 'react-redux';

import { selectRegionToPreserveItsNumberEffect } from 'GameLogic/events/regionNumbersSwapping'

import './ConflictOrderToken.scss';

const ConflictOrderToken = ({ number }) => {
    const dispatch = useDispatch();
    const canBeSwapped = useSelector(({ board }) => board.regionsToPreserveItsNumber.includes(number))
    const handleClick = () => dispatch(selectRegionToPreserveItsNumberEffect({ regionToBeMax: number }));
    return (
        <div onClick={handleClick} className={classnames('conflictToken', { canBeSwapped })}>
            {canBeSwapped ? '?' : number}
        </div>
    )
}

export default ConflictOrderToken;
