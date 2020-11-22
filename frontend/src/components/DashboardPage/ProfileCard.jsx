import React from 'react';
import './dashboard.css';

function ProfileCard({ color, circleColor, title, value, imgUrl }) {

    return (
        <div className="profile-card z-depth-1" style={{background: color}}>
            <div>
                <img src={ imgUrl } alt={`${title}-img`} style={{background: circleColor}}/>
            </div>
            <div>
                <span>{ title }</span>
                <span>{ value }</span>
            </div>
        </div>
    )
}

export default ProfileCard
