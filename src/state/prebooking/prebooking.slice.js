import { createSlice } from "@reduxjs/toolkit";

const initialState = { prebookingDetail: {} };

export const prebookingSlice = createSlice({
  name: "prebooking",
  initialState,
  reducers: {
    checkoutData: (state, actions) => {
      state.prebookingDetail = actions.payload.prebookingDetail;
    },
    resetDataPrebooking: (state) => {
      state.transaction = {};
      state.prebookingDetail = {};
    },
  },
});

export const { checkoutData, resetDataPrebooking } = prebookingSlice.actions;

export default prebookingSlice.reducer;
