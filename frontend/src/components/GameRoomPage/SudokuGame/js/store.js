var Redux = require('redux');
var Boards = require('./boards');
var Sudoku = require('./sudoku');
var cloneDeep = require('lodash.clonedeep');

var Store = Redux.createStore(function(state, action) {
  if (!state) {
    state = {};
  } else {
    state = cloneDeep(state);
  }
  switch (action.type) {
    case 'RESUME_GAME':
      state.game = action.currentGame;
      break;
    case 'NEW_GAME':
      state.game = action.currentGame;
      break;
    case 'CHANGE_VALUE':
      state.game.cells[action.i][action.j].value = action.value;
      break;
    case 'ADD_SECOND':
      if (state.game) {
        const newTime = state.game.time - 1;
        if(newTime > 0){
          state.game.time = newTime;
        }else{
          state.game.time = 0;
          // if(action.completionEvent)
          //   action.completionEvent(state);
        }
      }
      break;
    case 'POPULATE_CURRENT_GAME':
      state.game.cells = Sudoku.populateBoard(state.game.cells, action.newBoard);
      state.game.time = action.currentTime;
      break;
  }
  if (state.game) {
    Sudoku.checkConflicts(state.game.cells);
    localStorage.currentGame = JSON.stringify(state.game);
  }
  return state;
});

module.exports = Store;
