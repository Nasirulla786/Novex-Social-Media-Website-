import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice.js";
import storySlice from "./storySlice.js"
import loopSlice from "./loopSlice.js"
import postSlice from "./postSlice.js"
import commentSlice from "./commentSlice.js"




const Store = configureStore({
  reducer: {
    user: userReducer,
    story: storySlice,
    loop: loopSlice,
    post :postSlice,
    comment :commentSlice,

  },
});

export default Store;
