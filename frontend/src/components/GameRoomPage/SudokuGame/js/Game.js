import React, { useEffect, useState } from "react";
import { Game as GameComponent } from "./GameComponent";
import Store from "./store";

const Game = ({ exit, about, submit, game, isPlaying, changeGame, completionEvent }) => {
  const [time, setTime] = useState(game.time);
  const [overlayed, setOverlayed] = useState(false);
  let interval;

  useEffect(() => {
    interval = setInterval(() => {
        if(!overlayed){
            const count = time - 1;
            if(count >= 0){
              if(isPlaying){
                Store.dispatch({ type: "ADD_SECOND", completionEvent });
                changeGame({...game, time: count < 0 ? 0 : count})
                setTime(count < 0 ? 0 : count);
              }else{
                setTime(1800);
              }
            }else{
              completionEvent();
              setTime(1800);
            }
        }
        clearInterval(interval);
    }, 1000);

  }, [time, game, overlayed]);

  const convertToMinutesAndSecond = (sec) => {
    let minutes = Math.floor(sec / 60);
    let seconds = sec % 60;

    if (minutes >= 60) {
      let hours = Math.floor(minutes / 60);
      minutes = minutes % 60;
      return `${hours}:${minutes < 10 ? "0" + minutes : minutes}:${
        seconds < 10 ? "0" + seconds : seconds
      }`;
    }
    return `${minutes < 10 ? "0" + minutes : minutes}:${
      seconds < 10 ? "0" + seconds : seconds
    }`;
  };

  const buttonStyle = { width: "120px", textTransform: "uppercase" };

  return (
    <div id="image-puzzle-game" className="container">
      <div id="image-puzzle-timer" className="right-align">
        <span>{convertToMinutesAndSecond(time)}</span>
      </div>
      <GameComponent />
      <p className="black-text center-align">
        Click on about to find out how the game is played.😉
      </p>
      <div className="game-controls" style={{zIndex: 0}}>
        <button
          className="btn waves-effect yellow"
          style={buttonStyle}
          onClick={() => about()}
        >
          About
        </button>
        <button
          className="btn waves-effect green"
          style={buttonStyle}
          onClick={() =>{
              setOverlayed(true);
              submit();
          }}
        >
          Submit
        </button>
        <button
          className="btn waves-effect red"
          style={buttonStyle}
          onClick={() => {
            setOverlayed(true);
            exit();
          }}
        >
          Exit
        </button>
      </div>
    </div>
  );
};

export default Game;
