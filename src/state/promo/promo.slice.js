import { createSlice } from "@reduxjs/toolkit";

const initialState = { promoDetail: {} };

export const promoSlice = createSlice({
  name: "promo",
  initialState,
  reducers: {
    detail: (state, actions) => {
      state.promoDetail = actions.payload.promoDetail;
    },
  },
});

export const { detail } = promoSlice.actions;

export default promoSlice.reducer;
