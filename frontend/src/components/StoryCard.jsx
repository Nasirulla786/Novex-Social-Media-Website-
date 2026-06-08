import React, { useEffect, useState } from "react";
import { ArrowLeftSquare, Volume2, VolumeX } from "lucide-react";
import { useNavigate } from "react-router-dom";

const StoryCard = ({ story }) => {
  const [isMute, setIsMute] = useState(false); // Default: sound ON
  const [progressBar, setProgressBar] = useState(0);
  const navigate = useNavigate();


  useEffect(() => {
    const interval = setInterval(() => {
      setProgressBar((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          navigate("/"); // move to next story or home
          return 100;
        }
        return prev + 1;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [navigate]);


  // console.log("this is story",story)


  if (!story) {
  return (
    <div className="w-full h-screen flex items-center justify-center text-white bg-black">
      <p>Loading story...</p>
    </div>
  );
}

  return (
    <div className="w-full h-screen flex items-center justify-center bg-black">
      <div className="w-full h-full relative overflow-hidden flex items-center justify-center">
        {/* ===== Progress Bar ===== */}
        <div className="absolute top-0 left-0 w-full h-[3px] bg-gray-600">
          <div
            className="bg-white h-full transition-all"
            style={{ width: `${progressBar}%` }}
          />
        </div>

        {/* ===== Header (Profile + Back Arrow) ===== */}
        <div className="absolute top-3 left-3 z-20 flex items-center gap-3 text-white">
          <ArrowLeftSquare
            size={28}
            className="cursor-pointer"
            onClick={() => navigate(-1)}
          />
          <img
            src={story?.author?.profileImage}
            alt="profile"
            className="w-[40px] h-[40px] rounded-full border border-gray-400"
          />
          <div>
            <h1 className="text-sm font-semibold">{story?.author?.userName}</h1>
            <p className="text-xs text-gray-300">just now</p>
          </div>
        </div>

        {/* ===== Mute/Unmute Button ===== */}
        {story?.mediaType === "video" && (
          <button
            onClick={() => setIsMute((prev) => !prev)}
            className="absolute bottom-5 right-5 text-white bg-black/40 rounded-full p-3 hover:bg-black/60 transition"
          >
            {isMute ? <VolumeX size={24} /> : <Volume2 size={24} />}
          </button>
        )}

        {/* ===== Media (Image / Video) ===== */}
        <div className="w-[500px] h-full flex items-center justify-center">
          {story?.mediaType === "image" ? (
            <img
              src={story?.media}
              alt="Story"
              className="w-full h-full object-cover"
            />
          ) : story?.mediaType === "video" ? (
            <video
              src={story?.media}
              autoPlay
              muted={isMute}
              className="w-full h-full object-cover"
              playsInline
              loop
            />
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default StoryCard;
