import { configureStore, combineReducers } from '@reduxjs/toolkit';

import board from './GameLogic/board';
import game from './GameLogic/game';
import monuments from './GameLogic/monuments';
import figures from './GameLogic/figures';

const rootReducer = combineReducers({
    board: board.reducer,
    game: game.reducer,
    monuments: monuments.reducer,
    figures: figures.reducer,
});

const store = configureStore({
    reducer: rootReducer,
});

export default store;
