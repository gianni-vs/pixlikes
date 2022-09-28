import { configureStore } from "@reduxjs/toolkit";
import unsplashReducer from "../features/unsplash/unsplashSlice";
import pixlikesSlice from "../features/pixlikes/pixlikesSlice";

export const store = configureStore({
  reducer: {
    pixlikes: pixlikesSlice,
    unsplash: unsplashReducer,
  },
  devTools: false,
});
