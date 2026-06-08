import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import VideoPlayer from "../components/VideoPlayer";
import axios from "axios";
import { ServelURL } from "../App";
import { useDispatch, useSelector } from "react-redux";
import { setPostData } from "../redux/postSlice";
import { setStoryData } from "../redux/storySlice";
import { setLoopData } from "../redux/loopSlice";
import { ArrowLeft } from "lucide-react";

const UploadPage = () => {
  const [uploadType, setUploadType] = useState("post");
  const [frontendImage, setFrontendImage] = useState("");
  const [backendImage, setBackendImage] = useState("");
  const [mediaType, setMediaType] = useState("");
  const imageref = useRef();
  const [caption, setCaption] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false)
  const { storyData } = useSelector((state) => state.story);
  const { loopData } = useSelector((state) => state.loop);
  const { postData } = useSelector((state) => state.post);

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setMediaType(file.type.includes("image") ? "image" : "video");
    setBackendImage(file);
    setFrontendImage(URL.createObjectURL(file));
  };

  const uploadHandler = async (url, action, dataSet) => {
    try {

        setLoading(true)
      const formData = new FormData();
      if (uploadType !== "story") formData.append("caption", caption);
      formData.append("mediaType", mediaType);
      formData.append("media", backendImage);

      const res = await axios.post(`${ServelURL}${url}`, formData, {
        withCredentials: true,
      });


      if (res?.data) dispatch(action([...dataSet, res.data]));

      if(res){
           setLoading(false)
      }


      alert(`${uploadType} uploaded successfully!`);
      setFrontendImage("");
      setCaption("");



      // ✅ Navigate to home after upload
      navigate("/");
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Upload failed. Try again!");
    }
  };

  const handleUploadButton = () => {
    if (!backendImage) return alert("Please select a file first!");

    if (uploadType === "post")
      uploadHandler("/api/post/uploadpost", setPostData, postData);
    else if (uploadType === "story")
      uploadHandler("/api/story/uploadstory", setStoryData, storyData);
    else if (uploadType === "loop")
      uploadHandler("/api/loop/uploadloop", setLoopData, loopData);
  };

  return (
    <div className="w-screen h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white flex flex-col items-center justify-center px-4 relative">
      {/* 🔙 Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-5 left-5 flex items-center gap-2 text-gray-300 hover:text-white transition-all"
      >
        <ArrowLeft size={20} />
        <span className="hidden sm:block font-semibold">Back</span>
      </button>

      {/* Upload Type Tabs */}
      <div className="flex bg-white/10 backdrop-blur-lg p-2 rounded-3xl mb-8 shadow-lg">
        {["post", "loop", "story"].map((type) => (
          <button
            key={type}
            className={`px-8 py-3 rounded-3xl font-semibold transition-all duration-300 ${
              uploadType === type
                ? "bg-white text-black shadow-lg scale-105"
                : "text-gray-300 hover:text-white"
            }`}
            onClick={() => setUploadType(type)}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      {/* File Upload */}
      <input type="file" hidden ref={imageref} onChange={handleImage} />

      {!frontendImage ? (
        <div
          onClick={() => imageref.current.click()}
          className="w-[350px] sm:w-[450px] h-[350px] rounded-2xl border-2 border-dashed border-gray-400 hover:border-white flex flex-col items-center justify-center gap-3 cursor-pointer transition-all hover:scale-105 hover:bg-white/10"
        >
          <p className="text-lg font-semibold">Click to Upload {uploadType}</p>
          <p className="text-sm text-gray-400">Image or Video supported</p>
        </div>
      ) : (
        <div className="relative w-[350px] sm:w-[450px] h-[400px] rounded-2xl overflow-hidden shadow-lg group">
          {mediaType === "image" ? (
            <img
              src={frontendImage}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <VideoPlayer media={frontendImage} />
          )}
          <button
            onClick={() => setFrontendImage("")}
            className="absolute top-3 right-3 bg-black/70 px-3 py-1 rounded-lg text-sm hover:bg-red-500 transition-all"
          >
            ✕
          </button>
        </div>
      )}

      {/* Caption Input */}
      {uploadType !== "story" && (
        <div className="mt-6 w-[350px] sm:w-[450px]">
          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Write a caption..."
            className="w-full h-24 p-3 rounded-xl bg-white/10 backdrop-blur-lg text-white resize-none outline-none border border-gray-600 focus:border-white transition-all"
          />
        </div>
      )}

      {/* Upload Button */}
      <button
        onClick={handleUploadButton}
        className="mt-8 px-10 py-3 bg-white text-black font-semibold rounded-full shadow-lg hover:scale-105 hover:bg-gray-200 transition-all duration-300"
      >
       {loading?"Wait... ": `Upload${uploadType}`  }
      </button>
    </div>
  );
};

export default UploadPage;
