import React, {useState, useEffect} from 'react'
import DashboardLayout from '../DashboardLayout'
import NewsSection from './NewsSection'

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

function NewsRoom({news}) {
    const [newsCollection, setNewsCollection] = useState({
        header: "News Room",
        news: shuffle(news.news ? news.news : []).slice(0, 40)
    })

    useEffect(()=>{
        setNewsCollection({
            header: "News Room",
            news: shuffle(news.news).slice(0, 40)
        })
    }, [news])

    return (
        <DashboardLayout className="white">
            <NewsSection header={ newsCollection.header } news={ newsCollection.news }/>
        </DashboardLayout>
    )
}

export default NewsRoom
