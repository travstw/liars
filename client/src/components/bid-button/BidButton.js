import React from 'react';
import './BidButton.css';


function BidButton({action, disabled, label}) {
    const handleClick = () => {
        action();
    }
    return (
        <div className="BidButton">
            <button className={`BidBtn ${disabled ? 'BidButton-disabled': ''}`} onClick={handleClick} disabled={disabled}>{label}</button>
        </div>
    )
}

export default BidButton;