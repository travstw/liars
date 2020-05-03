import React, { useContext } from 'react';
import './Turn.css';
import Clicker from '../clicker/Clicker';
import DieClicker from '../die-clicker/DieClicker';
import BidButton from '../bid-button/BidButton';
import Timer from '../timer/Timer';
import { GameContext } from '../../context/game.context';


function Turn(props) {
    const { userId, gameId, players, round, count, value, lastBidCount, lastBidValue, call, bid, countChange, valueChange} = useContext(GameContext);
    const TIMEOUT_VALUE = 30;
    const yourTurn = round && round.rolls[0].userId === userId;
    const activeTurn = round && round.active;

    const user = players.find(p => p.userId === userId);


    const handleBid = () => {
        bid(userId, gameId, {
            type: 'bid',
            count,
            value
        });
    }

    const handleCall = () => {
        call(userId, gameId, { type: 'call' });
    }

    const handleTimeout = () => {
        if (!yourTurn) {
            return;
        }
        const isValueChange = (value !== 6);
        if (isValueChange) {
            valueChange(value + 1);
        } else {
            countChange(count + 1);
        }
        handleBid();
    }

    const getAllowed = () => {
        if (!yourTurn || round.endedOn) {
            return {
                countUp: false,
                countDown: false,
                valueDown: false,
                valueUp: false
            }
        }
        const totalDice = (players && players.reduce((total, player) => total += player.dice, 0)) || 0;

        if (!lastBidCount && !lastBidValue) { // first bid, anything goes
            return {
                countUp: true,
                countDown: true,
                valueDown: true,
                valueUp: true
            };
        }

        if (count === lastBidCount) {
            return {
                countUp: (count < totalDice),
                countDown: false,
                valueDown: false,
                valueUp: true
            };
        }

        // value is less and count is one higher, don't allow count to go down
        if (((count - 1) === lastBidCount) && value < lastBidValue) {
            return {
                countUp: (count < totalDice),
                countDown: false,
                valueDown: true,
                valueUp: true
            }
        }

        if (count > lastBidCount) {
            return {
                countUp: (count < totalDice),
                countDown: true,
                valueDown: true,
                valueUp: true
            }
        }

        return {
            countUp: (count <= totalDice),
            countDown: true,
            valueDown: true,
            valueUp: true
        }
    }

    const allowed = getAllowed();

    return (
        <>
            { user && <div className="Turn">

                <div className="Turn-clicker-container">
                    <div className="Turn-item">
                        <Clicker allowed={ allowed }/>
                    </div>
                    <div className="Turn-item">
                        <DieClicker allowed={ allowed }/>
                    </div>
                    {/* <div className="Turn-item">
                        {activeTurn ? <Timer timeout={handleTimeout} startValue={TIMEOUT_VALUE}/> : null}
                    </div> */}
                </div>
                <BidButton action={ handleBid } label="BID" disabled={!yourTurn || !round || (round && round.endedOn) || (round && !round.active)}/>
                <BidButton action={ handleCall } label="CALL" disabled={!round || (round && round.endedOn) || (round && !round.numTurns)} />
            </div> }
        </>
    )
}

export default Turn;