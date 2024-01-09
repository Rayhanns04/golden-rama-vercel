import { createSlice } from "@reduxjs/toolkit";

const initialState = { tourDetail: {}, transaction: {} };

export const tourSlice = createSlice({
  name: "tour",
  initialState,
  reducers: {
    checkoutData: (state, actions) => {
      state.tourDetail = actions.payload.tourDetail
    },
    paymentData: (state, actions) => {
      state.transaction = actions.payload.transaction
    },
    resetDataTour: (state) => {
      state.transaction = {}
      state.tourDetail = {} 
    }
  },
});

export const { checkoutData, paymentData, resetDataTour } = tourSlice.actions;

export default tourSlice.reducer;
