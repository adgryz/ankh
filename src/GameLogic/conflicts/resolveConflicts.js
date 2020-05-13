import conflictReducer, { BATTLE_ACTION } from 'GameLogic/conflict'
import gameReducer from 'GameLogic/game'
import boardReducer from 'GameLogic/board'
import figuresReducer from 'GameLogic/figures'
import monumentsReducer from 'GameLogic/monuments'
import { resolveResplendentEffect } from 'GameLogic/ankhPowers/resplendent';
import { endEventEffect } from 'GameLogic/events/events';

import { getConflicts, getPlayerFiguresFromConflict, CONFLICT_TYPE } from './getConflicts'
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
        console.log('No battle')
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
            dispatch(resolveBuildMonumentEffect({ playerId }))
            break;
        default:
            break;
    }
}

const afterBeforeBattleCardResolvedEffect = () => (dispatch, getState) => {
    dispatch(conflictReducer.actions.removeFirstBeforeBattleCard());

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

    const { conflict, figures, game: { players }, board: { hexes } } = getState();
    const { conflicts, activeConflictNumber } = conflict;
    const currentConflict = conflicts.find(conflict => conflict.regionNumber === activeConflictNumber);
    const playerFigures = getPlayerFiguresFromConflict(currentConflict.figuresInRegion, figures, playerId);
    const playerFiguresOnFertileLandsAmount = playerFigures.filter(({ x, y }) => hexes[x][y].areaType === 'G').length;

    const powers = players[playerId].god.unlockedPowers;
    let multiplier = 1;
    if (powers.includes('Bountiful')) {
        multiplier = 2;
    }

    const newFollowers = multiplier * playerFiguresOnFertileLandsAmount;

    dispatch(gameReducer.actions.increasePlayerFollowers({ playerId, amount: newFollowers }))

    console.log(`Player ${playerId} gets ${newFollowers} followers from Flood`);

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


// BUILD MONUMENT

export const resolveBuildMonumentEffect = ({ playerId }) => (dispatch, getState) => {
    dispatch(conflictReducer.actions.setMessage({ message: `Player ${playerId} uses Build Monument` }));

    const { game } = getState();
    const { monuments } = game.players[playerId];
    const { followers } = game.players[playerId]

    const obeliskCost = 2 + 2 * monuments.obelisksIds.length;
    const templeCost = 2 + 2 * monuments.templesIds.length;
    const pyramidCost = 2 + 2 * monuments.pyramidsIds.length;

    if (followers < obeliskCost && followers < templeCost && followers < pyramidCost) {
        console.log(`Player ${playerId} has not enough followers to build anything`)
        dispatch(afterBeforeBattleCardResolvedEffect());
    } else {
        dispatch(conflictReducer.actions.setCurrentBattleActionId({ actionId: BATTLE_ACTION.SELECT_MONUMENT }));
        dispatch(conflictReducer.actions.setMessage({ message: `${playerId} chose monument you want to build` }));
    }

}

export const resolveSelectMonumentToBuildEffect = ({ monumentType }) => (dispatch, getState) => {
    const { game, conflict } = getState();

    const [playerId, ...rest] = conflict.beforeBattleCards[0];
    const { monuments } = game.players[playerId];
    const { followers } = game.players[playerId]

    const obeliskCost = 2 + 2 * monuments.obelisksIds.length;
    const templeCost = 2 + 2 * monuments.templesIds.length;
    const pyramidCost = 2 + 2 * monuments.pyramidsIds.length;

    const hasInspiringPower = game.players[playerId].god.unlockedPowers.includes('Inspiring');

    let cost;
    if (hasInspiringPower) {
        cost = monumentType === 'o'
            ? Math.min(obeliskCost, 3)
            : monumentType === 't'
                ? Math.min(templeCost, 3)
                : Math.min(pyramidCost, 3);
    } else {
        cost = monumentType === 'o' ? obeliskCost : monumentType === 't' ? templeCost : pyramidCost;
    }

    if (cost > followers) {
        alert(`You don't have enough followers`);
        return;
    }

    dispatch(conflictReducer.actions.setCurrentBattleActionId({ actionId: BATTLE_ACTION.BUILD_MONUMENT }));
    const monumentName = monumentType === 'o' ? 'obelisk' : monumentType === 't' ? 'temple' : 'pyramid';
    dispatch(conflictReducer.actions.setMessage({ message: `${playerId} place your ${monumentName} in current battle region` }));

    dispatch(conflictReducer.actions.setMonumentToBeBuilt({ playerId, monumentType }))
    dispatch(gameReducer.actions.decreasePlayerFollowers({ playerId, amount: cost }))
}

export const resolvePlaceMonumentEffect = ({ x, y }) => (dispatch, getState) => {
    const { conflict, monuments, board, game } = getState();
    const { monumentToBeBuilt, activeConflictNumber } = conflict;
    const { playerId, monumentType } = monumentToBeBuilt;
    const { hexes } = board;
    const { obelisks, temples, pyramids } = monuments;
    const { players } = game;

    const chosenHex = hexes[x][y];
    if (chosenHex.region !== activeConflictNumber) {
        alert('You have to build your monument in current conflict region');
        return;
    }
    if (chosenHex.monumentId || chosenHex.figureId) {
        alert('You have to build your monument on empty space');
        return;
    }

    const monumentId = monumentType === 'o'
        ? `o${Object.values(obelisks).length + 1}`
        : monumentType === 't'
            ? `t${Object.values(temples).length + 1}`
            : `p${Object.values(pyramids).length + 1
            }`

    dispatch(boardReducer.actions.setMonuments({ monuments: [{ x, y, playerId, id: monumentId }] }));
    dispatch(gameReducer.actions.addMonumentToPlayer({ playerId, monumentId }))
    dispatch(monumentsReducer.actions.addNewMonument({ x, y, playerId, monumentId }))

    if (monumentType === 't' && players[playerId].god.unlockedPowers.includes('Temple Attuned')) {
        dispatch(resolveTempleAttunedEffect({ playerId, activeConflictNumber }))
    }

    const monumentName = monumentType === 'o' ? 'obelisk' : monumentType === 't' ? 'temple' : 'pyramid';
    console.log(`Player ${playerId} builds ${monumentName} in region ${activeConflictNumber} `)

    dispatch(afterBeforeBattleCardResolvedEffect());
}

const resolveTempleAttunedEffect = ({ playerId, activeConflictNumber }) => (dispatch, getState) => {
    dispatch(figuresReducer.actions.increaseFigureStrength({
        figureId: `g${playerId[1]}`,
        amount: 1
    }));
    // TO DO - if Amun played drought, increase by 2
    dispatch(conflictReducer.actions.increasePlayerStrengthInConflict({
        playerId, regionNumber: activeConflictNumber, amount: 1
    }))
}

export const cancelBuildMonumentEffect = () => (dispatch) => {
    dispatch(afterBeforeBattleCardResolvedEffect());
}

// MONUMENTS MAJORITY

const monumentMajorityEffect = () => (dispatch, getState) => {
    dispatch(conflictReducer.actions.setMessage({ message: `Monuments majority` }));
    const { conflict, board } = getState();
    const { conflicts, activeConflictNumber } = conflict;
    const currentConflict = conflicts.find(conflict => conflict.regionNumber === activeConflictNumber);

    const { hexes } = board;

    const regionHexes = hexes.flat().filter(hex => hex.region === activeConflictNumber)
    const figuresInRegion = regionHexes
        .filter(hex => hex.figureId)
        .map(({ figureId, playerId }) => ({ figureId, playerId }))

    const monumentsInRegion = regionHexes
        .filter(hex => hex.monumentId)
        .map(({ monumentId, playerId }) => ({ monumentId, playerId }))

    currentConflict.playersIds.forEach(
        playerId => {
            const playerFiguresAmount = figuresInRegion.filter(figure => figure.playerId === playerId).length;
            const devotion = playerFiguresAmount === 0 ? 0 : calculatePlayerDevotionFromRegion(playerId, monumentsInRegion);
            console.log(`Player ${playerId} gets ${devotion} devotion from Monuments Majority`);
            dispatch(gameReducer.actions.increasePlayerDevotion({ playerId, amount: devotion }))
        }
    )

    dispatch(resolveBattleResult());
}

// BATTLE RESOLUTION 

const resolveBattleResult = () => async (dispatch, getState) => {
    dispatch(conflictReducer.actions.setMessage({ message: `Battle result` }));
    dispatch(conflictReducer.actions.setCurrentBattleActionId({ actionId: BATTLE_ACTION.RESOLVE_BATTLE }));
    dispatch(resolveResplendentEffect());

    const { conflict } = getState();
    const { conflicts, activeConflictNumber, isTieBreakerUsed, tieBreakerOwnerId } = conflict;
    const currentConflict = conflicts.find(conflict => conflict.regionNumber === activeConflictNumber);
    const { playersStrengths } = currentConflict

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

    await sleep(3000);

    if (winnersIds.length > 1) {
        await sleep(2000);

        const oneOfWinnersHasTieBreaker = winnersIds.find(id => id === tieBreakerOwnerId)
        if (!isTieBreakerUsed && oneOfWinnersHasTieBreaker) {
            dispatch(conflictReducer.actions.setCurrentBattleActionId({ actionId: BATTLE_ACTION.TIE_BREAKER_QUESTION }));
            return;
        }
        dispatch(resolveNoBattleWinnerEffect());
    } else {
        dispatch(resolveBattleWinnerEffect({ winnerId: winnersIds[0] }))
    }

    dispatch(afterBattleResolutionEffect());
}

// TIE BREAKER


export const denyTieBreakerUseEffect = () => async (dispatch, getState) => {
    dispatch(resolveNoBattleWinnerEffect());
    dispatch(afterBattleResolutionEffect());
}

export const confirmTieBreakerUseEffect = () => async (dispatch, getState) => {
    const { conflict } = getState();
    const { tieBreakerOwnerId } = conflict;

    dispatch(conflictReducer.actions.setTieBreakerUsed());
    dispatch(resolveBattleWinnerEffect({ winnerId: tieBreakerOwnerId }))
    dispatch(afterBattleResolutionEffect());
}

// Battle resolution 

const resolveNoBattleWinnerEffect = () => async (dispatch, getState) => {
    const { conflict } = getState();
    const { conflicts, activeConflictNumber } = conflict;
    const currentConflict = conflicts.find(conflict => conflict.regionNumber === activeConflictNumber);;
    const { playersIds } = currentConflict

    const figures = currentConflict.figuresInRegion
        .filter(figure => !figure.figureId.startsWith('g'));
    dispatch(killFiguresEffect({ playersIds, figures }));
}

const resolveBattleWinnerEffect = ({ winnerId }) => async (dispatch, getState) => {
    const { conflict, game: { players } } = getState();
    const { conflicts, activeConflictNumber } = conflict;
    const currentConflict = conflicts.find(conflict => conflict.regionNumber === activeConflictNumber);;
    const { playersIds, playersStrengths } = currentConflict

    dispatch(conflictReducer.actions.setWinnerId({ playerId: winnerId }))
    await sleep(2000);

    // kill all except winner figures
    const figures = currentConflict.figuresInRegion
        .filter(figure => !figure.figureId.startsWith('g'))
        .filter(figure => figure.playerId !== winnerId);
    dispatch(killFiguresEffect({ playersIds, figures }));

    const winnerPowers = players[winnerId].god.unlockedPowers;
    let extraDevotion = 0;

    if (winnerPowers.includes('Commanding')) {
        dispatch(gameReducer.actions.increasePlayerFollowers({ playerId: winnerId, amount: 3 }))
        console.log(`Player ${winnerId} gets 3 followers from Commanding power`);
    }

    const sortedStrengths = Object.entries(playersStrengths).map(([playerId, str]) => str).sort((s1, s2) => s2 - s1);
    const winnerStr = sortedStrengths[0];
    const secondStr = sortedStrengths[1];
    if (winnerStr >= secondStr + 2) {
        if (winnerPowers.includes('Glorious')) {
            extraDevotion++;
        }
        if (winnerPowers.includes('Mighty')) {
            extraDevotion++;
            const losersIds = currentConflict.playersIds.filter(id => id !== winnerId);
            losersIds.forEach(id => {
                dispatch(gameReducer.actions.decreasePlayerDevotion({ playerId: id, amount: 1 }));
                console.log(`Player ${id} loses 1 devotion because ${winnerId} has Mighty`)
            })
        }
    }

    const devotionAmount = 1 + extraDevotion;
    dispatch(gameReducer.actions.increasePlayerDevotion({ playerId: winnerId, amount: devotionAmount }))

    console.log(`Player ${winnerId} gets ${devotionAmount} devotion from winning the battle`);
}

const afterBattleResolutionEffect = () => async (dispatch, getState) => {
    const { conflict } = getState();
    const { miraclePlayersIds } = conflict;
    miraclePlayersIds.forEach(playerId => dispatch(resolveMiracleEffect({ playerId })))
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
    const playersIds = [...(new Set(monuments.map(({ playerId }) => playerId)))].filter(id => !!id);
    const counter = {}
    playersIds.forEach(id => counter[id] = 0);
    monuments.forEach(({ playerId }) => counter[playerId]++);

    let highestPlayerMonumentsCount = 0;
    let topPlayers = [];
    Object.entries(counter).forEach(([player, amount]) => {
        if (amount > highestPlayerMonumentsCount) {
            topPlayers = [player];
            highestPlayerMonumentsCount = amount;
        } else if (amount === highestPlayerMonumentsCount) {
            topPlayers.push(player);
        }
    })

    if (topPlayers.length > 1) {
        return 0;
    } else if (topPlayers.length === 1) {
        return playerId === topPlayers[0] ? highestPlayerMonumentsCount : 0;
    } else {
        return 0;
    }
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
