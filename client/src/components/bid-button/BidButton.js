import React from 'react';
import './BidButton.css';


function BidButton(props) {
    const handleClick = () => {
        props.action();
    }
    return (
        <div className="BidButton">
            <button className="BidBtn" onClick={handleClick} >{props.label}</button>
        </div>
    )
}

export default BidButton;