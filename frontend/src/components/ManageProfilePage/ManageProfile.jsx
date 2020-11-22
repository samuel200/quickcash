import React, { useState } from 'react';
import $ from 'jquery';

import DashboardLayout from '../DashboardLayout';
import domainName from '../../DomainName';
import FormLoader from '../FormLoader';
import Auth from '../../Auth';

function ManageProfile({ showMessage }) {
    const { username, first_name, last_name, email, phone_number, account_name, bank_name, account_number } = Auth.authenticatedUser;
    const [loading, setLoading] = useState(false);

    const handleEditProfileSubmit = e => {
        e.preventDefault();
        const body = {
            firstname: $("input[name='first-name']").val(),
            lastname: $("input[name='last-name']").val(),
            username: $("input[name='username']").val(),
            email: $("input[name='email']").val(),
            phone_number: $("input[name='phone-number'").val()
        }

        setLoading(true);
        fetch(`${domainName}/api/user`, { headers: { "Authorization": `Token ${Auth.authenticationToken}`, "Content-Type": "application/json" }, method: "PUT", body: JSON.stringify(body) })
            .then(response => response.json())
            .then(data => {
                setTimeout(() => {
                    Auth.authenticatedUser = data;
                    Auth.saveAuthObject();
                }, 2000)
                setLoading(false);
                showMessage("success", "Profile Updated")
            })
            .catch(err => {
                setLoading(false);
                console.log(err);
                showMessage("error", "Problem Occured While Trying To Edit Profile")
            })
    }

    const handleEditAccountSubmit = e => {
        e.preventDefault();
        const body = {
            account_name: $("input[name='account-name']").val(),
            account_number: $("input[name='account-number']").val(),
            bank_name: $("input[name='bank-name']").val()
        }

        setLoading(true);
        fetch(`${domainName}/api/user/account/`, { headers: { "Authorization": `Token ${Auth.authenticationToken}`, "Content-Type": "application/json" }, method: "PUT", body: JSON.stringify(body) })
            .then(response => response.json())
            .then(data => {
                setTimeout(() => {
                    Auth.authenticatedUser = data;
                    Auth.saveAuthObject();
                }, 2000)
                setLoading(false);
                showMessage("success", "Account Details Updated")
            })
            .catch(err => {
                console.log(err)
                setLoading(false);
                showMessage("error", "Error Occured While Trying To Update Account Detail")
            })
    }

    const handleUploadImage = e => {
        e.preventDefault();
        const photoHolder = document.querySelector("#profile-picture");
        const photo = photoHolder.files[0];
        const form = new FormData();

        form.append('profile_picture', photo);
        setLoading(true);
        fetch(`${domainName}/api/user/account/`, { method: "post", body: form, headers: { "Authorization": `Token ${Auth.authenticationToken}` } })
            .then(res => res.json())
            .then(data => {
                showMessage("success", "Profile Picture Uploaded Successfully");
                photoHolder.files = null;
                photoHolder.value = "";

                Auth.authenticatedUser = data;
                Auth.saveAuthObject();
                setLoading(false);
            })
            .catch(() => {
                showMessage("error", "Error Occured While Uploading Profile Picture")
                setLoading(false);
            })
    }

    const handleChangePassword = e => {
        e.preventDefault()
        const oldPasswordHolder = $("input[name='current-password']"),
            newPasswordHolder = $("input[name='new-password']"),
            confirmPasswordHolder = $("input[name='confirm-password']");

        const confirmPassword = confirmPasswordHolder.val();

        const body = {
            old_password: oldPasswordHolder.val(),
            new_password: newPasswordHolder.val()
        }
        const numberTest = /\d/g;
        const characterTest = /[A-za-z]/g;


        if (body.new_password.length < 8) {
            showMessage("error", "Password Must Be Up To 8 Characters Containing Numbers And Letter")
        } else if (!numberTest.test(body.new_password) || !characterTest.test(body.new_password)) {
            showMessage("error", "Password Must Be Up To 8 Characters Containing Numbers And Letter")
        } else if (body.new_password !== confirmPassword) {
            showMessage("error", "Passwords Do Not Match");
        } else {
            setLoading(true);
            fetch(`${domainName}/api/user/change-password/`, { headers: { "Authorization": `Token ${Auth.authenticationToken}`, "Content-Type": "application/json" }, method: "post", body: JSON.stringify(body) })
                .then(response => response.json())
                .then(data => {
                    setLoading(false);
                    if (data.error_message) {
                        showMessage("error", data.error_message);
                    } else {
                        console.log(data);
                        showMessage("success", "Password Updated")
                        oldPasswordHolder.val("");
                        newPasswordHolder.val("");
                        confirmPasswordHolder.val("");
                    }
                })
                .catch(err => {
                    console.log(err);
                    setLoading(false);
                    showMessage("error", "Error Occured While Making Request")
                })
        }
    }



    return (
        <DashboardLayout>
            {loading ? <FormLoader /> : ""}
            <h2 id="topic">Manage Profile</h2>
            <section className="dashboard-info-section">
                <h2>Edit Profile Image</h2>
                <form enctype="multipart/form-data" method="post" onSubmit={handleUploadImage}>
                    <div className="row">
                        <div className="col l6 m12 s12">
                            <div>
                                <label htmlFor="">Profile Picture</label>
                                <input type="file" name="profile-picture" id="profile-picture" />
                            </div>
                        </div>
                    </div>
                    <button type="submit">Upload Profile Image</button>
                </form>
            </section>
            <section className="dashboard-info-section">
                <h2>Edit Profile</h2>
                <form onSubmit={handleEditProfileSubmit}>
                    <div className="row">
                        <div className="col l6 m12 s12">
                            <div>
                                <label htmlFor="">First Name</label>
                                <input type="text" name="first-name" defaultValue={first_name} />
                            </div>
                        </div>
                        <div className="col l6 m12 s12">
                            <div>
                                <label htmlFor="">Last Name</label>
                                <input type="text" name="last-name" defaultValue={last_name} />
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col l6 m12 s12">
                            <div>
                                <label htmlFor="">Email</label>
                                <input type="email" name="email" defaultValue={email} />
                            </div>
                        </div>
                        <div className="col l6 m12 s12">
                            <div>
                                <label htmlFor="">User Name</label>
                                <input type="text" name="username" defaultValue={username} />
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col l6 m12 s12">
                            <div>
                                <label htmlFor="">Phone Number</label>
                                <input type="tel" name="phone-number" defaultValue={phone_number} />
                            </div>
                        </div>

                    </div>
                    <button type="submit">Update Profile</button>
                </form>
            </section>

            <section className="dashboard-info-section">
                <h2>Edit Bank Details</h2>
                <form onSubmit={handleEditAccountSubmit}>
                    <div className="row">
                        <div className="col l6 m12 s12">
                            <div>
                                <label htmlFor="">Account Name</label>
                                <input type="text" name="account-name" defaultValue={account_name} />
                            </div>
                        </div>
                        <div className="col l6 m12 s12">
                            <div>
                                <label htmlFor="">Bank Name</label>
                                <input type="text" name="bank-name" defaultValue={bank_name} />
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col l6 m12 s12">
                            <div>
                                <label htmlFor="">Account Number</label>
                                <input type="text" name="account-number" defaultValue={account_number} />
                            </div>
                        </div>
                    </div>
                    <button type="submit">Update Account</button>
                </form>
            </section>

            <section className="dashboard-info-section">
                <h2>Change Password</h2>
                <form onSubmit={handleChangePassword}>
                    <div className="row">
                        <div className="col l6 m12 s12">
                            <div>
                                <label htmlFor="">Current Password</label>
                                <input type="password" name="current-password" required />
                            </div>
                        </div>
                        <div className="col l6 m12 s12">
                            <div>
                                <label htmlFor="">New Password</label>
                                <input type="password" name="new-password" required />
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col l6 m12 s12">
                            <div>
                                <label htmlFor="">Confirm Password</label>
                                <input type="password" name="confirm-password" required />
                            </div>
                        </div>
                    </div>
                    <button type="submit">Change Password</button>
                </form>
            </section>
        </DashboardLayout>
    )
}

export default ManageProfile
