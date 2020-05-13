import gameReducer, { GAME_ACTIONS } from 'GameLogic/game';
import figuresReducer from 'GameLogic/figures';
import boardReducer from 'GameLogic/board';
import { getAdjacentList } from 'GameLogic/utils/hexUtils';
import { endActionEffect } from 'GameLogic/actions/actions';
import { isAnyAdjacentAndInSameRegion } from 'GameLogic/utils/hexUtils';

import { getPlayerMonumentsAndFigures } from '../selectors';
import { ACTIONS_IDS } from './const'

export const selectFigureToSummonEffect = ({ figureId }) => (dispatch, getState) => {
    // TODO: allow end action during select && clear summon state (selectedFigureFromPool)
    dispatch(gameReducer.actions.setActiveGameAction({ actionId: GAME_ACTIONS.summonFigure }));
    dispatch(gameReducer.actions.setSelectedFigureFromPool({ figureId }));
}

export const summonFigureEffect = ({ x, y, }) => (dispatch, getState) => {
    const { board: { hexes }, figures, monuments, game } = getState();
    const playerId = game.currentPlayerId;
    const player = game.players[playerId]
    const figureId = game.selectedFigureFromPool;
    const { summonedFiguresAdjacentPyramids } = game;
    const hex = hexes[x][y];
    const hasPyramidAttuned = player.god.unlockedPowers.includes('Pyramid Attuned')

    if (hex.areaType === 'W') {
        alert('Cannot summon into water');
        return;
    }
    if (!!hex.figureId || !!hex.monumentId) {
        alert('Cannot summon into occupied area');
        return;
    }
    const playerFiguresAndMonumentsPositions = getPlayerMonumentsAndFigures(monuments, figures, playerId);
    if (!isAnyAdjacentAndInSameRegion(x, y, playerFiguresAndMonumentsPositions, hexes)) {
        alert('Summoned figure has to be adjacent to your monument or figure');
        return;
    }

    const adjacentPyramids = getAdjacentPyramids(x, y, hexes, playerId) // for Pyramids Attuned
    if (hasPyramidAttuned) {
        // TODO - figures adjacent to more than one pyramid
        const adjacentPyramidsSummonData = summonedFiguresAdjacentPyramids.flat();

        const didNonPyramidSummon = !!adjacentPyramidsSummonData.find(x => x === 'no-pyramid');
        const newSummonHasNoAdjacentPyramid = !!adjacentPyramids.find(x => x === 'no-pyramid');
        if (didNonPyramidSummon && newSummonHasNoAdjacentPyramid) {
            alert('Now you can only summon adjacent to your pyramids');
            return;
        }

        const somePyramidWasUsedTwiceToSummon = adjacentPyramids.some(p =>
            adjacentPyramidsSummonData.filter(x => x === p).length === 2 && p !== 'no-pyramid'
        )
        const pyramidWasAlreadyUsedToSummon = adjacentPyramids.some(p => adjacentPyramidsSummonData.find(x => x === p))
        if (somePyramidWasUsedTwiceToSummon || (didNonPyramidSummon && pyramidWasAlreadyUsedToSummon)) {
            alert('You can no more summon adjacent to this pyramid');
            return;
        }
    }

    dispatch(gameReducer.actions.removeFigureFromPool({ figureId }));
    dispatch(figuresReducer.actions.addFigure({ figureId, playerId: game.currentPlayerId, x, y }));
    dispatch(boardReducer.actions.setFigures({ figures: [{ id: figureId, x, y, playerId }] }))

    if (hasPyramidAttuned) {
        // set adjacent pyramids data
        dispatch(gameReducer.actions.addFigureToSummonedFiguresPA({ adjacentPyramids }))
        dispatch(gameReducer.actions.setCurrentActionId({ actionId: ACTIONS_IDS.SUMMON }))

        const { game: newGame } = getState();
        const summonedAmount = newGame.summonedFiguresAdjacentPyramids.length;
        const spotsAbleToSummonAmount = player.monuments.pyramidsIds.length + 1
        const newFiguresPool = newGame.players[newGame.currentPlayerId].figuresPool;

        console.log(summonedAmount, spotsAbleToSummonAmount)
        if (summonedAmount === spotsAbleToSummonAmount || newFiguresPool.length === 0) {
            dispatch(endActionEffect());
        }
    } else {
        dispatch(endActionEffect());
    }
}

// HELPERS
const getAdjacentPyramids = (x, y, hexes, playerId) => {
    // returns [p1,p2,p3] or [no-pyramid]
    const adjacent = getAdjacentList(x, y);
    const neighbors = adjacent.map(({ x, y }) => {
        if (hexes[x] && hexes[x][y]) {
            const hex = hexes[x][y];
            if (hex.monumentId && hex.monumentId[0] === 'p' && hex.playerId === playerId) {
                return hex.monumentId;
            } else {
                return 'no-pyramid'
            }
        } else {
            return 'no-hex'
        }
    }).filter(x => x !== 'no-hex')
    const isAnyPyramid = neighbors.some(n => n[0] === 'p');
    return isAnyPyramid ? neighbors.filter(x => x !== 'no-pyramid') : ['no-pyramid']
}
