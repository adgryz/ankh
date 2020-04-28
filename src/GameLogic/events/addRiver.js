import boardReducer, { BORDER } from 'GameLogic/board'
import { getConnectedBorders, areConnectedBorders } from 'GameLogic/utils/borderUtils';

export const placeRiverEffect = ({ x, y }) => (dispatch, getState) => {
    const { board: { prospectRivers, borders } } = getState();

    const connectedBorders = getConnectedBorders(x, y, borders);
    const connectedActiveBorders = connectedBorders.filter(
        ({ x, y }) => [BORDER.GAME, BORDER.RIVER].includes(borders[x][y]))
    console.log(connectedActiveBorders)
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
        dispatch(boardReducer.actions.applyProspectRivers());
        // region splitting
    }

    if (nextBoard.prospectRivers.length === 6) {
        alert('Max new river length is 6');
        dispatch(boardReducer.actions.clearProspectRivers());
        return;
    }
}

// ---RIVERS-PLACING---
// 1. Show all borders - active borders opacity 1, other opacity 0.5, all with pointer-events
// 2. When click on border -> check if connected border is active or in temp border
//     -> IF(Y) Add border to temp border collection
//     -> IF(N) alert('Border has to be connected with other borders')
// 3. Check if last placed border is connected with 2 borders (1 temp and 1 active)
//     -> IF(Y) Make temp border active, clear temp border, start ---REGIONS-SPLITTING---
// 3. Check if temp border length === 6
//     -> IF(Y) Alert('Border max length is 6') and clear temp border

// ---REGIONS-SPLITTING---
// 1. Create temp copy of board
// 2. Take first new border, then take 2 adjacent fields to it
// 3. Chose one of the fields, take new region number, start ---FLOODING-ALGORITHM---
// 4. Check if both/all regions have at least 6 fields
//     -> IF(Y) board = tempBoard start ---REGION-NUMBERS-SWAPPING---
//     -> IF(N) Alert('All regions need to have at least 6 fields'), tempBoard = board, start ---RIVERS-PLACING---

// ---FLOODING-ALGORITHM---
// 1. Set region number in field
// 2. For each neighbour field that isn't connected with border with current field, start ---FLOODING-ALGORITHM---