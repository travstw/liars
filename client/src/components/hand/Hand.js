import React, { useContext }from 'react';
import {v4 as uuidv4 } from 'uuid';
import './Hand.css';
import Die from '../die/Die';
import { GameContext } from '../../context/game.context';


const DICE_LABELS = new Map([
    [6, 'six'],
    [5, 'five'],
    [4, 'four'],
    [3, 'three'],
    [2, 'two'],
    [1, 'one']
]);

function Hand(props) {
    const { hand, roll, round } = useContext(GameContext);
    const getStringValue = (die) => {
        return DICE_LABELS.get(die);
    }

    const handleClick = () => {
        roll();
    }

    let item;
    if (!hand) {
        // watcher... show nothing
    } else if (hand.length) {
        item = hand.map(die => <Die key={uuidv4()} value={getStringValue(die)} />)
    } else {
        item = <button onClick={handleClick} className="Hand-roll-button">Roll</button>
    }

    const natural = round && round.natural;

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