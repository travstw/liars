import React from 'react';
import './Turn.css';
import Clicker from '../clicker/Clicker';
import DieClicker from '../die-clicker/DieClicker';
import BidButton from '../bid-button/BidButton';

function Turn(props) {

    const getAllowed = () => {
        const totalDice = props.state.players.reduce((total, player) => total += player.dice, 0);
        const count = props.state.count;
        const value = props.state.value;
        const lastBidCount = props.state.lastBidCount;
        const lastBidValue = props.state.lastBidValue;

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


    }

    const allowed = getAllowed();

    return (
        <div className="Turn">
            <BidButton action={props.state.call} label="CALL" />
            <div className="Turn-clicker-container">
                <div className="Turn-item">
                    <Clicker state={props.state} allowed={ allowed }/>
                </div>
                <div className="Turn-item">
                    <DieClicker state={props.state} allowed={ allowed }/>
                </div>
            </div>
            <BidButton action={props.state.bid} label="BID" />

        </div>
    )
}

export default Turn;