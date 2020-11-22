import React from 'react';
import { Route, Redirect, withRouter } from 'react-router-dom';

import Auth from '../Auth';


const ProtectedRoute = ({ path, component: RouteComponent, showMessage }) => {
    return (
        <>
            <Route path={path} render={props => Auth.isAuthenticated && Auth.authenticatedUser ? (<RouteComponent {...props} showMessage={showMessage} />) : <Redirect to='/signin' />} />
        </>
    )
}

export default withRouter(ProtectedRoute);
