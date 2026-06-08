import axios from "axios";
import React, { useEffect } from "react";
import { ServelURL } from "../App";
import { useDispatch, useSelector } from "react-redux";
import { setFollowing, setFollwingdata, setUserData } from "../redux/userSlice";

const GetCureentUserData = () => {
  const dispatch = useDispatch();
  const {storyData}  = useSelector(state=>state.story);

  useEffect(() => {
    async function fetchCurrentUser() {
      try {
        const fetchUser = await axios.get(`${ServelURL}/api/user/current`, {
          withCredentials: true,
        });

        if (fetchUser) {
          dispatch(setUserData(fetchUser.data));
          dispatch(setFollowing(fetchUser.data.following || []));
        }
      } catch (e) {
        console.log("ERROR", e);
      }
    }

    fetchCurrentUser();
  }, [storyData]);
};





export default GetCureentUserData;
