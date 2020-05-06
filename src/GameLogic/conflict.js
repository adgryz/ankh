import { createSlice } from '@reduxjs/toolkit'

export const BATTLE_ACTION = {
    SELECT_CARD: 'SELECT_CARD',
    RESOLVE_CARDS: 'RESOLVE_CARDS'
}

const getInitialState = () => {
    return {
        tieBreakerOwnerId: undefined,
        isTieBreakerUsed: false,
        isConflictActive: false,
        activeConflictNumber: 1,
        conflicts: [],
        message: '',
        playedCards: {},
        currentPlayerId: undefined,
        currentBattleActionId: undefined,
        currentConflictId: undefined
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
        clearAfterConflicts: (state) => {
            state.tieBreakerOwnerId = undefined;
            state.isTieBreakerUsed = false;
            state.isConflictActive = false;
            state.activeConflictNumber = 1;
        },
        markTieBreakerUsed: (state) => {
            state.isTieBreakerUsed = true;
        },
        setConflicts: (state, { payload }) => {
            state.conflicts = payload.conflicts;
        },
        goToNextConflict: (state) => {
            state.activeConflictNumber++;
        },
        setMessage: (state, { payload }) => {
            state.message = payload.message;
        },
        setCurrentPlayerId: (state, { payload }) => {
            state.currentPlayerId = payload.playerId;
        },
        setCurrentBattleActionId: (state, { payload }) => {
            state.currentBattleActionId = payload.actionId;
        },
        setCurrentConflictId: (state, { payload }) => {
            state.currentConflictId = payload.conflictId;
        },
        setPlayedCard: (state, { payload }) => {
            const { playerId, card } = payload;
            state.playedCards[playerId] = card;
        },
        removePlayerCard: (state, { payload }) => {
            const { playerId } = payload;
            delete state.playedCards[playerId];
        }
    },
})

export default conflict;