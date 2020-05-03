import React, { useContext } from 'react';
import {v4 as uuidv4 } from 'uuid';

import './Game.css';
import { GameContext } from '../../context/game.context';
import Header from '../header/Header';
import Summary from '../summary/Summary';
import Players from '../players/Players';
import History from '../history/History';
import Turn from '../turn/Turn';
import Hand from '../hand/Hand';
import Toast from '../toast/Toast';

export function Game() {
    const { toasts } = useContext(GameContext);

    return (
        <div className="Game">
          <div className="Game-header">
            <Header />
          </div>
          <div className="Game-container">
            <div className="Game-left-panel">
              <div className="Game-summary">
                <Summary />
              </div>
              <div className="Game-players">
                <Players />
              </div>
              <div className="Game-turn">
                <Turn />
              </div>
              <div className="Game-hand">
                <Hand />
              </div>
            </div>
            {/* <div className="Game-right-panel">
              <div className="Game-right-panel-item Game-history">
                <History />
              </div>
            </div> */}
          </div>
          <div className="Game-toast-container">
            { toasts.map(t => <Toast key={uuidv4()} toast={t}/>)}
          </div>
        </div>
    );
  }

export default Game;
