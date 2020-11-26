import React, { useContext } from 'react';

import DashboardLayout from '../DashboardLayout';
import DashboardInfo from '../DashboardPage/DashboardInfo';
import domainName from '../../DomainName';
import Auth from '../../Auth';

function Referral() {
    const {referrals, referral_count, username} = Auth.authenticatedUser;
    return (
        <DashboardLayout>
            <DashboardInfo authenticatedUser={ Auth.authenticatedUser }/>
            <h2 id="topic">Referrals</h2>
            <section className="dashboard-info-section">
                <h2>Referral Link</h2>
                <p>Send this link to people you want to refer to the platform.</p>
                <p>Referral Link: <span><a href={`${ domainName }/signup/${ username }/`} style={{fontSize: "12px"}}>{ domainName }/signup/{ username }/</a></span></p>
            </section>
            <section className="dashboard-info-section">
                <h2>List Of Referral</h2>
                <table className="stripped highlight">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Amount</th>
                            <th>Date</th>
                        </tr>
                    </thead>

                    <tbody>
                        { referrals.map(({username, create_date})=>{
                            const date = Date(create_date);
                            return (
                            <tr>
                                <th>{ username }</th>
                                <th>1000</th>
                                <th>{ date }</th>
                            </tr>
                        )})}
                    </tbody>
                </table>
                <p className={referral_count > 0 ? "hide" : ""}>No matching record Found</p>
            </section>
        </DashboardLayout>
    )
}

export default Referral
