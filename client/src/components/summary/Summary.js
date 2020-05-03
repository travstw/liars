import React, { useContext }from 'react';
import './Summary.css';
import { GameContext } from '../../context/game.context';


const DICE_LABELS = new Map([
    [6, 'six'],
    [5, 'five'],
    [4, 'four'],
    [3, 'three'],
    [2, 'two'],
    [1, 'one']
]);

function Summary() {
    const { players, round, lastBidValue, lastBidCount} = useContext(GameContext);
    const dice = players && players.reduce((total, player) => {
        total += player.dice;
        return total;
    }, 0);

    const matchedDice = round && round.rolls.reduce((acc, curr) => {
        acc += curr.roll.reduce((a, c) => {
            if (c === lastBidValue || (!round.natural && c === 1)) {
                a++;
            }
            return a;
        }, 0);
        return acc;
    }, 0)

    const roundNumber = round && round.round;
    const natural = round && round.natural;
    const value = lastBidValue && DICE_LABELS.get(lastBidValue);

    const die = <i className={`Summary-die fas fa-dice-${value}`}></i>

    return (
        <div className="Summary">
            <div className="Summary-container">
                <div className="Summary-item-container">
                    <div className="Summary-item"><span className="Summary-label">Bid:</span>{lastBidCount || ''}{die}</div>
                    { round && round.loser ? <div className="Summary-item"><span className="Summary-label">Call:</span>{matchedDice}</div> : null }
                    { round && round.loser ? <div className="Summary-item"><span className="Summary-label">Loser:</span>{round.loser}</div> : null }
                    <div className="Summary-item"><span className="Summary-label">Dice:</span>{dice || ''}</div>

                </div>
                {natural && <i className="Summary-leaf fas fa-leaf"></i>}
            </div>

        </div>
    )
}

export default Summary;