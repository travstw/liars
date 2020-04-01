
const store = new Map();
const players = new Map();

// Should I just keep latest state or store all states in an array and always fetch the latest?

const create = (id, game) => {
    store.set(id, game);
    return store.get(id);
};

const get = (id) => {
    return store.get(id);
}

const update = (id, game) => {
    store.set(id, game);
    return store.get(id);
}

// We'll keep a cache of active players in active games

const addPlayer = (gameId, userId, first) => {
    const game = players.get(gameId) || [];
    if (!game && !first) {
        throw new Error('Game not found');
    }

    game.push(userId);
    players.set(gameId, game);
}

const removePlayer = (gameId, userId) => {
    let game = players.get(gameId);
    if (!game) {
        throw new Error('Game not found');
    }

    game = game.filter(p => p.userId !== userId);
    players.set(gameId, game);
}

const checkPlayer = (gameId, userId) => {
    const game = players.get(gameId);
    if (!game) {
        throw new Error('Game not found');
    }
    const found = game.find(p => p === userId);

    return !!found;
}

module.exports = { create, get, update, addPlayer, removePlayer, checkPlayer }