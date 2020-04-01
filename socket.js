const socket = require('socket.io');
const store = require('./store');
const game = require('./game');
let io;
const users = [];


const init = (server) => {
    io = socket(server);

    io.on('connection', (socket) => {
        socket.broadcast.emit('message', 'A user has joined');

        socket.on('join', ({ gameId, userId }) => {
            socket.join(gameId);
            addUser(gameId, userId, socket.id);

            // users aren't connected to the socket until joined... update players with current game
            const game = store.get(gameId);
            updateSocket(gameId, game);

        });

        socket.on('disconnect', () => {
            const user = removeUser(socket.id);
            game.leave(user.userId, user.gameId)
                .then(game => {
                    updateSocket(user.gameId, game);
                });

        });
    });
};

const addUser = (gameId, userId, id) => {
    users.push({
        id,
        userId,
        gameId
    })
}

const removeUser = (id) => {
    const user = users.find(u => u.id === id);
    users = users.filter(u => u.id !== id);

    return user;
}

const getUsersInGame = (gameId) => {
    return users.filter(user => user.gameId === gameId);
}

const updateSocket = (gameId, updatedGame) => {
    const users = getUsersInGame(gameId);
    console.log('users', users);
    users.forEach(user => {
        const decorated = game.decorateClientPayload(user.userId, updatedGame);

        io.to(user.id).emit('update', decorated);
    });

};



module.exports = { init, getUsersInGame, updateSocket };