import React from 'react';
import {v4 as uuidv4 } from 'uuid';
import './Hand.css';
import Die from '../die/Die';

const DICE_LABELS = new Map([
    [6, 'six'],
    [5, 'five'],
    [4, 'four'],
    [3, 'three'],
    [2, 'two'],
    [1, 'one']
]);

function Hand(props) {
    const getStringValue = (die) => {
        return DICE_LABELS.get(die);
    }

    const handleClick = () => {
        props.state.roll();
    }

    let item;
    if (!props.state.hand) {
        // watcher... show nothing
    } else if (props.state.hand.length) {
        item = props.state.hand.map(die => <Die key={uuidv4()} value={getStringValue(die)} />)
    } else {
        item = <button onClick={handleClick} className="Hand-roll-button">Roll</button>
    }

    const natural = props.state.round && props.state.round.natural;

    return (
        <div className="Hand">
            <div className="Hand-dice-container">
                {item}
                {natural && <i className="Hand-leaf fas fa-leaf"></i>}
            </div>
        </div>
    )
}

export default Hand;