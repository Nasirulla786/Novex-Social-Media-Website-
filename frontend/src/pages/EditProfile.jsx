import React, { useRef, useState } from "react";
import dp from "../../public/images/default.jpeg";
import axios from "axios";
import { ServelURL } from "../App";
import { useDispatch, useSelector } from "react-redux";
import { setProfiledata, setUserData } from "../redux/userSlice";
import { useNavigate } from "react-router-dom";
// import { Navigate } from "react-router-dom";

const EditProfile = () => {
  const [frontendImage, setFrontendImage] = useState(dp);
  const [backendImage , setBackendImage] = useState("");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [profession, setProfession] = useState("");
  const [gender, setGender] = useState("");
  const navigate = useNavigate();
  const ref = useRef();
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageURL = URL.createObjectURL(file);
      setFrontendImage(imageURL);
      setBackendImage(file)
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formdata = new FormData();
    formdata.append("name", name);
    formdata.append("userName", username);
    formdata.append("bio", bio);
    formdata.append("profession", profession);
    formdata.append("profileImage", backendImage);

    const res = await axios.post(
      `${ServelURL}/api/user/editprofile`,
      formdata,
      { withCredentials: true }
    );

    // console.log("this is response",res.data);
    if (res) {
      dispatch(setProfiledata(res?.data));
      dispatch(setUserData(res?.data));
      navigate(`/profile/${userData?.userName}`);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center py-10 px-4">
      <h1 className="text-2xl font-bold text-yellow-400 mb-8">Edit Profile</h1>

      {/* Profile Image Section */}
      <div
        className="relative cursor-pointer  flex items-center justify-center flex-col"
        onClick={() => ref.current.click()}
      >
        <img
          src={frontendImage}
          alt="Profile"
          className="w-32 h-32 rounded-full object-cover border-4 border-yellow-400 shadow-[0_0_15px_#facc15] transition-transform duration-300 hover:scale-105"
        />
        <p className="text-center text-sm text-gray-400 mt-2">
          Click to change profile picture
        </p>
      </div>

      <input
        type="file"
        hidden
        ref={ref}
        onChange={handleImageChange}
        accept="image/*"
      />

      {/* Form Section */}
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 mt-8 w-full max-w-md"
      >
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="bg-transparent border border-yellow-500 px-4 py-2 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400 transition-all"
        />

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="bg-transparent border border-yellow-500 px-4 py-2 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400 transition-all"
        />

        <textarea
          placeholder="Bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows="3"
          className="bg-transparent border border-yellow-500 px-4 py-2 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400 transition-all resize-none"
        />

        <input
          type="text"
          placeholder="Profession"
          value={profession}
          onChange={(e) => setProfession(e.target.value)}
          className="bg-transparent border border-yellow-500 px-4 py-2 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400 transition-all"
        />

        <input
          type="text"
          placeholder="Gender"
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          className="bg-transparent border border-yellow-500 px-4 py-2 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400 transition-all"
        />

        <button
          type="submit"
          className="mt-4 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-2 rounded-lg shadow-md transition-all duration-300"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditProfile;
