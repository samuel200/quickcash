import React, { useState, useEffect } from 'react';
import $ from 'jquery';
import GameItem from './GameItem';
import LineProgressItem from './LineProgressItem';
import domainName from '../../DomainName';
import { Loading } from '../Loading';
import './gameroom.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGamepad } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import Auth from '../../Auth';

function GameRoom() {
    const [loading, setLoading] = useState(true);
    const authenticatedUser = Auth.authenticatedUser;
    const {sudoku, trivia, image_puzzle} = authenticatedUser.games;

    useEffect(()=>{
        setTimeout(()=>{
            $("#loader").animate({width: "500px", height: "500px", opacity: 0}, 300, ()=>{
                $("#loader-background").animate({opacity: 0}, 500, ()=>{
                    setLoading(false);
                })
            })
        }, 3000)
    }, [])

    const games = [
        {
            className: "col l4 m6 s12",
            gameName: "General Trivia Questions",
            description: "In this game you will be asked questions about interesting but unimportant facts in many subjects.",
            percentage: `${(authenticatedUser.games.trivia/20) * 100}`,
            count: authenticatedUser.games.trivia,
            iconUrl: require('../../img/miscellaneous.png'),
            to: "/dashboard/game/trivia"
        },
        {
            className: "col l4 m6 s12",
            gameName: "Sudoku Puzzle",
            description: "A Sudoku puzzle consists of 81 cells which are divided into nine columns, rows and regions. The task is now to place the numbers from 1 to 9 into the empty cells in such a way that in every row, column and 3×3 region each number appears only once.",
            percentage: `${(authenticatedUser.games.sudoku/20) * 100}`,
            count: authenticatedUser.games.sudoku,
            iconUrl: require('../../img/game.png'),
            to: "/dashboard/game/sudoku"
        },
        {
            className: "col l4 m6 s12",
            gameName: "Image Puzzle",
            description: " A image puzzle is a tiling puzzle that requires the assembly of often oddly shaped interlocking and mosaiced pieces. ",
            percentage: 100 * (image_puzzle/20),
            count: image_puzzle,
            iconUrl: require('../../img/gaming.png'),
            to: "/dashboard/game/image-puzzle"
        },
        // {
        //     className: "col l4 m6 s12",
        //     gameName: "Word Search Game",
        //     description: "A word search puzzle is a word game that consists of the letters of words placed in a grid, which usually has a rectangular or square shape. The objective of this puzzle is to find and mark all the words hidden inside the box.",
        //     percentage: "20",
        //     iconUrl: require('../../img/game (1).png'),
        //     to: "/dashboard/game/word-search"
        // },
        // {
        //     className: "col l4 m6 s12",
        //     gameName: "Crossword Puzzle",
        //     description: "The game's goal is to fill the white squares with letters, forming words or phrases, by solving clues, which lead to the answers.",
        //     percentage: "20",
        //     iconUrl: require('../../img/game (2).png'),
        //     to: "/dashboard/game/crossword"
        // },
    ]

    const logoImgStyle = {
        width: "40px"
    }

    const imgStyle = {
        width: "20px"
    }

    const [inPage, setIn] = useState(false);

    const handleOnClick = e => {
        e.preventDefault();
        setIn(!inPage);
    }

    const LoadingElement = ()=>(
        <h2 style={{fontSize: "24px"}}>Game Room <FontAwesomeIcon icon={ faGamepad } /></h2>
    )

    return (
        <div>
        {loading ? <Loading element={<LoadingElement />}/> : ""}
            <nav className="home-nav">
                <div className="nav-wrapper">
                    <a href="/dashboard" className="brand-logo left">Game Room{" "}<img style={logoImgStyle} src={require('../../img/technology.png')} alt="image" /></a>
                    <ul className="right">
                        <li><a href="/" onClick={handleOnClick}><img src={domainName + authenticatedUser.profile_picture} alt="avatar" className="game-room-img" /></a></li>
                    </ul>
                </div>
            </nav>
            <div id="floating-menu" className={inPage ? "pop-in" : "shrink-out"}>
                <div className="row">
                    <div className="col s4 m4 l4">
                        <p className="left-align"><b>Level</b></p>
                        <p className="left-align">{authenticatedUser.level}</p>
                    </div>
                    <div className="col s8 m8 l8">
                        <p className="left-align"><b>Game Room Balance</b></p>
                        <p className="left-align">₦{authenticatedUser.game_earnings}</p>
                    </div>
                    <div className="col s12 m12 l12">
                        <span className="right">{Math.floor(100 * ((sudoku+trivia+image_puzzle)/60))}%</span>
                        <LineProgressItem percentage={100 * ((sudoku+trivia+image_puzzle)/60)} />
                    </div>
                </div>
                <div className="row">
                    <div className="col s2 m2 l2 center-align">
                        <a href="/how-it-works"><img src={require("../../img/interface (1).png")} alt="interface" style={imgStyle} /></a>
                    </div>
                    <div className="col s10 m10 l10 left-align">
                        <a href="/how-it-works"><b>Help</b></a>
                    </div>
                </div>
                <div className="row" id="exit">
                    <div className="col s2 m2 l2 center-align">
                        <Link to="/dashboard"><img src={require("../../img/interface.png")} alt="interface" style={imgStyle} /></Link>
                    </div>
                    <div className="col s10 m10 l10 left-align">
                        <Link to="/dashboard"><b>Exit</b></Link>
                    </div>
                </div>
            </div>
            <section className="game-room-intro" onClick={() => setIn(false)}>
                <div className="container center-align white-text">
                    <h2 className="responsive-text">Make Money While Playing Games</h2>
                    <p className="responsive-text">The is our game room where you can play games and make money which will be added to your online account balance. The more you play the higher your rank becomes and the tougher the games will be. These games are made to mentally challenge you and the fact that you make money while doing that is an added bonus. Play and complete levels to fill up your weekly gaming point requirement so that you can withdraw the money made for the week. If the gaming point requirement is not met you cannot withdraw your earning and you won’t be able to rank up.</p>
                </div>
            </section>

            <div className="game-holder" onClick={() => setIn(false)}>
                <section className="row">
                    {games.map(({ className, gameName, description, percentage, count, starta, iconUrl, to }) => (
                        <GameItem className={className}
                            gameName={gameName}
                            description={description}
                            percentage={percentage}
                            starta={starta}
                            iconUrl={iconUrl}
                            count={count}
                            to={to} />
                    ))}
                </section>
            </div>
            <footer className="home-footer center-align">
                <span className="flow-text">Quick Cash &copy;Copyright{new Date().getFullYear()}</span>
            </footer>
        </div>
    )
}

export default GameRoom;
