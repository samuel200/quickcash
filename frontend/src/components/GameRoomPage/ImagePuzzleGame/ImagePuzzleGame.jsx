import React, { useState, useEffect } from 'react';
import Auth from '../../../Auth';
import domainName from '../../../DomainName';
import FormLoader from '../../FormLoader';
import GameIndex from '../GameIndex';
import Message from '../TriviaGame/Message';
import Game from './Game';

const ImagePuzzleGame = ({ history }) => {
    const [page, setPage] = useState();
    const [game, setGame] = useState();
    const [pageName, setPageName] = useState(null);
    const [hasGame, setHasGame] = useState(false);
    const [loading, setLoading] = useState(false);
    const [answered, setAnswered] = useState(true);
    const [paused, setPaused] = useState(false);
    const [inGame, setInGame] = useState(false);
    const [message, setMessage] = useState({ type: false, message: "wrong" });
    let authenticatedUser, token;

    useEffect(() => {
        const elems = document.querySelectorAll('.modal');
        window.M.Modal.init(elems, {});
        const instance = window.M.Modal.getInstance(document.querySelector('#img-puzzle-about'));

        authenticatedUser = Auth.authenticatedUser;
        token = Auth.authenticationToken;

        if (!hasGame) {
            setLoading(true);
            fetch(`${domainName}/api/user/game/image-puzzle`, { headers: { "Content-Type": "application/json", "Authorization": `Token ${token}` }, method: "GET" })
                .then(res => res.json())
                .then(data => {
                    setGame(data);
                    setHasGame(true);
                    if (game) {
                        setAnswered(true);
                        setPaused(false);
                    }
                })
                .catch(err => console.log(err))
                .finally(() => {
                    setLoading(false);
                })
        }

        switch (pageName) {
            case 'game':
                setPage(<Game exit={() => {
                    delayedFunc(setPageName, 'index', 3000);
                    setInGame(false);
                }}
                    about={() => instance.open()}
                    submit={() => { submitGame(false) }}
                    game={game}
                    changeGame={data => setGame(data)}
                    answered={answered}
                    paused={paused}
                    submitGame={bool => submitGame(bool)}
                    changeAnswered={bool => setAnswered(bool)}
                    inGame={inGame}
                    changeLoading={bool=>setLoading(bool)}
                />);
                break;

            default:
                setPage(<GameIndex name="Image Puzzle"
                    icon={require("../../../img/gaming.png")}
                    percentage={(authenticatedUser.games.image_puzzle / 20) * 100}
                    progress={`${authenticatedUser.games.image_puzzle}/20`}
                    startGame={() => {
                        if (authenticatedUser.games.image_puzzle < 20) {
                            if (!game) {
                                setHasGame(false);
                            } else {
                                setInGame(true);
                                delayedFunc(setPageName, "game", 3000)
                            }
                        } else {
                            setPaused(true);
                            setMessage({ type: true, message: "Congratulations You Have Solved All The Puzzles For The Week" })
                        }
                    }}
                    exitGame={() => delayedFunc(history.push, '/dashboard/game-room', 3000)}
                    aboutFunction={() => instance.open()} />)
        }

        if(hasGame){
            if (game.time === 0) {
                submitGame(false);
            }
        }

    }, [game, pageName, answered, hasGame, loading])

    const delayedFunc = (cb, arg, time) => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            cb(arg)
        }, time)
    }
    const setNewQuestion = () => {
        setHasGame(false);
    }

    const submitGame = correct => {
        const { id } = game;

        setLoading(true);
        fetch(`${domainName}/api/user/game/image-puzzle`, { headers: { "Content-Type": "application/json", "Authorization": `Token ${token}` }, method: "POST", body: JSON.stringify({ id, correct }) })
            .then(res => res.json())
            .then(data => {
                console.log(data.msg);
                if (data.msg) {
                    setMessage({ type: correct, message: correct ? "correct" : "wrong" });
                    setAnswered(true);
                    Auth.authenticatedUser.games.image_puzzle += 1;
                    Auth.saveAuthObject();
                } else if (data.error_message) {
                    alert(data.error_message);
                }
            })
            .catch(err => console.log(err))
            .finally(() => {
                setPaused(true);
                setLoading(false);
            })
    }

    return (
        <>
            <div id="img-puzzle-about" className="modal">
                <div className="modal-content">
                    <h4>Image Puzzle</h4>
                    <p> An image puzzle is a tiling puzzle that requires the assembly of often oddly shaped interlocking and mosaiced pieces.</p>
                </div>
                <div className="modal-footer">
                    <a href="#!" className="modal-close waves-effect waves-green btn-flat">Close</a>
                </div>
            </div>
            {loading ? <FormLoader /> : ""}
            {page}
            {paused ? (
                <>
                    <div className="overlay"></div>
                    <div id="message-board" className={paused ? "m-show" : ""} style={{ zIndex: 1 }}>
                        <Message type={message.type} message={message.message} />
                        <div className="row">
                            <div className="col l6 m6 s6">
                                {Auth.authenticatedUser.games.image_puzzle < 19 && inGame ? <div className="container">
                                    <button className="btn green lighten-2" onClick={setNewQuestion}>Continue</button>
                                </div> : <></>}
                            </div>
                            <div className="col l6 m6 s6">
                                <div className="container">
                                    <button className="btn red lighten-2" onClick={() => {
                                        setPageName("index");
                                        setInGame(false);
                                        setPaused(false);
                                    }}>Exit</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            ) : <></>}
        </>
    )
}

export default ImagePuzzleGame
