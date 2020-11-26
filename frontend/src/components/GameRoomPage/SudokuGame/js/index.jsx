import React, { useState, useEffect } from 'react';
import Store from './store';
import $ from 'jquery';

import FormLoader from '../../../FormLoader';
import GameIndex from '../../GameIndex';
import Game from './Game';
import domainName from '../../../../DomainName';
import Sudoku from './sudoku';
import Message from '../../TriviaGame/Message';
import Auth from '../../../../Auth';

const SudokuGame = ({ match, history }) => {
    const [page, setPage] = useState(null);
    const [pageName, setPageName] = useState(null);
    const [loading, setLoading] = useState(false);
    const [hasGame, setHasGame] = useState(false);
    const [currentGame, setCurrentGame] = useState();
    const [answered, setAnswered] = useState(false);
    const [message, setMessage] = useState({ type: false, message: "wrong" });
    const [hasNext, setHasNext] = useState();
    let authenticatedUser, token;

    useEffect(() => {
        const elems = document.querySelectorAll('.modal');
        window.M.Modal.init(elems, {});
        const instance = window.M.Modal.getInstance(document.querySelector('#sudoku-puzzle-about'));

        authenticatedUser = Auth.authenticatedUser
        token = Auth.authenticationToken

        if (authenticatedUser.games.sudoku < 20) {
            setHasNext(true);
        } else {
            setHasNext(false);
            Auth.authenticatedUser = { ...authenticatedUser, games: { ...authenticatedUser.games, sudoku: 20 } }
            Auth.saveAuthObject();
        };
        if (!hasGame) {
        setLoading(true);
        fetch(`${domainName}/api/user/game/sudoku`, { headers: { "Content-Type": "application/json", "Authorization": `Token ${token}` }, method: "GET" })
            .then(res => res.json())
            .then(data => {
                setCurrentGame(data);
                Store.dispatch({ type: "NEW_GAME", currentGame: Sudoku.boardToGame(data.board, data.time) });
                Store.dispatch({ type: "POPULATE_CURRENT_GAME", currentBoard: data.current_board, currentTime: data.time })
            })
            .catch(err => console.log(err))
            .finally(() => {
                setHasGame(true);
                setLoading(false);
            })
    }

    if(pageName !== 'game' && Auth.authenticationToken){
        fetch(`${domainName}/api/user`, {headers:{'Content-Type': 'application/json', 'Authorization': `Token ${Auth.authenticationToken}`}, method: 'GET'})
        .then(res=>res.json())
        .then(data=>{
            Auth.authenticatedUser = data;
            Auth.saveAuthObject();
        })
        .catch(err=>alert("unable to update game progress"));
    }

    switch (pageName) {
        case 'game':
            setPage(
                <Game exit={() => saveGame()}
                    about={() => instance.open()}
                    submit={submitGame}
                    game={currentGame}
                    changeGame={game => setCurrentGame(game)}
                    completionEvent={state => {
                        if (!answered) submitGame(state)
                    }}
                    isPlaying={!answered}
                />
            );
            return;

        default:
            setPage(
                <GameIndex name="Sudoku Puzzle"
                    icon={require("../../../../img/game.png")}
                    percentage={(authenticatedUser.games.sudoku / 20) * 100}
                    progress={`${authenticatedUser.games.sudoku}/20`}
                    startGame={() => {
                        if (authenticatedUser.games.sudoku < 20) {
                            if (!currentGame) {
                                setHasGame(false);
                            } else {
                                Store.dispatch({ type: "RESUME_GAME", currentGame: Sudoku.boardToGame(currentGame.board, currentGame.time) });
                                Store.dispatch({ type: "POPULATE_CURRENT_GAME", newBoard: currentGame.current_board })
                                delayedFunc(setPageName, "game", 3000)
                            }
                        } else {
                            setAnswered(true);
                            setHasNext(false);
                            setMessage({ type: true, message: "Congratulations You Have Solved All The Puzzles For The Week" })
                        }
                    }}
                    exitGame={() => delayedFunc(history.push, '/dashboard/game-room', 3000)}
                    aboutFunction={() => instance.open()} />
            )
    }

}, [pageName, hasGame, currentGame, answered, hasNext])

const delayedFunc = (cb, arg, time) => {
    setLoading(true);
    setTimeout(() => {
        setLoading(false);
        cb(arg)
    }, time)
}

const saveGame = () => {
    const { cells, time } = Store.getState().game;
    const { id } = currentGame;
    const board = Sudoku.gameToBoard(cells);

    setLoading(true);
    fetch(`${domainName}/api/user/save/sudoku`, { headers: { "Content-Type": "application/json", "Authorization": `Token ${token}` }, method: "PUT", body: JSON.stringify({ id, board, time }) })
        .then(res => res.json())
        .then(data => {
            if (data.error_message) {
                alert(data.error_message);
            } else if (data.msg) {
                alert(data.msg);
            }
        })
        .catch(err => console.log(err))
        .finally(() => {
            setLoading(false);
            setCurrentGame({ ...currentGame, time, current_board: board });
            delayedFunc(setPageName, 'index', 3000);
        })
}

const submitGame = () => {
    const cells = Store.getState().game.cells;
    const { id } = currentGame;

    setLoading(true);
    fetch(`${domainName}/api/user/game/sudoku`, { headers: { "Content-Type": "application/json", "Authorization": `Token ${token}` }, method: "POST", body: JSON.stringify({ id, cells }) })
        .then(res => res.json())
        .then(data => {
            let bool = (data.msg === "wrong") ? false : true;
            setMessage({ type: bool, message: data.msg });
            setAnswered(true);
        })
        .catch(err => console.log(err))
        .finally(() => {
            setLoading(false);
        })
}

const setNewQuesition = () => {
    const count = authenticatedUser.games.sudoku;
    $(".sudoku-table input").val("");
    setHasGame(false);
    Auth.authenticatedUser = { ...authenticatedUser, games: { ...authenticatedUser.games, sudoku: (count < 20) ? count + 1 : 20 } } 
    Auth.saveAuthObject();
    setAnswered(false);
}

return (
    <>
        <div id="sudoku-puzzle-about" className="modal">
            <div className="modal-content">
                <h4>Sudoku Puzzle</h4>
                <p>A Sudoku puzzle consists of 81 cells which are divided into nine columns,
                rows and regions. The task is now to place the numbers from 1 to 9 into the
                empty cells in such a way that in every row, column and 3×3 region each number
                      appears only once.</p>
            </div>
            <div className="modal-footer">
                <a href="#!" className="modal-close waves-effect waves-green btn-flat">Close</a>
            </div>
        </div>
        {loading ? <FormLoader /> : ""}
        {page}
        {answered && hasNext ? (
            <>
                <div className="overlay"></div>
                <div id="message-board" className={answered ? "m-show" : ""} style={{ zIndex: 1 }}>
                    <Message type={message.type} message={message.message} />
                    <div className="row">
                        <div className="col l6 m6 s6">
                            <div className="container">
                                <button className="btn green lighten-2" onClick={setNewQuesition}>Continue</button>
                            </div>
                        </div>
                        <div className="col l6 m6 s6">
                            <div className="container">
                                <button className="btn red lighten-2" onClick={() => {
                                    setAnswered(false);
                                    setPageName("index");
                                }}>Exit</button>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        ) : answered && !hasNext ? (
            <>
                <div className="overlay"></div>
                <div id="message-board" className={answered ? "m-show" : ""} style={{ zIndex: 1 }}>
                    <Message type={message.type} message={message.message} />
                    <div className="row">
                        <div className="col l6 m6 s6">
                            <div className="container">
                            </div>
                        </div>
                        <div className="col l6 m6 s6">
                            <div className="container">
                                <button className="btn red lighten-2" onClick={() => {
                                    setAnswered(false);
                                    setPageName("index");
                                }}>Exit</button>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        ) :
                <></>}
    </>
)
}

export default SudokuGame
