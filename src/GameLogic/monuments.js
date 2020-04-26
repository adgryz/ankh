import { createSlice } from '@reduxjs/toolkit'

const getInitialState = () => {
    return {
        obelisks: {
            o1: { id: 'o1', playerId: 'p1', x: 4, y: 3 },
            o2: { id: 'o2', x: 1, y: 3 },
            o3: { id: 'o3', x: 8, y: 9 }
        },
        temples: {
            t1: { id: 't1', x: 8, y: 2 },
            t2: { id: 't2', x: 6, y: 3 },
            t3: { id: 't3', x: 5, y: 4 },
            t4: { id: 't4', x: 6, y: 7 },
        },
        pyramids: {
            p1: { id: 'p1', playerId: 'p2', x: 3, y: 1 },
            p2: { id: 'p2', x: 9, y: 2 },
            p3: { id: 'p3', x: 8, y: 4 },
            p4: { id: 'p4', x: 0, y: 5 },
            p5: { id: 'p5', x: 2, y: 8 },
            p6: { id: 'p6', x: 5, y: 8 },
        }
    }
}

const monuments = createSlice({
    name: 'monuments',
    initialState: getInitialState(),
    reducers: {
        setMonumentPlayer: (state, { payload }) => {
            const { monumentId, playerId } = payload;

            if (monumentId.startsWith('o')) {
                state.obelisks[monumentId].playerId = playerId;
            }
            if (monumentId.startsWith('p')) {
                state.pyramids[monumentId].playerId = playerId;
            }
            if (monumentId.startsWith('t')) {
                state.temples[monumentId].playerId = playerId;
            }
        }
    },
})

export default monuments;