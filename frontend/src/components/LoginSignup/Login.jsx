import React, { useState } from 'react';
import $ from 'jquery';

import './auth.css';
import PublicLayout from '../PublicLayout';
import domainName from '../../DomainName';
import { Redirect } from 'react-router';
import FormLoader from '../FormLoader';
import Auth from '../../Auth';

const Login = ({ history, showMessage }) => {
    const [ loading, setLoading ] = useState(false);
    const handleSubmit = e =>{
        setLoading(true);
        e.preventDefault();
        const email = $('input[type="email"]').val();
        const password = $('input[type="password"]').val();

        fetch(`${domainName}/api/login`, {headers:{"Content-Type": "application/json"},method: "post", body:JSON.stringify({email, password})})
        .then(response=>response.json())
        .then(data=> {
            if(data.error_message){
                showMessage("error", data.error_message)
            }else{
                showMessage("success", "Login Successful");
                setLoading(true);
                Auth.login(data.key, ()=>{
                    setLoading(false);
                    history.push('/dashboard/index');
                });
            }
        })
        .catch(err=>{
            console.log(err);
        })
    }

    return (
        <PublicLayout>
            {loading ? <FormLoader /> : ""}
            <div className="contact-page">
                <div id="auth-form-holder">
                    <form onSubmit={ handleSubmit }>
                        <h2>Sign In</h2>
                        <input type="email" placeholder="Email" name="email" />
                        <input type="password" placeholder="password" name="password" />
                        <button className={"flat-btn white-text "+ (loading ? "disabled" : "")} type="submit" id="signin-btn">SIGN IN</button>
                    </form>
                    <a href="/forgot" id="forgot">Forgot your password?</a>
                    <div id="split">
                        <span>Don’t have an account?</span>
                        <a href="/signup" className="btn-flat " id="signup-btn">SIGN UP</a>
                    </div>
                </div>
            </div>
            {Auth.isAuthenticated && Auth.authenicationToken ? <Redirect to={ localStorage.getItem("currentPage") ? "/dashboard/" + localStorage.getItem("currentPage") : "/dashboard/index" }/> : ""}
        </PublicLayout>
    )
}

export default Login;