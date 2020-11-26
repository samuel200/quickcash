import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import $ from 'jquery';
import domainName from '../../../DomainName';
import FormLoader from '../../FormLoader';
import Message from './Message';
import './triviagame.css';
import GameIndex from '../GameIndex';
import Auth from '../../../Auth';

const TriviaGame = ({ history }) => {
    const [answered, setAnswered] = useState(false);
    const [answer, setAnswer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [questions, setQuestions] = useState(false);
    const [time, setTime] = useState(10);
    const [message, setMessage] = useState({ type: false, message: "wrong" })
    const [hasNext, setHasNext] = useState(true);
    const [page, setPage] = useState(null);
    const [pageName, setPageName] = useState('index');
    let interval;
    let authenticatedUser, token;

    useEffect(() => {
        const elems = document.querySelectorAll('.modal');
        window.M.Modal.init(elems, {});
        const instance = window.M.Modal.getInstance(document.querySelector('#trivia-about'));

        authenticatedUser = Auth.authenticatedUser;
        token = Auth.authenticationToken;

        if (!questions) {
            fetch(`${domainName}/api/user/game/trivia`, { headers: { "Content-Type": "application/json", "Authorization": `Token ${token}` } })
                .then(res => res.json())
                .then(data => {
                    setQuestions(data);
                })
                .catch(err => console.log(err))
                .finally(() => setLoading(false))
        }

        if (pageName !== 'game' && Auth.authenticationToken) {
            fetch(`${domainName}/api/user`, { headers: { 'Content-Type': 'application/json', 'Authorization': `Token ${Auth.authenticationToken}` }, method: 'GET' })
                .then(res => res.json())
                .then(data => {
                    Auth.authenticatedUser = data;
                    Auth.saveAuthObject();
                })
                .catch(err => alert("unable to update game progress"));
        }

        switch (pageName) {
            case 'game':
                setPage(authenticatedUser.games.trivia < 20 ?
                    <div id="trivia-game">
                        <div className="trivia-question-holder">
                            <h2><b>{authenticatedUser.games.trivia + 1}. </b>{questions[authenticatedUser.games.trivia].question}</h2>
                            <div className="timer">{time}</div>
                        </div>
                        <form onSubmit={answerQuestion}>
                            <div className="trivia-options-holder row">
                                {
                                    questions[authenticatedUser.games.trivia].options.substring(0, questions[authenticatedUser.games.trivia].options.length - 1).split(",").map(option =>
                                        (<div className="col l6 m6 s12">
                                            <div className="option">
                                                <label>
                                                    <input type="radio" name="answer" onClick={selectAnswer} value={option} />
                                                    <span>{option}</span>
                                                </label>
                                            </div>
                                        </div>)
                                    )
                                }
                                <div className="col l12 m12 s12 transparent">
                                    <button type="submit" className="btn-flat waves-effect blue lighten-3 white-text" disabled={answered}>SUBMIT</button>
                                </div>
                            </div>
                        </form>
                    </div> : <Redirect to="/dashboard/game/trivia" />)
                break;

            default:
                setPage(<GameIndex name="Trivia Game"
                    icon={require("../../../img/miscellaneous.png")}
                    percentage={(authenticatedUser.games.trivia / 20) * 100}
                    progress={`${authenticatedUser.games.trivia}/20`}
                    startGame={() => {
                        if (authenticatedUser.games.trivia === questions.length) {
                            setHasNext(false);
                            setAnswered(true);
                            setMessage({ type: true, message: "Congratulations You Have Answered All The Questions For The Week" });
                        } else {
                            delayedFunc(setPageName, 'game', 3000);
                        }
                    }}
                    exitGame={() => delayedFunc(history.push, 'dashbaord/game-room', 3000)}
                    aboutFunction={() => instance.open()}
                />)
        }

        if (pageName == 'game') {
            console.log("page name is game")
            if (!loading && !answered) {
                console.log("time ticking");
                interval = setInterval(() => {
                    if (time > 0)
                        setTime(time - 1);
                }, 1000)
                if (time === 0) {
                    setAnswer("");
                    checkAnswer();
                }
                return () => clearInterval(interval);
            }
        }


    }, [loading, time, answered, pageName, hasNext])

    const delayedFunc = (cb, arg, time) => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            cb(arg)
        }, time)
    }

    const checkAnswer = () => {
        setLoading(true);

        fetch(`${domainName}/api/user/game/trivia`, { method: "post", headers: { "Content-Type": "application/json", "Authorization": `Token ${token}` }, body: JSON.stringify({ answer, id: questions[authenticatedUser.games.trivia].id }) })
            .then(res => res.json())
            .then(data => {
                clearInterval(interval);
                if (data.error_message) {
                    setMessage({ type: false, message: data.error_message });
                } else {
                    if (data.msg.toLowerCase() === "correct") {
                        setMessage({ type: true, message: "correct" })
                    } else {
                        setMessage({ type: false, message: "wrong" })
                    }
                }
                setAnswered(true);
            })
            .catch(err => console.log(err))
            .finally(() => {
                setLoading(false);
            })
    }

    const answerQuestion = e => {
        e.preventDefault();
        checkAnswer();
    }

    const selectAnswer = e => {
        setAnswer($(e.target).val());
    }

    const setNewQuesition = () => {
        const count = authenticatedUser.games.trivia;
        if (authenticatedUser.games.trivia === questions.length - 1) {
            setHasNext(false);
        } else {
            setAnswered(false);
            setTime(10);
        }
        Auth.authenticatedUser = { ...authenticatedUser, games: { ...authenticatedUser.games, trivia: count + 1 <= 20 ? count + 1 : count } };
        Auth.saveAuthObject();
    }

    return (
        <>
            <div id="trivia-about" className="modal">
                <div class="modal-content">
                    <h4>General Trivia Questions</h4>
                    <p>In this game you will be asked questions about interesting but unimportant facts in many subjects.</p>
                </div>
                <div className="modal-footer">
                    <a href="#!" class="modal-close waves-effect waves-green btn-flat">Close</a>
                </div>
            </div>
            {loading ? <FormLoader /> : page}
            {answered ? (
                <>
                    <div className="overlay"></div>
                    <div id="message-board" className={answered ? "m-show" : ""}>
                        <Message type={message.type} message={message.message} />
                        <div className="row">
                            <div className="col l6 m6 s6">
                                {hasNext ?
                                    <div className="container">
                                        <button className="btn green lighten-2" onClick={setNewQuesition}>Continue</button>
                                    </div> : <div className="container"></div>}
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
            ) : <></>}
        </>
    )
}

export default TriviaGame
