import React from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../DashboardLayout';

function Activities() {
    return (
        <DashboardLayout>
            <div className="row" style={{padding: "60px 0px"}}>
                <div className="col l6 m12 s12 container">
                    <div className="dashboard-info-section activity-card">
                        <img src={require("../../img/interface (3).png")} alt="interface"/>
                        <h4>New Room</h4>
                        <span>Earn money by reading daily news</span>
                        <a href="/news-room"><button>Start Reading</button></a>
                    </div>
                </div>
                <div className="col l6 m12 s12 container">
                    <div className="dashboard-info-section activity-card">
                        <img src={require("../../img/technology (1).png")} alt="technology"/>
                        <h4>Game Room</h4>
                        <span>Earn money while having fun and playing some games</span>
                        <Link to="/dashboard/game-room"><button>Start Playing</button></Link>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    )
}

export default Activities
