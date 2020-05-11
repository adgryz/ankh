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
}

export const resolveConflictEffect = ({ conflict }) => (dispatch, getState) => {
    const { conflictType, regionNumber, playerId, monumentsInRegion, playersIds } = conflict;
    if (conflictType === CONFLICT_TYPE.NO_BATTLE) {
        dispatch(conflictReducer.actions.setMessage({ message: `No battle in region ${regionNumber}` }));
        console.log('NO BATTLE')
        dispatch(finishCurrentConflictEffect())
        return;
    }

    if (conflictType === CONFLICT_TYPE.DOMINATION) {
        dispatch(conflictReducer.actions.setMessage({ message: `Domination in region ${regionNumber}` }));
        const devotionAmount = 1 + calculatePlayerDevotionFromRegion(playerId, monumentsInRegion);
        dispatch(gameReducer.actions.increasePlayerDevotion({ playerId, amount: devotionAmount }))
        console.log(`Player ${playerId} get ${devotionAmount} devotion from domination`)
        dispatch(finishCurrentConflictEffect())
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
    const { conflict, game } = getState();
    const { conflicts, activeConflictNumber, currentPlayerId, beforeBattleCards } = conflict;

    if (card === BATTLE_CARD.plague) {
        dispatch(conflictReducer.actions.addPlaguePlayerId({ playerId: currentPlayerId }))
    }
    else if (card === BATTLE_CARD.miracle) {
        dispatch(conflictReducer.actions.addMiraclePlayerId({ playerId: currentPlayerId }))
    } else {
        const playerIdsByDevotion = Object.values(game.players)
            .sort((p1, p2) => p1.devotion - p2.devotion)
            .map(({ id }) => id)

        const newBeforeBattleCards = [...beforeBattleCards, [currentPlayerId, card]]
        const newBeforeBattleCardsSortedByDevotion = newBeforeBattleCards
            .sort(([p1, c1], [p2, c2]) =>
                playerIdsByDevotion.findIndex(id => id === p1) - playerIdsByDevotion.findIndex(id => id === p2)
            );
        dispatch(conflictReducer.actions.setBeforeBattleCards({ battleCards: newBeforeBattleCardsSortedByDevotion }))
    }

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
    const { plaguePlayersIds, activeConflictNumber } = conflict;

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
    playersIds.forEach(playerId => dispatch(gameReducer.actions.removeCardFromPlayerAvailableCards({ playerId, card: BATTLE_CARD.plague })));
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
    const { beforeBattleCards } = conflict;

    if (beforeBattleCards.length === 0) {
        dispatch(monumentMajorityEffect());
    } else {
        const [playerId, card] = beforeBattleCards[0];
        dispatch(resolveBeforeBattleCardEffect({ playerId, card }))
    }
}

const resolveBeforeBattleCardEffect = ({ playerId, card }) => (dispatch, getState) => {
    dispatch(conflictReducer.actions.setMessage({ message: `Resolve ${card}` }));

    dispatch(gameReducer.actions.removeCardFromPlayerAvailableCards({ playerId, card }));
    dispatch(conflictReducer.actions.removeFirstBeforeBattleCard());

    switch (card) {
        case BATTLE_CARD.cycle:
            dispatch(resolveCycleOfMaatEffect({ playerId }))
            break;
        case BATTLE_CARD.flood:
            dispatch(resolveFloodEffect({ playerId }))
            break;
        case BATTLE_CARD.drought:
            dispatch(resolveDroughtEffect({ playerId }))
            break;
        case BATTLE_CARD.build:
            dispatch(resolveSelectMonumentToBuildEffect({ playerId }))
            break;
        default:
            break;
    }
}

const afterBeforeBattleCardResolvedEffect = () => (dispatch, getState) => {
    const { conflict } = getState();
    const { beforeBattleCards } = conflict;
    if (beforeBattleCards.length === 0) {
        dispatch(monumentMajorityEffect())
    } else {
        const [playerId, card] = beforeBattleCards[0];
        dispatch(resolveBeforeBattleCardEffect({ playerId, card }))
    }
}

const resolveCycleOfMaatEffect = ({ playerId }) => (dispatch, getState) => {
    dispatch(conflictReducer.actions.setMessage({ message: `Player ${playerId} uses Cycle of Ma'at` }));
    dispatch(gameReducer.actions.recoverPlayerBattleCards({ playerId }));
    dispatch(afterBeforeBattleCardResolvedEffect());
}

const resolveDroughtEffect = ({ playerId }) => (dispatch, getState) => {
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

    dispatch(afterBeforeBattleCardResolvedEffect());
}

const resolveFloodEffect = ({ playerId }) => (dispatch, getState) => {
    dispatch(conflictReducer.actions.setMessage({ message: `Player ${playerId} uses Flood` }));

    const { conflict, figures, board: { hexes } } = getState();
    const { conflicts, activeConflictNumber } = conflict;
    const currentConflict = conflicts.find(conflict => conflict.regionNumber === activeConflictNumber);
    const playerFigures = getPlayerFiguresFromConflict(currentConflict.figuresInRegion, figures, playerId);
    const playerFiguresOnFertileLandsCount = playerFigures.filter(({ x, y }) => hexes[x][y].areaType === 'G').length;
    dispatch(gameReducer.actions.increasePlayerFollowers({ playerId, count: playerFiguresOnFertileLandsCount }))

    console.log(`Player ${playerId} gets ${playerFiguresOnFertileLandsCount} followers from Flood`);

    dispatch(afterBeforeBattleCardResolvedEffect());
}

const resolveMiracleEffect = ({ playerId }) => (dispatch, getState) => {
    dispatch(conflictReducer.actions.setMessage({ message: `Player ${playerId} uses Miracle` }));

    const { conflict } = getState();
    const { killedFiguresAmounts } = conflict;
    const playerDevotion = killedFiguresAmounts[playerId];
    dispatch(gameReducer.actions.increasePlayerDevotion({ playerId, amount: playerDevotion }))

    dispatch(gameReducer.actions.removeCardFromPlayerAvailableCards({ playerId, card: BATTLE_CARD.miracle }));

    console.log(`Player ${playerId} gets ${playerDevotion} devotion from Miracle`)
}

export const resolveSelectMonumentToBuildEffect = ({ playerId }) => (dispatch, getState) => {
    dispatch(conflictReducer.actions.setMessage({ message: `Player ${playerId} uses Build Monument` }));
    dispatch(conflictReducer.actions.setCurrentBattleActionId({ actionId: BATTLE_ACTION.SELECT_MONUMENT }));
    dispatch(conflictReducer.actions.setMessage({ message: `${playerId} chose monument you want to build` }));
    // TO DO - resolve build monument card
}

const resolveBuildMonumentEffect = ({ playerId }) => (dispatch, getState) => {
    dispatch(conflictReducer.actions.setMessage({ message: `Player ${playerId} uses Build Monument` }));
    dispatch(conflictReducer.actions.setCurrentBattleActionId({ actionId: BATTLE_ACTION.SELECT_MONUMENT }));
    // TO DO - resolve build monument card

}

// MONUMENTS MAJORITY

const monumentMajorityEffect = () => (dispatch, getState) => {
    dispatch(conflictReducer.actions.setMessage({ message: `Monuments majority` }));
    const { conflict } = getState();
    const { conflicts, activeConflictNumber } = conflict;
    const currentConflict = conflicts.find(conflict => conflict.regionNumber === activeConflictNumber);

    // TODO - check if player still has figures in region
    currentConflict.playersIds.forEach(
        playerId => {
            const devotion = calculatePlayerDevotionFromRegion(playerId, currentConflict.monumentsInRegion);
            console.log(`Player ${playerId} gets ${devotion} devotion from Monuments Majority`);
            dispatch(gameReducer.actions.increasePlayerDevotion({ playerId, amount: devotion }))
        }
    )

    dispatch(resolveBattleResult());
}

const resolveBattleResult = () => async (dispatch, getState) => {
    dispatch(conflictReducer.actions.setMessage({ message: `Battle result` }));
    dispatch(conflictReducer.actions.setCurrentBattleActionId({ actionId: BATTLE_ACTION.RESOLVE_BATTLE }));

    const { conflict } = getState();
    const { conflicts, activeConflictNumber, miraclePlayersIds } = conflict;

    const currentConflict = conflicts.find(conflict => conflict.regionNumber === activeConflictNumber);;
    const { playersStrengths, playersIds } = currentConflict

    let winnersIds = [];
    let maxStr = 0;
    Object.entries(playersStrengths).forEach(([playerId, str]) => {
        if (str > maxStr) {
            maxStr = str;
            winnersIds = [playerId];
        } else if (str === maxStr) {
            winnersIds.push(playerId);
        }
    })

    if (winnersIds.length > 1) {
        await sleep(2000);

        // TODO - ask for Tiebreaker

        // kill all figures
        const figures = currentConflict.figuresInRegion
            .filter(figure => !figure.figureId.startsWith('g'));
        dispatch(killFiguresEffect({ playersIds, figures }));
    } else {
        const winnerId = winnersIds[0]
        dispatch(conflictReducer.actions.setWinnerId({ playerId: winnerId }))
        await sleep(2000);

        // kill all except winner figures
        const figures = currentConflict.figuresInRegion
            .filter(figure => !figure.figureId.startsWith('g'))
            .filter(figure => figure.playerId !== winnerId);
        dispatch(killFiguresEffect({ playersIds, figures }));

        dispatch(gameReducer.actions.increasePlayerDevotion({ playerId: winnerId, amount: 1 }))

        console.log(`Player ${winnerId} gets 1 devotion from winning the battle`);
    }


    // Resolve miracle cards
    miraclePlayersIds.forEach(playerId => dispatch(resolveMiracleEffect({ playerId })))

    // 6. Go to next conflict or end conflicts
    dispatch(finishCurrentConflictEffect())
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
    if (figure) {
        const { x, y } = figure;
        dispatch(boardReducer.actions.killFigure({ x, y }))
        dispatch(figuresReducer.actions.killFigure({ figureId }))
        dispatch(gameReducer.actions.addFigureToPlayerPool({ playerId, figureId }))
        dispatch(conflictReducer.actions.removeFigureFromConflicts({ figureId, playerId, strength: figure.strength }))
    }
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

export const finishCurrentConflictEffect = () => async (dispatch, getState) => {
    const { board, conflict } = getState();
    const { activeConflictNumber } = conflict;

    if (activeConflictNumber === board.maxRegionNumber) {
        dispatch(finishConflictsEffect());
    } else {
        dispatch(conflictReducer.actions.goToNextConflict());
        const { conflict: conflict2 } = getState();
        const { conflicts, activeConflictNumber: nextActiveConflictNumber } = conflict2;
        const nextConflict = conflicts.find(conflict => conflict.regionNumber === nextActiveConflictNumber);
        console.log(conflicts, nextConflict, nextActiveConflictNumber)
        dispatch(resolveConflictEffect({ conflict: nextConflict }))
    }
}

export const finishConflictsEffect = () => (dispatch) => {
    dispatch(conflictReducer.actions.clearAfterConflicts())
    dispatch(endEventEffect());
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
