import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import Board from './GameComponents/Board/Board';
import EventBoard from './GameComponents/EventBoard/EventBoard';
import ActionBoard from './GameComponents/ActionBoard/ActionBoard';
import DevotionBoard from './GameComponents/DevotionBoard/DevotionBoard';
import ConflictsBoard from './GameComponents/ConflictsBoard/ConflictsBoard';
import GodBoards from './GameComponents/GodBoards/GodBoards';
import InfoBox from './GameComponents/UI/InfoBox';

import GuardianCards from './GameComponents/GuardianCards/GuardianCards';
import { initializeFiguresAndMonumentsOnBoardEffect } from './GameLogic/board';
import { initializePlayerFiguresAndMonumentsEffect } from './GameLogic/game';

import './app.scss';

function App() {
  const dispatch = useDispatch();
  const players = useSelector(({ game }) => game.players);
  const actions = useSelector(({ game }) => game.actions);
  const eventIndex = useSelector(({ game }) => game.eventIndex);
  const hexes = useSelector(({ board }) => board.hexes);
  const borders = useSelector(({ board }) => board.borders);
  const devotion = Object.values(players).map(({ god, devotion }) => ({
    color: god.color,
    devotion
  }))
  const isConflictActive = useSelector(({ conflict }) => conflict.isConflictActive);

  useEffect(() => {
    dispatch(initializeFiguresAndMonumentsOnBoardEffect());
    dispatch(initializePlayerFiguresAndMonumentsEffect());
  }, [])

  return (
    <div style={{ display: 'flex' }}>
      <div>
        <div style={{ display: 'flex' }}>
          <Board hexes={hexes} borders={borders} />
          {
            isConflictActive
              ? <div><ConflictsBoard /></div>
              : (<div>
                <ActionBoard actions={actions} />
                <EventBoard event={eventIndex} />
              </div>)
          }
          <DevotionBoard devotion={devotion} />
        </div>
        <GuardianCards />
      </div>

      <div>
        <GodBoards players={Object.values(players)} />
      </div>
      {!isConflictActive && <InfoBox />}
    </div>
  );
}

export default App;
