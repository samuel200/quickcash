import React, { useEffect } from 'react'

export default function Carousel() {
    const sliderContentSpacing = {
        marginBottom: "20px"
    }
    const slides = [
        {
            header: "Make Money By Just Being Active Online",
            body: "QuickCash provides a means of making money from the comfort of your home by viewing latest news daily and playing some games.",
            imageURL: require("../../img/active-online.jpg")
        },
        {
            header: "Make Money While Reading News.",
            body: "QuickCash provides a means of making money from the comfort of your home by viewing latest news daily. ",
            imageURL: require("../../img/reading-news.jpg")
        },
        {
            header: "Make Money While Playing Games Online.",
            body: "QuickCash provides a means of making money by playing games and completing level, you get rewarded for completing all the levels that are created for the week.",
            imageURL: require("../../img/playing-games.jpg")
        }
    ]
    useEffect(() => {
        var elems = document.querySelectorAll('.slider');
        window.M.Slider.init(elems, {
            height: 480,
            duration: 800,
            interval: 8000
        });
    }, [])
    return (
        <div className="slider">
            <ul className="slides">
                { slides.map(({header, body, imageURL})=>{
                    return(
                        <li>
                            <img src={ imageURL }/>
                            <div className="caption center-align">
                                <h3 style={ sliderContentSpacing }>{ header }</h3>
                                <p className="light grey-text text-lighten-3" style={ sliderContentSpacing }>{ body }</p>
                                <a href="/signup" id="get-started">get started</a>
                            </div>
                            <div id="cover"></div>
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}
