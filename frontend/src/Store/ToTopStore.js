import React, { createContext, useReducer } from 'react';

const initialState = { inView: false };
export const ToTopStore =  createContext()

const toTopReducer = (state, action)=>{
    switch(action.name){
        case "AT_TOP":
            return {inView: false};

        case "NOT_TOP":
            return {inView: true};

        default:
            return {inView: false};
    }
}

export const ToTopProvider = ({children})=>{
    const [state, dispatch] = useReducer(toTopReducer, initialState)
    return(
        <ToTopStore.Provider value={{state, dispatch}}>
            {children}
        </ToTopStore.Provider>
    )
}