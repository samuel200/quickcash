import React from 'react';
import './dashboard.css';

import DashboardLayout from '../DashboardLayout';
import DashboardInfo from './DashboardInfo';
import Auth from '../../Auth';

function Dashboard() {
    return (
        <DashboardLayout>
            <DashboardInfo authenticatedUser={ Auth.authenticatedUser }/>
        </DashboardLayout>
    )
}

export default Dashboard
