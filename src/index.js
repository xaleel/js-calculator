import React, { Component } from 'react';
import ReactDOM from 'react-dom';

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      tempNum: [],
      expression: [],
      lastPressed: '0',
      results: false
    }
  }   

  componentDidMount() {
    let buttons = document.querySelectorAll('h4')
    buttons.forEach((el) => {
      el.addEventListener('click', () => {
        this.clicked(el)
      })});
    document.addEventListener('keydown', ev => {
      let ids = {
        'Digit0': 'zero', 'Digit1': 'one', 'Digit2': 'two', 'Digit3': 'three',
        'Digit4': 'four', 'Digit5': 'five', 'Digit6': 'six', 'Digit7': 'seven', 
        'Digit8': 'eight', 'Digit9': 'nine', 'Numpad0': 'zero', 'Numpad1': 'one',
        'Numpad2': 'two', 'Numpad3': 'three', 'Numpad4': 'four', 'Numpad5': 'five',
        'Numpad6': 'six', 'Numpad7': 'seven', 'Numpad8': 'eight', 'Numpad9': 'nine',
        'Minus': 'subtract', 'NumpadSubtract': 'subtract', 'Equal': 'equals', 'Enter': 'equals',
        'NumpadDivide': 'divide', 'NumpadMultiply': 'multiply', 'Period': 'decimal', 'Backspace': 'clear'
      };
      let element = document.getElementById(ids[ev.code])
      if (element){
        element.click();
      }
      return;
    })
  }

  clicked = (e) => {
    if ((this.state.expression.length > 24 || this.state.tempNum.length > 12) && e.innerHTML !== 'AC' && e.innerHTML !== '='){
      this.setState({
        lastPressed: 'Limit exceeded', 
        expression: this.state.expression[this.state.expression.length - 1].slice(0, this.state.expression[this.state.expression.length - 1].length - 1),
        tempNum: this.state.tempNum.slice(0, this.state.tempNum.length - 2)
      });
      return;
    }
    if (e.innerHTML === 'AC' || (this.state.results && !isNaN(Number.parseInt(e.innerHTML)))){
      this.setState({
        expression: [],
        lastPressed: '0',
        tempNum: [],
        results: false
      })
    } else if (e.innerHTML === '.'){
      this.setState(!this.state.tempNum.find(x => x === '.') ? {
        expression: isNaN(Number.parseInt(this.state.expression.slice(this.state.expression.length - 1))) ? 
        [...this.state.expression, '0' + e.innerHTML]
        : [...this.state.expression.slice(0, this.state.expression.length - 1),
          this.state.expression.slice(this.state.expression.length - 1) + e.innerHTML],
          lastPressed: e.innerHTML,
          tempNum: [...this.state.tempNum, e.innerHTML]
      } : {})
    } else if (isNaN(Number.parseInt(e.innerHTML)) && e.innerHTML !== '=') {
      if (this.state.results){
        this.setState({
          expression: [this.state.lastPressed, e.innerHTML],
          lastPressed: e.innerHTML,
          results: false,
          tempNum: []
        }); 
        return;
      }
      if (this.state.expression.length < 1 && e.innerHTML !== '-'){
        return;
      }
      if (!isNaN(Number.parseInt(this.state.lastPressed)) || (this.state.lastPressed !== '-' && e.innerHTML === '-')){
        this.setState({
          expression: [...this.state.expression, e.innerHTML],
          tempNum: this.state.tempNum.length < 1 && e.innerHTML === '-' ? ['-'] : [],
          lastPressed: e.innerHTML,
        })
      } else {
        this.setState({
          expression: this.state.tempNum.length < 1 ? this.state.expression.slice(0, this.state.expression.length - 1).concat(e.innerHTML)
          : this.state.expression.slice(0, this.state.expression.length - 2).concat(e.innerHTML),
          lastPressed: e.innerHTML,
          tempNum : this.state.tempNum.length === 1 && this.state.tempNum[0] === '-' ? [] : this.state.tempNum
        })
      }
    } else if (e.innerHTML === '=') {
      if (this.state.results){
        document.getElementById('clear').click();
        return;
      }
      let exp = [...this.state.expression];
      if(!/\w/.test(exp[exp.length - 1])){
        exp.pop();
      }
      while (true){  // eval all * and / first
        for (let n = 0; n < exp.length; n++){
          if (exp[n] === 'x'){
            exp[n + 1] = Number.parseFloat(exp[n - 1]) * Number.parseFloat(exp[n + 1]);
            exp.splice(n - 1, 2);
            break;
          }
          if (exp[n] === '/'){
            exp[n + 1] = Number.parseFloat(exp[n - 1]) / Number.parseFloat(exp[n + 1]);
            exp.splice(n - 1, 2);
            break;
          }
        }
        if (!exp.find(x => x === 'x') && !exp.find(x => x === '/')){
          break;
        }
      }
      while (true){  // then + and -
        for (let n = 0; n < exp.length; n++){
          if (exp[n] === '+'){
            exp[n + 1] = Number.parseFloat(exp[n - 1]) + Number.parseFloat(exp[n + 1]);
            exp.splice(n - 1, 2);
            break;
          }
          if (exp[n] === '-'){
            exp[n + 1] = Number.parseFloat(exp[n - 1]) - Number.parseFloat(exp[n + 1]);
            exp.splice(n - 1, 2);
            break;
          }
        }
        if (!exp.find(x => x === '+') && !exp.find(x => x === '-')){
          break;
        }
      }
      this.setState({
        expression: this.state.expression.concat(' = '),
        lastPressed: exp[0],
        results: true
      })
    } else {  // if you're reading this, I sincerely apologize
      this.setState({
        expression: this.state.tempNum.length === 1 && this.state.tempNum[0] === '0' ? [...this.state.expression.slice(0, this.state.expression.length - 1), e.innerHTML] // 0 => e.innerHTML
        : isNaN(Number.parseInt(this.state.expression.slice(this.state.expression.length - 1))) && this.state.expression.slice(this.state.expression.length - 1)[0] !== '-' && this.state.tempNum.length === 0 ? 
        [...this.state.expression, e.innerHTML] // ['1', '+'] (not '-') => ['1', '+', 'e.innerHTML']
        : isNaN(Number.parseInt(this.state.expression.slice(this.state.expression.length - 1))) && this.state.tempNum.length === 0 ? 
        [...this.state.expression, e.innerHTML] : [...this.state.expression.slice(0, this.state.expression.length - 1), this.state.expression.slice(this.state.expression.length - 1) + e.innerHTML],
        lastPressed: e.innerHTML,
        tempNum: this.state.tempNum.length === 1 && this.state.tempNum[0] === '0' ? [e.innerHTML] : [...this.state.tempNum, e.innerHTML]
      })
    } 
  }

  render(){
    return (
      <div id='calculator'>
        <div id='topScreen'>
          <h3> {this.state.expression} </h3>
          <h3 id='display'> {this.state.lastPressed} </h3>
        </div>
        <div id='buttons'>
          <h4 id='clear'>AC</h4>
          <h4 id='divide'>/</h4>
          <h4 id='multiply'>x</h4>
          <h4 id='seven'>7</h4>
          <h4 id='eight'>8</h4>
          <h4 id='nine'>9</h4>
          <h4 id='subtract'>-</h4>
          <h4 id='four'>4</h4>
          <h4 id='five'>5</h4>
          <h4 id='six'>6</h4>
          <h4 id='add'>+</h4>
          <h4 id='one'>1</h4>
          <h4 id='two'>2</h4>
          <h4 id='three'>3</h4>
          <h4 id='equals'>=</h4>
          <h4 id='zero'>0</h4>
          <h4 id='decimal'>.</h4>
        </div>
      </div>
    )
  }
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
