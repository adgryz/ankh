import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classnames from 'classnames';

import Figure from '../Board/Figure'
import './FiguresPool.scss'

import { GAME_ACTIONS } from 'GameLogic/game'
import { selectFigureToSummonEffect } from 'GameLogic/actions/summonFigure'

const FiguresPool = ({ figuresPool, playerId }) => {
    const dispatch = useDispatch();
    const isSelecting = useSelector(({ game }) => game.currentGameAction === GAME_ACTIONS.selectFigureToSummon);
    const isSelectingPlayerPool = useSelector(({ game }) => game.currentPlayerId === playerId)
    const selectedId = useSelector(({ game }) => game.selectedFigureFromPool);
    const getClassName = figureId => classnames('figureWrapper', { isSelecting, isSelected: figureId === selectedId });
    const getChoiceHandler = figureId => () => dispatch(selectFigureToSummonEffect({ figureId }))

    return (
        <div className="figuresPool" style={{ border: isSelecting && isSelectingPlayerPool ? '3px solid salmon' : null }}>
            {figuresPool.map(figureId => <div onClick={getChoiceHandler(figureId)} className={getClassName(figureId)} key={figureId}>
                <Figure figureId={figureId} />
            </div>)}
        </div>
    )
}

export default FiguresPool;