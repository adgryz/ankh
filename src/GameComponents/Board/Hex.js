import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Figure from './Figure';
import Monument from './Monument';
import './Hex.scss';

import { GAME_ACTIONS } from 'GameLogic/game'
import { summonFigureEffect } from 'GameLogic/actions/summonFigure';
import { selectFigureToMoveEffect, moveFigureEffect } from 'GameLogic/actions/moveFigures';
import { controlMonumentEffect } from 'GameLogic/events/controlMonument';

const highlightColor = 'salmon';
const selectingActions = [
    GAME_ACTIONS.summonFigure,
    GAME_ACTIONS.selectFigureToMove,
    GAME_ACTIONS.moveFigure,
    GAME_ACTIONS.selectMonumentToControl,
]

const dispatchCurrentAction = (dispatch, currentAction, x, y) => {
    switch (currentAction) {
        case GAME_ACTIONS.summonFigure:
            dispatch(summonFigureEffect({ x, y }));
            return;
        case GAME_ACTIONS.selectFigureToMove:
            dispatch(selectFigureToMoveEffect({ x, y }));
            return;
        case GAME_ACTIONS.moveFigure:
            dispatch(moveFigureEffect({ x, y }));
            return;
        case GAME_ACTIONS.selectMonumentToControl:
            dispatch(controlMonumentEffect({ x, y }))
        default:
            return;
    }
}

const Hex = ({ hexData, columnNumber, hexNumber }) => {
    const dispatch = useDispatch();
    const currentAction = useSelector(({ game }) => game.currentGameAction)
    const players = useSelector(({ game }) => game.players)
    const selectedFigureId = useSelector(({ game }) => game.selectedFigureId)

    const playerColor = hexData.playerId ? players[hexData.playerId].god.color : 'grey';

    const isSelecting = selectingActions.includes(currentAction);

    const { areaType } = hexData;

    const [hoverColor, setHoverColor] = useState('transparent');

    const handleMouseOver = () => setHoverColor(highlightColor);
    const handleMouseOut = () => setHoverColor('transparent');

    const handleClick = () => dispatchCurrentAction(dispatch, currentAction, columnNumber, hexNumber);

    let backgroundColor;
    if (areaType === 'X') {
        backgroundColor = 'transparent';
    } else {
        // backgroundColor = '#' + 3 * hexData.region + 3 * hexData.region + 3 * hexData.region;
        backgroundColor = getColor(areaType);
    }

    let overlayColor;
    if (!!selectedFigureId && selectedFigureId === hexData.figureId) {
        overlayColor = highlightColor;
    } else if (hexData.isPreview) {
        overlayColor = highlightColor
    } else if (isSelecting) {
        overlayColor = hoverColor;
    }

    let hexStyles = { backgroundColor }
    if (areaType === 'X') {
        hexStyles = { ...hexStyles, pointerEvents: 'none' }
    }
    if (isSelecting) {
        hexStyles = { ...hexStyles, cursor: 'pointer' }
    }

    return (
        <div
            className="hex"
            data={hexData.isPreview ? 'preview' : '' + hexData.isSelecting ? 'select' : ''}
            onMouseOver={handleMouseOver}
            onMouseOut={handleMouseOut}
            onClick={handleClick}
            style={hexStyles} >
            {/* {columnNumber + ',' + hexNumber} */}
            {
                (hexData.figureId || hexData.monumentId) &&
                <div className="token" style={{ borderColor: playerColor }}>
                    {
                        hexData.figureId && <Figure figureId={hexData.figureId} />
                    }
                    {
                        hexData.monumentId && <Monument monumentId={hexData.monumentId} />
                    }
                </div>
            }
            <div style={{ backgroundColor: overlayColor }} className="colorOverlay" />
        </div>
    )
}

const getColor = colorCode => {
    switch (colorCode) {
        case 'G':
            return '#2fb541'; // Green
        case 'D':
            return '#ebd773'; // Desert
        case 'W':
            return '#58bae0'; // Water
        default:
            return 'black';
    }
}


export default Hex;
