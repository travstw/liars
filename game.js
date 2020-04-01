const store = require('./store');
const { v4: uuidv4 } = require('uuid');
const Round = require('./round');


const create = async (user) => {
    const gameId = uuidv4();
    const userId = uuidv4();
    const game = {
        gameId,
        active: false,
        createdBy: user,
        players: [{ user, userId, dice: 5 }],
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
        userId: uuidv4(),
        dice: 5
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
    const user = Object.keys(round[0].players).find(key => {
        return userId === key;
    });
    delete rolls.players[key];
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
    clone.rounds.push(new Round(clone.players));
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

const decorateClientPayload = (userId, game) => {
    let round = game.rounds[game.rounds.length - 1];
    let lastRound;
    if (round && !round.turns.length) {
        lastRound = game.rounds[game.rounds.length - 2];
    }

    console.log(game.rounds);

    return {
        gameId: game.gameId,
        currentBid: round ? round.getLastBid(): undefined,
        lastTurn: lastRound ? lastRound.getLastTurn(): round ? round.getLastTurn(): undefined,
        nextTurn: round ? round.getNextTurn(): undefined,
        round: round ? round.getRound(userId): undefined,
        players: game.players.map(p => {
            if (p.userId === userId) {
                return p;
            }
            return {
                user: p.user,
                dice: p.dice
            };
        }),
        message: 'message',
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


module.exports = { create, decorateClientPayload, get, join, leave, roll, start, turn };

