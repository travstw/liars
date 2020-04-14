import React, { useContext } from 'react';
import './Clicker.css';
import { GameContext } from '../../context/game.context';


function Clicker(props) {
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
            <i onClick={props.allowed.countUp ? increment: undefined}
                className={`Clicker-caret ${props.allowed.countUp ? '' : 'disabled'} fas fa-caret-up`}>
            </i>
            <input onChange={handleChange} value={count} id="Clicker-count"></input>
            <i onClick={props.allowed.countDown ? decrement: undefined}
                className={`Clicker-caret ${props.allowed.countDown ? '' : 'disabled'} fas fa-caret-down`}>
            </i>
        </div>
    )
}

export default Clicker;