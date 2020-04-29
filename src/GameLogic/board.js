import { createSlice } from '@reduxjs/toolkit'
import { hexesConfig, bordersConfig } from './boardConfig';

export const BORDER = {
    GAME: 1,
    RIVER: 2,
    POSSIBLE: 8,
}

const getInitialState = () => {
    return {
        hexes: hexesConfig.map(
            ({ fields }) => [...fields].map(field => ({ areaType: field[0], region: parseInt(field[1]) }))
        ),
        borders: bordersConfig,
        isBordersPreviewActive: false,
        prospectRivers: [],
        maxRegionNumber: 3,
        areConflictOrderTokensShown: true,
        regionsToPreserveItsNumber: [],
    }
}

export const initializeFiguresAndMonumentsOnBoardEffect = () => (dispatch, getState) => {
    const { figures, monuments } = getState();
    const { obelisks, temples, pyramids } = monuments;
    const { gods, warriors } = figures;
    const allMonuments = [...Object.values(obelisks), ...Object.values(temples), ...Object.values(pyramids)]
    const allFigures = [...Object.values(gods), ...Object.values(warriors)]
    dispatch(board.actions.setMonuments({ monuments: allMonuments }));
    dispatch(board.actions.setFigures({ figures: allFigures }));
}

const board = createSlice({
    name: 'board',
    initialState: getInitialState(),
    reducers: {
        // HEXES
        setMonuments: (state, { payload }) => {
            const { monuments } = payload;
            monuments.forEach(({ id, x, y, playerId }) => {
                state.hexes[x][y].monumentId = id;
                state.hexes[x][y].playerId = playerId;
            });
        },
        setFigures: (state, { payload }) => {
            const { figures } = payload;
            figures.forEach(({ id, x, y, playerId }) => {
                state.hexes[x][y].figureId = id;
                state.hexes[x][y].playerId = playerId;
            });
        },
        setPreview: (state, { payload }) => {
            const { previewList } = payload;
            previewList.forEach(({ x, y }) => {
                const hex = state.hexes[x][y];
                if (hex.areaType !== 'W' && !hex.figureId && !hex.monumentId) {
                    state.hexes[x][y].isPreview = true;
                }
            });
        },
        clearPreview: (state) => {
            state.hexes.forEach(
                col => col.forEach(
                    cell => cell.isPreview = undefined
                )
            )
        },
        moveFigure: (state, { payload }) => {
            const { hexes } = state;
            const { from, to } = payload;
            hexes[to.x][to.y].figureId = hexes[from.x][from.y].figureId;
            hexes[to.x][to.y].playerId = hexes[from.x][from.y].playerId;
            hexes[from.x][from.y].figureId = undefined;
        },
        changeMonumentOwner: (state, { payload }) => {
            const { x, y, playerId } = payload;
            state.hexes[x][y].playerId = playerId;
        },
        // BORDERS
        toggleBordersPreview: (state, { payload }) => {
            state.isBordersPreviewActive = payload.isActive;
        },
        addProspectRiver: (state, { payload }) => {
            const { x, y } = payload;
            state.prospectRivers.push({ x, y });
        },
        clearProspectRivers: (state) => {
            state.prospectRivers = [];
        },
        applyProspectRivers: (state) => {
            state.isBordersPreviewActive = false;
            state.prospectRivers.forEach(river => state.borders[river.x][river.y] = BORDER.RIVER);
            state.prospectRivers = [];
        },
        // REGIONS
        incrementMaxRegionNumber: (state) => {
            state.maxRegionNumber++;
        },
        decrementMaxRegionNumber: (state) => {
            state.maxRegionNumber--;
        },
        changeHexRegion: (state, { payload }) => {
            const { x, y, regionNumber } = payload;
            state.hexes[x][y].region = regionNumber;
        },
        toggleAreConflictOrderTokensShown: (state) => {
            state.areConflictOrderTokensShown = !state.areConflictOrderTokensShown;
        },
        setRegionsToPreserveItsNumber: (state, { payload }) => {
            state.regionsToPreserveItsNumber = payload.regions;
        },
        clearRegionsToPreserveItsNumber: (state) => {
            state.regionsToPreserveItsNumber = [];
        }
    },
})

export default board;