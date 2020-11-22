import React from 'react'
import { Link } from 'react-router-dom'

const Activation = () => {
    return (
        <div id="activation-comp">
            <p className="white-text">You need to pay a sum of ₦1000 in order to get activated on this platform.</p>
            <Link to='/dashboard/wallet' className="btn-flat white-text red lighten-2 waves-effect">Activate</Link>
        </div>
    )
}

export default Activation
