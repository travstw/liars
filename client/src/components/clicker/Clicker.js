import React, { useContext } from 'react';
import './Clicker.css';
import { GameContext } from '../../context/game.context';


function Clicker({ allowed }) {
    const { countChange, count } = useContext(GameContext);
    const increment = () => {
        countChange(count + 1);
    }

    const decrement = () => {
        countChange(count - 1);
    }

    const handleChange = (evt) => {
        countChange(+evt.target.value);

    }

    return (
        <div className="Clicker">
            <i onClick={allowed.countUp ? increment: undefined}
                className={`Clicker-caret ${allowed.countUp ? '' : 'disabled'} fas fa-caret-up`}>
            </i>
            <input onChange={handleChange} value={count} id="Clicker-count" disabled={!(allowed.countUp && allowed.countDown)}></input>
            <i onClick={allowed.countDown ? decrement: undefined}
                className={`Clicker-caret ${allowed.countDown ? '' : 'disabled'} fas fa-caret-down`}>
            </i>
        </div>
    )
}

export default Clicker;