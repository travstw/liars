import React from 'react';
import {v4 as uuidv4 } from 'uuid';
import './Player.css';

function Player(props) {
    return (
        <div className="Player">
            <div className="Player-name">{props.player.user}</div>
            <div className="Player-dice">
                {props.player.roll.map(die => <div key={uuidv4()} className="Player-die">?</div>) }
            </div>
        </div>

    )
}

export default Player;