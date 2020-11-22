import React, { useState } from 'react';
import $ from 'jquery';

import PublicLayout from '../PublicLayout'
import domainName from '../../DomainName';
import FormLoader from '../FormLoader';

function Signup({ showMessage, history, match }) {
    const [ loading, setLoading ] = useState(false);
    const referree = match.params.username;

    const handleRegistration = e =>{
        e.preventDefault();
        const body = {
            first_name: $("input[name='first-name']").val(),
            last_name: $("input[name='last-name']").val(),
            username: $("input[name='username']").val(),
            email: $("input[name='email']").val(),
            phone_number: $("input[name='phone-number']").val(),
            password: $("input[name='password']").val(),
        }

        if(referree){
            body.referree = referree;
        }
        console.log("Body:", body);
        const confirmPassword = $("input[name='confirm-password']").val();
        const numberTest = /\d/g;
        const characterTest = /[A-za-z]/g;

        if(!(confirmPassword === body.password)){
            showMessage("error", "Passwords Do Not Match")
        }else if(!numberTest.test(body.password) || !characterTest.test(body.password) || body.password.length < 8){
            showMessage("error", "Password Must Be Up To 8 Characters Containing Numbers And Letter")
        }else{
            setLoading(true);
            fetch(`${domainName}/api/register`, {headers:{"Content-Type": "application/json"}, method: "POST", body: JSON.stringify(body)})
            .then(response=>response.json())
            .then(data=>{
                if(data.error_message){
                    showMessage("error", data.error_message);
                }else{
                    showMessage("success", "User Registerd Successfully");
                    $(e.target).find("input").val("");
                    setTimeout(()=>{
                        history.push("/signin");
                    }, 2000)
                }
                setLoading(false);
            }).catch(err=>{
                console.log(err);
                setLoading(false);
                showMessage("error", "Error Occured While Carrying Out Registration")
            })
        }
    }

    return (
        <PublicLayout>
            {loading ? <FormLoader /> : ""}
            <div className="contact-page">
                <div id="auth-form-holder">
                    <form onSubmit={ handleRegistration }>
                        <h2>Sign Up</h2>
                        <input type="text" placeholder="FIRST NAME" name="first-name" required/>
                        <input type="text" placeholder="LAST NAME" name="last-name" required/>
                        <input type="text" placeholder="USERNAME" name="username" required/>
                        <input type="email" placeholder="EMAIL" name="email" required/>
                        <input type="tel" placeholder="PHONE NUMBER" name="phone-number" required/>
                        <input type="password" placeholder="PASSWORD" name="password" required/>
                        <input type="password" placeholder="CONFIRM PASSWORD" name="confirm-password" required/>
                        <button className="flat-btn white-text" type="submit" id="signin-btn">SIGN UP</button>
                    </form>
                    <div id="split">
                        <span>Already have an account?</span>
                        <a href="/signin" className="btn-flat" id="signup-btn">SIGN IN</a>
                    </div>
                </div>
            </div>
        </PublicLayout>
    )
}

export default Signup
