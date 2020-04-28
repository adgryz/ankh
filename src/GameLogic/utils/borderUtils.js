import { BORDER } from 'GameLogic/board'

const flatNeighbors = (x, y) => x % 4 === 1
    ? [{ x: x - 1, y: 2 * y }, { x: x - 1, y: 2 * y - 1 }, { x: x + 1, y: 2 * y }, { x: x + 1, y: 2 * y - 1 }]
    : [{ x: x - 1, y: 2 * y }, { x: x - 1, y: 2 * y + 1 }, { x: x + 1, y: 2 * y }, { x: x + 1, y: 2 * y + 1 }];

const skewNeighbors = (x, y) => y % 2 === 0
    ? [{ x, y: y - 1 }, { x, y: y + 1 }, { x: x - 1, y: y / 2 }, { x: x + 1, y: y / 2 }]
    : x % 4 === 0
        ? [{ x, y: y - 1 }, { x, y: y + 1 }, { x: x - 1, y: (y - 1) / 2 }, { x: x + 1, y: (y + 1) / 2 }]
        : [{ x, y: y - 1 }, { x, y: y + 1 }, { x: x - 1, y: (y + 1) / 2 }, { x: x + 1, y: (y - 1) / 2 }]

export const getConnectedBorders = (x, y, allBorders) => {
    const connectedBorders = x % 2 === 0 ? skewNeighbors(x, y) : flatNeighbors(x, y);
    return getExistingBorders(connectedBorders, allBorders);
}
export const getExistingBorders = (borders, allBorders) => borders.filter(({ x, y }) => !!allBorders[x] && !!allBorders[x][y]);

export const areConnectedBorders = (x1, y1, x2, y2, allBorders) => {
    const connectedBorders = getConnectedBorders(x1, y1, allBorders);
    return connectedBorders.find(({ x, y }) => x === x2 && y === y2);
}

export const getBorderAdjacentHexes = (x, y) => {
    return x % 2 === 0
        ? y % 2 === 1
            ? [{ x: x / 2, y: (y - 1) / 2 }, { x: x / 2 - 1, y: (y - 1) / 2 }]
            : x % 4 === 2
                ? [{ x: x / 2, y: y / 2 - 1 }, { x: x / 2 - 1, y: y / 2 }]
                : [{ x: x / 2, y: y / 2 }, { x: x / 2 - 1, y: y / 2 - 1 }]
        : [{ x: (x - 1) / 2, y: y - 1 }, { x: (x - 1) / 2, y }];
}

export const getHexBorders = (x, y) => x % 2 === 1
    ? [
        { x: 2 * x, y: 2 * y + 2 },
        { x: 2 * x, y: 2 * y + 1 },

        { x: 2 * x + 1, y },
        { x: 2 * x + 1, y: y + 1 },

        { x: 2 * x + 2, y: 2 * y + 2 },
        { x: 2 * x + 2, y: 2 * y + 1 },

    ]
    : [
        { x: 2 * x, y: 2 * y + 1 },
        { x: 2 * x, y: 2 * y },

        { x: 2 * x + 1, y },
        { x: 2 * x + 1, y: y + 1 },

        { x: 2 * x + 2, y: 2 * y + 1 },
        { x: 2 * x + 2, y: 2 * y },
    ]


export const hexesHaveCommonActiveBorder = (hex1, hex2, borders, prospectRivers) => {
    const hex1ActiveBorders = getHexBorders(hex1.x, hex1.y)
        .filter(({ x, y }) => [BORDER.GAME, BORDER.RIVER].includes(borders[x][y])
            || prospectRivers.find(river => river.x === x && river.y === y));

    const hex2ActiveBorders = getHexBorders(hex2.x, hex2.y)
        .filter(({ x, y }) => [BORDER.GAME, BORDER.RIVER].includes(borders[x][y])
            || prospectRivers.find(river => river.x === x && river.y === y));
    return hex1ActiveBorders.some(border1 => hex2ActiveBorders
        .find(border2 => border1.x === border2.x && border1.y === border2.y))
}