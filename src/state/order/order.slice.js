import { createSlice } from "@reduxjs/toolkit";

const initialState = { data: {}, query: {} };

export const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    orderData: (state, actions) => {
      state.data = {
        flights: actions.payload.data,
      };
      state.isDomestic = actions.payload.isDomestic;
      state.query = actions.payload.query;
      state.addFee = actions.payload.addFee;
      state.isSmartCombo = actions.payload.isSmartCombo
    },
    checkoutData: (state, actions) => {
      state.orderDetail = actions.payload.orderDetail;
      state.transaction = actions.payload.transaction;
    },
    resetDataFlight: (state) => {
      state.data = {};
      state.query = {};
      state.orderDetail = {};
      state.isDomestic = {};
      state.addFee = {}
      state.transaction = {}
    },
  },
});

export const { orderData, checkoutData, resetDataFlight } = orderSlice.actions;

export default orderSlice.reducer;
