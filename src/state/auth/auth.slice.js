import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  jwt: {},
  jwt_expiration: {},
  user: {},
  isLoggedIn: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginData: (state, actions) => {
      state.jwt = actions.payload.jwt;
      state.jwt_expiration = actions.payload.jwt_expiration;
      state.user = actions.payload.user;
      state.isLoggedIn = true;
    },
    userData: (state, actions) => {
      state.user = actions.payload;
    },
    logoutData: (state) => {
      state.jwt = {};
      state.jwt_expiration = {};
      state.user = {};
      state.isLoggedIn = false;
    },
  },
});

export const { loginData, logoutData, userData } = authSlice.actions;

export default authSlice.reducer;
