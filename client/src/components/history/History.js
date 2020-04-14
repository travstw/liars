import React, { useContext } from 'react';
import {v4 as uuidv4 } from 'uuid';
import './History.css';
import HistoryItem from './history-item/HistoryItem';
import { GameContext } from '../../context/game.context';


function History(props) {
    const { messages } = useContext(GameContext);
    return (
        <div className="History">
            {messages.map(m => <HistoryItem key={uuidv4()} message={m} />)}
        </div>

    )
}

export default History;