import React from 'react';
import PublicLayout from '../PublicLayout';
import './how-it-works.css';

function Privacy() {
    return (
        <PublicLayout className="layout">
            <section id="how-it-works" className="container z-depth-1 white">
                <h2>Privacy Policy</h2>
                <ul>
                    <li>
                        <h3>Who we are?</h3>
                        <p>Our website address is: <a href="/">https://quickcash.com</a></p>
                    </li>
                    <li>
                        <h3>Media</h3>
                        <p>
                            If you upload images to the website, you should avoid uploading images with embedded location data (EXIF GPS) 
                            included. Visitors to the website can download and extract any location data from images on the website.
                        </p>
                    </li>
                    <li>
                        <h3>Contact / Support forms</h3>
                        <p>
                            You should know that all the information inputted into the contact us form is stored and kept to help 
                            us better help you and respond appropriately to your need.
                        </p>
                    </li>
                    <li>
                        <h3>Embedded content from other websites</h3>
                        <p>
                            Articles on this site may include embedded content (e.g. videos, images, articles, etc.). Embedded content 
                            from other websites behaves in the exact same way as if the visitor has visited the other website. 
                            These websites may collect data about you, use cookies, embed additional third-party tracking, and monitor 
                            your interaction with that embedded content, including 
                            tracing your interaction with the embedded content if you have an account and are logged in to that website.
                        </p>
                    </li>
                    <li>
                        <h3>What rights you have over your data</h3>
                        <p>
                            If you have an account on this site, you can request to receive an exported file 
                            of the personal data we hold about you, including any data you have provided to us. You can also request 
                            that we erase any personal data we hold about you. This does not include any data we are obliged to keep 
                            for administrative, legal, or security purposes.
                        </p>
                    </li>
                </ul>
            </section>
        </PublicLayout>
    )
}

export default Privacy
