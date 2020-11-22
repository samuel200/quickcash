import React from 'react';
import { Link } from 'react-router-dom';
import $ from 'jquery';
import { faGamepad } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const GameLink = () => {
    const handleClick = e =>{
        const link = $(e.target).find('a')[0];
        if(link) link.click();
    }
    return (
        <div id="game-link" onClick={handleClick}>
            <Link to="/dashboard/game-room"><FontAwesomeIcon icon={ faGamepad } size="1x" style={{color: "white"}}/></Link>
        </div>
    )
}

export default GameLink
