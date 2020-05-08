import { createSlice } from '@reduxjs/toolkit'

export const BATTLE_ACTION = {
    SELECT_CARD: 'SELECT_CARD',
    RESOLVE_CARDS: 'RESOLVE_CARDS',

    PLAGUE_BID: 'PLAGUE_BID',
    RESOLVE_PLAGUE: 'RESOLVE_PLAGUE',

    SELECT_MONUMENT: 'SELECT_MONUMENT',
    BUILD_MONUMENT: 'BUILD_MONUMENT',

    RESOLVE_BATTLE: 'RESOLVE_BATTLE',
}

const getInitialState = () => {
    return {
        tieBreakerOwnerId: undefined,
        isTieBreakerUsed: false,
        isConflictActive: false,
        activeConflictNumber: 1,
        conflicts: [],
        message: '',
        // PER BATTLE STATE
        playedCards: {},
        currentPlayerId: undefined,
        currentBattleActionId: undefined,
        playersBids: {},
        bidWinnerId: undefined,
        killedFiguresAmounts: {},
        winnerId: undefined,
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
            state.currentBattleActionId = undefined;
            state.conflicts = [];
            state.message = '';
            state.playedCards = {};
            state.playersBids = {};
            state.bidWinnerId = undefined;
            state.killedFiguresAmounts = {};
            state.winnerId = undefined;
        },
        markTieBreakerUsed: (state) => {
            state.isTieBreakerUsed = true;
        },
        setConflicts: (state, { payload }) => {
            state.conflicts = payload.conflicts;
        },
        goToNextConflict: (state) => {
            state.playedCards = {};
            state.playersBids = {};
            state.message = undefined;
            state.bidWinnerId = undefined;
            state.killedFiguresAmounts = {};
            state.currentBattleActionId = undefined;
            state.winnerId = undefined;
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
        setPlayedCard: (state, { payload }) => {
            const { playerId, card } = payload;
            state.playedCards[playerId] = card;
        },
        removeCardFromPlayedCardsInConflict: (state, { payload }) => {
            const { playerId } = payload;
            delete state.playedCards[playerId];
        },
        // DROUGHT
        changePlayerStrengthInConflict: (state, { payload }) => {
            const { playerId, newStrength, regionNumber } = payload;
            const conflict = state.conflicts.find(conflict => conflict.regionNumber === regionNumber);
            conflict.playersStrengths[playerId] = newStrength;
        },
        increasePlayerStrengthInConflict: (state, { payload }) => {
            const { playerId, regionNumber, amount } = payload;
            const conflict = state.conflicts.find(conflict => conflict.regionNumber === regionNumber);
            conflict.playersStrengths[playerId] += amount;
        },
        // BIDS
        setPlayerBid: (state, { payload }) => {
            const { playerId, bid } = payload;
            state.playersBids[playerId] = bid;
        },
        setBidWinnerId: (state, { payload }) => {
            state.bidWinnerId = payload.playerId;
        },
        setPlayerKilledFiguresAmount: (state, { payload }) => {
            const { playerId, amount } = payload;
            if (state.killedFiguresAmounts[playerId] === undefined) {
                state.killedFiguresAmounts[playerId] = amount;
            }
        },
        // RESOLUTION
        setWinnerId: (state, { payload }) => {
            state.winnerId = payload.playerId;
        },
        removeFigureFromConflicts: (state, { payload }) => {
            const { figureId, strength, playerId } = payload;
            state.conflicts.forEach(conflict => {
                if (conflict.figuresInRegion) {
                    const figureIndex = conflict.figuresInRegion.findIndex(figure => figure.figureId === figureId)
                    if (figureIndex !== -1) {
                        conflict.figuresInRegion.splice(figureIndex, 1)
                        conflict.playersStrengths[playerId] -= strength;
                    }
                }
            })

        }
    },
})

export default conflict;