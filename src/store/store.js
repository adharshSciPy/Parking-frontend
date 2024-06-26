import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import authSlices from "../slices/state/authSlices";
import notificationSlices from "../slices/state/notificationSlice";
import { apiSlice } from "../slices/api/apiSlice";
import userFloorslice from "../slices/state/userFloorslice";

const store = configureStore({
    reducer: {
        auth: authSlices,
        userFloor: userFloorslice,
        notification: notificationSlices,
        [apiSlice.reducerPath]: apiSlice.reducer
    },
    middleware: (getDefaultMiddleware) => {
        return getDefaultMiddleware().concat(apiSlice.middleware)
    }
});

setupListeners(store.dispatch)

export default store;