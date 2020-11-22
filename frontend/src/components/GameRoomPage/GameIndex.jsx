import React from 'react';
import './game-index.css';

import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

import { faPlay, faInfo, faPowerOff } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


const GameIndex = ({startGame, exitGame, aboutFunction, name, icon, percentage, progress}) => {

    return (
        <div id="game-index">
            <div id="game-header">
                <h2>{name}</h2>
                <img src={icon} alt="game-image" />
            </div>
            <div className="index-button" onClick={startGame}>
                <span className="index-icon green">
                    <FontAwesomeIcon icon={faPlay} style={{color: "white"}}size='2x'/>
                </span>
                <p>Play</p>
            </div>
            <div className="index-button" onClick={aboutFunction}>
                <span className="index-icon green">
                    <FontAwesomeIcon icon={faInfo} style={{color: "white"}}size='2x'/>
                </span>
                <p>About</p>
            </div>
            <div className="index-button" onClick={exitGame}>
                <span className="index-icon red">
                    <FontAwesomeIcon icon={faPowerOff} style={{color: "white"}}size='2x'/>
                </span>
                <p>Exit</p>
            </div>
            <div style={{maxWidth: "200px"}}>
                <CircularProgressbar value={percentage} text={progress} />;
            </div>
        </div>
    )
}

export default GameIndex
