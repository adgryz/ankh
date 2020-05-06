export const getConflicts = (board) => {
    const regionNumbers = new Array(board.maxRegionNumber).fill(0).map((x, ind) => ind + 1);
    return regionNumbers.map(regionNumber => getRegionConflict(board, regionNumber))
}

const getRegionConflict = (board, regionNumber) => {
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

    return {
        regionNumber,
        conflictType: CONFLICT_TYPE.BATTLE,
        playersIds: playersToTakePartInBattle.sort(),
        figuresInRegion,
        monumentsInRegion,
    }
}

export const CONFLICT_TYPE = {
    NO_BATTLE: 'No Battle',
    DOMINATION: 'Domination',
    BATTLE: 'Battle',
}