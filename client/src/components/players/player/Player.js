import React from 'react';
import {v4 as uuidv4 } from 'uuid';
import Die from '../../die/Die';
import './Player.css';

const DICE_LABELS = new Map([
    [6, 'six'],
    [5, 'five'],
    [4, 'four'],
    [3, 'three'],
    [2, 'two'],
    [1, 'one']
]);

function Player(props) {

    const getStringValue = (die) => {
        return DICE_LABELS.get(die);
    }

    const setDieClass = (die) => {
        if (props.round && props.round.endedOn) {
            return (die === props.value || (die === 1 && !props.round.natural)) ? '#9EE493' : undefined;
        }
        return undefined;
    }

    const getDieMatchCount = () => {
        return dice.reduce((acc, curr) => {
            if ((curr === props.value || (curr === 1 && !props.round.natural))) {
                acc++;
            }
            return acc;
        }, 0);
    }

    let dice = [];
    let initialRoll = false;

    // This logic is getting unruly... should refactor the server side to provide better state info
    if (props.round) {
        const roll = props.round.rolls.find(roll => roll.user === props.player.user);
        if (props.round.active || (roll.roll.length && !props.round.endedOn)) {
            dice = Array(roll.roll.length).fill('?');
        } else if (props.round.endedOn) {
            dice = roll.roll;
        } else {
            // Only show initial rolls before first round, not between rounds
            if (props.round && props.round.round === 1) {
                dice = [props.player.initialRoll || '?'];
                initialRoll = true;
            }
        }
    } else {
        dice = [props.player.initialRoll || '?'];
    }

    return (
        <div className="Player">
            <div className="Player-name">{props.player.user}</div>
            <div className="Player-dice">
                {dice.map(die =>
                    <div key={uuidv4()} className="Player-die-container"
                    >
                        {
                            ((props.round && props.round.endedOn) || initialRoll)?
                            <Die value={getStringValue(die)} fontSize="3.5rem" color={setDieClass(die)}/> :

                            <div className="Player-die">
                                <span className="Player-die-text">
                                    {die}
                                </span>
                            </div>
                        }

                    </div>
                )}
            </div>
            {/* {props.round && props.round.endedOn ? <div className="Player-total">{getDieMatchCount()}</div> : null} */}
        </div>

    )
}

export default Player;