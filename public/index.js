import * as controller from './controller.js';
const socket = io.connect();

// debug
const $multitest = document.querySelector('#multi-test');
const $gameId = document.querySelector('#game-id');
const $userId = document.querySelector('#user-id');
const $game = document.querySelector('#game');
const $rest = document.querySelector('#rest');
const $socket = document.querySelector('#socket');


// Game
let gameState;
let userId;
let username;
let gameId;

const search = new URLSearchParams(window.location.search);
username = search.get('username');
$userId.innerHTML = username; // debug

if (!username) {
    alert('A user name must be provided');
    window.location.replace('/index.html');
}
gameId = search.get('gameid');
$gameId.innerHTML = gameId;

if (!gameId) {
    controller.create(username).then(game => {
        if (game.error) {
            alert(game.error);
            return;
        }
        gameState = game;
        gameId = game.gameId;
        $gameId.innerHTML = gameId;
        userId = game.players[0].userId;

        socket.emit('join',{ gameId, userId});
        update('rest');
    });
} else {
    controller.join(username, gameId).then(game => {
        if (game.error) {
            alert(game.error);
            window.location.replace('/index.html')
            return;
        }
        gameState = game;
        const player = game.players.find(p => p.user === username);
        userId = player.userId;

        socket.emit('join',{ gameId, userId });
        update('rest');
    });
}

//socket handler

socket.on('update', (data) => {
    $socket.innerHTML = JSON.stringify(data);
});

// buttons
// const $leave = document.querySelector('#leave');
const $start = document.querySelector('#start');
const $initialRoll = document.querySelector('#initial-roll');
const $roll = document.querySelector('#roll');
const $bid = document.querySelector('#bid');
const $call = document.querySelector('#call');
const $count = document.querySelector('#count');
const $value = document.querySelector('#value');
const $round = document.querySelector('#round');
const $watch = document.querySelector('#watch');


$start.addEventListener('click', () => {
    controller.start(userId, gameId).then(game => {
        if (game.error) {
            alert(game.error);
            return;
        }

        if (!game) {
            return;
        }
        gameState = game;
        update('rest');
    });
});

$initialRoll.addEventListener('click', () => {
    controller.initialRoll(userId, gameId).then(game => {
        if (game.error) {
            alert(game.error);
            return;
        }

        if (!game) {
            return;
        }
        gameState = game;
        update('rest');
    });
});

$roll.addEventListener('click', () => {
    controller.roll(userId, gameId).then(game => {
        if (game.error) {
            alert(game.error);
            return;
        }

        if (!game) {
            return;
        }
        gameState = game;
        update('rest');
    });
});

$bid.addEventListener('click', () => {
    const bid = {
        type: 'bid',
        count: $count.value,
        value: $value.value
    }

    bid.userId = userId;
    controller.update(userId, gameId, bid).then(game => {
        if (game.error) {
            alert(game.error);
            return;
        }

        if (!game) {
            return;
        }
        gameState = game;
        update('rest');
    });
});

$call.addEventListener('click', () => {
    controller.update(userId, gameId, {type: 'call'}).then(game => {
        if (game.error) {
            alert(game.error);
            return;
        }

        if (!game) {
            return;
        }
        gameState = game;
        update('rest');
    });
});

$round.addEventListener('click', () => {
    controller.nextRound(userId, gameId).then(game => {
        if (game.error) {
            alert(game.error);
            return;
        }

        if (!game) {
            return;
        }
        gameState = game;
        update('rest');
    })
});

$watch.addEventListener('click', () => {
    controller.watch(userId, gameId).then(game => {
        if (game.error) {
            alert(game.error);
            return;
        }

        if (!game) {
            return;
        }
        gameState = game;
        update('rest');
    });
});


const update = (from) => {
    if (from === 'rest') {
        $rest.innerHTML = JSON.stringify(gameState);
    } else {
        $socket.innerHTML = JSON.stringify(gameState);
    }

    $game.innerHTML = '';


}



