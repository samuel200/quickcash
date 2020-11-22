import React, { createContext, useReducer } from 'react';

export const context = createContext();

const defaultTokenValue = localStorage.getItem('authenticationToken');
const defaultUserValue = JSON.parse(localStorage.getItem('authenticatedUser'));
const defaultLoggedIn = JSON.parse(localStorage.getItem('loggedIn'));

const initialState = {
    token: defaultTokenValue ? defaultTokenValue : null,
    authenticatedUser: defaultUserValue ? defaultUserValue : null,
    loggedIn: defaultLoggedIn ? defaultLoggedIn : false
}

const userReducer = (action, state)=>{
    switch(action.type){
        case "LOGIN_USER":
            localStorage.setItem("loggedIn", JSON.stringify(action.payload));
            return {...state, loggedIn: action.payload}

        case "UPDATE_USER":
            localStorage.setItem("authenticatedUser", JSON.stringify(action.payload))
            return {...state, authenticatedUser: action.payload}
            
        case "UPDATE_TOKEN":
            localStorage.setItem("authenticationToken", action.payload)
            return {...state, token: action.payload}

        case "LOGOUT_USER":
            localStorage.removeItem("authenticationToken");
            localStorage.removeItem("authenticatedUser");
            localStorage.removeItem("loggedIn");
            return {loggedIn: false, authenticatedUser: null, authenticationToken: null}

        default:
            return state
    }

}

export const UserProvider = ({children})=>{
    const [state, dispatch] = useReducer(userReducer, initialState);
    return(
        <context.Provider value={{state, dispatch}}>
            {children}
        </context.Provider>
    )
}
