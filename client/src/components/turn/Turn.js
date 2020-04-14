import React, { useContext } from 'react';
import './Turn.css';
import Clicker from '../clicker/Clicker';
import DieClicker from '../die-clicker/DieClicker';
import BidButton from '../bid-button/BidButton';
import { GameContext } from '../../context/game.context';


function Turn(props) {
    const { players, count, value, lastBidCount, lastBidValue, call, bid} = useContext(GameContext);
    const getAllowed = () => {
        const totalDice = players.reduce((total, player) => total += player.dice, 0);

        if (!lastBidCount && !lastBidValue) { // first bid, anything goes
            return {
                countUp: true,
                countDown: true,
                valueDown: true
            };
        }

        if (count === lastBidCount) {
            return {
                countUp: (count < totalDice),
                countDown: false,
                valueDown: false
            };
        }

        // value is less and count is one higher, don't allow count to go down
        if (((count - 1) === lastBidCount) && value < lastBidValue) {
            return {
                countUp: (count < totalDice),
                countDown: false,
                valueDown: true,
            }
        }

        if (count > lastBidCount) {
            return {
                countUp: (count <= totalDice),
                countDown: true,
                valueDown: true
            }
        }

        return {
            countUp: (count <= totalDice),
            countDown: true,
            valueDown: true
        }
    }

    const allowed = getAllowed();

    return (
        <div className="Turn">
            <BidButton action={call} label="CALL" />
            <div className="Turn-clicker-container">
                <div className="Turn-item">
                    <Clicker allowed={ allowed }/>
                </div>
                <div className="Turn-item">
                    <DieClicker allowed={ allowed }/>
                </div>
            </div>
            <BidButton action={bid} label="BID" />

        </div>
    )
}

export default Turn;