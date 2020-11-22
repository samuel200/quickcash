import React, { useState, useEffect } from 'react';
import $ from 'jquery';

import Footer from './HomePage/Footer';
import DashboardNavigationBar from './DashboardNav';
import { Loading } from './Loading';
import GameLink from './GameLink';
import Activation from './DashboardPage/Activation';
import Auth from '../Auth';

function DashboardLayout({children}) {
    const [ loading, setLoading ] = useState(true);

    useEffect(()=>{
        setTimeout(()=>{
            $("#loader").animate({width: "500px", height: "500px", opacity: 0}, 300, ()=>{
                $("#loader-background").animate({opacity: 0}, 500, ()=>{
                    setLoading(false);
                })
            })
        }, 5000)
    }, [])

    return (
        <div className="layout">
            {loading ? <Loading /> : ""}
            <DashboardNavigationBar />
            {Auth.authenticatedUser && !Auth.authenticatedUser.activated ? <Activation /> : <></>}
            {children}
            <Footer/>
            <GameLink />
        </div>
    )
}

export default DashboardLayout
