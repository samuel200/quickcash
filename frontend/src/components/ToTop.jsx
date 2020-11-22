import React, { useContext } from 'react';
import $ from 'jquery';
import { ToTopStore } from '../Store/ToTopStore';

export default function ToTop(){
    const { state } = useContext(ToTopStore);

    const topTopStyle = {
        zIndex: "9999",
        transition: ".1s ease-in transform",
        transformOrigin: "50% 50%",
        transform: state.inView ? "scale(1)" : "scale(0)"
    }

    const scrollUp = e =>{
        $("html").animate({
            scrollTop: "0px"
        }, 1000, 'swing');
    }

    return (
        <div id="to-top" style={ topTopStyle } onClick={scrollUp}>
            <img src={ require('../img/up-arrow.png')} alt="up-arrow"/>
        </div>
    )
}