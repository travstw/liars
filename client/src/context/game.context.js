import React, { createContext, useState, useEffect} from 'react';
import moment from 'moment';
import {v4 as uuidv4 } from 'uuid';

import * as controller from '../controller';

import io from 'socket.io-client';
const socket = io('http://localhost:5000');



export const GameContext = createContext();

export function GameProvider(props) {

    // client bid state
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

    // Server actions...

    const handleCreate = async(username) => {
        controller.create(username).then(game => {
            let toasts = [];
            if (game.error) {
                toasts.push({
                    type: 'error',
                    message: game.error
                });
            }
            setGameState(prevState => {
                const newToasts = [...prevState.toasts, ...toasts]
                game.toasts = newToasts;
                return {...prevState, ...game };
            });

            setUserId(game.userId);
            setGameId(game.gameId);
        });
    }

    const handleJoin = async(username, gameId) => {
        controller.join(username, gameId).then(game => {
            let toasts = [];
            if (game.error) {
                toasts.push({
                    type: 'error',
                    message: game.error
                });
            }
            setGameState(prevState => {
                const newToasts = [...prevState.toasts, ...toasts]
                game.toasts = newToasts;
                return {...prevState, ...game };
            });

            setUserId(game.userId);
            setGameId(game.gameId);
        });
    }

    const handleStart = async (userId, gameId) => {
        controller.start(userId, gameId).then(game => {
            let toasts = [];
            if (game.error) {
                toasts.push({
                    type: 'error',
                    message: game.error
                });
            }
            setGameState(prevState => {
                const newToasts = [...prevState.toasts, ...toasts]
                game.toasts = newToasts;
                return {...prevState, ...game };
            });
        });
    }

    const handleInitialRoll = async (userId, gameId) => {
        controller.initialRoll(userId, gameId).then(game => {
            let toasts = [];
            if (game.error) {
                toasts.push({
                    type: 'error',
                    message: game.error
                });
            }

            setGameState(prevState => {
                const newToasts = [...prevState.toasts, ...toasts]
                game.toasts = newToasts;
                return {...prevState, ...game };
            });
        });
    }

    const handleRoll = async (userId, gameId) => {
        controller.roll(userId, gameId).then(game => {
            let toasts = [];
            if (game.error) {
                toasts.push({
                    type: 'error',
                    message: game.error
                });
            }
            setGameState(prevState => {
                const newToasts = [...prevState.toasts, ...toasts]
                game.toasts = newToasts;
                return {...prevState, ...game };
            });
        });
    }

    const handleBid = async (userId, gameId, bid) => {
        controller.update(userId, gameId, bid)
            .then(game => {
                let toasts = [];
                if (game.error) {
                    toasts.push({
                        type: 'error',
                        message: game.error
                    });
                }
                setGameState(prevState => {
                    const newToasts = [...prevState.toasts, ...toasts]
                    game.toasts = newToasts;
                    return {...prevState, ...game };
                });
        });
    }

    const handleCall = async (userId, gameId) => {
        controller.update(userId, gameId, { type: 'call' })
            .then(game => {
                let toasts = [];
                if (game.error) {
                    toasts.push({
                        type: 'error',
                        message: game.error
                    });
                }
                setGameState(prevState => {
                    const newToasts = [...prevState.toasts, ...toasts]
                    game.toasts = newToasts;
                    return {...prevState, ...game };
                });
        });
    }

    const handleWatch = async (userId, gameId) => {
        controller.watch(userId, gameId).then(game => {
            let toasts = [];
            if (game.error) {
                toasts.push({
                    type: 'error',
                    message: game.error
                });
            }
            setGameState(prevState => {
                const newToasts = [...prevState.toasts, ...toasts]
                game.toasts = newToasts;
                return {...prevState, ...game };
            });
        });
    }

    const handleNextRound = async (userId, gameId) => {
        controller.nextRound(userId, gameId).then(game => {
            let toasts = [];
            if (game.error) {
                toasts.push({
                    type: 'error',
                    message: game.error
                });
            }

            setGameState(prevState => {
                const newToasts = [...prevState.toasts, ...toasts]
                game.toasts = newToasts;
                return {...prevState, ...game };
            });
        });
    }

    const handleLeave = async () => {
        console.log('Leave');
    }

    const handleUpdate = (game) => {
        let toasts = [];
        if (game.winner) {
            toasts.push({
                type: 'winner',
                message: `${game.winner} wins!`,
            })
        }
        if (!game.winner && game.round && game.round.endedOn) {
            toasts.push({
                type: 'loser',
                message: `${game.round.loser} loses a die!`
            })
        }

        setGameState(prevState => {
            const newToasts = [...prevState.toasts, ...toasts]
            game.toasts = newToasts;
            return {...prevState, ...game};
        });
    }

    const handlers = {
        valueChange: handleValueChange,
        countChange: handleCountChange,
        create: handleCreate,
        join: handleJoin,
        bid: handleBid,
        call: handleCall,
        watch: handleWatch,
        nextRound: handleNextRound,
        leave: handleLeave,
        initialRoll: handleInitialRoll,
        roll: handleRoll,
        start: handleStart,
        toasts: []
    }

    const [ userId, setUserId ] = useState('');
    const [ gameId,setGameId] = useState('');
    const [gameState, setGameState] = useState(handlers);
    const count = gameState.toasts.length;

    useEffect(() => {
        console.log('called');
        if (count > 0) {  // prevent this timer from running when there are no toasts
            setTimeout(() => {
                setGameState(prevState => {
                    const toasts = prevState.toasts.slice(1);
                    const newState = {...prevState, toasts };
                    return newState;
                })
            }, 3000);
        }
    }, [count]);

    useEffect(() => {
        if (!gameId || !userId) {
            return;
        }
        socket.emit('join',{ gameId, userId: userId});

        socket.on('update', (game) => {
           handleUpdate(game);
        });
    }, [gameId, userId]);

    return (
        <GameContext.Provider value={gameState}>
            {props.children}
        </GameContext.Provider>
    )
}