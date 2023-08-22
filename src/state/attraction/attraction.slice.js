import { createSlice } from "@reduxjs/toolkit";

const initialState = { attractionDetail: {}, transaction: {} };

export const attractionSlice = createSlice({
  name: "attraction",
  initialState,
  reducers: {
    checkoutData: (state, actions) => {
      state.attractionDetail = actions.payload.attractionDetail;
    },
    paymentData: (state, actions) => {
      state.transaction = actions.payload.transaction;
    },
    resetDataAttraction: (state) => {
      state.transaction = {};
      state.attractionDetail = {};
    },
  },
});

export const { checkoutData, paymentData, resetDataAttraction } =
  attractionSlice.actions;

export default attractionSlice.reducer;
