import { createSlice } from "@reduxjs/toolkit";

const initialState = { transaction: {} };

export const travelSlice = createSlice({
    name: "travelcard",
    initialState,
    reducers: {
        paymentData: (state, actions) => {
            state.transaction = actions.payload.transaction;
        },
        resetDataHotel: (state) => {
            state.transaction = {};
        },
    },
});

export const { paymentData, resetDataHotel } = travelSlice.actions;

export default travelSlice.reducer;
