import React from 'react'
import PublicLayout from '../PublicLayout'
import './how-it-works.css'

function HowItWorks() {
    return (
        <PublicLayout className="layout">
            <section id="how-it-works" className="container z-depth-1 white">
                <h2>How It Works?</h2>
                <p>
                    <b>Quick Cash</b> is an online money making platform that helps you keep smart and earn fast.
                    You might think to yourself that "this cannot be true" but it is! and you can read on to find out
                    how this platform works and how to start earning as soon as possible.
                </p>
                <ul>
                    <li>
                        <h3>Create An Account</h3>
                        <p>
                            If you are new to the platform the registeration process is quick and easy <a href="/signup">click here</a> to go to the registration page ang get registered
                            and then come back to follow the remaining steps. After registration, every user is required to deposit the sum of 1000 naira, this is the activation fee and
                            it is compolsory for every user in order to be able to earn on this platform.
                        </p>
                    </li>
                    <li>
                        <h3>How To Start Earning</h3>
                        <p>
                            As soon as your payment is confirmed and your account is activated, you are then required to fund your account with a minimum of N1,000(One Thousand Naira) Only.
                            As soon as your account is funded, you become eligible to participate and earn real money from all your activities on our platform.
                            You can withdraw your profits at any time. However, the minimum withdrawal amount is N1,000.
                        </p>
                    </li>
                    <li>
                        <h3>Referral Earnings</h3>
                        <p>
                            You can earn a commission of N1000 for every activated user you refer to the platform
                            It is easy, quick and simple.
                            <a href="/signup">Register now</a> to start earning.
                        </p>
                    </li>
                    <li>
                        <h3>News Room</h3>
                        <p>
                            Get updates on the latest news on different topics on our platform while you earn.
                        </p>
                    </li>
                    <li>
                        <h3>How To Earn From Your Activities?</h3>
                        <p>
                            When you have an activated account you are allowed to carry out the activies on the activies page in your account dashboard.
                            To be specific the game room section, you earn by making stakes of N2 for a game and earn N5 if you win the game, this is so easy
                            and you get to increase your smarts in the process. This is a unique and entertaining way of making money unlike any other and
                            in this platform you can earn up to N50,000 in one month and don't forget that withdrawal can be done at any time just make sure your balance is up to N1000. 
                        </p>
                    </li>
                </ul>
            </section>
        </PublicLayout>
    )
}

export default HowItWorks
