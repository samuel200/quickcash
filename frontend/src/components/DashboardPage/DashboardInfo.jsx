import React, {useEffect, useState} from 'react';
import UserProfileImage from './UserProfileImage';
import ProfileCard from './ProfileCard';

function DashboardInfo({ authenticatedUser }) {
    const [total, setTotal] = useState();

    useEffect(()=>{
        setTotal(authenticatedUser.referral_earnings + authenticatedUser.game_earnings);
    }, [])
    return (
        <section id="dashboard-section" className="row">
            <UserProfileImage className="col l3 m12 s12" authenticatedUser={ authenticatedUser }/>
            <div className="col l9 m12 s12 info-holder">
                <ProfileCard color={"#1BAFB3"} circleColor={"#51BCBF"} title={"Game Earnings"} value={"₦ " + authenticatedUser.game_earnings} imgUrl={require('../../img/sign.png')} />
                <ProfileCard color={"#3831DD"} circleColor={"#5650DB"} title={"Total Referrals"} value={authenticatedUser.referral_count} imgUrl={require('../../img/avatar (1).png')} />
                <ProfileCard color={"#FFC107"} circleColor={"#FFD146"} title={"Referral Earnings"} value={"₦ " + authenticatedUser.referral_earnings} imgUrl={require('../../img/discuss.png')} />
                <ProfileCard color={"#2AC030"} circleColor={"#57B55A"} title={"Total Earnings"} value={"₦ " + total} imgUrl={require('../../img/sign.png')} />
            </div>
        </section>
    )
}

export default DashboardInfo
