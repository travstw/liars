import React, {useContext} from 'react';
import './Modal.css';
import { GameContext } from '../../context/game.context';

function Modal() {
    const { gameId, userId, round, nextRound } = useContext(GameContext);

    const handleNextRoundClick = () => {
        nextRound(userId, gameId);
    }

    return (
        <div onClick={ handleClose } className={`Modal ${round && round.closedOn ? 'visible' : ''}`} >

        </div>
    )
}

export default Header;