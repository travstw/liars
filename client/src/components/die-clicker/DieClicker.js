import React from 'react';
import Die from '../die/Die';
import './DieClicker.css'

const DICE_LABELS = new Map([
    [6, 'six'],
    [5, 'five'],
    [4, 'four'],
    [3, 'three'],
    [2, 'two'],
    [1, 'one']
]);


function DieClicker(props) {
    const getDiceString = (die) => {
        return DICE_LABELS.get(die);
    }
    const handleIncrement = () => {
        if (props.state.value === 6) {
            return;
        }
        props.state.valueChange(props.state.value + 1);
    }
    const handleDecrement = () => {
        if (props.state.value === 1) {
            return;
        }
        props.state.valueChange(props.state.value - 1);
    }
    return (
        <div className="DieClicker">
            <i onClick={props.state.value < 6 ? handleIncrement: undefined}
                className={`Die-clicker-caret ${props.state.value < 6 ? '' : 'disabled'} fas fa-caret-up`}>
            </i>
            <Die value={getDiceString(props.state.value)} />
            <i onClick={props.allowed.valueDown ? handleDecrement: undefined}
                className={`Die-clicker-caret ${props.allowed.valueDown ? '' : 'disabled'} fas fa-caret-down`}>
            </i>
        </div>
    )
}

export default DieClicker;