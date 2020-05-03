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
    const { players, userId, gameId, hand, initialRoll, roll, round, active , start, nextRound } = useContext(GameContext);
    const getStringValue = (die) => {
        return DICE_LABELS.get(die);
    }

    const handleClick = () => {
        if (!active) {
            return start(userId, gameId);
        }

        if (!round) {
            return initialRoll(userId, gameId);
        }

        if (round && !round.endedOn) {
            return roll(userId, gameId);
        }

        if (round && round.endedOn) {
            return nextRound(userId, gameId);
        }
    }

    const setButtonLabel = () => {
        if (!active) {
            return 'Start';
        } else if (!round) {
            return 'Roll Turn';
        } else if (round && !round.endedOn) {
            return 'Roll';
        } else if (round && round.endedOn) {
            return `Next Round`;
        }
    }

    const player = players.find(p => p.userId === userId);
    let item;
    if (!player) {
        // watcher... show nothing
    } else if (hand.length && (round && !round.endedOn)) {
        item = hand.map(die => <Die key={uuidv4()} value={getStringValue(die)} />)
    } else {
        item = <button onClick={handleClick} className="Hand-roll-button">{setButtonLabel()}</button>
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