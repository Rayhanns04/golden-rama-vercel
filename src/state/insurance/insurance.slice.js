import { createSlice } from "@reduxjs/toolkit";

const initialState = { insuranceDetail: {} };

export const insuranceSlice = createSlice({
  name: "insurance",
  initialState,
  reducers: {
    checkoutData: (state, actions) => {
      state.insuranceDetail = actions.payload.insuranceDetail;
    },
    paymentData: (state, actions) => {
      state.transaction = actions.payload.transaction;
    },
    resetDataInsurance: (state) => {
      state.transaction = {};
      state.insuranceDetail = {};
    },
  },
});

export const { checkoutData, paymentData, resetDataInsurance } =
  insuranceSlice.actions;

export default insuranceSlice.reducer;
