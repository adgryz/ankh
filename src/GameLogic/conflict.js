import { createSlice } from '@reduxjs/toolkit'

const getInitialState = () => {
    return {
        tieBreakerOwnerId: undefined,
        isTieBreakerUsed: false,
        isConflictActive: false,
        activeConflictNumber: 1,
    }
}

const conflict = createSlice({
    name: 'conflict',
    initialState: getInitialState(),
    reducers: {
        giveTieBreakerToPlayer: (state, { payload }) => {
            state.tieBreakerOwnerId = payload.playerId;
        },
        setConflictActive: (state) => {
            state.isConflictActive = true;
        },
        clearAfterConflict: (state) => {
            state.tieBreakerOwnerId = undefined;
            state.isTieBreakerUsed = false;
            state.isConflictActive = false;
            state.activeConflictNumber = 1;
        },
        markTieBreakerUsed: (state) => {
            state.isTieBreakerUsed = true;
        }
    },
})

export default conflict;