import { createSlice } from '@reduxjs/toolkit'

const getInitialState = () => {
    return {
        gods: {
            g1: { id: 'g1', playerId: 'p1', x: 2, y: 7, strength: 1 },
            g2: { id: 'g2', playerId: 'p2', x: 3, y: 7, strength: 1 },
        },
        warriors: {
            w11: { id: 'w11', playerId: 'p1', x: 4, y: 5, strength: 1 },
            w12: { id: 'w12', playerId: 'p1', x: 4, y: 7, strength: 1 },
            w21: { id: 'w21', playerId: 'p2', x: 1, y: 6, strength: 1 },
            w22: { id: 'w22', playerId: 'p2', x: 5, y: 5, strength: 1 },
        },
        sentinels: {

        }
    }
}

export const getFigureById = (figureId, state) => state.gods[figureId] || state.warriors[figureId] || state.sentinels[figureId];

const figures = createSlice({
    name: 'figures',
    initialState: getInitialState(),
    reducers: {
        addFigure: (state, { payload }) => {
            const { figureId, playerId, x, y } = payload;
            if (figureId.startsWith('g')) {
                state.gods[figureId] = { id: figureId, playerId, x, y, strength: 1 };;
            }
            if (figureId.startsWith('w')) {
                state.warriors[figureId] = { id: figureId, playerId, x, y, strength: 1 };;
            }
            if (figureId.startsWith('s')) {
                state.sentinels[figureId] = { id: figureId, playerId, x, y, strength: 1 };;
            }
        },
        changeFigurePosition: (state, { payload }) => {
            const { x, y, figureId } = payload;
            const figure = getFigureById(figureId, state);
            figure.x = x;
            figure.y = y;
        }
    },
})

export default figures;