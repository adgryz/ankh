import { createSlice } from '@reduxjs/toolkit'
import { amun, ra } from 'GameLogic/godsSettings/godsSettings';
import { ACTIONS_IDS } from 'GameLogic/actions/const'
import { BATTLE_CARD } from 'GameLogic/conflicts/const'

export const GAME_ACTIONS = {
    selectAction: 'selectAction',

    selectFigureToMove: 'selectFigureToMove',
    moveFigure: 'moveFigure',

    selectFigureToSummon: 'selectFigureToSummon',
    summonFigure: 'summonFigure',

    gainFollowers: 'gainFollowers',
    unlockAnkhPower: 'unlockAnkhPower',

    selectMonumentToControl: 'selectMonumentToControl',
    controlMonument: 'controlMonument',

    selectBorderToPutRiver: 'selectBorderToPutRiver',
    selectWhichRegionWillPreserveItsNumber: 'selectWhichRegionWillPreserveItsNumber',
    selectRegionToSwapNumbers: 'selectRegionToSwapNumbers',

    battle: 'battle',
}

const getGameActionForActionId = actionId => {
    switch (actionId) {
        case ACTIONS_IDS.MOVE:
            return GAME_ACTIONS.selectFigureToMove;
        case ACTIONS_IDS.SUMMON:
            return GAME_ACTIONS.selectFigureToSummon;
        case ACTIONS_IDS.GAIN:
            return GAME_ACTIONS.gainFollowers;
        case ACTIONS_IDS.ANKH:
            return GAME_ACTIONS.unlockAnkhPower;
        default:
            return null;
    }
}

export const getMessageForGameAction = gameAction => {
    switch (gameAction) {
        case GAME_ACTIONS.selectAction:
            return "choose action";

        case GAME_ACTIONS.selectFigureToMove:
            return "select figure to move";
        case GAME_ACTIONS.moveFigure:
            return "move figure";

        case GAME_ACTIONS.selectFigureToSummon:
            return "select figure to summon";
        case GAME_ACTIONS.summonFigure:
            return "summon figure";

        case GAME_ACTIONS.unlockAnkhPower:
            return "unlock Ankh power";

        case GAME_ACTIONS.selectMonumentToControl:
            return 'take control of monument';

        case GAME_ACTIONS.selectBorderToPutRiver:
            return 'create new border consisting up to 6 river borders';
        case GAME_ACTIONS.selectWhichRegionWillPreserveItsNumber:
            return 'select which region will preserve its number';
        case GAME_ACTIONS.selectRegionToSwapNumbers:
            return 'select region to switch numbers with newly created region (highest number)';
        default:
            return 'no-action';
    }
}

const initialPlayerState = {
    monuments: {
        obelisksIds: [],
        templesIds: [],
        pyramidsIds: [],
    },
    figures: {
        godsIds: [],
        warriorsIds: [],
        sentinelsIds: []
    },
    followers: 1,
    devotion: 0,
    battleCards: Object.values(BATTLE_CARD)
}
const getInitialState = () => {
    return {
        playerIds: ['p1', 'p2'],
        players: {
            p1: {
                id: 'p1',
                name: 'Adam',
                god: amun,
                figuresPool: ['w13', 'w14', 'w15', 'w16'],
                ...initialPlayerState,
            },
            p2: {
                id: 'p2',
                name: 'Kinga',
                god: ra,
                figuresPool: ['w23', 'w24', 'w25', 'w26'],
                ...initialPlayerState,
            }
        },
        currentPlayerId: 'p1',
        currentGameAction: GAME_ACTIONS.selectAction,
        eventIndex: 0,
        actions: {
            [ACTIONS_IDS.MOVE]: {
                id: ACTIONS_IDS.MOVE,
                startingIndex: 3,
                index: 3,
                maxIndex: 6,
                order: 1,
            },
            [ACTIONS_IDS.SUMMON]: {
                id: ACTIONS_IDS.SUMMON,
                startingIndex: 3,
                index: 3,
                maxIndex: 6,
                order: 2,
            },
            [ACTIONS_IDS.FOLLOWERS]: {
                id: ACTIONS_IDS.FOLLOWERS,
                startingIndex: 3,
                index: 5,
                maxIndex: 6,
                order: 3,
            },
            [ACTIONS_IDS.ANKH]: {
                id: ACTIONS_IDS.ANKH,
                startingIndex: 3,
                index: 3,
                maxIndex: 5,
                order: 4
            }
        },
        playedActions: 0,
        currentActionId: null,
        initialActionsIndex: 3,
        movedFiguresIds: [],
        summonedFiguresAdjacentPyramids: [], // types of adjacency of summoned figures: [ [p1,p2], [no-pyramid], [p5], [p2,p3,p4] ]
    }
}

export const initializePlayerFiguresAndMonumentsEffect = () => (dispatch, getState) => {
    const { figures, game: gameState, monuments } = getState();
    const { playerIds } = gameState;
    const { gods, warriors } = figures;
    const { obelisks, pyramids, temples } = monuments;

    playerIds.forEach(playerId => {
        const godsIds = getPlayerObjectIds(gods, playerId);
        const warriorsIds = getPlayerObjectIds(warriors, playerId);
        const obelisksIds = getPlayerObjectIds(obelisks, playerId);
        const pyramidsIds = getPlayerObjectIds(pyramids, playerId);
        const templesIds = getPlayerObjectIds(temples, playerId);
        dispatch(game.actions.setInitialFiguresAndMonuments({
            playerId,
            godsIds, warriorsIds, obelisksIds, pyramidsIds, templesIds
        }));
    })
}
const getPlayerObjectIds = (object, playerId) => Object.values(object).filter(x => x.playerId === playerId).map(({ id }) => id);

export const isDuringAction = currentGameActionId => {
    return [
        GAME_ACTIONS.moveFigure,
        GAME_ACTIONS.summonFigure,
        GAME_ACTIONS.selectWhichRegionWillPreserveItsNumber].includes(currentGameActionId)
}

export const isEventAction = currentGameActionId => {
    return [
        GAME_ACTIONS.selectMonumentToControl,
        GAME_ACTIONS.selectBorderToPutRiver,
        GAME_ACTIONS.selectRegionToSwapNumbers].includes(currentGameActionId)
}

const game = createSlice({
    name: 'game',
    initialState: getInitialState(),
    reducers: {
        // UI
        endTurn: (state) => {
            const currentPlayerIdIndex = state.playerIds.findIndex(id => id === state.currentPlayerId);
            state.currentPlayerId = state.playerIds[(currentPlayerIdIndex + 1) % state.playerIds.length];
            state.currentGameAction = GAME_ACTIONS.selectAction;
            state.currentActionId = null;
            state.playedActions = 0;
        },
        setInitialFiguresAndMonuments: ({ players }, { payload }) => {
            const { playerId, godsIds, warriorsIds, obelisksIds, pyramidsIds, templesIds } = payload;
            players[playerId].figures.godsIds = godsIds;
            players[playerId].figures.warriorsIds = warriorsIds;
            players[playerId].monuments.obelisksIds = obelisksIds;
            players[playerId].monuments.pyramidsIds = pyramidsIds
            players[playerId].monuments.templesIds = templesIds;
        },
        // ACTIONS, GAME ACTIONS AND EVENT FLOW
        setActiveGameAction: (state, { payload }) => {
            state.currentGameAction = payload.actionId;
        },
        setCurrentActionId: (state, { payload }) => {
            const { actionId } = payload;
            state.currentActionId = actionId;
            state.currentGameAction = getGameActionForActionId(actionId);
        },
        moveActionIndex: (state, { payload }) => {
            const { actionId } = payload;
            state.actions[actionId].index++;
        },
        resetActionIndex: (state) => {
            const { currentActionId } = state;
            state.actions[currentActionId].index = state.actions[currentActionId].startingIndex;
        },
        moveEventIndex: (state) => {
            state.eventIndex++;
        },
        increasePlayedActionsNumber: (state) => {
            state.playedActions++;
        },
        // MOVE FIGURE 
        setFigureMoved: (state, { payload }) => {
            state.movedFiguresIds.push(payload.figureId);
        },
        clearMovedFigures: (state, { payload }) => {
            state.movedFiguresIds = [];
        },
        // ANKH POWERS
        unlockAnkhPower: (state, { payload }) => {
            const player = state.players[state.currentPlayerId];
            player.god.unlockedPowers.push(payload.powerName)
        },
        // FOLLOWERS
        decreasePlayerFollowers: (state, { payload }) => {
            const { playerId, amount } = payload;
            const player = state.players[playerId];
            player.followers = Math.max(player.followers - amount, 0);
        },
        increasePlayerFollowers: (state, { payload }) => {
            const { playerId, amount } = payload;
            const player = state.players[playerId];
            player.followers += amount;
        },
        // DEVOTION
        decreasePlayerDevotion: (state, { payload }) => {
            const { playerId, amount } = payload;
            const player = state.players[playerId];
            player.devotion = Math.max(player.devotion - amount, 0);
        },
        increasePlayerDevotion: (state, { payload }) => {
            const { playerId, amount } = payload;
            const player = state.players[playerId];
            player.devotion += amount;
        },
        // SUMMON 
        addFigureToSummonedFiguresPA: (state, { payload }) => {
            state.summonedFiguresAdjacentPyramids.push(payload.adjacentPyramids);
        },
        // POOL
        setSelectedFigureFromPool: (state, { payload }) => {
            state.selectedFigureFromPool = payload.figureId;
        },
        removeFigureFromPool: (state, { payload }) => {
            const { figureId } = payload;
            const pool = state.players[state.currentPlayerId].figuresPool;
            const index = pool.findIndex(figure => figure === figureId);
            if (index !== -1) {
                pool.splice(index, 1);
                state.selectedFigureFromPool = null;
            }
        },
        addFigureToPlayerPool: (state, { payload }) => {
            const { figureId, playerId } = payload;
            const pool = state.players[playerId].figuresPool;
            pool.push(figureId)
        },
        // BOARD
        setSelectedFigureId: (state, { payload }) => {
            state.selectedFigureId = payload.figureId
        },
        // PLAYER MONUMENTS AND FIGURES
        addMonumentToPlayer: (state, { payload }) => {
            const { monumentId, playerId } = payload;
            const playerMonuments = state.players[playerId].monuments;

            if (monumentId.startsWith('o')) {
                playerMonuments.obelisksIds.push(monumentId);
            }
            if (monumentId.startsWith('p')) {
                playerMonuments.pyramidsIds.push(monumentId);
            }
            if (monumentId.startsWith('t')) {
                playerMonuments.templesIds.push(monumentId);
            }
        },
        removeMonumentFromPlayer: (state, { payload }) => {
            const { monumentId, playerId } = payload;
            const playerMonuments = state.players[playerId].monuments;

            if (monumentId.startsWith('o')) {
                const ind = playerMonuments.obelisksIds.findIndex(id => id === monumentId);
                if (ind !== -1) {
                    playerMonuments.obelisksIds.splice(ind, 1);
                }
            }
            if (monumentId.startsWith('p')) {
                const ind = playerMonuments.pyramidsIds.findIndex(id => id === monumentId);
                if (ind !== -1) {
                    playerMonuments.pyramidsIds.splice(ind, 1);
                }
            }
            if (monumentId.startsWith('t')) {
                const ind = playerMonuments.templesIds.findIndex(id => id === monumentId);
                if (ind !== -1) {
                    playerMonuments.templesIds.splice(ind, 1);
                }
            }
        },
        // BATTLE CARD
        removeCardFromPlayerAvailableCards: (state, { payload }) => {
            const { playerId, card } = payload;
            let playerCards = state.players[playerId].battleCards;
            const cardIndex = playerCards.findIndex(c => c === card);
            if (cardIndex !== -1) {
                playerCards.splice(cardIndex, 1);
            }
        },
        recoverPlayerBattleCards: (state, { payload }) => {
            const { playerId } = payload;
            state.players[playerId].battleCards = Object.values(BATTLE_CARD)
        }
    },
})


export default game;