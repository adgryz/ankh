import boardReducer from 'GameLogic/board'

export const placeRiver = ({ x, y }) => (dispatch, getState) => {
    // 1. Show all borders - active borders opacity 1, other opacity 0.5, all with pointer-events
    dispatch()
    // 2. When click on border -> check if connected border is active or in temp border
    //     -> IF(Y) Add border to temp border collection
    //     -> IF(N) alert('Border has to be connected with other borders')

    // 3. Check if last placed border is connected with 2 borders (1 temp and 1 active)
    //     -> IF(Y) Make temp border active, clear temp border, start ---REGIONS-SPLITTING---

    // 3. Check if temp border length === 6
    //     -> IF(Y) Alert('Border max length is 6') and clear temp border
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