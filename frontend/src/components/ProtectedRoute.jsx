import React, { useEffect, useState } from 'react';
import { Route, Redirect, withRouter } from 'react-router-dom';
import Auth from '../Auth';


const ProtectedRoute = ({ path, component: RouteComponent, showMessage }) => {

    return (
        <>
            <Route path={path} render={props => Auth.isAuthenticated ?
                <RouteComponent {...props} showMessage={showMessage} />
                : <Redirect to='/signin' />} />
        </>
    )
}

export default withRouter(ProtectedRoute);