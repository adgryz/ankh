import { createSlice } from '@reduxjs/toolkit'
import { boardConfig } from '../GameComponents/Board/boardConfig';

const getInitialState = () => {
    return {
        hexes: boardConfig.map(
            ({ fields }) => [...fields].map(field => ({ areaType: field[0], region: field[1] }))
        )
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
        }
    },
})

export default board;