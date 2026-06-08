import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import dp from "../../public/images/default.jpeg"
import { PlusIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const StoryDP = ({ profileImage, username, story }) => {
  const { userData } = useSelector(state => state.user);
  const navigate = useNavigate();
  const [seenStoryIds, setSeenStoryIds] = useState(() => {
    if (typeof window === 'undefined') return [];
    try {
      return JSON.parse(localStorage.getItem('seenStories') || '[]');
    } catch {
      return [];
    }
  });

  const isStoryEmpty = !story || Object.keys(story).length === 0;
  const storyKey = story?._id || username;
  const isSeen = !isStoryEmpty && seenStoryIds.includes(storyKey);
  const borderClass = !isStoryEmpty
    ? isSeen
      ? 'border-[5px] border-gray-400'
      : 'border-[5px] border-pink-500'
    : '';

  const markAsSeen = () => {
    if (!storyKey || isSeen) return;
    const updated = Array.from(new Set([...seenStoryIds, storyKey]));
    setSeenStoryIds(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('seenStories', JSON.stringify(updated));
    }
  };

  const handleClick = () => {
    if (!isStoryEmpty) {
      markAsSeen();
    }

    if (isStoryEmpty && username === "your story") {
      navigate("/uploadpost");
    } else if (!isStoryEmpty && username === "your story") {
      navigate(`/story/${userData?.userName}`);
    } else {
      navigate(`/story/${username}`);
    }
  }

  return (
    <div className='flex flex-col items-center justify-center gap-2 cursor-pointer' onClick={handleClick}>
      <div
        className={`w-[90px] h-[90px] rounded-full relative ${borderClass}`}
      >
        <img
          src={profileImage || userData?.profileImage || dp}
          alt="Profile"
          className="w-full h-full object-cover rounded-full"
        />

        {username === "your story" && (
          <PlusIcon className='bg-white text-black w-6 h-6 rounded-full absolute bottom-0 right-0' />
        )}
      </div>

      <h1>{username || userData?.userName}</h1>
    </div>
  )
}

export default StoryDP;
