
const flatNeighbors = (x, y) => x % 4 === 1
    ? [{ x: x - 1, y: 2 * y }, { x: x - 1, y: 2 * y - 1 }, { x: x + 1, y: 2 * y }, { x: x + 1, y: 2 * y - 1 }]
    : [{ x: x - 1, y: 2 * y }, { x: x - 1, y: 2 * y + 1 }, { x: x + 1, y: 2 * y }, { x: x + 1, y: 2 * y + 1 }];

const skewNeighbors = (x, y) => y % 2 === 0
    ? [{ x, y: y - 1 }, { x, y: y + 1 }, { x: x - 1, y: y / 2 }, { x: x + 1, y: y / 2 }]
    : [{ x, y: y - 1 }, { x, y: y + 1 }, { x: x - 1, y: (y - 1) / 2 }, { x: x + 1, y: (y + 1) / 2 }]

export const getConnectedBorders = (x, y, allBorders) => {
    const connectedBorders = x % 2 === 0 ? skewNeighbors(x, y) : flatNeighbors(x, y);
    return getExistingBorders(connectedBorders, allBorders);
}
export const getExistingBorders = (borders, allBorders) => borders.filter(({ x, y }) => !!allBorders[x] && !!allBorders[x][y]);

export const areConnectedBorders = (x1, y1, x2, y2, allBorders) => {
    const connectedBorders = getConnectedBorders(x1, y1, allBorders);
    return connectedBorders.find(({ x, y }) => x === x2 && y === y2);
}
