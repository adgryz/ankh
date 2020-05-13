import { createSlice } from '@reduxjs/toolkit'

export const BATTLE_ACTION = {
    SELECT_CARD: 'SELECT_CARD',
    RESOLVE_CARDS: 'RESOLVE_CARDS',

    PLAGUE_BID: 'PLAGUE_BID',
    RESOLVE_PLAGUE: 'RESOLVE_PLAGUE',

    SELECT_MONUMENT: 'SELECT_MONUMENT',
    BUILD_MONUMENT: 'BUILD_MONUMENT',

    RESOLVE_BATTLE: 'RESOLVE_BATTLE',
    TIE_BREAKER_QUESTION: 'TIE_BREAKER_QUESTION',

    OBELISK_ATTUNED_SELECT_FIGURE: 'OBELISK_ATTUNED_SELECT_FIGURE',
    OBELISK_ATTUNED_PLACE_FIGURE: 'OBELISK_ATTUNED_PLACE_FIGURE'
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
        plaguePlayersIds: [],
        beforeBattleCards: [], // without plague cards and without miracle cards, entries are [playerId,card]
        miraclePlayersIds: [],
        currentPlayerId: undefined,
        currentBattleActionId: undefined,
        playersBids: {},
        bidWinnerId: undefined,
        killedFiguresAmounts: {},
        winnerId: undefined,
        monumentToBeBuilt: {
            playerId: undefined,
            monumentType: undefined
        },
        // obelisk attuned
        obeliskAttunedPlayerId: undefined,
        obeliskAttunedSelectedFigureId: undefined,
    }
}

const conflict = createSlice({
    name: 'conflict',
    initialState: getInitialState(),
    reducers: {
        giveTieBreakerToPlayer: (state, { payload }) => {
            state.tieBreakerOwnerId = payload.playerId;
        },
        setTieBreakerUsed: (state) => {
            state.isTieBreakerUsed = true;
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
            state.plaguePlayersIds = [];
            state.beforeBattleCards = [];
            state.miraclePlayersIds = [];
            state.message = '';
            state.playersBids = {};
            state.bidWinnerId = undefined;
            state.killedFiguresAmounts = {};
            state.winnerId = undefined;
            state.monumentToBeBuilt = {};
            state.obeliskAttunedPlayerId = undefined;
            state.obeliskAttunedSelectedFigureId = undefined;
        },
        markTieBreakerUsed: (state) => {
            state.isTieBreakerUsed = true;
        },
        setConflicts: (state, { payload }) => {
            state.conflicts = payload.conflicts;
        },
        goToNextConflict: (state) => {
            state.plaguePlayersIds = [];
            state.beforeBattleCards = [];
            state.miraclePlayersIds = [];
            state.playersBids = {};
            state.message = undefined;
            state.bidWinnerId = undefined;
            state.killedFiguresAmounts = {};
            state.currentBattleActionId = undefined;
            state.winnerId = undefined;
            state.activeConflictNumber++;
            state.monumentToBeBuilt = {};
            state.obeliskAttunedPlayerId = undefined;
            state.obeliskAttunedSelectedFigureId = undefined;
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
        // CARDS RESOLUTION
        addPlaguePlayerId: (state, { payload }) => {
            state.plaguePlayersIds.push(payload.playerId);
        },
        setBeforeBattleCards: (state, { payload }) => {
            state.beforeBattleCards = payload.battleCards;
        },
        removeFirstBeforeBattleCard: (state) => {
            state.beforeBattleCards.shift();
        },
        addMiraclePlayerId: (state, { payload }) => {
            state.miraclePlayersIds.push(payload.playerId);
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
        // BUILD MONUMENT 
        setMonumentToBeBuilt: (state, { payload }) => {
            const { playerId, monumentType } = payload;
            state.monumentToBeBuilt = { playerId, monumentType };
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

        },
        // OBELISK ATTUNED
        setObeliskAttunedPlayerId: (state, { payload }) => {
            state.obeliskAttunedPlayerId = payload.playerId;
        },
        setObeliskAttunedSelectedFigureId: (state, { payload }) => {
            state.obeliskAttunedSelectedFigureId = payload.figureId;
        },
    },
})

export default conflict;