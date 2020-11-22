import React, { useState } from 'react';
import $ from 'jquery';

import '../LoginSignup/auth.css';
import PublicLayout from '../PublicLayout';
import domainName from '../../DomainName';
import { Redirect } from 'react-router';
import FormLoader from '../FormLoader';

const Forgot = ({ showMessage }) => {
    const [ loading, setLoading ] = useState(false);
    const handleSubmit = e =>{
        setLoading(true);
        e.preventDefault();
        const email = $('input[type="email"]').val();

        fetch(`${domainName}/api/user/forgot-password/`, {headers:{"Content-Type": "application/json"},method: "post", body:JSON.stringify({email})})
        .then(response=>response.json())
        .then(data=> {
            if(data.error_message){
                showMessage("error", data.error_message);
            }else{
                showMessage("success", data.msg);
            }
            setLoading(false);
        })
        .catch(err=>{
            showMessage("error", "Error Connecting To Server Try Again Later");
            setLoading(false);
        })
    }

    return (
        <PublicLayout>
            {loading ? <FormLoader /> : ""}
            <div className="contact-page">
                <div id="auth-form-holder">
                    <form onSubmit={ handleSubmit }>
                        <h2>Forgot Password</h2>
                        <input type="email" placeholder="Email" name="email" />
                        <button className={"flat-btn white-text "+ (loading ? "disabled" : "")} type="submit" id="signin-btn">SUBMIT</button>
                    </form>
                </div>
            </div>
        </PublicLayout>
    )
}

export default Forgot;