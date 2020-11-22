import React from 'react';
import { Link } from 'react-router-dom';
import LineProgressItem from './LineProgressItem';

function GameItem({ className, gameName, description, percentage, to, iconUrl, count }) {
    return (
        <div className={ className }>
            <div className="dashboard-info-section game-card">
                <img src={iconUrl} alt="miscellaneous" className="center-align" />
                <h4>{ gameName }</h4>
                <span className="left"><b>Progress:</b></span><LineProgressItem percentage={ percentage } />
                <span className="right">{count}/20</span>
                <p className="left-align"><span><b>Description:</b></span>  { description }</p>
                <Link to={ to } className="right"><button>Start Game</button></Link>
            </div>
        </div>
    )
}

export default GameItem
