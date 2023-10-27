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
    },
    checkoutData: (state, actions) => {
      state.orderDetail = actions.payload.orderDetail;
    },
    resetDataFlight: (state) => {
      state.data = {};
      state.query = {};
      state.orderDetail = {};
      state.isDomestic = {};
      state.addFee = {}
    },
  },
});

export const { orderData, checkoutData, resetDataFlight } = orderSlice.actions;

export default orderSlice.reducer;
