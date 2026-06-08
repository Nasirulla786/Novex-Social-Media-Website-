import React, { useEffect, useRef, useState } from "react";
import { Heart, MessageCircle, Volume2, VolumeX, ArrowLeft } from "lucide-react"; // 🆕 ArrowLeft icon
import axios from "axios";
import { ServelURL } from "../App";
import { useDispatch, useSelector } from "react-redux";
import dp from "../../public/images/default.jpeg";
import FollowButton from "./FollowButton";
import { setLoopData } from "../redux/loopSlice";
import { useNavigate } from "react-router-dom"; // 🆕 for navigation

const LoopCard = ({ video }) => {
  const videoRef = useRef(null);
  const [isMuted, setIsMuted] = useState(true);
  const [loopLike, setLoopLike] = useState(video.like || []);
  const { userData } = useSelector((state) => state.user);
  const [progressBar, setProgressBar] = useState(0);
  const [showComment, setShowComment] = useState(false);
  const [comment, setComment] = useState("");
  const [localVideo, setLocalVideo] = useState(video);
  const { loopData } = useSelector((state) => state.loop);
  const dispatch = useDispatch();
  const navigate = useNavigate(); // 🆕 navigation hook

  // ✅ Keep likes in sync if Redux updates
  useEffect(() => {
    setLoopLike(localVideo.like || []);
  }, [localVideo.like]);

  // ✅ Play/pause video when visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        const vid = videoRef.current;
        if (!vid) return;
        if (entry.isIntersecting) vid.play();
        else vid.pause();
      },
      { threshold: 0.6 }
    );

    const vidEl = videoRef.current;
    if (vidEl) observer.observe(vidEl);

    return () => {
      if (vidEl) observer.unobserve(vidEl);
      observer.disconnect();
    };
  }, []);

  // ✅ Toggle mute
  const handleMuteToggle = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  // ✅ Handle like/unlike
  const handleLike = async () => {
    try {
      const res = await axios.get(`${ServelURL}/api/loop/like/${video._id}`, {
        withCredentials: true,
      });
      setLoopLike(res.data.like || []);
      setLocalVideo((prev) => ({
        ...prev,
        like: res.data.like || [],
        author: prev.author,
      }));
    } catch (error) {
      console.error("like error:", error);
    }
  };

  // ✅ Handle progress bar
  const handleProgressBar = () => {
    try {
      const vid = videoRef.current;
      const percentage = (vid.currentTime / vid.duration) * 100;
      setProgressBar(percentage);
    } catch (error) {
      console.log(error);
    }
  };

  // ✅ Handle posting a comment
  const handleComment = async () => {
    if (!comment.trim()) return;
    try {
      const res = await axios.post(
        `${ServelURL}/api/loop/comment/${video._id}`,
        { message: comment },
        { withCredentials: true }
      );

      setComment("");
      setLocalVideo((prev) => ({
        ...res.data,
        author: prev.author || res.data.author,
      }));

      const updatedLoops = loopData.map((l) =>
        l._id === video._id
          ? { ...res.data, author: l.author || res.data.author }
          : l
      );
      dispatch(setLoopData(updatedLoops));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center bg-black text-white overflow-hidden">
      {/* 🆕 Back Button */}
      <button
        onClick={() => navigate("/")}
        className="absolute top-4 left-4 bg-black/60 p-2 rounded-full hover:bg-black/80 transition z-50"
      >
        <ArrowLeft className="text-white" size={22} />
      </button>

      {/* Video Section */}
      <video
        ref={videoRef}
        src={localVideo.media}
        autoPlay
        loop
        muted={isMuted}
        playsInline
        className="h-screen w-[500px]"
        onTimeUpdate={handleProgressBar}
      />

      {/* Mute Button */}
      <button
        onClick={handleMuteToggle}
        className="absolute top-4 right-4 bg-black/60 p-2 rounded-full hover:bg-black/80 transition"
      >
        {isMuted ? (
          <VolumeX className="text-white" size={22} />
        ) : (
          <Volume2 className="text-white" size={22} />
        )}
      </button>

      {/* Right Sidebar */}
      <div className="absolute right-4 bottom-24 flex flex-col items-center gap-6">
        {/* Like */}
        <div
          onClick={handleLike}
          className="flex flex-col items-center justify-center gap-1 cursor-pointer"
        >
          {userData && loopLike.includes(userData._id) ? (
            <Heart className="fill-red-500" size={36} />
          ) : (
            <Heart className="text-white" size={36} />
          )}
          <span className="text-sm text-gray-200 font-medium">
            {loopLike?.length || 0}
          </span>
        </div>

        {/* Comment */}
        <div className="flex flex-col items-center justify-center gap-1 cursor-pointer">
          <MessageCircle
            className="text-white"
            size={32}
            onClick={() => setShowComment(true)}
          />
          <span className="text-sm text-gray-200 font-medium">
            {localVideo?.comments?.length || 0}
          </span>
        </div>
      </div>

      {/* Bottom User Info */}
      <div className="absolute bottom-6 left-4 w-[90%] flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <img
            src={localVideo?.author?.profileImage || dp}
            onError={(e) => (e.target.src = dp)}
            alt="profile"
            className="w-10 h-10 rounded-full object-cover border border-gray-600"
          />
          <h1 className="font-semibold text-sm">
            {localVideo?.author?.userName}
          </h1>
          <FollowButton
            tailwind="text-white border border-white rounded-md px-3 py-[2px] text-xs font-medium hover:bg-white hover:text-black transition"
            targetUserID={localVideo?.author?._id}
          />
        </div>

        {/* Caption */}
        <p className="text-sm font-light leading-tight text-white">
          {localVideo?.caption}
        </p>

        {/* Progress Bar */}
        <div className="bg-white h-[8px]" style={{ width: `${progressBar}%` }} />
      </div>

      {/* Comment Section */}
      <div
        onClick={() => setShowComment(false)}
        className={`fixed inset-0 bg-black/50 z-[90] transition-opacity duration-500 ${
          showComment ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />
      <div
        className={`fixed bottom-0 left-0 w-full z-[100] bg-white text-black rounded-t-xl shadow-xl transform transition-transform duration-500 ease-in-out ${
          showComment ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="flex justify-between items-center px-4 py-3 border-b bg-yellow-400 border-gray-300">
          <h2 className="text-lg font-semibold">Comments</h2>
          <button
            onClick={() => setShowComment(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="p-4 h-[400px] overflow-y-auto bg-black">
          {localVideo?.comments?.length > 0 ? (
            localVideo.comments.map((comment, idx) => (
              <div key={idx} className="flex items-start gap-2 mb-3">
                <img
                  src={comment?.author?.profileImage || dp}
                  onError={(e) => (e.target.src = dp)}
                  alt="profile"
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <p className="text-sm font-semibold text-white">
                    {comment?.author?.userName}
                  </p>
                  <p className="text-sm text-white">
                    {comment.text || comment.message || comment.content}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">No comments yet</p>
          )}
        </div>

        <div className="border-t border-gray-300 p-3 flex items-center bg-black">
          <input
            type="text"
            placeholder="Add a comment..."
            className="flex-1 px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleComment();
            }}
          />
          <button
            className="ml-2 px-3 py-2 bg-red-500 text-black text-sm rounded-md hover:bg-red-600 transition"
            onClick={handleComment}
          >
            Post
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoopCard;
