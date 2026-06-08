import axios from "axios";
import React, { useEffect } from "react";
import { ServelURL } from "../App";
import { useDispatch, useSelector } from "react-redux";
import { setStoryList } from "../redux/storySlice";

const useGetAllFollowersStory = () => {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);

  useEffect(() => {
    async function fetchFollowerStories() {
      try {
        const res = await axios.get(`${ServelURL}/api/story/followerstory`, {
          withCredentials: true,
        });

        if (res?.data) {
          dispatch(setStoryList(res.data));
        }
      } catch (e) {
        console.log("ERROR fetching follower stories:", e);
      }
    }

    if (userData) fetchFollowerStories();
  }, [userData, dispatch]);
};

export default useGetAllFollowersStory;
