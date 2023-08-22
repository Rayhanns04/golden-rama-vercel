import { combineReducers, configureStore } from "@reduxjs/toolkit";
import orderReducer from "./order/order.slice";
import tourReducer from "./tour/tour.slice";
import authReducer from "./auth/auth.slice";
import packageReducer from "./package/package.slice";
import attractionReducer from "./attraction/attraction.slice";
import cruiseReducer from "./cruise/cruise.slice";
import hotelReducer from "./hotel/hotel.slice";
import insuranceReducer from "./insurance/insurance.slice";
import promoReducer from "./promo/promo.slice";
import prebookingReducer from "./prebooking/prebooking.slice";
import travelcardReducer from "./travelcard/travelcard.slice";

import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import thunk from "redux-thunk";

const persistConfig = {
  key: "root",
  storage,
  whitelist: [
    "orderReducer",
    "tourReducer",
    "attractionReducer",
    "hotelReducer",
    "cruiseReducer",
    "packageReducer",
    "attractionReducer",
    "authReducer",
    "insuranceReducer",
    "promoReducer",
    "travelcardReducer",
    "prebookingReducer",
  ],
};

const rootReducer = combineReducers({
  orderReducer,
  packageReducer,
  cruiseReducer,
  tourReducer,
  authReducer,
  attractionReducer,
  hotelReducer,
  insuranceReducer,
  promoReducer,
  travelcardReducer,
  prebookingReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  devTools: true,
  middleware: [thunk],
});

export const persistor = persistStore(store);
