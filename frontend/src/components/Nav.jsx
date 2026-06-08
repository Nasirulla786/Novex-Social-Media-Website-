import { Home, Plus, Search, Video } from "lucide-react";

import dp from "../../public/images/default.jpeg";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const Nav = () => {
  const { userData } = useSelector((state) => state.user);
  const navigate = useNavigate();
  return (
    <div className="w-[90%] lg:w-[460px] h-[80px] bg-slate-950/95 border border-white/10 backdrop-blur-xl flex justify-around items-center fixed bottom-[20px] left-1/2 transform -translate-x-1/2 rounded-full shadow-2xl shadow-black/40 z-[100]">
      <button
        type="button"
        title="Home"
        onClick={() => navigate("/")}
        className="icon-button cursor-pointer"
      >
        <Home className="w-5 h-5" />
      </button>

      <button
        type="button"
        title="Search"
        onClick={() => navigate("/search")}
        className="icon-button cursor-pointer"
      >
        <Search className="w-5 h-5" />
      </button>

      <button
        type="button"
        title="Upload"
        onClick={() => navigate("/uploadpost")}
        className="icon-button bg-gradient-to-br from-[#ff5f7a] to-[#ffd166] text-slate-950 shadow-lg shadow-[#ff5f7a]/20"
      >
        <Plus className="w-5 h-5" />
      </button>

      <button
        type="button"
        title="Loops"
        onClick={() => navigate("/loop")}
        className="icon-button cursor-pointer"
      >
        <Video className="w-5 h-5" />
      </button>

      <button
        type="button"
        title="Profile"
        onClick={() => navigate(`/profile/${userData?.userName}`)}
        className="w-[50px] h-[50px] rounded-full overflow-hidden border border-white/10 shadow-inner shadow-black/20"
      >
        <img
          src={userData?.profileImage || dp}
          alt="Profile"
          className="w-full h-full object-cover"
        />
      </button>
    </div>
  );
};

export default Nav;
