import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Figure from './Figure';
import Monument from './Monument';
import './Hex.scss';

import { GAME_ACTIONS } from 'GameLogic/game'
import { summonFigureEffect } from 'GameLogic/actions/summonFigure';
import { selectFigureToMoveEffect, moveFigureEffect } from 'GameLogic/actions/moveFigures';
import { controlMonumentEffect } from 'GameLogic/events/controlMonument';

import { BATTLE_ACTION } from 'GameLogic/conflict';
import { resolvePlaceMonumentEffect } from 'GameLogic/conflicts/resolveConflicts'
import {
    selectFigureToMoveDuringObeliskAttunedffect,
    moveFigureDuringObeliskAttunedEffect
} from 'GameLogic/ankhPowers/obeliskAttuned';

const highlightColor = 'salmon';
const selectingActions = [
    GAME_ACTIONS.summonFigure,
    GAME_ACTIONS.selectFigureToMove,
    GAME_ACTIONS.moveFigure,
    GAME_ACTIONS.selectMonumentToControl,
    BATTLE_ACTION.BUILD_MONUMENT,
    BATTLE_ACTION.OBELISK_ATTUNED_SELECT_FIGURE,
    BATTLE_ACTION.OBELISK_ATTUNED_PLACE_FIGURE,
]

const dispatchCurrentAction = (dispatch, currentAction, currentBattleActionId, x, y) => {
    if (currentBattleActionId) {
        switch (currentBattleActionId) {
            case BATTLE_ACTION.BUILD_MONUMENT:
                dispatch(resolvePlaceMonumentEffect({ x, y }));
                return;
            case BATTLE_ACTION.OBELISK_ATTUNED_SELECT_FIGURE:
                dispatch(selectFigureToMoveDuringObeliskAttunedffect({ x, y }));
                return;
            case BATTLE_ACTION.OBELISK_ATTUNED_PLACE_FIGURE:
                dispatch(moveFigureDuringObeliskAttunedEffect({ x, y }));
                return;
            default:
                return;
        }
    }
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
            return;
        default:
            return;
    }
}

const Hex = ({ hexData, columnNumber, hexNumber }) => {
    const dispatch = useDispatch();
    const currentAction = useSelector(({ game }) => game.currentGameAction)
    const currentBattleActionId = useSelector(({ conflict }) => conflict.currentBattleActionId)
    const players = useSelector(({ game }) => game.players)
    const selectedFigureId = useSelector(({ game }) => game.selectedFigureId)
    const obeliskAttunedSelectedFigureId = useSelector(({ conflict }) => conflict.obeliskAttunedSelectedFigureId)

    const playerColor = hexData.playerId ? players[hexData.playerId].god.color : 'grey';

    const isSelecting = selectingActions.includes(currentAction) || selectingActions.includes(currentBattleActionId);

    const { areaType } = hexData;

    const [hoverColor, setHoverColor] = useState('transparent');

    const handleMouseOver = () => setHoverColor(highlightColor);
    const handleMouseOut = () => setHoverColor('transparent');

    const handleClick = () => dispatchCurrentAction(dispatch, currentAction, currentBattleActionId, columnNumber, hexNumber);

    let backgroundColor;
    if (areaType === 'X') {
        backgroundColor = 'transparent';
    } else {
        backgroundColor = getColor(areaType);
    }

    let overlayColor;
    if (!!selectedFigureId && selectedFigureId === hexData.figureId) {
        overlayColor = highlightColor;
    } else if (!!obeliskAttunedSelectedFigureId && obeliskAttunedSelectedFigureId === hexData.figureId) {
        overlayColor = highlightColor
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
