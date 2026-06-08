import React, { useState } from "react";
import { Heart, MessageCircle, MoreHorizontal } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { ServelURL } from "../App";
import { setPostData } from "../redux/postSlice";
import dp from "../../public/images/default.jpeg";
import FollowButton from "./FollowButton";

const Post = ({ post }) => {
  const formatTime = (dateString) => {
    const now = new Date();
    const postDate = new Date(dateString);
    const diffInMs = now - postDate;
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const { userData } = useSelector((state) => state.user);
  const { postData } = useSelector((state) => state.post);
  const dispatch = useDispatch();
  const [like, setLike] = useState(post.likes || []);
  const [message, setMessage] = useState("");

  const [showCommnet, setShowCommnet] = useState(false)
  // Handle Like
  const handleLike = async () => {
    try {
      const res = await axios.get(`${ServelURL}/api/post/like/${post._id}`, {
        withCredentials: true,
      });
      setLike(res.data.likes);
    } catch (error) {
      console.log(error);
    }
  };

  // Handle Comment
  const handleComment = async () => {
    if (!message.trim()) return;
    try {
      const res = await axios.post(
        `${ServelURL}/api/post/comment/${post._id}`,
        { message },
        { withCredentials: true }
      );

      setMessage("");

      // If backend returns updated post
      const updatedPost = res.data;
      const updatedPosts = postData.map((p) =>
        p._id === post._id ? updatedPost : p
      );
      dispatch(setPostData(updatedPosts));
    } catch (error) {
      console.log(error);
    }


  };


  // const handleFollow = async()=>{
  //   try {
  //     const res = await axios.get(`${ServelURL}/api/user/follow/${post.author._id}`,{withCredentials:true})
  //     console.log(res.data)

  //   } catch (error) {
  //     console.log(error)

  //   }
  // }







  return (
    <div className="w-full bg-white border-b border-gray-200 shadow-sm mb-6 rounded-xl overflow-hidden">
      {/* ====== Post Header ====== */}
  <div className="flex items-center justify-between">





        <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-3">
          <img
            src={post.author?.profileImage || dp}
            alt={post.author?.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <h3 className="font-semibold text-gray-900 text-sm">
              {post.author?.name}
            </h3>
            <p className="text-gray-500 text-xs">
              @{post.author?.userName} · {formatTime(post.createdAt)}
            </p>
          </div>
        </div>
        <MoreHorizontal className="w-5 h-5 text-gray-500 cursor-pointer" />
      </div>


      <div className="pr-3" >

{userData._id != post.author._id && <div>
          <FollowButton tailwind={"w-[120px] h-[40px] flex items-center justify-center bg-black text-white font-bold rounded cursor-pointer " } targetUserID={post.author._id} /></div>}
      </div>



  </div>

      {/* ====== Media ====== */}
      <div className="relative w-full flex items-center justify-center bg-white">
        {post.mediaType === "image" ? (
          <img
            src={post.media}
            alt={post.caption}
            className="w-full max-h-[500px] object-contain"
          />
        ) : post.mediaType === "video" ? (
          <video
            src={post.media}
            controls
            className="w-full max-h-[500px] object-contain"
          />
        ) : null}
      </div>

      {/* ====== Caption ====== */}
      {post.caption && (
        <div className="px-4 pb-2 pt-2">
          <p className="text-gray-900 text-sm">
            <span className="font-semibold">@{post.author?.userName}</span>{" "}
            {post.caption}
          </p>
        </div>
      )}

      {/* ====== Actions (Like + Comment) ====== */}
      <div className="flex items-center gap-5 px-4 py-2">
        <div
          className="flex items-center gap-1 cursor-pointer"
          onClick={handleLike}
        >
          {userData && !like.includes(userData._id) ? (
            <Heart className="text-black w-5 h-5" />
          ) : (
            <Heart className="fill-red-500 text-red-500 w-5 h-5" />
          )}
          <span className="text-sm text-gray-800">{like.length}</span>
        </div>

        <div className="flex items-center gap-1">
          <MessageCircle className="text-black w-5 h-5"  onClick={()=>{
            setShowCommnet(prev=>!prev)
          }}/>
          <span className="text-sm text-gray-800">{post.comments.length}</span>
        </div>
      </div>

      {/* ====== Comment Input ====== */}
      <div className="px-4 pb-4 rounded-lg">
   <div className="flex items-center gap-2 mb-3 w-full bg-[#0a0a0a] px-3 py-2 rounded-xl shadow-[0_0_10px_rgba(255,255,0,0.2)] border border-yellow-400 focus-within:shadow-[0_0_20px_rgba(255,255,0,0.5)] transition-all duration-300">
  {/* 📝 Input Field */}
  <input
    type="text"
    className="flex-1 bg-transparent text-yellow-300 placeholder-gray-500 px-2 py-2 outline-none text-sm sm:text-base"
    placeholder="Write your thoughts..."
    value={message}
    onChange={(e) => setMessage(e.target.value)}
  />

  {/* 🚀 Submit Button */}
  <button
    onClick={handleComment}
    className="bg-yellow-400 text-black font-semibold px-4 py-2 rounded-full hover:bg-yellow-300 active:scale-95 transition-all duration-200"
  >
    Add Comment
  </button>
</div>


        {/* ====== Comments List ====== */}
        <div className={showCommnet?"space-y-2 block": "hidden"}>
          {post?.comments?.map((e, idx) => (

            <div
              key={e._id || idx}
              className="flex items-start gap-2 bg-gray-100 rounded-lg p-2"
            >
              <img
                src={e.author?.profileImage || dp}
                alt="profile"
                className="w-8 h-8 rounded-full object-cover"
              />
              <div>
                <p className="text-sm text-gray-800">
                  <span className="font-semibold">
                    @{e.author?.userName || "user"}
                  </span>{" "}
                  {e.message}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Post;
