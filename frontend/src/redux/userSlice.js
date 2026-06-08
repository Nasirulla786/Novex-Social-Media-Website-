import { createSlice } from "@reduxjs/toolkit"

const UserSlice = createSlice({
  name: "User",
  initialState: {
    userData: null,
    suggestedusers: null,
    profileData: null,
    following: [],
    searchData :[]
  },
  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload;
    },
    setSuggestesUsers: (state, action) => {
      state.suggestedusers = action.payload;
    },
    setSearchData: (state, action) => {
      state.searchData = action.payload;
    },
    setProfiledata: (state, action) => {
      if (Array.isArray(action.payload)) {
        console.warn("⚠️ Attempted to set profileData with array, ignored");
        return;
      }
      state.profileData = action.payload;
    },
    setFollwingdata: (state, action) => {
      if (state.profileData) {
        state.profileData = { ...state.profileData, ...action.payload };
      }
    },
    setFollowing: (state, action) => {
      state.following = action.payload || [];
    },
    toggleFollow: (state, action) => {
      const targetUserID = action.payload;
      if (state.following.includes(targetUserID)) {
        state.following = state.following.filter((id) => id !== targetUserID);
      } else {
        state.following.push(targetUserID);
      }
    },
  },
});

export const {
  setUserData,
  setSuggestesUsers,
  setProfiledata,
  setFollowing,
  toggleFollow,
  setFollwingdata,
  setSearchData,
} = UserSlice.actions;

export default UserSlice.reducer;
