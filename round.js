
class Round {
    constructor(players, prevRound) {
        this.players = players.map((p, i) => {
            p.index = i
            return p;
        });
        this.round = prevRound ? prevRound.round + 1 : 1;
        this.rolls = this.players.slice().map(p => {
            p.roll = [];
            return p;
        });
        this.active = false;
        this.turns = [];
        this.endedOn;
        this.startedOn;
        this.natural = false;
        this.called = false;
        this.loser;
    }

    getRound(userId) {
        return {
            round: this.round,
            active: this.active,
            natural: this.natural,
            rolls: this.rolls.map(roll => {
                if (roll.userId === userId) {
                    return {
                        userId: roll.userId,
                        user: roll.user,
                        roll: roll.roll.map(r => {
                            return this.called ? r : '?';
                        })
                    }
                }
                return {
                    user: roll.user,
                    roll: roll.roll.map(r => {
                        return this.called ? r : '?'
                    }),
                }
            }),
            loser: this.loser,
            endedOn: this.endedOn
        }
    }

    getHand(userId) {
        const user = this.rolls.find(roll => roll.userId === userId);
        return (user && user.roll) || [];
    }

    isReadyToStart() {
        if (this.active) {
            return this.active;
        }

        let allRolled = true;

        for (const roll of this.rolls) {
            if (!roll.roll.length) {
                allRolled = false;
                break;
            }
        }

        if (allRolled) {
            this.active = true;
            this.startedOn = Date.now();
            this.setPlayerOrder();
        }

        return this.active;
    }

    addTurn(turn) {
        const user = this.players.find(p => p.userId === turn.userId);
        const t = {
            user: user.user,
            userId: user.userId,
            count: turn.type === 'bid' ? +turn.count: undefined,
            value: turn.type === 'bid' ? +turn.value: undefined,
            type: turn.type
        }
        this.turns.push(t);
        if (turn.type === 'call') {
            this.called = true;
            return;
        }
        this.setPlayerOrder();
    }

    getLastTurn() {
        return this.turns[this.turns.length - 1];
    }

    setPlayerOrder() {
        if (this.active) {
            const last = this.rolls.shift();
            this.rolls.push(last);
        }
    }

    getLowestDicePlayer = () => {
        let lowest;

        this.players.forEach((p, i) => {
            if (!lowest && p.dice) {
                lowest = i;
                return;
            }

            if (p.dice && p.dice < lowest.dice) {
                lowest = i;
            }
        });

        return lowest;
    }

    getLastBid() {
        let bid;
        for (let i = this.turns.length - 1; i >= 0; i--) {
            if (this.turns[i].type === 'bid') {
                bid = this.turns[i];
                break;
            }
        }
        return bid;
    }

    getNextTurn() {
        return this.rolls[0];
    }

    setRoll(userId, roll) {
        const index = this.rolls.findIndex(p => p.userId === userId);
        const player = {...this.rolls[index]};
        player.roll = roll;
        this.rolls.splice(index, 1, player);
    }

    getRoll(userId) {
        return this.rolls.find(roll => roll.userId === userId);
    }

    removeUser(userId) {
        this.players = this.players.filter(p => p.userId !== userId);
        delete this.rolls[userId];
    }

    endRound() {
        this.active = false;
        this.endedOn = Date.now();
    }

    setLoser(loser){
        this.loser = loser;
    }


}

module.exports = Round;