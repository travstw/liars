import React from 'react';
import './Header.css';

function Header(props) {

    const handleShareClick = () => {
        console.log('share');
        // props.share();
    }

    const handleLeaveClick = () => {
        props.state.leave();
    }

    const handleWatchClick = () => {
        props.state.watch();
    }

    return (
        <div className="Header">
            <div className="Header-title">JABR<i className="Header-die fas fa-dice-one"></i>NI DICE</div>
            <div className="Header-controls">
            <div className="Header-share Header-control-item tooltip">
                    <i onClick={handleWatchClick} className="Header-icon fas fa-eye"></i>
                    <span className="tooltiptext">Watch Game</span>
                </div>
                <div className="Header-share Header-control-item tooltip">
                    <i onClick={handleShareClick} className="Header-icon fas fa-clipboard-list"></i>
                    <span className="tooltiptext">Copy Game Id</span>
                </div>
                <div className="Header-leave Header-control-item tooltip">
                    <i onClick={handleLeaveClick} className="Header-icon fas fa-sign-out-alt"></i>
                    <span className="tooltiptext">Leave Game</span>
                </div>
            </div>
        </div>

    )
}

export default Header;