import boardReducer from 'GameLogic/board';
import gameReducer, { GAME_ACTIONS } from 'GameLogic/game';


export const selectRegionToPreserveItsNumberEffect = ({ regionToBeMax }) => (dispatch, getState) => {
    const { board } = getState();
    const { maxRegionNumber, hexes } = board;

    if (regionToBeMax === maxRegionNumber) {
        dispatch(boardReducer.actions.clearRegionsToPreserveItsNumber());
        dispatch(gameReducer.actions.setActiveGameAction({ actionId: GAME_ACTIONS.selectRegionToSwitchNumbers }))
        return;
    }

    // set maxRegionNumber as 0
    hexes.forEach((col, x) => col.forEach((hex, y) => {
        if (hex.region === maxRegionNumber) {
            dispatch(boardReducer.actions.changeHexRegion({ x, y, regionNumber: 0 }))
        }
    }))

    const { board: boardNext } = getState();
    const { hexes: hexesNext } = boardNext
    // set regionToBeMax as maxRegionNumber
    hexesNext.forEach((col, x) => col.forEach((hex, y) => {
        if (hex.region === regionToBeMax) {
            dispatch(boardReducer.actions.changeHexRegion({ x, y, regionNumber: maxRegionNumber }))
        }
    }))

    const { board: boardNextNext } = getState();
    const { hexes: hexesNextNext } = boardNextNext
    // set 0 region as  regionToBeMax
    hexesNextNext.forEach((col, x) => col.forEach((hex, y) => {
        if (hex.region === 0) {
            dispatch(boardReducer.actions.changeHexRegion({ x, y, regionNumber: regionToBeMax }))
        }
    }))

    dispatch(boardReducer.actions.clearRegionsToPreserveItsNumber());
    dispatch(gameReducer.actions.setActiveGameAction({ actionId: GAME_ACTIONS.selectRegionToSwitchNumbers }))
}