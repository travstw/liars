import React, { useContext } from 'react';
import './AppContainer.css';
import Game from '../game/Game';
import Login from '../login/Login';
import { GameContext } from '../../context/game.context';


function AppContainer() {
    const { gameId } = useContext(GameContext);
    return (
        <div className="App-Container">
            { gameId ? <Game /> : <Login /> }
        </div>

    )
}


export default AppContainer;