import React, { useState } from 'react';
import $ from 'jquery';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

import DashboardLayout from '../DashboardLayout';
import DashboardInfo from '../DashboardPage/DashboardInfo';
import FormLoader from '../FormLoader';
import domainName from '../../DomainName';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import Auth from '../../Auth';

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe('pk_test_tt2Rmb4Z5ptgh9Bdy1iXzYxV008NonLVne');

const CheckoutForm = ({ changeLoading, showMessage }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [amount, setAmount] = useState();

    const handleSubmit = async (event) => {
        // Block native form submission.
        event.preventDefault();

        if (!stripe || !elements) {
            // Stripe.js has not loaded yet. Make sure to disable
            // form submission until Stripe.js has loaded.
            return;
        }

        // Get a reference to a mounted CardElement. Elements knows how
        // to find your CardElement because there can only ever be one of
        // each type of element.
        const card = elements.getElement(CardElement);

        // Use your card Element with other Stripe.js APIs
        const result = await stripe.createToken(card);

        if (result.error) {
            console.log('[error]', result.error);
        } else {
            if(amount >= 1000){
                changeLoading(true);
                fetch(`${domainName}/api/user/deposit`, {headers:{'Content-Type': "application/json", 'Authorization': `Token ${Auth.authenticationToken}`}, method: "POST", body: JSON.stringify({stripeToken: result.token.id, amount})})
                .then(res=>res.json())
                .then(data=>{
                    if(data.error_message){
                        showMessage({type: false, message: data.error_message})
                    }else if(data.msg){
                        Auth.authenticatedUser = {...Auth.authenticatedUser, game_earnings: Auth.authenticatedUser.game_earnings + data.transaction.amount, transaction: [...Auth.authenticatedUser.transaction, data.transaction]};
                        Auth.saveAuthObject();
                        showMessage({type: true, message: data.msg}) 
                    }
                })
                .catch(err=>console.log(err))
                .finally(()=>{
                    changeLoading(false);
                })
            }else{
                showMessage('error', "The minimum deposit amount is ₦1000")
            }
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" name="ammount" placeholder="Enter Ammount" onChange={e=>{
                setAmount(parseFloat(e.target.value));
            }}/>
            <div className="container" style={{
                background: "white",
                borderRadius: "5px",
                padding: "10px",
                marginLeft: "0px",
                marginBottom: "10px"
            }}>
                <CardElement
                    options={{
                        style: {
                            base: {
                                fontSize: '16px',
                                color: '#424770',
                                height: '80px',
                                marginBottom: "10px",
                                '::placeholder': {
                                    color: '#aab7c4',
                                },
                            },
                            invalid: {
                                color: '#9e2146',
                            },
                        },
                    }}
                />
            </div>
            <button type="submit" disabled={!stripe}>Make Deposit</button>
        </form>
    )
}

function Wallet({ showMessage }) {
    const [loading, setLoading] = useState(false);

    const handleWithdrawalRequest = e => {
        e.preventDefault();
        const inputElement = $(e.target).find('input[name="amount"]');
        const input = inputElement.val();
        let inputVal = input === '' ? 0 : parseFloat(input);
        setLoading(true);
        fetch(`${domainName}/api/user/withdrawal`, { headers: { "Content-Type": "application/json", "Authorization": `Token ${ Auth.authenticationToken }` }, body: JSON.stringify({ amount: inputVal }), method: "POST" })
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
                <Elements stripe={stripePromise}>
                    <CheckoutForm showMessage={showMessage} changeLoading={bool=>setLoading(bool)}/>
                </Elements>
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
