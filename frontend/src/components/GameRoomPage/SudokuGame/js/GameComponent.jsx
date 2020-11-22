import React from 'react';
import Store from './store';
import Sudoku from './sudoku';
import Boards from './boards';
import '../css/main.css'

class Cell extends React.Component {
  constructor(props) {
    super(props);

    this.onClick = this.onClick.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  shouldComponentUpdate(newProps, newState) {
    var oldCell = this.props.cell;
    var newCell = newProps.cell;
    return (
      oldCell.value !== newCell.value ||
      oldCell.editable !== newCell.editable ||
      oldCell.hasConflict !== newCell.hasConflict
    );
  }

  render() {
    var cell = this.props.cell;

    var classes = [];
    classes.push('i' + cell.i);
    classes.push('j' + cell.j);
    classes.push(cell.editable ? 'editable' : 'not-editable');
    classes.push(cell.hasConflict ? 'has-conflict' : 'no-conflict');

    return (
      <td className={classes.join(' ')}>
        <input
          type="tel"
          value={cell.value}
          onClick={this.onClick}
          onChange={this.onChange} 
          className="browser-default cell"/>
      </td>
    );
  }

  onClick(event) {
    event.preventDefault();
    if (this.props.cell.editable) {
      event.target.select();
    } else {
      event.target.blur();
    }
  }

  onChange(event) {
    event.preventDefault();
    var cell = this.props.cell;
    if (!cell.editable) {
      return;
    }
    var newValue = event.target.value;
    if (newValue !== '' && !/^[1-9]$/.test(newValue)) {
      event.target.value = cell.value;
      return;
    }
    Store.dispatch({
      type: 'CHANGE_VALUE',
      i: cell.i,
      j: cell.j,
      value: newValue === '' ? null : parseInt(newValue)
    });
  }
}

// class Controls extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = Store.getState();
//   }

//   componentDidMount() {
//     var self = this;
//     self.unsubscribe = Store.subscribe(function () {
//       self.setState(Store.getState());
//     });
//   }

//   componentWillUnmount() {
//     this.unsubscribe();
//   }

//   render() {
//     var time = this.state.game.time;
//     function f(num) {
//       if (num < 10) {
//         return '0' + num;
//       } else {
//         return '' + num;
//       }
//     }
//     return (
//       <div className="controls">
//         <p><a onClick={}>Back</a></p>
//         {Sudoku.isComplete(this.state.game.cells)
//           ? <p className="congratulations">Congratulations!</p>
//           : <p>{f(time.getHours()) + ':' + f(time.getMinutes()) + ':' + f(time.getSeconds())}</p>}
//       </div>
//     )
//   }
// }

export class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = Store.getState();
  }

  componentDidMount() {
    var self = this;
    this.unsubscribe = Store.subscribe(function () {
      self.setState(Store.getState());
    });

    this.addSecond = setInterval(function () {
      Store.dispatch({ type: 'ADD_SECOND' });
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.addSecond);
    this.unsubscribe();
  }

  render() {
    console.log(this.state.game);
    return (
      <div>
        <table className="sudoku-table">
          <tbody>
            {this.state.game.cells.map(function (line, i) {
              return (
                <tr key={i}>
                  {line.map(function (cell) {
                    return <Cell cell={cell} key={cell.j+cell.i} />;
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }
}
