import axios from "axios";
import React, { useState } from "react";
import { ServelURL } from "../App";
import { useDispatch, useSelector } from "react-redux";
import { setSearchData } from "../redux/userSlice";
import { useNavigate } from "react-router-dom";

const Search = () => {
  const [searchValue, setSearchValue] = useState("");
  const { searchData } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!searchValue.trim()) return;
      const res = await axios.get(
        `${ServelURL}/api/user/search?keyword=${searchValue}`,
        { withCredentials: true }
      );
      if (res) {
        dispatch(setSearchData(res.data));
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#0a0a0a] flex flex-col items-center text-white px-4 relative">
      {/* ⬅️ Back Button */}
      <button
        onClick={() => navigate("/")}
        className="absolute top-6 left-6 flex items-center gap-2 text-yellow-400 font-medium bg-black/40 border border-yellow-500 rounded-full px-4 py-2 hover:bg-yellow-500 hover:text-black transition-all shadow-[0_0_10px_rgba(255,255,0,0.3)]"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2.2}
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Home
      </button>

      {/* 🔍 Search Bar */}
      <form
        onSubmit={handleSubmit}
        className="w-full sm:w-[500px] md:w-[600px] mt-20 flex items-center bg-[#111] border border-yellow-400 rounded-full shadow-[0_0_15px_rgba(255,255,0,0.2)] px-4 py-2 transition-all focus-within:shadow-[0_0_25px_rgba(255,255,0,0.5)]"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="#FFD700"
          className="w-5 h-5 mr-2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 100-15 7.5 7.5 0 000 15z"
          />
        </svg>
        <input
          type="text"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder="Search user..."
          className="flex-1 bg-transparent outline-none text-yellow-400 placeholder-gray-500"
        />
      </form>

      {/* ⚡ Search Results */}
      <div className="w-full sm:w-[500px] md:w-[600px] mt-8">
        {searchData?.length > 0 ? (
          <div className="flex flex-col divide-y divide-gray-800">
            {searchData.map((e) => (
              <div
                key={e._id}
                className="flex items-center gap-3 p-3 hover:bg-[#1a1a1a] cursor-pointer transition-all rounded-xl group"
                onClick={() => navigate(`/profile/${e?.userName}`)}
              >
                <img
                  src={
                    e?.profileImage ||
                    "https://cdn-icons-png.flaticon.com/512/847/847969.png"
                  }
                  alt="Profile"
                  className="w-12 h-12 rounded-full object-cover border-2 border-yellow-400 group-hover:scale-105 transition-transform"
                />
                <div className="flex flex-col">
                  <span className="text-yellow-400 font-semibold text-lg tracking-wide">
                    {e.userName}
                  </span>
                  <span className="text-gray-400 text-sm">{e.name}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center mt-10 text-sm">
            No users found
          </p>
        )}
      </div>

      {/* ⚙️ Brand Footer */}
      <footer className="mt-auto mb-5 text-gray-600 text-sm">
        Powered by <span className="text-yellow-400 font-semibold">Novex</span>
      </footer>
    </div>
  );
};

export default Search;
