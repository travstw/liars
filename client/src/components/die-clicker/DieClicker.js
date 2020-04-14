import React, { useContext } from 'react';
import Die from '../die/Die';
import './DieClicker.css';
import { GameContext } from '../../context/game.context';

const DICE_LABELS = new Map([
    [6, 'six'],
    [5, 'five'],
    [4, 'four'],
    [3, 'three'],
    [2, 'two'],
    [1, 'one']
]);


function DieClicker(props) {
    const { value, valueChange } = useContext(GameContext);

    const getDiceString = (die) => {
        return DICE_LABELS.get(die);
    }
    const handleIncrement = () => {
        if (value === 6) {
            return;
        }
        valueChange(value + 1);
    }
    const handleDecrement = () => {
        if (value === 1) {
            return;
        }
        valueChange(value - 1);
    }
    return (
        <div className="DieClicker">
            <i onClick={value < 6 ? handleIncrement: undefined}
                className={`Die-clicker-caret ${value < 6 ? '' : 'disabled'} fas fa-caret-up`}>
            </i>
            <Die value={getDiceString(value)} />
            <i onClick={props.allowed.valueDown ? handleDecrement: undefined}
                className={`Die-clicker-caret ${props.allowed.valueDown ? '' : 'disabled'} fas fa-caret-down`}>
            </i>
        </div>
    )
}

export default DieClicker;