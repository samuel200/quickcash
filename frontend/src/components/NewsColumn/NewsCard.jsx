import React from 'react'

export default function NewsCard({img, source, time, topic, body, post_url}) {
    
    return (
        <div className="col s12 m6 l4">
            <div className="row">
                <div className="col s12 m12 l12">
                    <div className="card">
                        <div className="card-image">
                            <img src={ img } style={{height: "170px"}}/>
                        </div>
                        <div className="card-content" style={{height: "250px", overflowY: "auto"}}>
                            <div className="description">
                                <span className="news-type">{ source }</span>
                                <span className="news-time">{ time }</span>
                            </div>
                            <h4>{ topic }</h4>
                            <p>{ body }</p>
                        </div>
                        <div className="card-action right-align">
                            <a href={post_url}>Read More</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
