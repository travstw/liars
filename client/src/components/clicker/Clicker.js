import React from 'react';
import './Clicker.css';

function Clicker(props) {
    const increment = () => {
        props.state.countChange(props.state.count + 1);
    }

    const decrement = () => {
        props.state.countChange(props.state.count - 1);
    }

    const handleChange = (evt) => {
        console.log('change')
    }

    return (
        <div className="Clicker">
            <i onClick={props.allowed.countUp ? increment: undefined}
                className={`Clicker-caret ${props.allowed.countUp ? '' : 'disabled'} fas fa-caret-up`}>
            </i>
            <input onChange={handleChange} value={props.state.count} id="Clicker-count"></input>
            <i onClick={props.allowed.countDown ? decrement: undefined}
                className={`Clicker-caret ${props.allowed.countDown ? '' : 'disabled'} fas fa-caret-down`}>
            </i>
        </div>
    )
}

export default Clicker;