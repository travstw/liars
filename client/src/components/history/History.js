import React from 'react';
import {v4 as uuidv4 } from 'uuid';
import './History.css';
import HistoryItem from './history-item/HistoryItem';

function History(props) {
    return (
        <div className="History">
            {props.state.messages.map(m => <HistoryItem key={uuidv4()} message={m} />)}
        </div>

    )
}

export default History;