import React, { useRef, useState, useEffect } from "react";
import { Volume2, VolumeX, Maximize, Pause, Play } from "lucide-react";

const VideoPlayer = ({ media }) => {
  const videoRef = useRef();
  const progressRef = useRef();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);

  const handleVideo = () => {
    if (!isPlaying) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleMute = () => {
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleFullscreen = () => {
    if (videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    }
  };

  const handleProgress = () => {
    const current = videoRef.current.currentTime;
    const duration = videoRef.current.duration;
    setProgress((current / duration) * 100);
  };

  const handleSeek = (e) => {
    const newTime = (e.target.value / 100) * videoRef.current.duration;
    videoRef.current.currentTime = newTime;
  };

  useEffect(() => {
    const video = videoRef.current;
    video.addEventListener("timeupdate", handleProgress);
    return () => video.removeEventListener("timeupdate", handleProgress);
  }, []);

  return (
    <div className="w-[400px] h-[400px] bg-black rounded-2xl overflow-hidden relative group shadow-lg">
      <video
        ref={videoRef}
        src={media}
        muted={isMuted}
        className="w-full h-full object-cover cursor-pointer"
        onClick={handleVideo}
      />

      {/* Controls */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
        {/* Progress Bar */}
        <input
          ref={progressRef}
          type="range"
          min="0"
          max="100"
          value={progress}
          onChange={handleSeek}
          className="w-full h-1 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-blue-500"
        />

        {/* Control Buttons */}
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-3">
            <button
              onClick={handleVideo}
              className="text-white hover:text-blue-400 transition"
            >
              {isPlaying ? <Pause size={22} /> : <Play size={22} />}
            </button>

            <button
              onClick={handleMute}
              className="text-white hover:text-blue-400 transition"
            >
              {isMuted ? <VolumeX size={22} /> : <Volume2 size={22} />}
            </button>
          </div>

          <button
            onClick={handleFullscreen}
            className="text-white hover:text-blue-400 transition"
          >
            <Maximize size={22} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
