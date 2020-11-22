import React, { useEffect, useState } from 'react';
import PuzzleImg from './puzzleimg';
import './puzzleimg.css';

const Game = ({ exit, about, submit, game, changeGame, answered, changeAnswered, paused, submitGame, inGame, changeLoading }) => {
  let interval;
  let puz1;

  useEffect(() => {
    if (!paused && inGame) {
      const gameScreen = document.querySelector("#image-puzzle-game");
      const width = gameScreen.clientWidth;
      const height = window.innerWidth < 960 ? width * .6 : 450;
      if (answered) {
        changeLoading(true);
        puz1 = new PuzzleImg('puzzle', game.image_url, 5, 4, width * 0.8, height, ()=>{
          changeLoading(false);
          changeAnswered(false);
        });
        puz1.solved = function () {
          submitGame(true);
        }
      } else {
        interval = setInterval(() => {
          const count = game.time - 1;
          changeGame({ ...game, time: count < 0 ? 0 : count });
          clearInterval(interval);
        }, 1000)
      }
    }
  }, [paused, answered, game])

  const buttonStyle = { width: "120px", textTransform: "uppercase" }
  const convertToMinutesAndSecond = (sec) => {
    let minutes = Math.floor(sec / 60);
    let seconds = sec % 60;

    if (minutes >= 60) {
      let hours = Math.floor(minutes / 60);
      minutes = minutes % 60;
      return `${hours}:${minutes < 10 ? "0" + minutes : minutes}:${seconds < 10 ? "0" + seconds : seconds
        }`;
    }
    return `${minutes < 10 ? "0" + minutes : minutes}:${seconds < 10 ? "0" + seconds : seconds
      }`;
  };

  return (
    <div id="image-puzzle-game" className="container">
      <div id="image-puzzle-timer" className="right-align">
        <span>{convertToMinutesAndSecond(game.time)}</span>
      </div>
      <div id="puzzle" className="puzelm"></div>
      <p className="black-text center-align">Swap tiles until you get the correct image.😉</p>
      <div className="game-controls">
        <button className="btn waves-effect yellow" style={buttonStyle} onClick={() => about()}>About</button>
        <button className="btn waves-effect green" style={buttonStyle} onClick={() => submit()}>Submit</button>
        <button className="btn waves-effect red" style={buttonStyle} onClick={() => exit()}>Exit</button>
      </div>
    </div>
  )
}

export default Game
