import React from 'react'
import NewsCard from './NewsCard'

export default function NewsSection({ header, news }) {
    return (
        <div className="container news-section">
            <div className="news-section-heading">
                <hr/>
                <h2>{ header }</h2>
            </div>
            <div className="news-section-body row">
                {
                    news.map(({image_url, published_at, title, description, post_url, source})=><NewsCard img={image_url} time={published_at} topic={title} body={description} post_url={ post_url } source={ source }/>)
                }     
            </div>
        </div>
    )
}
