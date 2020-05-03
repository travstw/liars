import React, { useContext, useState }from 'react';
import './Login.css';
import { GameContext } from '../../context/game.context';

function Login() {
    const data = {
        username: '',
        gameId: ''
    };
    const [ loginData, setLoginData ] = useState(data);
    const { create, join } = useContext(GameContext);

    const handleUserChange = (e) => {
        const username = e.target.value;
        setLoginData(prevState => {
           return {...prevState, username };
        });
    }

    const handleGameIdChange = (e) => {
        const gameId = e.target.value;
        setLoginData(prevState => {
            return {...prevState, gameId };
        });
    }

    const handleSubmit = () => {
        if (loginData.gameId) {
            join(loginData.username, loginData.gameId);
            return;
        }

        create(loginData.username);
    }

    const handleKeyDown = (e) => {
        console.log(e);
    }

    return (
        <div className="Login">
            <div className="Login-container">
                <div className="Login-item">
                    <div className="Login-title">
                        JABR<i className="Login-die fas fa-dice-one"></i>NI DICE
                    </div>
                </div>
                <input
                    className="Login-item Login-input"
                    type='text'
                    minLength="2"
                    placeholder="User"
                    value={ loginData.username }
                    onChange={ handleUserChange }
                >
                </input>
                <input
                    className="Login-item Login-input"
                    type='text'
                    minLength="2"
                    placeholder="Game ID"
                    onChange={ handleGameIdChange }
                    value={ loginData.gameId }
                >
                </input>
                <button
                    className="Login-item Login-button"
                    onClick={ handleSubmit }
                    disabled={ !loginData.username }
                >
                    { loginData.gameId ? 'Join' : 'Create' }
                </button>
            </div>

        </div>
    )
}



export default Login;