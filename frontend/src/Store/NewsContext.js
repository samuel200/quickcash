import React, { createContext, useReducer, useState } from 'react';

export const newsContext = createContext();


export const NewsProvider = ({children})=>{
    const [initialState, setInitialState] = useState({
        topHeadlines: null,
        homeNewsSection :[
            {
            header: "Latest News",
            news: [
                    {
                        img: "https://materializecss.com/images/sample-1.jpg",
                        type: "politics",
                        time: "24th May, 2020.",
                        topic: "Why Nigeria is a mess",
                        body: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Adipisci cupiditate a facilis quidem inventore repellat sed laboriosam quibusdam"
                    },
                    {
                        img: "https://materializecss.com/images/sample-1.jpg",
                        type: "business",
                        time: "24th May, 2020.",
                        topic: "Why Nigeria is a mess",
                        body: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Adipisci cupiditate a facilis quidem inventore repellat sed laboriosam quibusdam"
                    },
                    {
                        img: "https://materializecss.com/images/sample-1.jpg",
                        type: "sports",
                        time: "24th May, 2020.",
                        topic: "Why Nigeria is a mess",
                        body: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Adipisci cupiditate a facilis quidem inventore repellat sed laboriosam quibusdam"
                    },
                ]
            },
        ]
    })

    const newsReducer = (state, action)=>{
        switch(action.type){
            case "LOAD_HOME_NEWS":
                const homeNewsSection = state.homeNewsSection;
                homeNewsSection.push({header: action.payload.header, news: action.payload.news})
                const newState = {...state, homeNewsSection};
                setInitialState(newState);
                return newState
    
            default:
                return state
        }
    }

    const [state, dispatch] = useReducer(newsReducer, initialState);

    return (
        <newsContext.Provider value={{state, dispatch}}>
            {children}
        </newsContext.Provider>
    )
}
