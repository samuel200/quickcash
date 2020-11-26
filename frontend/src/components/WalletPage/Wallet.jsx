import React, { useState } from 'react';
import $ from 'jquery';
import { PaystackButton } from 'react-paystack';

import DashboardLayout from '../DashboardLayout';
import DashboardInfo from '../DashboardPage/DashboardInfo';
import FormLoader from '../FormLoader';
import domainName from '../../DomainName';
import Auth from '../../Auth';

function Wallet({ showMessage }) {
    const [loading, setLoading] = useState(false);
    const [disabled, setDisabled] = useState(true);
    const [amount, setAmount] = useState(0);
    const [error, setError] = useState(null)
    const [paymentParams, setPaymentParams] = useState({
        email: Auth.authenticatedUser.email,
        amount: 0,
        text: "Make Deposit",
        publicKey: "pk_test_22327c6d1340ad6d5b5580e465df1942e983c192",
        channels: ['card'],
        currency: 'NGN',
        onClose: () => {
            if(error){
                window.M.toast({ html: "Payment Failed", classes: "red white-text" })
            }else{
                showMessage('success', "Payment Successful")
            }
            setError(null);
        }
    });

    const handleWithdrawalRequest = e => {
        e.preventDefault();
        const inputElement = $(e.target).find('input[name="amount"]');
        const input = inputElement.val();
        let inputVal = input === '' ? 0 : parseFloat(input);
        setLoading(true);
        fetch(`${domainName}/api/user/withdrawal`, { headers: { "Content-Type": "application/json", "Authorization": `Token ${Auth.authenticationToken}` }, body: JSON.stringify({ amount: inputVal,  }), method: "POST" })
            .then(res => res.json())
            .then(data => {
                if (data.error_message) {
                    showMessage('error', data.error_message);
                } else {
                    showMessage('success', data.msg);
                    Auth.authenticatedUser = { ...Auth.authenticatedUser, transactions: [...Auth.authenticatedUser.transactions, data.transaction] };
                    Auth.saveAuthObject();
                }
            })
            .catch(err => console.log(err))
            .finally(() => {
                setLoading(false);
                inputElement.val("");
            })
    }


    return (
        <DashboardLayout>
            {loading ? <FormLoader /> : <></>}
            <DashboardInfo authenticatedUser={Auth.authenticatedUser} />
            <h2 id="topic" style={{ marginTop: "0px" }}>Wallet</h2>
            <section className="dashboard-info-section">
                <h2>Make Deposit</h2>
                <p>The minimum ammount that can be deposited is ₦1000</p>
                <form onSubmit={e=>e.preventDefault()}>
                    <input type="text" name="ammount" placeholder="Enter Ammount" onChange={e => {
                        const inputAmount = parseFloat(e.target.value) * 100 || 0;
                        setAmount(inputAmount);
                        if(inputAmount >= 100000){
                            setPaymentParams({...paymentParams, amount: inputAmount});
                            setDisabled(false);
                        }else{
                            setDisabled(true);
                            setAmount(0);
                        }
                    }} />
                    {disabled ? <button onClick={()=>{
                        if(amount < 100000){
                            showMessage('error', "Minimum amount that can be deposited is ₦1000");
                        }
                    }}>Make Deposit</button> :
                    <PaystackButton {...({
                        ...paymentParams, onSuccess: (response) => {
                            setLoading(true);
                            fetch(`${domainName}/api/user/deposit`, {method: 'POST', headers:{'Content-Type': "application/json", "Authorization": `Token ${Auth.authenticationToken}`}, body: JSON.stringify({ref: response.reference, amount})})
                                .then(res=>res.json())
                                .then(data => {
                                    Auth.authenticatedUser = {...Auth.authenticatedUser, transactions: [...Auth.authenticatedUser.transactions, data.transaction]}
                                })
                                .catch(err => {
                                    setError(err);
                                    console.log(err)
                                    window.M.toast({ html: "Payment Failed", classes: "red white-text" });
                                })
                                .finally(()=>{
                                    setLoading(false);
                                })

                        },
                    })} />}
                </form>
            </section>
            <section className="dashboard-info-section">
                <h2>Make Withdraw Request</h2>
                <p className="warning">Make sure to fill in your bank details before making withdraw request</p>
                <p>The minimum ammount that can be withdrawn is ₦5000</p>
                <form onSubmit={handleWithdrawalRequest}>
                    <input type="text" name="amount" placeholder="Enter Ammount" />
                    <button type="submit">Make Request</button>
                </form>
            </section>
            <section className="dashboard-info-section table-holder">
                <h2>Transaction History</h2>
                <table className="responsive-table stripped highlight">
                    <thead>
                        <tr>
                            <th>S/N</th>
                            <th>Amount</th>
                            <th>Type</th>
                            <th>Status</th>
                            <th>Date</th>
                        </tr>
                    </thead>

                    <tbody>
                        {Auth.authenticatedUser.transactions ? Auth.authenticatedUser.transactions.map(({ trans_type, amount, status, created_date }, count) =>
                            <tr>
                                <td>{count + 1}</td>
                                <td>{amount}</td>
                                <td>{trans_type}</td>
                                <td>{status ? "Confirmed" : "Pending"}</td>
                                <td>{created_date}</td>
                            </tr>
                        ) : <></>}
                    </tbody>
                </table>
                {Auth.authenticatedUser.transactions.length === 0 ? <p>No transaction Found</p> : <></>}
            </section>
        </DashboardLayout>
    )
}

export default Wallet
