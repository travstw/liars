import React, { useContext } from 'react';
import {v4 as uuidv4 } from 'uuid';
import './Players.css';
import Player from './player/Player';
import { GameContext } from '../../context/game.context';


function Players() {
    const { round } = useContext(GameContext);
    const players = round.rolls;
    return (
        <div className="Players">
            { players.map((p, i) =>
                <div
                    key={ uuidv4()}
                    className={`Players-player ${i === 0 ? 'selected': ''}`}
                >
                    <Player player={p}/>
                </div>) }
        </div>

    )
}

export default Players;