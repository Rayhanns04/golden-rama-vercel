import { createSlice } from "@reduxjs/toolkit";

const initialState = { hotelDetail: {}, transaction: {} };

export const hotelSlice = createSlice({
  name: "hotel",
  initialState,
  reducers: {
    checkoutData: (state, actions) => {
      state.hotelDetail = actions.payload.hotelDetail;
    },
    paymentData: (state, actions) => {
      state.transaction = actions.payload.transaction;
    },
    resetDataHotel: (state) => {
      state.transaction = {};
      state.hotelDetail = {};
    },
  },
});

export const { checkoutData, paymentData, resetDataHotel } = hotelSlice.actions;

export default hotelSlice.reducer;
