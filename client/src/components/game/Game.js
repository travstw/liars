import React from 'react';
import './Game.css';
import Header from '../header/Header';
import Summary from '../summary/Summary';
import Players from '../players/Players';
import History from '../history/History';
import Turn from '../turn/Turn';
import Hand from '../hand/Hand';
import { GameProvider } from '../../context/game.context';

export function Game() {
    return (
      <GameProvider>
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
              <div className="Game-hand">
                <Hand />
              </div>
            </div>
            <div className="Game-right-panel">
              <div className="Game-right-panel-item Game-history">
                <History />
              </div>
              <div className="Game-right-panel-item Game-turn">
                <Turn />
              </div>
            </div>
          </div>
        </div>
      </GameProvider>
    );
  }

export default Game;
