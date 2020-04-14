// const host = 'http://localhost:3000';   // move to config

export const get = async (userId, gameId) => {
    const url = 'game/' + gameId;
    try {
        const res = await fetch(url, {
            method: 'GET',
            headers: {
                'userid': userId
            }
        });

        return await res.json();
    } catch (e) {
        console.error(e);
    }

};

export const join = async (user, gameId) => {
    const url = 'join/' + gameId;
    let res;
    try {
        res = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ user: user })
        });

        if (!res.ok) {
            return { error: 'An error occured joining the game'};
        }

       return await res.json();

    } catch (e) {
        console.error(e);
    }

};

export const create = async (user) => {
    const url = 'game';
    try {
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ user: user })
        });
        if (!res.ok) {
            return { error: 'An error occured creating the game'};
        }

        return await res.json();
    } catch (e) {
        console.error(e);
    }
};

export const update = async (userId, gameId, turn) => {
    const url = 'turn/' + gameId;
    try {
        const res = await fetch(url, {
            method: 'PUT',
            headers: {
                'userid': userId,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(turn)
        });

        if (!res.ok) {
            return { error: 'An error occured processing your turn, please try again'};
        }

        return await res.json();
    } catch (e) {
        console.error(e);
    }
};

export const start = async (userId, gameId) => {
    const url = 'game/' + gameId + '/start';
    try {
        const res = await fetch(url, {
            method: 'PUT',
            headers: {
                'userid': userId,
                'Content-Type': 'application/json'
            }
        });

        if (!res.ok) {
            return { error: 'An error occured starting the game, please try again'};
        }

        return await res.json();
    } catch (e) {
        console.error(e);
    }
};

export const roll = async (userId, gameId) => {
    const url = 'roll/' + gameId;
    try {
        const res = await fetch(url, {
            method: 'PUT',
            headers: {
                'userid': userId,
                'Content-Type': 'application/json'
            }
        });

        if (!res.ok) {
            return { error: 'An error occured processing your roll, please try again'};
        }

        return await res.json();
    } catch (e) {
        console.error(e);
    }
};

export const initialRoll = async (userId, gameId) => {
    const url = 'initial-roll/' + gameId;
    try {
        const res = await fetch(url, {
            method: 'PUT',
            headers: {
                'userid': userId,
                'Content-Type': 'application/json'
            }
        });

        if (!res.ok) {
            return { error: 'An error occured processing your roll, please try again'};
        }

        return await res.json();
    } catch (e) {
        console.error(e);
    }
};