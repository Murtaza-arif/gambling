import React from 'react';
import "./styles.css";

class App extends React.Component {
  state = {
    balance: 100,
    dices: [
      {
        name: 1,
        bet: 0,
        selected: false
      },
      {
        name: 2,
        bet: 0,
        selected: false
      },
      {
        name: 3,
        bet: 4,
        selected: false
      },
      {
        name: 4,
        bet: 0,
        selected: false
      },
      {
        name: 5,
        bet: 0,
        selected: false

      },
      {
        name: 6,
        bet: 9,
        selected: false
      }
    ],
    currentBets: new Set(),
    winDice: null,
    net: 0,
    timer: 10
  }
  interval
  constructor(props) {
    super(props);

  }
  add = (bet) => {
    this.setState((state => {
      let currentBets = state.currentBets
      let dices = state.dices
      if (state.timer != 0) {
        currentBets.add(bet)
        dices = dices.map((d) => {
          if (bet.name == d.name) {
            d.selected = true
          }
          return d
        })
      }

      return ({ ...state, dices, currentBets })
    }))
  }
  generateRandomInteger = (min, max) => {
    return Math.floor(min + Math.random() * (max - min + 1))
  }
  componentDidMount() {
    this.start()
  }
  start = () => {
    if (this.interval) return
    this.interval = setInterval(() => {
      this.setState((state => {
        let timer = state.timer - 1
        if (timer == 0) {
          clearInterval(this.interval)
          setTimeout(() => {
            this.result()
          }, 2000);
        }
        return ({ ...state, timer })
      }))
    }, 1000);
  }
  result = () => {
    let win = this.generateRandomInteger(1, 6)

    this.setState((state => {
      console.log("call result")
      if (state.net == 0) {
        let winDice = this.state.dices.find((d) => d.name == win)
        let net = 0
        console.log(state.currentBets)
        for (const item of state.currentBets.keys()) {
          if (item.name == winDice.name) {
            net = net + item.bet * 2
          } else {
            net = net - item.bet * 2
          }
        }
        let balance = state.balance + net
        console.log(balance);
        setTimeout(() => {
          this.reset()
          this.start()
        }, 5000);
        return ({ ...state, winDice, net, balance })

      }
      return ({ ...state })

    }))
  }
  reset = () => {
    clearInterval(this.interval)
    this.interval = null
    this.setState((state => {
      return ({
        ...state, timer: 10, net: 0, winDice: null,
        dices: state.dices.map((d) => { return { ...d, selected: false } }),
        currentBets: new Set()
      })
    }))
  }

  render() {
    return (
      <div className="App">
        <h1>Gambling</h1>
        <h2>Balance: ${this.state.balance}</h2>
        <hr></hr>
        <div>Timer : {this.state.timer} Seconds</div>
        <br></br>
        <div className='d-flex text-center d-flex justify-content-center'>
          {this.state.dices.map(dice => (
            <div onClick={() => this.add(dice)} className={`${this.state.timer == 0 ? 'btn-disabled' : 'btn'} click mx-3
             p-2 border
             border-primary ${this.state.winDice && this.state.winDice.name == dice.name ? 'winner' : ''}`} key={dice.name}>
              <div>Dice {dice.name}</div>
              <div>Bet: ${dice.bet}</div>
              <div>{dice.selected ? 'Selected' : ''}</div>
            </div>
          ))}
        </div>
        {
          this.state.winDice ? <div>
            <div>Win Move: Dice {this.state.winDice?.name}</div>
            <div>Amount {this.state.net > 0 ? 'Win' : 'Lose'} : ${this.state.net}</div>
          </div> : <div></div>
        }

      </div>
    );
  }
}

export default App