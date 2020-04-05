import React, { Component } from 'react';
import './App.css';
import moment from 'moment';
import Header from './components/header/Header';
import Summary from './components/summary/Summary';
import Players from './components/players/Players';
import History from './components/history/History';
import Turn from './components/turn/Turn';
import Hand from './components/hand/Hand';

class App extends Component {

  handleValueChange = (value) => {
    this.setState({ value });
  }

  handleCountChange = (count) => {
    this.setState({ count });
  }

  handleBid = () => {
    console.log(this.state.count, this.state.value);
  }

  handleCall = () => {
    console.log('CALL');
  }

  handleWatch = () => {
    console.log('Watch');
  }

  handleLeave = () => {
    console.log('Leave');
  }

  handleRoll = () => {
    console.log('Roll');
  }

  state = {
    gameId: '4545-656565-6565',
    userId: '33432-66565-7565',
    players: [
      { user: 'Scott', dice: 3},
      { user: 'CJ', dice: 4},
      { user: 'Mike', dice: 5},
      { user: 'Natasya', dice: 2}
    ],
    round: {
      round: 2,
      rolls: [
        { user: 'Scott', roll: [5, 4, 6] },
        { user: 'CJ', roll: [3, 2, 4, 5] },
        { user: 'Mike', roll: [3, 2, 5, 5, 5] },
        { user: 'Natasya', roll: [2, 1]},
        { user: 'bob', roll: [5, 4, 6] },
        { user: 'PHil', roll: [3, 2, 4, 5] },
        { user: 'Pancakes', roll: [3, 2, 5, 5, 5] },
        { user: 'Bobo', roll: [2, 1]},
        { user: 'Stan', roll: [5, 4, 6] },
        { user: 'Sandie', roll: [3, 2, 4, 5] },
        { user: 'bleep bloop', roll: [3, 2, 5, 5, 5] },
        { user: 'Sammie', roll: [2, 1]}
      ],
      turns: [],
      natural: true,
    },
    messages: [{time: moment().format('HH:mm:ss'), message: 'Scott rules'}, {time: moment().format('HH:mm:ss'), message: 'CJ drools'}],
    count: 5,
    value: 6,
    lastBidCount: 5,
    lastBidValue: 6,
    hand: [1, 2, 4, 5, 6],
    valueChange: this.handleValueChange,
    countChange: this.handleCountChange,
    bid: this.handleBid,
    call: this.handleCall,
    watch: this.handleWatch,
    leave: this.handleLeave,
    roll: this.handleRoll,
    winner: undefined,
    watcher: true,
    rolling: false,
  }

  componentDidMount() {

  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <Header state={this.state}/>
        </div>
        <div className="App-container">
          <div className="App-left-panel">
            <div className="App-summary">
              <Summary state={this.state}/>
            </div>
            <div className="App-players">
              <Players state={this.state}/>
            </div>
            <div className="App-hand">
              <Hand state={this.state}/>
            </div>
          </div>
          <div className="App-right-panel">
            <div className="App-right-panel-item App-history">
              <History state={this.state}/>
            </div>
            <div className="App-right-panel-item App-turn">
              <Turn state={this.state} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}


export default App;
