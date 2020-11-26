import React, { useState } from 'react';
import $ from 'jquery';

import '../LoginSignup/auth.css';
import PublicLayout from '../PublicLayout';
import domainName from '../../DomainName';
import { Redirect } from 'react-router';
import FormLoader from '../FormLoader';

const Reset = ({ match, history, showMessage }) => {

    const [loading, setLoading] = useState(false);
    const handleSubmit = e => {
        e.preventDefault();

        const numberTest = /\d/g;
        const characterTest = /[A-za-z]/g;

        const password = $('input[type="password"]').val();
        
        if (!numberTest.test(password) || !characterTest.test(password) || password.length < 8) {
            showMessage("error", "Password Must Be Up To 8 Characters Containing Numbers And Letter")
        } else {
            setLoading(true);
            fetch(`${domainName}/api/user/reset-password/${match.params.id}/`, { headers: { "Content-Type": "application/json" }, method: "put", body: JSON.stringify({ password }) })
                .then(response => response.json())
                .then(data => {
                    if (data.error_message) {
                        showMessage("error", data.error_message);
                    } else {
                        showMessage("success", data.msg);
                        setTimeout(()=>{
                            history.push("/signin")
                        })
                    }
                    setLoading(false);
                })
                .catch(err => {
                    showMessage("error", "Error Connecting To Server Try Again Later");
                    setLoading(false);
                })
        }
    }

    return (
        <PublicLayout>
            {loading ? <FormLoader /> : ""}
            <div className="contact-page">
                <div id="auth-form-holder" style={{padding: "80px 0px"}}>
                    <form onSubmit={handleSubmit}>
                        <h2>Reset Password</h2>
                        <input type="password" placeholder="Password" name="password" required />
                        <button className={"flat-btn white-text " + (loading ? "disabled" : "")} type="submit" id="signin-btn">SUBMIT</button>
                    </form>
                </div>
            </div>
        </PublicLayout>
    )
}

export default Reset;