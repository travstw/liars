import React, { useContext } from 'react';
import {v4 as uuidv4 } from 'uuid';
import './Players.css';
import Player from './player/Player';
import { GameContext } from '../../context/game.context';


function Players() {
    const { value, round, players } = useContext(GameContext);
    let currentPlayers;

    if (round && round.active) {
        currentPlayers = round.rolls;
    } else {
        currentPlayers = players.filter(p => p.type === 'player');
    }

    return (
        <div className="Players">
            { currentPlayers && currentPlayers.map((p, i) =>
                <div
                    key={ uuidv4()}
                    className={`Players-player ${i === 0 ? 'selected': ''}`}
                >
                    <Player round={round} player={p} value={value}/>
                </div>) }
        </div>

    )
}

export default Players;