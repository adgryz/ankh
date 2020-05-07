export const getConflicts = (board, figures) => {
    const regionNumbers = new Array(board.maxRegionNumber).fill(0).map((x, ind) => ind + 1);
    return regionNumbers.map(regionNumber => getRegionConflict(board, figures, regionNumber))
}

const getRegionConflict = (board, figures, regionNumber) => {
    const { hexes } = board;

    const regionHexes = hexes.flat().filter(hex => hex.region === regionNumber)
    const figuresInRegion = regionHexes
        .filter(hex => hex.figureId)
        .map(({ figureId, playerId }) => ({ figureId, playerId }))

    const monumentsInRegion = regionHexes
        .filter(hex => hex.monumentId)
        .map(({ monumentId, playerId }) => ({ monumentId, playerId }))

    if (figuresInRegion.length === 0) {
        return {
            regionNumber,
            conflictType: CONFLICT_TYPE.NO_BATTLE,
        }
    }

    const playersToTakePartInBattle = [...(new Set(figuresInRegion.map(({ playerId }) => playerId)))]
    if (playersToTakePartInBattle.length === 1) {
        return {
            regionNumber,
            conflictType: CONFLICT_TYPE.DOMINATION,
            playerId: playersToTakePartInBattle[0],
            monumentsInRegion,
        }
    }

    const playersIds = playersToTakePartInBattle.sort();

    const playersStrengths = playersIds
        .reduce((acc, currId) => {
            return {
                [currId]: getPlayerFiguresFromConflict(figuresInRegion, figures, currId)
                    .reduce((acc, curr) => acc + curr.strength, 0),
                ...acc,
            }
        }, {})

    return {
        regionNumber,
        conflictType: CONFLICT_TYPE.BATTLE,
        playersIds,
        figuresInRegion,
        monumentsInRegion,
        playersStrengths
    }
}

export const getPlayerFiguresFromConflict = (figuresInRegion, figures, playerId) => {
    const playerFiguresIds = figuresInRegion.filter(figure => figure.playerId === playerId).map(figure => figure.figureId);
    const playerGod = Object.values(figures.gods).filter(god => playerFiguresIds.includes(god.id));
    const playerWarriors = Object.values(figures.warriors).filter(warrior => playerFiguresIds.includes(warrior.id));
    const playerSentinels = Object.values(figures.sentinels).filter(sentinel => playerFiguresIds.includes(sentinel.id));
    return [...playerGod, ...playerWarriors, ...playerSentinels];
}

export const CONFLICT_TYPE = {
    NO_BATTLE: 'No Battle',
    DOMINATION: 'Domination',
    BATTLE: 'Battle',
}