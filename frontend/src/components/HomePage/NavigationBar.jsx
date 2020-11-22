import { faAngleDown, faBars } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

const NavigationBar = () => {
    let sidenav = useRef();

    const links = [
        { name: "Home", to: "/", isSubLink: false },
        { name: "How it works?", to: "/how-it-works", isSubLink: false },
        { name: "FAQ", to: "/faq", isSubLink: false },
        { name: "Contact Us", to: "/contact", isSubLink: false },
        { name: "Account", to: "", isSubLink: true },
    ]
    const sublinks = [{ name: "Signin", to: "/signin" }, { name: "Register", to: "/signup" }]

    useEffect(() => {
        const dropdowntrigger = document.querySelectorAll(".dropdown-trigger")
        window.M.Dropdown.init(dropdowntrigger);
        window.M.Sidenav.init(sidenav.current);
    }, [])

    return (
        <div>
            <ul id="dropdown1" className="dropdown-content">
                {sublinks.map(({ name, to }) => <li><Link to={to}>{name}</Link></li>)}
            </ul>
            <ul id="dropdown2" className="dropdown-content">
                {sublinks.map(({ name, to }) => <li><Link to={to}>{name}</Link></li>)}
            </ul>
            <nav className="home-nav">
                <div className="nav-wrapper">
                    <Link to="/" className="brand-logo left">Quick Cash</Link>
                    <Link to="#" data-target="mobile-demo" className="sidenav-trigger right" style={{position: 'relative', top: '5px'}}><FontAwesomeIcon icon={faBars} style={{color: "white"}}size='2x'/></Link>
                    <ul className="right hide-on-med-and-down">
                        {
                            links.map(({ name, to, isSubLink }) => {
                                if (isSubLink) {
                                    return <li><Link className="dropdown-trigger" to={to} data-target="dropdown1">{name} <span style={{paddingLeft: "5px"}}><FontAwesomeIcon icon={ faAngleDown } style={{ color: '#FFF'}} size="m"/></span></Link></li>
                                }
                                return <li><Link to={to}>{name}</Link></li>
                            })
                        }
                    </ul>
                </div>
            </nav>

            <ul className="sidenav" id="mobile-demo" ref={sidenav}>
                {
                    links.map(({ name, to, isSubLink }) => {
                        if (isSubLink) {
                            return <li><Link className="dropdown-trigger" to={to} data-target="dropdown2">{name} <span style={{paddingLeft: "10px"}}><FontAwesomeIcon icon={ faAngleDown } style={{ color: '#333'}}/></span></Link></li>
                        }
                        return <li><Link to={to}>{name}</Link></li>
                    })
                }
            </ul>
        </div>
    )
}

export default NavigationBar;