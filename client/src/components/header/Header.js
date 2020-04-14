import React, {useContext} from 'react';
import './Header.css';
import { GameContext } from '../../context/game.context';

function Header(props) {
    const { active, gameId, watch, start } = useContext(GameContext);

    return (
        <div className="Header">
            <div className="Header-title">JABR<i className="Header-die fas fa-dice-one"></i>NI DICE</div>
            <div className="Header-controls">
                <div className="Header-game-id">{`${gameId}`}</div>
                <div className="Header-share Header-control-item tooltip">
                    <i onClick={active ? start: undefined} className={`Header-icon ${active ? 'Header-disabled': ''} fas fa-play`}></i>
                    <span className="tooltiptext">{active ? 'Game Started' : 'Start Game'}</span>
                </div>
                <div className="Header-share Header-control-item tooltip">
                    <i onClick={watch} className="Header-icon fas fa-eye"></i>
                    <span className="tooltiptext">Watch Game</span>
                </div>
            </div>
        </div>

    )
}

export default Header;