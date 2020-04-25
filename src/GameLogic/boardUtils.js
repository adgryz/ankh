const SHORT_COL = 8;
const MID_COL = 9;
const LONG_COL = 10;
const COLS_COUNT = 11;

const isExistingField = (x, y) => {
    // CORNER FIELDS
    if (x === 0 && (y === 0 || y === LONG_COL - 1)) {
        return false;
    }
    if (x === COLS_COUNT - 1 && (y === 0 || y === LONG_COL - 1)) {
        return false;
    }
    if (x < 0 || y < 0) {
        return false;
    }
    if (x % 2 === 0 && y > LONG_COL - 1) {
        return false;
    }
    if (x % 2 === 1 && y > MID_COL - 1) {
        return false;
    }
    return true;
}

export const getAdjacentList = (x, y) => {
    if (x % 2 === 0) {
        return [
            { x, y: y - 1 }, { x, y: y + 1 },
            { x: x - 1, y: y - 1 }, { x: x - 1, y },
            { x: x + 1, y: y - 1 }, { x: x + 1, y },
        ].filter(({ x, y }) => isExistingField(x, y))
    } else {
        return [
            { x, y: y - 1 }, { x, y: y + 1 },
            { x: x - 1, y: y + 1 }, { x: x - 1, y },
            { x: x + 1, y: y + 1 }, { x: x + 1, y },
        ].filter(({ x, y }) => isExistingField(x, y))
    }
}

export const areAdjacent = (x1, y1, x2, y2) => {
    const adjacencyList = getAdjacentList(x1, y1);
    return !!adjacencyList.find(({ x, y }) => x === x2 && y === y2)
}

export const isAnyAdjacent = (x1, y1, list) => {
    return list.some(a => areAdjacent(x1, y1, a.x, a.y))
}

const getHash = (x, y) => 10 * x + y;
const getValue = hash => ({ x: parseInt(hash / 10), y: hash % 10 });

const getUniqueCoordinates = (arr) => {
    const hashedArray = arr.map(({ x, y }) => getHash(x, y))
    const uniqueHashArray = [...(new Set(hashedArray))];
    return uniqueHashArray.map(hash => getValue(hash));
}

export const getInThreeDistance = (x, y) => {
    const inOneDistance = getAdjacentList(x, y);
    const inTwoDistance = getUniqueCoordinates(inOneDistance.flatMap(({ x, y }) => getAdjacentList(x, y)));
    const inThreeDistance = getUniqueCoordinates(inTwoDistance.flatMap(({ x, y }) => getAdjacentList(x, y)));
    return inThreeDistance;
}