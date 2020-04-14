import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

// const search = new URLSearchParams(window.location.search);
// username = search.get('username');
// $userId.innerHTML = username; // debug

// if (!username) {
//     alert('A user name must be provided');
//     window.location.replace('/index.html');
// }
// gameId = search.get('gameid');

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

