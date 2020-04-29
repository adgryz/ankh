import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import boardReducer from 'GameLogic/board'

import './ConflictOrderTokensToggle.scss';

const ConflictOrderTokensToggle = () => {
    const dispatch = useDispatch();
    const areConflictOrderTokensShown = useSelector(({ board }) => board.areConflictOrderTokensShown);
    const handleClick = () => dispatch(boardReducer.actions.toggleAreConflictOrderTokensShown())
    return (
        <div className="toggleButton" onClick={handleClick}>
            {areConflictOrderTokensShown ? 'Hide' : 'Show'}
        </div>
    )
}

export default ConflictOrderTokensToggle;