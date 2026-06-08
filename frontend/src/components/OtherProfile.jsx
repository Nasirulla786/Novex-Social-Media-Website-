import React from "react";
import defaultImage from "../../public/images/default.jpeg";
import { useNavigate } from "react-router-dom";
import FollowButton from "./FollowButton";

const OtherProfile = ({ user }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/profile/${user.userName}`)}
      className="flex justify-between items-center cursor-pointer"
    >
      <div className="flex items-center gap-2.5">
        <div className="w-[50px] h-[50px] rounded-full overflow-hidden">
          <img
            src={user?.profileImage || defaultImage}
            alt="None"
            className="w-full h-full object-cover rounded-full"
          />
        </div>

        <div>
          <h1 className="font-bold font-sans text-[12px]">{user?.name}</h1>
          <h1 className="font-semibold text-[10px] text-gray-400">
            {user?.userName}
          </h1>
        </div>
      </div>

      <FollowButton
        tailwind={
          "w-[100px] h-[30px] text-black bg-white rounded-2xl cursor-pointer flex items-center justify-center text-[12px]"
        }
        targetUserID={user?._id}
      />
    </div>
  );
};

export default OtherProfile;
