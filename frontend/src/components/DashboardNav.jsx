import React, { useContext, useEffect, useRef } from 'react';
import { withRouter } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Auth from '../Auth';


const DashboardNavigationBar = ({ history }) => {
    let sidenav = useRef();

    const logout = e =>{
        e.preventDefault();
        Auth.logout(()=>{
            history.push('/signin');
        });
    }

    const links = [
        { name: "Dashboard", to: "/dashboard/index"},
        { name: "Activities", to: "/dashboard/activities"},
        { name: "Manage Profile", to: "/dashboard/manage"},
        { name: "Wallet", to: "/dashboard/wallet"},
        { name: "Referrals", to: "/dashboard/referrals"},
        { name: "Logout", to: ""},
    ]

    useEffect(() => {
        document.querySelectorAll(".dropdown-trigger")
        window.M.Sidenav.init(sidenav.current);
    }, [])

    return (
        <div>
            <nav className="home-nav">
                <div className="nav-wrapper">
                    <Link to="/" className="brand-logo left">Quick Cash</Link>
                    <Link to="#" data-target="mobile-demo" className="sidenav-trigger right"><FontAwesomeIcon icon={faBars} style={{color: "white", fontSize: "24px"}}/></Link>
                    <ul className="right hide-on-med-and-down">
                        {
                            links.map(({ name, to }) => {
                                if(name === "Logout"){
                                    return <li><a href={to} onClick= { logout }>{name}</a></li>
                                }
                                return <li><Link to={to}>{name}</Link></li>
                            })
                        }
                    </ul>
                </div>
            </nav>

            <ul className="sidenav" id="mobile-demo" ref={sidenav}>
                {
                    links.map(({ name, to }) => {
                        return <li><Link to={to}>{name}</Link></li>
                    })
                }
            </ul>
        </div>
    )
}

export default withRouter(DashboardNavigationBar);