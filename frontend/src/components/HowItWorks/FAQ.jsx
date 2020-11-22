import React from 'react'
import PublicLayout from '../PublicLayout'
import './how-it-works.css'
import Collapsible from './Collapsible'

function FAQ() {
    const faqs = [
        { 
            header: "How to get registered?", 
            body: (<>
                    Go to the <a href="/signup">sign up page</a> fill in the form, confirm your 
                    email and then pay your activation fee if you want to start earning.
                    </>) 
        },
        { 
            header: "How much do i need to get started?", 
            body: (<>
                    In order to get started, the total ammount need would be at least N2,000 because a compulsory 
                    fee of N1,000 is need for your account to be activated and then you need to deposit money into
                    your account in order to play the games. The minimum deposit ammount is N1,000.
                    </>) 
        },
        { 
            header: "How long does it take to get my account activated?", 
            body: (<>
                    The activation process is almost instant, once your payment is made and confirmed your account will be activated.
                    </>) 
        },
        { 
            header: "When can i withdraw my money?", 
            body: (<>
                    You can withdraw anytime, just make sure to fill in your account details before withdrawing to avoid complications.
                    </>) 
        },
        { 
            header: "Is Quick Cash a ponzi scheme?", 
            body: (<>
                    No! Quick Cash is not a ponzi scheme. Money made on Quick Cash is made by betting on your ability to complete brain
                    intensive games and does not depend on any referral system.
                    </>) 
        },
        { 
            header: "Do you get paid to refer people?", 
            body: (<>
                    Yes! you do get compensated for referring people to this platform, you make up to N1,000 for every
                    activated member you refer to the platform.
                    </>) 
        },
        { 
            header: "Do you need to refer someone in order to get paid?", 
            body: (<>
                    No! you do not need to refer people to get paid because the main method of making money on this platform
                    is through our gaming activities.
                    </>) 
        },
    ]
    return (
        <PublicLayout className="layout">
            <section className="container z-depth-1 white" id="how-it-works">
                <h2>Frequently Asked Questions</h2>
                <Collapsible faqs={ faqs }/>
            </section>
        </PublicLayout>
    )
}

export default FAQ
