import React, { useEffect, useState } from 'react';
import $ from 'jquery';

import PublicLayout from '../PublicLayout';
import './contact.css';
import FormLoader from '../FormLoader';
import domainName from '../../DomainName';

function Contact({ token, showMessage }) {
    const [ loading, setLoading ] = useState(false);

    useEffect(() => {
        window.M.textareaAutoResize($('#textarea1'));
    }, [])

    const handleSendMessage = e =>{
        e.preventDefault();

        const body = {
            name: $("input#first_name").val(),
            email: $("input#email").val(),
            message: $("textarea#textarea1").val()
        }

        // Emulating fetch request delay
        setLoading(true);
        fetch(`${domainName}/api/contact/`, {headers: {"Content-Type": "application/json"}, method: "POST", body})
        .then(res=>res.json())
        .then(data=>{
            if(data.error_message){
                showMessage("error", data.error_message);
            }else{
                showMessage("succcess", data.msg);
                $("input#first_name").val("");
                $("input#email").val("");
                $("textarea#textarea1").val("");
            }
            setLoading(false);
        })
        .catch(err=>{
            showMessage("error", "Error Connecting To Server Try Again Later");
            console.error(err);
            setLoading(false);
        })
    }

    return (
        <PublicLayout>
            <div className="contact-page">
                {loading ? <FormLoader /> : ""}
                <section className="contact-section z-depth-1 row">
                    <div className="col l6 m12 s12 contact-info-side">
                        <div className="contact-heading">
                            <h2>quick support</h2>
                            <p>GET OUR CONTACT INFORMATION HERE.</p>
                        </div>
                        <div className="contact-body">
                            <div className="body-item">
                                <img src={require("../../img/communications.png")} alt="communication" />
                                <h3 className="black-text">call us</h3>
                                <p>+(234) 8029 374 9382</p>
                                <p>+(234) 8029 374 9382</p>
                            </div>
                            <div className="body-item">
                                <img src={require("../../img/open.png")} alt="communication" />
                                <h3 className="black-text">message us</h3>
                                <p>quickcash@cash.com</p>
                            </div>
                        </div>
                    </div>
                    <div className="col l6 m12 s12 form-side">
                        <div className="contact-heading">
                            <h2>Get In Touch</h2>
                            <p>LEAVE US A MESSAGE.</p>
                        </div>
                        <div className="form-holder row">
                            <form onSubmit={ handleSendMessage }>
                                <div class="input-field col s12">
                                    <input id="first_name" type="text" class="validate" required/>
                                    <label for="first_name">Full Name</label>
                                </div>
                                <div class="input-field col s12">
                                    <input id="email" type="email" class="validate"  required/>
                                    <label htmlFor="email">Email</label>
                                </div>
                                <div class="input-field col s12">
                                    <textarea id="textarea1" class="materialize-textarea" required></textarea>
                                    <label for="textarea1">Textarea</label>
                                </div>
                                <button className="btn right" type="submit">SEND MESSAGE</button>
                            </form>
                        </div>
                    </div>
                </section>
            </div>
        </PublicLayout>
    )
}

export default Contact
