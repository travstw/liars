import React from 'react';
import './HistoryItem.css';


function History(props) {
    return (
        <div className="HistoryItem">
            <div className="HistoryItem-time">{props.message.time}</div>
            <div className="HistoryItem-message">{props.message.message}</div>
        </div>

    )
}

export default History;