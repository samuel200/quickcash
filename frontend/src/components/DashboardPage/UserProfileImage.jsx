import React from 'react';
import domainName from '../../DomainName';

function UserProfileImage({ className, authenticatedUser }) {

    const profileStyle = {
        padding: "0px"
    }

    return (
        <div className={"profile-image " + className}>
            <img src={authenticatedUser.profile_picture ? domainName + authenticatedUser.profile_picture : require('../../img/profile-image.jpg')} alt="profile-image" style={authenticatedUser.profile_picture ? profileStyle : {}} />
            <p>{authenticatedUser.username}</p>
        </div>
    )
}

export default UserProfileImage
