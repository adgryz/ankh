import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import classnames from 'classnames';

import './Border.scss';

import { placeRiverEffect } from 'GameLogic/events/addRiver'
import { BORDER } from 'GameLogic/board'

const Border = ({ x, y, borderData }) => {
    const dispatch = useDispatch();

    const isPreviewActive = useSelector(({ board }) => board.isBordersPreviewActive)
    const prospectRivers = useSelector(({ board }) => board.prospectRivers)

    const isFlat = x % 2 === 1;
    const isOddFlat = x % 4 === 3;
    const isLeftSkew = (x % 4 === 0 && y % 2 === 1) || (x % 4 === 2 && y % 2 === 0);
    const isRightSkew = (x % 4 === 0 && y % 2 === 0) || (x % 4 === 2 && y % 2 === 1);

    const isDisplayed = borderData === BORDER.RIVER;
    const isGameBoardDisplayed = borderData === BORDER.GAME && isPreviewActive;
    const isPreview = borderData === BORDER.POSSIBLE && isPreviewActive;
    const isProspectRiver = prospectRivers.find(river => river.x === x && river.y === y);

    const handleClick = () => {
        if (!isProspectRiver) {
            dispatch(placeRiverEffect({ x, y }));
        }
    }

    const className = classnames(
        "border",
        {
            isRightSkew, isLeftSkew, isFlat, isOddFlat,
            isDisplayed, isPreview, isGameBoardDisplayed,
            isProspectRiver
        }
    )
    return (
        <div className={className} onClick={handleClick} />
    )
}

export default Border;