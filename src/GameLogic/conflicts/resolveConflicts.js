import conflictReducer, { BATTLE_ACTION } from 'GameLogic/conflict'
import gameReducer from 'GameLogic/game'
import boardReducer from 'GameLogic/board'
import figuresReducer from 'GameLogic/figures'

import { getConflicts, getPlayerFiguresFromConflict, CONFLICT_TYPE } from './getConflicts'
import { endEventEffect } from 'GameLogic/events/events';
import { BATTLE_CARD } from './const';

export const resolveConflictsEffect = () => (dispatch, getState) => {
    const { board, figures } = getState();
    dispatch(conflictReducer.actions.setConflicts({ conflicts: getConflicts(board, figures) }))
    const { conflict: { conflicts } } = getState();
    dispatch(resolveConflictEffect({ conflict: conflicts[0] }))
    // TO DO GO TO NEXT CONFLICTS
}

export const resolveConflictEffect = ({ conflict }) => (dispatch, getState) => {
    const { conflictType, regionNumber, playerId, monumentsInRegion, playersIds } = conflict;
    if (conflictType === CONFLICT_TYPE.NO_BATTLE) {
        dispatch(conflictReducer.actions.setMessage({ message: `No battle in region ${regionNumber}` }));
        dispatch(finishCurrentConflictEffect({ conflict }))
        return;
    }

    if (conflictType === CONFLICT_TYPE.DOMINATION) {
        dispatch(conflictReducer.actions.setMessage({ message: `Domination in region ${regionNumber}` }));
        const devotionAmount = 1 + calculatePlayerDevotionFromRegion(playerId, monumentsInRegion);
        dispatch(gameReducer.actions.increasePlayerDevotion({ playerId, count: devotionAmount }))
        dispatch(finishCurrentConflictEffect({ conflict }))
        return;
    }


    if (conflictType === CONFLICT_TYPE.BATTLE) {
        dispatch(conflictReducer.actions.setMessage({ message: `Battle in region ${regionNumber}` }));
        dispatch(conflictReducer.actions.setCurrentPlayerId({ playerId: playersIds[0] }));
        sleep(1000).then(() => dispatch(selectBattleCardEffect()))

        // 3 resolve other cards
        // 4 monuments majority
        // 5 battle resolution
        return;
    }

}

const selectBattleCardEffect = () => (dispatch, getState) => {
    const { conflict } = getState();
    const { currentPlayerId } = conflict;
    dispatch(conflictReducer.actions.setMessage({ message: `${currentPlayerId} choose battle card` }));
    dispatch(conflictReducer.actions.setCurrentBattleActionId({ actionId: BATTLE_ACTION.SELECT_CARD }));
}

export const playBattleCardEffect = ({ card }) => (dispatch, getState) => {
    const { conflict } = getState();
    const { conflicts, activeConflictNumber, currentPlayerId } = conflict;

    dispatch(conflictReducer.actions.setPlayedCard({ playerId: currentPlayerId, card }));


    const currentConflict = conflicts.find(conflict => conflict.regionNumber === activeConflictNumber);
    const players = currentConflict.playersIds;
    const currentPlayerIndex = players.findIndex(p => p === currentPlayerId);
    const nextPlayerId = currentPlayerIndex === players.length - 1 ? null : players[currentPlayerIndex + 1];

    if (nextPlayerId) {
        dispatch(conflictReducer.actions.setCurrentPlayerId({ playerId: nextPlayerId }));
        dispatch(selectBattleCardEffect())
    } else {
        // Last player played battle card => resolve battle cards
        dispatch(conflictReducer.actions.setMessage({ message: `Played cards` }));
        dispatch(conflictReducer.actions.setCurrentBattleActionId({ actionId: BATTLE_ACTION.RESOLVE_CARDS }));
        dispatch(conflictReducer.actions.setCurrentPlayerId({ playerId: players[0] }));
        dispatch(resolveCardsEffect());
    }
}


const resolveCardsEffect = () => async (dispatch, getState) => {
    await sleep(3000);
    const { conflict } = getState();
    const { playedCards, activeConflictNumber } = conflict;
    const plaguePlayersIds = Object.entries(playedCards)
        .filter(([playerId, card]) => card === BATTLE_CARD.plague)
        .map(([playerId, card]) => playerId)
    const plaguePlayed = plaguePlayersIds.length > 0;

    if (plaguePlayed) {
        plaguePlayersIds.forEach(playerId =>
            dispatch(conflictReducer.actions.increasePlayerStrengthInConflict({
                playerId,
                amount: 1,
                regionNumber: activeConflictNumber
            }))
        )
        dispatch(startPlagueBidding({ playersIds: plaguePlayersIds }));
    } else {
        dispatch(resolveOtherCardsEffect());
    }
}

// PLAGUE

const startPlagueBidding = ({ playersIds }) => (dispatch) => {
    dispatch(conflictReducer.actions.setCurrentBattleActionId({ actionId: BATTLE_ACTION.PLAGUE_BID }));
    dispatch(conflictReducer.actions.setMessage({ message: `Resolve plague` }));
    console.log('PLAGUE HAPPENS');
    playersIds.forEach(playerId => dispatch(conflictReducer.actions.removePlayerCard({ playerId })));
    playersIds.forEach(playerId => dispatch(gameReducer.actions.playBattleCard({ playerId, card: BATTLE_CARD.plague })));
    // dispatch(resolveOtherCardsEffect())
}

export const plagueBidEffect = ({ playerId, bid }) => (dispatch, getState) => {
    const { conflict } = getState();
    const { conflicts, activeConflictNumber, currentPlayerId } = conflict;

    dispatch(conflictReducer.actions.setPlayerBid({ playerId, bid }))

    const currentConflict = conflicts.find(conflict => conflict.regionNumber === activeConflictNumber);
    const players = currentConflict.playersIds;
    const currentPlayerIndex = players.findIndex(p => p === currentPlayerId);
    const nextPlayerId = currentPlayerIndex === players.length - 1 ? null : players[currentPlayerIndex + 1];

    if (nextPlayerId) {
        dispatch(conflictReducer.actions.setCurrentPlayerId({ playerId: nextPlayerId }));
    } else {
        // Last player placed his bid => resolve plague
        dispatch(conflictReducer.actions.setMessage({ message: `Bid results` }));
        dispatch(conflictReducer.actions.setCurrentBattleActionId({ actionId: BATTLE_ACTION.RESOLVE_PLAGUE }));
        dispatch(resolvePlagueEffect());
    }
}

const resolvePlagueEffect = () => async (dispatch, getState) => {
    const { conflict } = getState();
    const { conflicts, activeConflictNumber, playersBids } = conflict;
    const currentConflict = conflicts.find(conflict => conflict.regionNumber === activeConflictNumber);
    const playersIds = currentConflict.playersIds;

    let winnersIds = [];
    let maxBid = 0;
    Object.entries(playersBids).forEach(([playerId, bid]) => {
        if (bid > maxBid) {
            maxBid = bid;
            winnersIds = [playerId];
        } else if (bid === maxBid) {
            winnersIds.push(playerId);
        }
    })


    if (winnersIds.length > 1) {
        await sleep(2000);
        // kill all figures
        const figures = currentConflict.figuresInRegion
            .filter(figure => !figure.figureId.startsWith('g'));
        dispatch(killFiguresEffect({ playersIds, figures }));
    } else {
        const winnerId = winnersIds[0];
        dispatch(conflictReducer.actions.setBidWinnerId({ playerId: winnerId }))
        await sleep(2000);

        // kill all except winner figures
        const figures = currentConflict.figuresInRegion
            .filter(figure => !figure.figureId.startsWith('g'))
            .filter(figure => figure.playerId !== winnerId);
        dispatch(killFiguresEffect({ playersIds, figures }));
    }

    dispatch(resolveOtherCardsEffect());
}

// OTHER BATTLE CARDS EFFECTS

const resolveOtherCardsEffect = () => (dispatch, getState) => {
    const { conflict } = getState();
    const { playedCards } = conflict;
    // TO DO resolve cards starting from player with lowest devotion in ascending order (build monument)
    const cardsList = Object.entries(playedCards);

    if (cardsList.length === 0) {
        dispatch(monumentMajorityEffect());
    } else {
        const [playerId, card] = cardsList[0];
        dispatch(resolveCardEffect({ playerId, card }))
    }
}

const resolveCardEffect = ({ playerId, card }) => (dispatch, getState) => {
    dispatch(conflictReducer.actions.setMessage({ message: `Resolve ${card}` }));

    dispatch(conflictReducer.actions.removePlayerCard({ playerId }))
    dispatch(gameReducer.actions.playBattleCard({ playerId, card }));

    switch (card) {
        case BATTLE_CARD.cycle:
            dispatch(resolveCycleOfMaat({ playerId }))
            break;
        case BATTLE_CARD.flood:
            dispatch(resolveFlood({ playerId }))
            break;
        case BATTLE_CARD.drought:
            dispatch(resolveDrought({ playerId }))
            break;
        case BATTLE_CARD.build:
            dispatch(resolveBuildMonument({ playerId }))
            break;
        default:
            break;
    }

    const { conflict } = getState();
    const { playedCards } = conflict;
    const cardsList = Object.entries(playedCards);
    if (cardsList.length === 0) {
        dispatch(monumentMajorityEffect());
    } else {
        const [nextPlayerId, nextCard] = cardsList[0];
        dispatch(resolveCardEffect({ playerId: nextPlayerId, card: nextCard }))
    }
}

const resolveCycleOfMaat = ({ playerId, card }) => (dispatch, getState) => {
    dispatch(conflictReducer.actions.setMessage({ message: `Player ${playerId} uses Cycle of Ma'at` }));
    dispatch(gameReducer.actions.recoverPlayerBattleCards({ playerId }));
}

const resolveDrought = ({ playerId }) => (dispatch, getState) => {
    dispatch(conflictReducer.actions.setMessage({ message: `Player ${playerId} uses Drought` }));

    const { conflict, figures, board: { hexes } } = getState();
    const { conflicts, activeConflictNumber } = conflict;
    const currentConflict = conflicts.find(conflict => conflict.regionNumber === activeConflictNumber);
    const playerFigures = getPlayerFiguresFromConflict(currentConflict.figuresInRegion, figures, playerId);
    const playerFiguresOnDesertLands = playerFigures.filter(({ x, y }) => hexes[x][y].areaType === 'D');
    const otherPlayerFigures = playerFigures.filter(({ x, y }) => hexes[x][y].areaType !== 'D');

    const desertStrength = playerFiguresOnDesertLands.reduce((acc, curr) => acc + curr.strength, 0);
    const otherStrength = otherPlayerFigures.reduce((acc, curr) => acc + curr.strength, 0);
    const newStrength = otherStrength + 2 * desertStrength + 2;
    dispatch(conflictReducer.actions.changePlayerStrengthInConflict({ playerId, newStrength, regionNumber: activeConflictNumber }))

    console.log(`Player ${playerId} strength grows from ${desertStrength + otherStrength} to ${newStrength} from Drought`);
}

const resolveFlood = ({ playerId }) => (dispatch, getState) => {
    dispatch(conflictReducer.actions.setMessage({ message: `Player ${playerId} uses Flood` }));

    const { conflict, figures, board: { hexes } } = getState();
    const { conflicts, activeConflictNumber } = conflict;
    const currentConflict = conflicts.find(conflict => conflict.regionNumber === activeConflictNumber);
    const playerFigures = getPlayerFiguresFromConflict(currentConflict.figuresInRegion, figures, playerId);
    const playerFiguresOnFertileLandsCount = playerFigures.filter(({ x, y }) => hexes[x][y].areaType === 'G').length;
    dispatch(gameReducer.actions.increasePlayerFollowers({ playerId, count: playerFiguresOnFertileLandsCount }))

    console.log(`Player ${playerId} gets ${playerFiguresOnFertileLandsCount} followers from Flood`);
}

const resolveMiracle = ({ playerId, card }) => (dispatch, getState) => {
    dispatch(conflictReducer.actions.setMessage({ message: `Player ${playerId} uses Miracle` }));
}

const resolveBuildMonument = ({ playerId, card }) => (dispatch, getState) => {
    dispatch(conflictReducer.actions.setMessage({ message: `Player ${playerId} uses Build Monument` }));
    dispatch(conflictReducer.actions.setCurrentBattleActionId({ actionId: BATTLE_ACTION.SELECT_MONUMENT }));
}

// MONUMENTS MAJORITY 

const monumentMajorityEffect = () => (dispatch, getState) => {
    dispatch(conflictReducer.actions.setMessage({ message: `Monuments majority` }));
    const { conflict } = getState();
    const { conflicts, activeConflictNumber } = conflict;
    const currentConflict = conflicts.find(conflict => conflict.regionNumber === activeConflictNumber);

    currentConflict.playersIds.forEach(
        playerId => {
            const devotion = calculatePlayerDevotionFromRegion(playerId, currentConflict.monumentsInRegion);
            console.log(`Player ${playerId} gets ${devotion} devotion from Monuments Majority`);
            dispatch(gameReducer.actions.increasePlayerDevotion({ playerId, count: devotion }))
        }
    )

    dispatch(finishConflictsEffect());
}

// HELPERS

const killFiguresEffect = ({ figures, playersIds }) => (dispatch, getState) => {
    // 1 Set killed figures amount (for miracle card)
    playersIds.forEach(playerId => {
        const killedAmount = figures.filter(figure => figure.playerId === playerId).length;
        dispatch(conflictReducer.actions.setPlayerKilledFiguresAmount({ playerId, amount: killedAmount }))
    })

    // 2 kill figures
    figures.forEach(({ figureId, playerId }) => dispatch(killFigureEffect({ figureId, playerId })))
}

const killFigureEffect = ({ figureId, playerId }) => (dispatch, getState) => {
    const { figures } = getState();
    const killableFigures = [...Object.values(figures.warriors), ...Object.values(figures.sentinels)];
    const figure = killableFigures.find(figure => figure.id === figureId);
    const { x, y } = figure;
    // 2 Clear hexes
    dispatch(boardReducer.actions.killFigure({ x, y }))
    dispatch(figuresReducer.actions.killFigure({ figureId }))
    dispatch(gameReducer.actions.addFigureToPlayerPool({ playerId, figureId }))
}

const calculatePlayerDevotionFromRegion = (playerId, monumentsInRegion) => {
    const obelisksInRegion = monumentsInRegion.filter(({ monumentId }) => monumentId.startsWith('o'))
    const pyramidsInRegion = monumentsInRegion.filter(({ monumentId }) => monumentId.startsWith('p'))
    const templesInRegion = monumentsInRegion.filter(({ monumentId }) => monumentId.startsWith('t'))
    return calculatePlayerDevotionForMonumentType(playerId, obelisksInRegion) +
        calculatePlayerDevotionForMonumentType(playerId, pyramidsInRegion) +
        calculatePlayerDevotionForMonumentType(playerId, templesInRegion);
}

const calculatePlayerDevotionForMonumentType = (playerId, monuments) => {
    const playerIds = [...(new Set(monuments.map(({ playerId }) => playerId)))];
    const counter = {}
    playerIds.forEach(id => counter[id] = 0);
    monuments.forEach(({ playerId }) => counter[playerId]++);

    let highestPlayerMonumentsCount = 0;
    let topPlayer = undefined;
    Object.entries(counter).forEach(([player, count]) => {
        if (count > highestPlayerMonumentsCount) {
            topPlayer = player;
            highestPlayerMonumentsCount = count;
        }
    })

    return playerId === topPlayer ? highestPlayerMonumentsCount : 0;
}

export const finishCurrentConflictEffect = ({ conflict }) => async (dispatch, getState) => {
    const { board } = getState();

    if (conflict.regionNumber === board.maxRegionNumber) {
        dispatch(finishConflictsEffect());
    } else {
        dispatch(conflictReducer.actions.goToNextConflict());
    }
}

export const finishConflictsEffect = () => (dispatch) => {
    dispatch(conflictReducer.actions.clearAfterConflicts())
    dispatch(endEventEffect());
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
