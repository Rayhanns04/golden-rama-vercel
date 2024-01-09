import { createSlice } from "@reduxjs/toolkit";

const initialState = { packageDetail: {} };

export const packageSlice = createSlice({
  name: "package",
  initialState,
  reducers: {
    checkoutData: (state, actions) => {
      state.packageDetail = actions.payload.packageDetail;
    },
    resetDataPackage: (state) => {
      state.transaction = {};
      state.packageDetail = {};
    },
  },
});

export const { checkoutData, resetDataPackage } = packageSlice.actions;

export default packageSlice.reducer;
