
class Round {
    constructor(players, prevRound) {
        this.players = players;
        this.round = prevRound ? prevRound.round + 1 : 1;
        this.rolls = {};
        this.active = false;
        this.turns = [];
        this.endedOn;
        this.startedOn;
        this.natural = false;
    }

    getRound(userId) {
        return {
            round: this.round,
            active: this.active,
            natural: this.natural,
            rolls: Object.keys(this.rolls).reduce((acc, curr) => {
                const user = this.players.find(p => p.userId === curr);
                acc[user.user] = this.rolls[curr].map(roll => {
                    console.log('roll', roll);
                    if (curr === userId) {
                        return roll;
                    } else {
                        return '?';
                    }
                });
                return acc;
            }, {})
        }
    }

    isReadyToStart() {
        if (this.active) {
            return this.active;
        }

        const activePlayers = this.players.filter(p => p.dice > 0);
        if (activePlayers.length === Object.keys(this.rolls).length) {
            this.active = true;
        }
        this.startedOn = Date.now();
        return this.active;
    }

    addTurn(turn) {
        const t = {
            userId: turn.userId,
            count: +turn.count,
            value: +turn.value,
            type: turn.type
        }
        this.turns.push(t);
    }

    getLastTurn() {
        return this.turns[this.turns.length - 1];
    }

    getNextTurn() {
        if (!this.turns.length) {
            return this.players[0];
        }
        const lastTurn = this.getLastTurn()
        const index = this.players.findIndex(p => p.userId === lastTurn.userId) + 1;
        return this.players[index];
    }

    getLastBid() {
        let bid;
        for (let i = this.turns.length - 1; i > 0; i--) {
            if (this.turns[i].type === 'bid') {
                bid = this.turns[i];
                break;
            }
        }
        return bid;
    }

    setRoll(userId, roll) {
        this.rolls[userId] = roll;
    }

    getRoll(userId) {
        return this.rolls[userId];
    }

    removeUser(userId) {
        this.players = this.players.filter(p => p.userId !== userId);
        delete this.rolls[userId];
    }

    endRound() {
        this.active = false;
        this.endedOn = Date.now();
    }


}

module.exports = Round;