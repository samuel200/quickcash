import React, { createContext, useReducer, useEffect, useState } from "react";
import Auth from "../Auth";

export const context = createContext();

const initialState = JSON.parse(localStorage.getItem('savedAuthObject')) || {authenticatedUser: null, authenticationToken: null, isAuthenticated: null};

const userReducer = (action, state) => {
  switch (action.type) {
    case "LOGIN_USER":
      return {...state, ...(JSON.parse(localStorage.getItem('savedAuthObject')))};

    case "UPDATE_USER":
      return {...state, ...(JSON.parse(localStorage.getItem('savedAuthObject')))};


    case "UPDATE_TOKEN":
      return { ...state, token: action.token };

    case "LOGOUT_USER":
      return {...state, ...(JSON.parse(localStorage.getItem('savedAuthObject')))};

    default:
      return state;
  }
};

export const UserProvider = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, initialState);
  useEffect(() => {
  }, [state]);
  return (
    <context.Provider value={{ state, dispatch }}>{children}</context.Provider>
  );
};
