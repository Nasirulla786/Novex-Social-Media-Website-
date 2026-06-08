import React from "react";
import { Logo } from "../pages/Signup";
import { Heart } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import defaultImage from "../../public/images/default.jpeg";
import axios from "axios";
import { ServelURL } from "../App";
import { setUserData } from "../redux/userSlice";
import { useNavigate } from "react-router-dom";
import GetCureentUserData from "../hooks/GetCureentUserData";
import OtherProfile from "./OtherProfile";

const LeftHome = () => {
  GetCureentUserData();
  const { userData, suggestedusers } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const res = await axios.get(`${ServelURL}/api/auth/logout`, {
        withCredentials: true,
      });
      dispatch(setUserData(null));
      navigate("/signup");

      if (res) {
        alert("Logged out successfully!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="hidden sm:flex sm:flex-col sm:w-[28%] min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(255,209,102,0.16),_transparent_22%),linear-gradient(180deg,_rgba(6,7,13,0.95),_rgba(3,5,11,1))] text-white border-r border-white/10 shadow-2xl overflow-y-auto px-4 py-6 glass-card">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Logo className="brand-logo" />
        </div>
        <Heart className="text-yellow-300 cursor-pointer hover:scale-110 transition-transform" />
      </div>

      <div className="glass-panel rounded-3xl p-5 mb-6 border border-white/10 shadow-xl shadow-black/20">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-[60px] h-[60px] rounded-full overflow-hidden border border-white/10 shadow-inner shadow-black/40">
            <img
              src={userData?.profileImage || defaultImage}
              alt="User"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h1 className="font-semibold text-lg text-white">{userData?.name}</h1>
            <p className="text-gray-400 text-sm">@{userData?.userName}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 text-center">
          <div className="rounded-2xl bg-white/5 p-3">
            <p className="text-sm text-gray-400">Followers</p>
            <p className="font-semibold text-white">{userData?.followers?.length || 0}</p>
          </div>
          <div className="rounded-2xl bg-white/5 p-3">
            <p className="text-sm text-gray-400">Following</p>
            <p className="font-semibold text-white">{userData?.following?.length || 0}</p>
          </div>
        </div>
      </div>

      <div className="px-1 py-4">
        <h2 className="font-semibold text-white text-lg mb-4 tracking-wide">
          Suggested for you
        </h2>

        <div className="flex flex-col gap-4">
          {suggestedusers && suggestedusers.length > 0 ? (
            suggestedusers.slice(0, 3).map((value, idx) => (
              <div
                key={idx}
                className="glass-panel rounded-3xl p-3 hover:border-pink-500/40 hover:shadow-xl transition-all"
              >
                <OtherProfile user={value} />
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-sm">No suggestions available.</p>
          )}
        </div>
      </div>

      <div className="mt-auto py-4 text-center text-xs text-gray-400">
        © {new Date().getFullYear()} <span className="text-yellow-300 font-semibold">Novex</span>
      </div>
    </div>
  );
};

export default LeftHome;
