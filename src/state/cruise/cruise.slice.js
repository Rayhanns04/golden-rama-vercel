import { createSlice } from "@reduxjs/toolkit";

const initialState = { cruiseDetail: {} };

export const cruiseSlice = createSlice({
  name: "cruise",
  initialState,
  reducers: {
    checkoutData: (state, actions) => {
      state.cruiseDetail = actions.payload.cruiseDetail;
    },
    resetDataCruise: (state) => {
      state.transaction = {};
      state.cruiseDetail = {};
    },
  },
});

export const { checkoutData, resetDataCruise } = cruiseSlice.actions;

export default cruiseSlice.reducer;
