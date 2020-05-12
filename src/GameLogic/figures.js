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

const getName = char => {
    switch (char) {
        case 'g':
            return 'gods'
        case 'w':
            return 'warriors'
        case 's':
            return 'sentinels'
        default:
            throw new Error('sth went wrong')
    }
}

export const getFigureById = (figureId, state) => state.gods[figureId] || state.warriors[figureId] || state.sentinels[figureId];

const figures = createSlice({
    name: 'figures',
    initialState: getInitialState(),
    reducers: {
        addFigure: (state, { payload }) => {
            const { figureId, playerId, x, y } = payload;
            state[getName(figureId[0])][figureId] = { id: figureId, playerId, x, y, strength: 1 };
        },
        changeFigurePosition: (state, { payload }) => {
            const { x, y, figureId } = payload;
            const figure = getFigureById(figureId, state);
            figure.x = x;
            figure.y = y;
        },
        increaseFigureStrength: (state, { payload }) => {
            const { figureId, amount } = payload;
            state[getName(figureId[0])][figureId].strength += amount;
        },
        decreaseFigureStrength: (state, { payload }) => {
            const { figureId, amount } = payload;
            state[getName(figureId[0])][figureId].strength -= amount;
        },
        killFigure: (state, { payload }) => {
            const { figureId } = payload;
            if (figureId[0] !== 'g') {
                delete state[getName(figureId[0])][figureId]
            }
        }
    },
})

export default figures;