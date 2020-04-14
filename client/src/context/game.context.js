import React, { createContext, useState} from 'react';
import moment from 'moment';



export const GameContext = createContext();

export function GameProvider(props) {

    const handleStart = () => {
        console.log('start');
    }

    const handleValueChange = (value) => {
        setGameState(prevState => {
            return {...prevState, value }
        });
    }

    const handleCountChange = (count) => {
        setGameState(prevState => {
            return {...prevState, count}
        });
    }

    const handleBid = () => {
        console.log('BID');
    }

    const handleCall = () => {
        console.log('CALL');
    }

    const handleWatch = () => {
        console.log('Watch');
    }

    const handleLeave = () => {
        console.log('Leave');
    }

    const handleRoll = () => {
        console.log('Roll');
    }

    const testState = {
        active: true,
        gameId: '4545-656565-6565',
        gameStateId: '45454',
        userId: '33432-66565-7565',
        players: [
          { user: 'Scott', dice: 3},
          { user: 'CJ', dice: 4},
          { user: 'Mike', dice: 5},
          { user: 'Natasya', dice: 2}
        ],
        round: {
          round: 2,
          rolls: [
            { user: 'Scott', roll: [5, 4, 6] },
            { user: 'CJ', roll: [3, 2, 4, 5] },
            { user: 'Mike', roll: [3, 2, 5, 5, 5] },
            { user: 'Natasya', roll: [2, 1]},
            { user: 'bob', roll: [5, 4, 6] },
            { user: 'PHil', roll: [3, 2, 4, 5] },
            { user: 'Pancakes', roll: [3, 2, 5, 5, 5] },
            { user: 'Bobo', roll: [2, 1]},
            { user: 'Stan', roll: [5, 4, 6] },
            { user: 'Sandie', roll: [3, 2, 4, 5] },
            { user: 'bleep bloop', roll: [3, 2, 5, 5, 5] },
            { user: 'Sammie', roll: [2, 1]}
          ],
          turns: [],
          natural: false,
        },
        messages: [{time: moment().format('HH:mm:ss'), message: 'Scott rules'}, {time: moment().format('HH:mm:ss'), message: 'CJ drools'}],
        count: 5,
        value: 6,
        lastBidCount: 5,
        lastBidValue: 6,
        hand: [2, 4, 6],
        valueChange: handleValueChange,
        countChange: handleCountChange,
        bid: handleBid,
        call: handleCall,
        watch: handleWatch,
        leave: handleLeave,
        roll: handleRoll,
        start: handleStart,
        winner: undefined,
        watcher: true,
        rolling: false,
      }
    const [gameState, setGameState] = useState(testState);

    return (
        <GameContext.Provider value={gameState}>
            {props.children}
        </GameContext.Provider>
    )
}