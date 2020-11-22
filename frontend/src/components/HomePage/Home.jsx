import React, { useContext, useEffect, useState } from 'react';
import Carousel from './Carousel';
import NewsSection from '../NewsColumn/NewsSection';
import PublicLayout from '../PublicLayout';
import { InView } from 'react-intersection-observer';
import { ToTopStore } from '../../Store/ToTopStore';


function shuffle(arra1) {
    var ctr = arra1.length, temp, index;

// While there are elements in the array
    while (ctr > 0) {
// Pick a random index
        index = Math.floor(Math.random() * ctr);
// Decrease ctr by 1
        ctr--;
// And swap the last element with it
        temp = arra1[ctr];
        arra1[ctr] = arra1[index];
        arra1[index] = temp;
    }
    return arra1;
}


export default function Home({news}) {
    const toTop = useContext(ToTopStore);
    const [newsCollection, setNewsCollection] = useState([]);

    useEffect(() => {
        setNewsCollection([
            {
                header: "Lates News",
                news: shuffle(news.news.filter(({ news_type }) => news_type == "top-headlines")).slice(0, 3)
            },
            {
                header: "Politics",
                news: shuffle(news.news.filter(({ news_type }) => news_type == "politics")).slice(0, 3)
            },
            {
                header: "Sports",
                news: shuffle(news.news.filter(({ news_type }) => news_type == "sports")).slice(0, 3)
            },
            {
                header: "Fashion",
                news: shuffle(news.news.filter(({ news_type }) => news_type == "fashion")).slice(0, 3)
            },
            {
                header: "Business",
                news: shuffle(news.news.filter(({ news_type }) => news_type == "business")).slice(0, 3)
            },
        ])
    }, [news])

    return (
        <PublicLayout>
            <Carousel />
            <InView as="div" onChange={(inView, entry) => {
                toTop.dispatch({ name: inView ? "NOT_TOP" : "AT_TOP" })
            }}>
                {newsCollection.map(({ header, news }) => <NewsSection header={header} news={news} />)}
            </InView>
        </PublicLayout>
    )
}
