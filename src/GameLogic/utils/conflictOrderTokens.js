
export const getConflictOrderTokensWithPositions = ({ hexes, maxRegionNumber }) => {
    const regionNumbers = new Array(maxRegionNumber).fill(0).map((x, ind) => ind + 1);
    return regionNumbers.map(regionNumber => getRegionConflictOrderTokenPosition(hexes, regionNumber))
}

const getRegionConflictOrderTokenPosition = (hexes, regionNumber) => {
    const hexesWithPositions = hexes.map((col, x) => col.map((hex, y) => ({ ...hex, x, y })));
    const regionHexes = hexesWithPositions.flat().filter(hex => hex.region === regionNumber);
    let minx = 20;
    let miny = 20;
    let maxx = 0;
    let maxy = 0;

    regionHexes.forEach(({ x, y }) => {
        if (x > maxx) maxx = x;
        if (x < minx) minx = x;
        if (y > maxy) maxy = y;
        if (y < miny) miny = y;
    })

    return {
        regionNumber,
        x: (minx + maxx) / 2,
        y: (miny + maxy) / 2
    }
}