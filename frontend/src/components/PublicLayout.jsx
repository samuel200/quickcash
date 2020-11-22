import React, { useState, useEffect } from 'react';
import $ from 'jquery';

import NavigationBar from './HomePage/NavigationBar';
import Footer from './HomePage/Footer';
import ToTop from './ToTop';
import { Loading } from './Loading';

export default function PublicLayout({ children, className }) {
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
        <div className={className}>
            {loading ? <Loading /> : ""}
            <NavigationBar />
                { children }
                <ToTop /> 
            <Footer />
        </div>
    )
}
