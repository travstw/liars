const store = require('./store');
const { v4: uuidv4 } = require('uuid');
const shortId = require('shortid');
const Round = require('./round');


const create = async (user) => {
    const gameId = shortId.generate();
    const userId = shortId.generate();
    const game = {
        gameId,
        active: false,
        createdBy: user,
        players: [{ user, userId, dice: 5, initialRoll: null }],
        rounds: [],
        natural: false
    };
    const saved = await store.create(gameId, game);
    store.addPlayer(gameId, userId, true);

    return saved;
};

const get = async (gameId) => {
    const game = await store.get(gameId);
    if (!game) {
        throw new Error('Game not found');
    }
    return game;
};

const join = async (user, gameId) => {
    const game = await store.get(gameId);
    if (!game) {
        throw new Error('Game not found');
    }
    if (game.startedOn) {
        throw new Error('Cannot join a game that has already started');
    }
    const found = game.players.find((u) => u.user === user);
    if (found) {
        throw new Error(`User with name ${user} already exists.`);
    }
    const clone = {...game};
    const newUser = {
        user,
        userId: shortId.generate(),
        dice: 5,
        initialRoll: null
    }
    clone.players.push(newUser);
    const updated = await store.update(gameId, clone);
    store.addPlayer(gameId, newUser.userId);

    return updated;
};

const leave = async (userId, gameId) => {
    const game = await store.get(gameId);
    if (!game) {
        throw new Error('Game not found');
    }

    if (game.endedOn) {
        throw new Error('Game has already ended');
    }

    const clone = {...game};
    clone.players = clone.players.filter(p => p.userId !== userId);

    // Remove the rolls from the active round.
    const round = clone.rounds[clone.rounds.length - 1];
    if (round) {
        const key = Object.keys(round[0].players).find(k => {
            return userId === k;
        });
        delete rolls.players[key];
    }

    const updated = await store.update(gameId, clone);
    store.removePlayer(gameId, userId);

    return updated;
}

const start = async (userId, gameId) => {
    const game = await store.get(gameId);
    if (!game) {
        throw new Error('Game not found');
    }
    if (game.startedOn) {
        throw new Error('Game already started');
    }
    const clone = {...game};
    clone.active = true;
    clone.startedOn = Date.now();
    const started = await store.update(gameId, clone);

    return started;
};


const turn = async (userId, gameId, turn) => {
    const game = await store.get(gameId);
    if (!game) {
        throw new Error('Game not found');
    }

    if (!game.startedOn) {
        throw new Error('Cannot take a turn before game has started');
    }

    const round = game.rounds[game.rounds.length - 1];

    const ready = round.isReadyToStart();
    if (!ready) {
        throw new Error('Not all users have rolled in this round');
    }
    const nextTurn = round.getNextTurn();
    if (nextTurn.userId !== userId) {
        throw new Error('Not your turn');
    }

    const lastTurn = round.getLastTurn();

    if (lastTurn && lastTurn.type === 'call' && turn.type === 'call') {
        throw new Error('Only one call can be made per round');
    }

    if (lastTurn && userId === lastTurn.userId) {
        throw new Error('Same player cannot take two turns in a row');
    }

    if (!lastTurn && turn.type === 'call') {
        throw new Error('Cannot call before a bid exists');
    }

    // if the bid is aces on the first turn of the round, aces are no longer wild
    if (!lastTurn && +turn.value === 1) {
        round.natural = true;
    }

    if (turn.type === 'bid') {
        validateBid(turn, lastTurn);
    }

    round.addTurn({userId, ...turn});

    const clone = {...game};

    // end of round
    if (turn.type === 'call') {
        updateGameState(clone);
    }

    const updated = await store.update(gameId, clone);
    return updated;

};

const initialRoll = async (userId, gameId) => {
    const game = await store.get(gameId);
    if (!game) {
        throw new Error('Game not found');
    }

    if (!game.startedOn) {
        throw new Error('Cannot roll before game has started');
    }

    const player = game.players.find(p => p.userId === userId);

    if (player.initialRoll) {
        throw new Error('Already rolled');
    }
    player.initialRoll = Math.floor(Math.random() * (6 - 1)) + 1;
    const clone = {...game};

    const allRolled = haveAllPlayersRolled(clone.players);
    if (allRolled) {
        const previousRound = clone.rounds[clone.rounds.length -1];
        clone.rounds.push(new Round(clone.players, previousRound));
        clone.players = clone.players.sort(sortPlayerTurns);
    }

    const updated = await store.update(gameId, clone);
    return updated;

}

const haveAllPlayersRolled = (players) => {
    let rolled = true;
    players.forEach(p => {
        if (!p.initialRoll) {
            rolled = false;
        }
    });

    return rolled;
}

const roll = async (userId, gameId) => {
    const game = await store.get(gameId);
    if (!game) {
        throw new Error('Game not found');
    }

    if (!game.startedOn) {
        throw new Error('Cannot roll before game has started');
    }
    const clone = {...game};

    const round = clone.rounds[clone.rounds.length - 1];
    const user = clone.players.find(p => p.userId === userId);
    const userRound = round.getRoll[userId];
    if (userRound) {
        throw new Error('User already rolled this round');
    }
    const numDice = user.dice;

    const roll = [];
    for (let i = 0; i < numDice; i++) {
        roll.push(Math.floor(Math.random() * (6 - 1)) + 1);
    }

    round.setRoll(userId, roll);

    const updated = await store.update(gameId, clone);

    return updated;
};

const updateGameState = (game) => {
    const round = game.rounds[game.rounds.length - 1];
    const rolls = round.rolls;
    const bid = round.getLastBid();
    const call = round.getLastTurn(); // only in this method if last turn is 'call'
    const dice = Object.keys(rolls).map(p => rolls[p])
        .reduce((acc, curr) => {
            acc = acc.concat(curr);
            return acc;
        }, []);

    const total = dice.reduce((acc, curr) => {
        if (curr === bid.value) {
            acc++;
        }

        // Aces are wild unless game has gone natural
        if (!round.natural && curr === 1) {
            acc++;
        }
        return acc;
    }, 0);

    // call successful
    if (total < bid.count) {
        call.status = 'success';
        const loser = game.players.find(p => p.userId === bid.userId);
        loser.dice--;
    } else {
        call.status = 'failure';
        const loser = game.players.find(p => p.userId === call.userId);
        loser.dice--;
    }

    const alive = game.players.reduce((acc, curr) => {
        if (curr.dice > 0) {
            acc.push(curr);
        }
        return acc;
    }, []);

    if (alive.length === 1) {
        game.endedOn = Date.now();
        game.winner = alive[0].user;
        return;
    }

    // start new round if game is still going
    round.endRound();
    game.rounds.push(new Round(game.players, round));
};

const decorateClientPayload = (userId, game, gameStateId) => {
    let round = game && game.rounds && game.rounds[game.rounds.length - 1];
    let lastRound;
    if (round && !round.turns.length) {
        lastRound = game.rounds[game.rounds.length - 2];
    }

    const currentBid = round ? round.getLastBid(): undefined;

    return {
        gameId: game.gameId,
        gameStateId: gameStateId ? gameStateId: shortId.generate(),
        userId: userId,
        lastBidCount: currentBid && currentBid.count,
        lastBidValue: currentBid && currentBid.value,
        round: round ? round.getRound(userId): undefined,
        players: game.players.map(p => {
            if (p.userId === userId) {
                return p;
            }
            return {
                user: p.user,
                dice: p.dice,
                initialRoll: p.initialRoll
            };
        }),
        hand: [],
        message: ['message'],
        winner: game.winner,
        startedOn: game.startedOn,
        endedOn: game.endedOn,
        active: game.active
    }
};

const validateBid = (currentTurn, lastTurn) => {
    let error = false;


    if (lastTurn && currentTurn.count < lastTurn.count) {
        error = true;
    }

    // same count, but value is <=
    if (lastTurn && currentTurn.count === lastTurn.count
        && currentTurn.value <= lastTurn.value) {
            error = true;
    }

    if (error) {
        throw new Error('Invalid Bid. Bid must increase in count or dice value');
    }

    return error;
};

const sortPlayerTurns = (a, b) => {
    if (a.initialRoll > b.initialRoll) return -1;
    if (b.initialRoll > a.initialRoll) return 1;
    if (a.user.toLowerCase() > b.user.toLowerCase()) return -1;
    if (b.user.toLowerCase() > a.user.toLowerCase()) return 1;

    return 0;
};

const setPlayOrder = (game) => {
    const players = [...game.players];
    const lastTurn = players.shift();
    players.push(lastTurn);
    game.players = players;

    return game;
}


module.exports = { create, decorateClientPayload, get, join, leave, initialRoll, roll, start, turn };

