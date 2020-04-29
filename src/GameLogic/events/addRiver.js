import boardReducer, { BORDER } from 'GameLogic/board'
import { getConnectedBorders, areConnectedBorders, getBorderAdjacentHexes, hexesHaveCommonActiveBorder } from 'GameLogic/utils/borderUtils';
import { getAdjacentList } from 'GameLogic/utils/hexUtils';
import { endEventEffect } from './events';

export const placeRiverEffect = ({ x, y }) => (dispatch, getState) => {
    const { board: { prospectRivers, borders } } = getState();
    const connectedBorders = getConnectedBorders(x, y, borders);
    const connectedActiveBorders = connectedBorders.filter(
        ({ x, y }) => [BORDER.GAME, BORDER.RIVER].includes(borders[x][y]))
    if (prospectRivers.length === 0 && connectedActiveBorders.length === 0) {
        alert('First river must be connected with active borders');
        return;
    }

    const lastAddedRiver = prospectRivers[prospectRivers.length - 1];
    if (prospectRivers.length !== 0 && !areConnectedBorders(x, y, lastAddedRiver.x, lastAddedRiver.y, borders)) {
        alert('Rivers have to be connected');
        return;
    }

    dispatch(boardReducer.actions.addProspectRiver({ x, y }))

    const { board: nextBoard } = getState();
    // END OF NEW BORDER
    if ((connectedActiveBorders.length === 2 && nextBoard.prospectRivers.length > 1) || connectedActiveBorders.length === 4) {
        dispatch(splitRegionsEffect())
    }

    if (nextBoard.prospectRivers.length === 7) {
        alert('Max new river length is 6');
        dispatch(boardReducer.actions.clearProspectRivers());
        return;
    }
}

const finishRiverPlacementEffect = ({ splittedRegionNumber }) => (dispatch, getState) => {
    const { board } = getState();
    const { hexes, maxRegionNumber } = board;
    let newRegionHexesCount = 0;
    let splittedRegionHexesCount = 0;
    hexes.forEach(col => col.forEach(hex => hex.region === maxRegionNumber ? newRegionHexesCount++ : null));
    hexes.forEach(col => col.forEach(hex => hex.region === splittedRegionNumber ? splittedRegionHexesCount++ : null));

    if (newRegionHexesCount < 6 || splittedRegionHexesCount < 6) {
        alert('Both regions have to have at least 6 hexes')
        // Undo regions splitting
        hexes.forEach((col, x) => col.forEach((hex, y) => {
            if (hex.region === maxRegionNumber) {
                dispatch(boardReducer.actions.changeHexRegion({ x, y, regionNumber: splittedRegionNumber }));
            }
        }));
        dispatch(boardReducer.actions.decrementMaxRegionNumber());
        dispatch(boardReducer.actions.clearProspectRivers());

        return;
    }

    dispatch(boardReducer.actions.applyProspectRivers());
    dispatch(endEventEffect());

    // Chose which region will preserve number: splittedRegionNumber 
    // Select region to swap region number with ne region number: maxRegionNumber
    // TODO: Now player should be able to switch highest region number with other region number

}

const splitRegionsEffect = () => (dispatch, getState) => {
    dispatch(boardReducer.actions.incrementMaxRegionNumber());

    const { board } = getState();
    const { prospectRivers, maxRegionNumber, hexes } = board;
    const firstNewRiver = prospectRivers[0];
    const [hex1, hex2] = getBorderAdjacentHexes(firstNewRiver.x, firstNewRiver.y);
    const { x, y } = hex1;
    dispatch(changeHexAndItsNeighborsRegionEffect({
        x, y,
        regionNumber: maxRegionNumber,
        splittedRegionNumber: hexes[x][y].region
    }))
}

let numberOfActiveRecursiveFunctions = 0;

const changeHexAndItsNeighborsRegionEffect = ({ x, y, regionNumber, splittedRegionNumber }) => (dispatch, getState) => {
    numberOfActiveRecursiveFunctions++;
    const { board } = getState();
    const { borders, hexes, prospectRivers } = board;

    dispatch(boardReducer.actions.changeHexRegion({ x, y, regionNumber }));
    const adjacentHexes = getAdjacentList(x, y);
    const hexesToChangeRegion = adjacentHexes
        .filter(hex2 => {
            if (!hexes[hex2.x] || !hexes[hex2.x][hex2.y]) {
                return false;
            }
            if (hexes[hex2.x][hex2.y].region === regionNumber) {
                return false;
            }
            if (hexesHaveCommonActiveBorder({ x, y }, hex2, borders, prospectRivers)) {
                return false;
            }
            return true;
        });

    hexesToChangeRegion.forEach(({ x, y }) => dispatch(changeHexAndItsNeighborsRegionEffect({ x, y, regionNumber })));

    numberOfActiveRecursiveFunctions--;
    // REGION SPLITTING FINISHED
    if (numberOfActiveRecursiveFunctions === 0) {
        dispatch(finishRiverPlacementEffect({ splittedRegionNumber }))
    }
}
