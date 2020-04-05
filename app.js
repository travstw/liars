const express = require('express')
const bodyParser = require('body-parser')
const game = require('./game');
const store = require('./store');
const app = express();
const server = require('http').Server(app);
const port = 5000;
const socket = require('./socket');

const io = socket.init(server);


// app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());

app.use((req, res, next) => {
    // creating, joining, or watching a game... just pass along
    if ((req.path === '/game' && req.method === 'POST')
        || /\/join/.test(req.path)
        || /\/game\//.test(req.path) && req.method === 'GET') {
        next();
    } else {
        if (!req.headers.userid) {
            res.status(403).send();
        } else {
            next();
        }
    }
});

// Gets existing game
app.get('/game/:gameId', async (req, res, next) => {
    const userId = req.headers.userid;
    const gameId = req.params.gameId;
    try {
        const found = await game.get(gameId);
        const decorated = game.decorateClientPayload(userId, found);
        res.send(decorated);
    } catch(e) {
        next(e);
    }

});

// Join existing game
// returns {user: name, userId}
app.put('/join/:gameId', async (req, res, next) => {
    const { user } = req.body;
    const { gameId } = req.params;

    console.log(user, gameId);
    try {
        const joined = await game.join(user, gameId);
        const player = joined.players.find(p => p.user === user);
        const decorated = game.decorateClientPayload(player.userId, joined);
        res.send(decorated);
    } catch(e) {
        next(e);
    }
});

// create game
app.post('/game', async (req, res, next) => {
    const user = req.body.user;
    try {
        const newGame = await game.create(user);
        const player = newGame.players.find(p => p.user === user);

        const decorated = game.decorateClientPayload(player.userId, newGame);
        res.send(decorated);
    } catch(e) {
        next(e);
    }
});

// update game
//  { gameId: id, type: bid | call, count: 4, value: [1-6]}
app.put('/turn/:gameId', async (req, res, next) => {
    const userId = req.headers.userid;
    const { gameId } = req.params;
    const turn = req.body;
    try {
        if (!store.checkPlayer(gameId, userId)) {
            return res.status(403).send('Not a player in game: ' + gameId);
        }
        const updated = await game.turn(userId, gameId, turn);
        const decorated = game.decorateClientPayload(userId, updated)
        socket.updateSocket(gameId, updated);
        res.send(decorated);
    } catch(e) {
        next(e)
    }
});


//start game
app.put('/game/:gameId/start', async (req, res, next) => {
    const userId = req.headers.userid;
    const gameId = req.params.gameId;
    try {
        if (!store.checkPlayer(gameId, userId)) {
            return res.status(403).send('Not a player in game: ' + gameId);
        }
        const started = await game.start(userId, gameId);
        const decorated = game.decorateClientPayload(userId, started)

        socket.updateSocket(gameId, started);
        res.send(decorated);
    } catch(e) {
        next(e);
    }
});

// round roll
app.put('/roll/:gameId', async (req, res, next) => {
    const userId = req.headers.userid;
    const gameId = req.params.gameId;
    try {
        if (!store.checkPlayer(gameId, userId)) {
            return res.status(403).send('Not a player in game: ' + gameId);
        }
        const rolled = await game.roll(userId, gameId);
        const decorated = game.decorateClientPayload(userId, rolled)

        socket.updateSocket(gameId, rolled);
        res.send(decorated);
    } catch(e) {
        next(e);
    }
});

app.put('/initial-roll/:gameId', async (req, res, next) => {
    const userId = req.headers.userid;
    const gameId = req.params.gameId;
    try {
        if (!store.checkPlayer(gameId, userId)) {
            return res.status(403).send('Not a player in game: ' + gameId);
        }
        const rolled = await game.initialRoll(userId, gameId);
        const decorated = game.decorateClientPayload(userId, rolled)

        socket.updateSocket(gameId, rolled);
        res.send(decorated);
    } catch(e) {
        next(e);
    }
});






server.listen(port, () => console.log(`Jabroni.horse listening on port ${port}!`))







// same user can't make two turns in a row
// one call per round
