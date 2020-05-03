import React from 'react';
import AppContainer from './components/app-container/AppContainer';
import './App.css';
import { GameProvider } from './context/game.context';

export function App() {
  return (
    <GameProvider>
      <AppContainer />
    </GameProvider>
  )
}

export default App;
