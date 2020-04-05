import React from 'react';
import './Summary.css';

const DICE_LABELS = new Map([
    [6, 'six'],
    [5, 'five'],
    [4, 'four'],
    [3, 'three'],
    [2, 'two'],
    [1, 'one']
]);

function Summary(props) {
    const dice = props.state.players.reduce((total, player) => {
        total += player.dice;
        return total;
    }, 0);

    const round = props.state.round && props.state.round.round;
    const natural = props.state.round && props.state.round.natural;
    const value = props.state.lastBidValue && DICE_LABELS.get(props.state.lastBidValue);

    const die = <i className={`Summary-die fas fa-dice-${value}`}></i>

    return (
        <div className="Summary">
            <div className="Summary-container">
                <div className="Summary-item-container">
                    <div className="Summary-item">{`Round: ${round}`}</div>
                    <div className="Summary-item">{`Bid: ${props.state.lastBidCount}  `}{die}</div>
                    <div className="Summary-item">{`Dice: ${dice}`}</div>
                    {/* <div className="Summary-item">{`Odds: ${odds}%`}</div> */}
                </div>
                {natural && <i className="Summary-leaf fas fa-leaf"></i>}
            </div>

        </div>
    )
}

export default Summary;