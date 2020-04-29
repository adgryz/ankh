import boardReducer from 'GameLogic/board';
import gameReducer, { GAME_ACTIONS } from 'GameLogic/game';
import { endEventEffect } from './events';


export const selectRegionToPreserveItsNumberEffect = ({ regionToBeMax }) => (dispatch, getState) => {
    const { board } = getState();
    const regionsToSwap = board.regionsToPreserveItsNumber;

    if (regionToBeMax !== board.maxRegionNumber) {
        dispatch(boardReducer.actions.clearRegionsToPreserveItsNumber());
        dispatch(gameReducer.actions.setActiveGameAction({ actionId: GAME_ACTIONS.selectRegionToSwapNumbers }))
        return;
    }

    dispatch(swapRegionsEffect({ regions: regionsToSwap }));

    dispatch(boardReducer.actions.clearRegionsToPreserveItsNumber());
    dispatch(gameReducer.actions.setActiveGameAction({ actionId: GAME_ACTIONS.selectRegionToSwapNumbers }))
}

export const selectRegionToBeSwappedWithMaxEffect = ({ regionToBeMax }) => (dispatch, getState) => {
    const { board } = getState();
    dispatch(swapRegionsEffect({ regions: [regionToBeMax, board.maxRegionNumber] }));
    dispatch(endEventEffect());
}

export const swapRegionsEffect = ({ regions }) => (dispatch, getState) => {
    const { board } = getState();
    const { hexes } = board;

    const [firstRegion, secondRegion] = regions;

    // set firstRegion as 0
    hexes.forEach((col, x) => col.forEach((hex, y) => {
        if (hex.region === firstRegion) {
            dispatch(boardReducer.actions.changeHexRegion({ x, y, regionNumber: 0 }))
        }
    }))

    const { board: boardNext } = getState();
    const { hexes: hexesNext } = boardNext
    // set secondRegion as firstRegion
    hexesNext.forEach((col, x) => col.forEach((hex, y) => {
        if (hex.region === secondRegion) {
            dispatch(boardReducer.actions.changeHexRegion({ x, y, regionNumber: firstRegion }))
        }
    }))

    const { board: boardNextNext } = getState();
    const { hexes: hexesNextNext } = boardNextNext
    // set 0 region as secondRegion
    hexesNextNext.forEach((col, x) => col.forEach((hex, y) => {
        if (hex.region === 0) {
            dispatch(boardReducer.actions.changeHexRegion({ x, y, regionNumber: secondRegion }))
        }
    }))
}