import React from "react";
import { Logo } from "../pages/Signup";
import { Heart } from "lucide-react";
import StoryDP from "./StoryDP";
import Nav from "./Nav";
import { useSelector } from "react-redux";
import Post from "./Post";
import useGetAllPosts from "../hooks/useGetAllPosts";

const FeedHome = () => {
  useGetAllPosts();
  const { postData } = useSelector((state) => state.post);
  const { userData } = useSelector((state) => state.user);
  const { storyList } = useSelector((state) => state.story);
  const {storyData} = useSelector((state)=>state.story)
  // console.log(userData)
  // console.log(postData)
  return (
    <div className="w-full sm:w-[75%] bg-black text-white h-screen">
      <div className="sm:hidden flex justify-between p-[20px] items-center">
        <h1>
          <Logo />
        </h1>
        <Heart className="fill-red-500 text-red-400" />
      </div>

    <div className="w-full flex justify-start p-5 overflow-auto gap-4 scrollbar-hidden">
  <StoryDP
    profileImage={userData?.profileImage}
    username="your story"
    story={storyData}
  />

  {storyList?.map((e, i) => (
    <div key={i}>
      <StoryDP
        profileImage={e?.author?.profileImage}
        username={e?.author?.userName}
        story={e}
      />
    </div>
  ))}
</div>

      <div className="flex flex-col items-center h-[calc(100vh-80px)]">
        {/* total height minus navbar height (adjust if needed) */}

        <div className="w-full rounded-t-4xl bg-white flex-1 overflow-y-auto scrollbar-hidden">
          {postData?.map((value, idx) => (
            <Post key={idx} post={value} />
          ))}
        </div>

        <Nav />
      </div>
    </div>
  );
};

export default FeedHome;
