import React from 'react'

import './news.css'
import PublicLayout from '../PublicLayout'

function NewsPage() {
    return (
        <PublicLayout>
            <div id="news-head">
                <img src={require('../../img/aerial-architectural-design-architecture-buildings-373912.jpg')} alt="aerial-architectural-design-architecture-buildings-373912" />
                <div>
                    <span className="black-text">Politics</span>
                    <span>24th May, 2020.</span>
                </div>
            </div>
            <div id="news-body">
                <div className="news-section-heading">
                    <hr />
                    <h2>Topic Of The News That Was Opened</h2>
                </div>
                <div className="container">
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean mattis volutpat neque quis euismod. Nam laoreet orci pellentesque dictum semper. Nam posuere hendrerit purus non lacinia. Ut condimentum tincidunt tincidunt. Suspendisse sed purus nisl. Maecenas porta porta ante. In imperdiet quis purus ac pulvinar. Sed eleifend velit nec elementum volutpat. Sed sapien enim, mollis fringilla nisl at, facilisis porta justo. Integer purus risus, sagittis eget neque vel, aliquet posuere libero. Ut justo dolor, finibus rutrum turpis in, fringilla dignissim mauris. Praesent imperdiet ut urna auctor efficitur.
                    <br />
                        <br />
                    Nulla eu consequat metus, ultricies imperdiet felis. Integer ut turpis tempus, accumsan orci congue, suscipit justo. Curabitur vitae augue vitae ligula finibus blandit. Nulla facilisi. Aliquam tempus sapien purus, a cursus leo dignissim a. Pellentesque eu diam dapibus, tristique velit sit amet, fringilla tortor. In luctus neque quis ligula aliquet, vitae convallis sem ornare. Suspendisse tellus nisi, vestibulum non fermentum sed, tincidunt et nisi. Phasellus ut tincidunt lorem, aliquet iaculis felis. Praesent rutrum tortor non sapien sollicitudin porta. Fusce rutrum ligula vel nulla mollis aliquam.
                    <br />
                        <br />
                    Quisque et erat justo. Nulla et nisi viverra, efficitur ante sed, bibendum nisl. Pellentesque ut dolor at tellus blandit convallis. Sed euismod efficitur tellus, sed ultrices risus volutpat eget. Nunc ultricies pretium massa vel maximus. Etiam ac lacinia urna. Quisque suscipit interdum magna, ac ornare eros pellentesque quis. Mauris nisi elit, cursus a auctor ac, efficitur vel enim. Proin tempor tristique lacus a laoreet. Maecenas massa odio, varius ornare metus nec, venenatis elementum nibh. Aliquam lobortis, erat nec hendrerit consectetur, arcu tortor blandit ligula, et consectetur massa arcu et libero. Nam congue ligula lacinia, luctus odio ac, fringilla elit.</p>
                </div>
            </div>
            <div id="news-foot" className="container">
                <a href="#">&lt;{" "}Previous News Topic</a>
                <a href="#">Previous News Topic{" "}&gt;</a>
            </div>
        </PublicLayout>
    )
}

export default NewsPage
