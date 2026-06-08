import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ServelURL } from "../App";
import { setSuggestesUsers } from "../redux/userSlice";

const SuggestedUsers = () => {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchSuggestedUser = async () => {
      try {
        const res = await axios.get(`${ServelURL}/api/user/suggest`,{withCredentials:true});
        if(res){
            dispatch(setSuggestesUsers(res.data))
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchSuggestedUser()
  }, [userData]);
};

export default SuggestedUsers;
