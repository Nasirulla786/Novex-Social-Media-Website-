import axios from 'axios';
import React, { useState } from 'react';
import { Check, UserPlus } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { ServelURL } from '../App';
import { toggleFollow, setFollwingdata } from '../redux/userSlice';

const FollowButton = ({ targetUserID, tailwind }) => {
  const { following, profileData } = useSelector((state) => state.user);
  const isFollowing = following.includes(targetUserID);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const handleFollow = async (e) => {
    e.stopPropagation();
    try {
      setLoading(true);
      const res = await axios.get(`${ServelURL}/api/user/follow/${targetUserID}`, {
        withCredentials: true,
      });

      dispatch(toggleFollow(targetUserID));

      if (profileData && profileData._id === targetUserID) {
        dispatch(
          setFollwingdata({
            followers: res.data.followers,
          })
        );
      }
    } catch (error) {
      console.log('Follow error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      className={`${tailwind} font-semibold px-4 py-2 rounded-full transition-all duration-200 ${
        isFollowing
          ? 'bg-green-500 text-white hover:bg-green-600'
          : 'bg-yellow-500 text-black hover:bg-yellow-600'
      }`}
      onClick={handleFollow}
      disabled={loading}
    >
      {loading ? (
        'Loading...'
      ) : isFollowing ? (
        <span className="flex items-center gap-2">
          <Check size={16} /> Following
        </span>
      ) : (
        <span className="flex items-center gap-2">
          <UserPlus size={16} /> Follow
        </span>
      )}
    </button>
  );
};

export default FollowButton;
