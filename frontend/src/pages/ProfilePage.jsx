import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ServelURL } from "../App";
import { useDispatch, useSelector } from "react-redux";
import { setProfiledata, setUserData } from "../redux/userSlice";
import {
  ArrowLeft,
  Users,
  User,
  FileText,
  Edit3,
  MessageCircle,
  LogOut,
  Loader2,
  Play,
  Heart,
  MessageSquare,
  MoreHorizontal,
  Grid3X3,
  Film,
} from "lucide-react";
import dp from "../../public/images/default.jpeg";
import FollowButton from "../components/FollowButton";
import Post from "../components/Post";
import useGetAllLoops from "../hooks/useGetLoops";

/* ─── tiny CSS-in-JS helper ─── */
const style = document.createElement("style");
style.textContent = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');

  :root {
    --gold: #f5c842;
    --gold-dark: #d4a800;
    --rose: #ff5f7a;
    --violet: #7c3aed;
    --bg: #060b14;
    --surface: rgba(255,255,255,0.04);
    --border: rgba(255,255,255,0.08);
    --text: #f0f2f8;
    --muted: #7a869a;
  }

  .profile-root { font-family: 'DM Sans', sans-serif; background: var(--bg); min-height: 100vh; color: var(--text); }
  .profile-root h1, .profile-root h2, .profile-root h3 { font-family: 'Syne', sans-serif; }

  /* noise overlay */
  .profile-root::before {
    content:''; position:fixed; inset:0; pointer-events:none; z-index:0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
    opacity: 0.6;
  }

  /* gradient blobs */
  .blob { position:fixed; border-radius:50%; filter:blur(120px); pointer-events:none; z-index:0; }
  .blob-1 { width:560px; height:560px; top:-160px; left:-160px; background:radial-gradient(circle, rgba(245,200,66,0.18) 0%, transparent 70%); }
  .blob-2 { width:480px; height:480px; bottom:-100px; right:-80px; background:radial-gradient(circle, rgba(255,95,122,0.14) 0%, transparent 70%); }
  .blob-3 { width:320px; height:320px; top:40%; left:60%; background:radial-gradient(circle, rgba(124,58,237,0.10) 0%, transparent 70%); }

  /* glass card */
  .g-card {
    background: var(--surface);
    border: 1px solid var(--border);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
  }

  /* stat card hover */
  .stat-card { transition: transform .25s, border-color .25s, box-shadow .25s; }
  .stat-card:hover { transform: translateY(-4px); border-color: rgba(245,200,66,0.3); box-shadow: 0 12px 40px rgba(0,0,0,0.4); }

  /* avatar ring pulse */
  @keyframes ring-pulse { 0%,100%{ box-shadow: 0 0 0 0 rgba(245,200,66,0.5); } 50%{ box-shadow: 0 0 0 10px rgba(245,200,66,0); } }
  .avatar-img { animation: ring-pulse 3s ease-in-out infinite; }

  /* fade-in */
  @keyframes fadeUp { from{ opacity:0; transform:translateY(24px);} to{ opacity:1; transform:translateY(0);} }
  .fade-up { animation: fadeUp .5s ease both; }
  .delay-1 { animation-delay:.1s; }
  .delay-2 { animation-delay:.2s; }
  .delay-3 { animation-delay:.3s; }
  .delay-4 { animation-delay:.4s; }
  .delay-5 { animation-delay:.5s; }

  /* tab pill */
  .tab-pill { transition: background .2s, color .2s; }
  .tab-pill.active { background: var(--gold); color: #000; }
  .tab-pill:not(.active):hover { background: rgba(255,255,255,0.07); }

  /* video hover */
  .loop-card { transition: transform .25s, box-shadow .25s; }
  .loop-card:hover { transform: scale(1.02); box-shadow: 0 20px 50px rgba(0,0,0,0.6); }
  .loop-overlay { opacity:0; transition: opacity .25s; }
  .loop-card:hover .loop-overlay { opacity:1; }

  /* btn */
  .btn-gold { background: var(--gold); color:#000; font-weight:600; padding:.75rem 2rem; border-radius:12px; display:inline-flex; align-items:center; gap:8px; transition: background .2s, transform .15s, box-shadow .2s; font-family:'Syne',sans-serif; font-size:.9rem; letter-spacing:.01em; }
  .btn-gold:hover { background:var(--gold-dark); transform:translateY(-1px); box-shadow:0 8px 24px rgba(245,200,66,0.35); }
  .btn-ghost { background: rgba(255,255,255,0.07); color:var(--text); font-weight:600; padding:.75rem 2rem; border-radius:12px; border:1px solid var(--border); display:inline-flex; align-items:center; gap:8px; transition: background .2s, transform .15s; font-family:'Syne',sans-serif; font-size:.9rem; }
  .btn-ghost:hover { background: rgba(255,255,255,0.12); transform:translateY(-1px); }
  .btn-danger { background: rgba(239,68,68,0.15); border:1px solid rgba(239,68,68,0.3); color:#f87171; font-weight:600; padding:.65rem 1.25rem; border-radius:10px; display:inline-flex; align-items:center; gap:8px; transition: background .2s, transform .15s; font-size:.85rem; }
  .btn-danger:hover { background: rgba(239,68,68,0.25); transform:translateY(-1px); }
  .btn-danger:disabled { opacity:.5; cursor:not-allowed; }
`;
if (!document.head.querySelector("[data-profile-styles]")) {
  style.setAttribute("data-profile-styles", "true");
  document.head.appendChild(style);
}

/* ─── Component ─── */
const ProfilePage = () => {
  const { username } = useParams();
  const dispatch = useDispatch();
  const { profileData, userData } = useSelector((s) => s.user);
  const [loading, setLoading] = useState(true);
  const [imageLoading, setImageLoading] = useState(true);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("posts"); // "posts" | "loops"
  const navigate = useNavigate();
  const { postData } = useSelector((s) => s.post);
  const { loopData } = useSelector((s) => s.loop);
  useGetAllLoops();

  const profileLoops = loopData.filter((l) => l.author?._id === profileData?._id);
  const profilePosts = postData.filter((p) => p.author?._id === profileData?._id);

  const handleProfile = async () => {
    try {
      setLoading(true);
      const result = await axios.get(`${ServelURL}/api/user/profile/${username}`, {
        withCredentials: true,
      });
      if (result) dispatch(setProfiledata(result.data));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      setLogoutLoading(true);
      const res = await axios.get(`${ServelURL}/api/auth/logout`, { withCredentials: true });
      if (res) dispatch(setUserData(null));
      alert("Logged out successfully");
      navigate("/signup");
    } catch (err) {
      console.error(err);
      setLogoutLoading(false);
    }
  };

  useEffect(() => {
    if (username) handleProfile();
  }, [username]);

  /* ── Loading ── */
  if (loading)
    return (
      <div className="profile-root" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
        <div className="blob blob-1" /><div className="blob blob-2" />
        <div style={{ textAlign: "center" }}>
          <Loader2 style={{ width: 40, height: 40, color: "var(--gold)", animation: "spin 1s linear infinite", margin: "0 auto 16px" }} />
          <p style={{ color: "var(--muted)", fontFamily: "DM Sans, sans-serif" }}>Loading profile…</p>
        </div>
      </div>
    );

  /* ── Not found ── */
  if (!profileData)
    return (
      <div className="profile-root" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
        <div className="blob blob-1" /><div className="blob blob-2" />
        <div style={{ textAlign: "center" }}>
          <p style={{ color: "var(--muted)", marginBottom: 20, fontFamily: "DM Sans,sans-serif" }}>Profile not found</p>
          <button className="btn-gold" onClick={() => navigate(-1)}>Go Back</button>
        </div>
      </div>
    );

  const isOwnProfile = profileData?._id === userData?._id;

  return (
    <div className="profile-root" style={{ position: "relative" }}>
      {/* Background blobs */}
      <div className="blob blob-1" /><div className="blob blob-2" /><div className="blob blob-3" />

      <div style={{ position: "relative", zIndex: 1, maxWidth: 900, margin: "0 auto", padding: "24px 16px 80px" }}>

        {/* ── Top bar ── */}
        <div className="fade-up" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32 }}>
          <button
            className="btn-ghost"
            onClick={() => navigate("/")}
            style={{ padding: ".6rem 1.1rem", fontSize: ".85rem" }}
          >
            <ArrowLeft size={16} /> Back
          </button>

          <button className="btn-danger" onClick={handleLogout} disabled={logoutLoading}>
            {logoutLoading ? <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> : <LogOut size={14} />}
            Log Out
          </button>
        </div>

        {/* ── Hero card ── */}
        <div className="g-card fade-up delay-1" style={{ borderRadius: 28, padding: "32px 28px", marginBottom: 24, position: "relative", overflow: "hidden" }}>
          {/* subtle inner glow */}
          <div style={{ position: "absolute", top: -80, right: -80, width: 280, height: 280, borderRadius: "50%", background: "radial-gradient(circle, rgba(245,200,66,0.08), transparent 70%)", pointerEvents: "none" }} />

          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>

            {/* Avatar */}
            <div style={{ position: "relative", flexShrink: 0 }}>
              <div style={{ width: 120, height: 120, borderRadius: "50%", padding: 3, background: "linear-gradient(135deg, var(--gold), var(--rose))" }}>
                <img
                  src={profileData?.profileImage || dp}
                  alt="Profile"
                  onLoad={() => setImageLoading(false)}
                  onError={(e) => { e.target.src = dp; setImageLoading(false); }}
                  className="avatar-img"
                  style={{
                    width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover",
                    border: "3px solid var(--bg)", display: "block",
                    opacity: imageLoading ? 0 : 1, transition: "opacity .3s"
                  }}
                />
              </div>
              {/* online dot */}
              <span style={{ position: "absolute", bottom: 6, right: 6, width: 14, height: 14, borderRadius: "50%", background: "#22c55e", border: "2px solid var(--bg)" }} />
            </div>

            {/* Info */}
            <div style={{ textAlign: "center", flex: 1 }}>
              <h1 style={{ fontSize: "clamp(1.5rem,4vw,2rem)", fontWeight: 800, margin: "0 0 4px", letterSpacing: "-0.02em" }}>
                {profileData?.name || profileData?.userName}
              </h1>
              <p style={{ color: "var(--gold)", fontWeight: 600, margin: "0 0 10px", fontSize: ".9rem", letterSpacing: ".04em", textTransform: "uppercase" }}>
                {profileData?.profession || "Member"}
              </p>
              {profileData?.bio && (
                <p style={{ color: "var(--muted)", maxWidth: 480, margin: "0 auto", lineHeight: 1.7, fontSize: ".92rem" }}>
                  {profileData.bio}
                </p>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div style={{ marginTop: 28, display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
            {isOwnProfile ? (
              <button className="btn-gold" onClick={() => navigate("/editprofile")}>
                <Edit3 size={15} /> Edit Profile
              </button>
            ) : (
              <>
                <FollowButton
                  tailwind=""
                  style={{}}
                  className="btn-gold"
                  targetUserID={profileData?._id}
                />
                <button className="btn-ghost">
                  <MessageCircle size={15} /> Message
                </button>
              </>
            )}
          </div>
        </div>

        {/* ── Stats row ── */}
        <div className="fade-up delay-2" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 24 }}>
          {[
            { icon: <User size={20} />, label: "Followers", value: profileData?.followers?.length ?? 0, gradient: "linear-gradient(135deg,#f5c842,#f59e0b)" },
            { icon: <Users size={20} />, label: "Following", value: profileData?.following?.length ?? 0, gradient: "linear-gradient(135deg,#ff5f7a,#7c3aed)" },
            { icon: <FileText size={20} />, label: "Posts", value: (profileData?.posts?.length ?? 0) + profileLoops.length, gradient: "linear-gradient(135deg,#7c3aed,#ec4899)" },
          ].map(({ icon, label, value, gradient }) => (
            <div key={label} className="g-card stat-card" style={{ borderRadius: 20, padding: "20px 16px", textAlign: "center" }}>
              <div style={{ width: 44, height: 44, borderRadius: 14, background: gradient, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px", color: "#000" }}>
                {icon}
              </div>
              <p style={{ fontSize: "clamp(1.4rem,4vw,2rem)", fontWeight: 800, margin: "0 0 4px", fontFamily: "Syne,sans-serif" }}>{value}</p>
              <p style={{ color: "var(--muted)", fontSize: ".78rem", margin: 0, textTransform: "uppercase", letterSpacing: ".06em" }}>{label}</p>
            </div>
          ))}
        </div>

        {/* ── Following avatars strip ── */}
        {profileData?.following?.length > 0 && (
          <div className="g-card fade-up delay-3" style={{ borderRadius: 20, padding: "16px 20px", marginBottom: 24, display: "flex", alignItems: "center", gap: 14 }}>
            <span style={{ color: "var(--muted)", fontSize: ".8rem", whiteSpace: "nowrap", textTransform: "uppercase", letterSpacing: ".06em" }}>Following</span>
            <div style={{ display: "flex", gap: -6, flexWrap: "nowrap" }}>
              {profileData.following.slice(0, 7).map((u, i) => (
                <img key={i} src={u.profileImage || dp} alt="" style={{ width: 32, height: 32, borderRadius: "50%", objectFit: "cover", border: "2px solid var(--bg)", marginLeft: i === 0 ? 0 : -8 }} />
              ))}
              {profileData.following.length > 7 && (
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(255,255,255,0.1)", border: "2px solid var(--bg)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: ".65rem", color: "var(--muted)", marginLeft: -8, flexShrink: 0 }}>
                  +{profileData.following.length - 7}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Content tabs ── */}
        <div className="fade-up delay-4" style={{ marginBottom: 20 }}>
          <div style={{ display: "inline-flex", gap: 6, background: "rgba(255,255,255,0.04)", borderRadius: 14, padding: 5, border: "1px solid var(--border)" }}>
            {[
              { id: "posts", icon: <Grid3X3 size={14} />, label: "Posts", count: profilePosts.length },
              { id: "loops", icon: <Film size={14} />, label: "Loops", count: profileLoops.length },
            ].map(({ id, icon, label, count }) => (
              <button
                key={id}
                className={`tab-pill${activeTab === id ? " active" : ""}`}
                onClick={() => setActiveTab(id)}
                style={{ padding: ".5rem 1.1rem", borderRadius: 10, display: "flex", alignItems: "center", gap: 6, fontFamily: "Syne,sans-serif", fontWeight: 600, fontSize: ".82rem", cursor: "pointer", border: "none", letterSpacing: ".02em" }}
              >
                {icon} {label}
                <span style={{ background: activeTab === id ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.08)", borderRadius: 20, padding: "1px 7px", fontSize: ".72rem" }}>{count}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ── Posts tab ── */}
        {activeTab === "posts" && (
          <div className="fade-up delay-5">
            {profilePosts.length === 0 ? (
              <EmptyState label="posts" />
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                {profilePosts.map((p) => (
                  <div key={p._id}>
                    <Post post={p} />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Loops tab ── */}
        {activeTab === "loops" && (
          <div className="fade-up delay-5">
            {profileLoops.length === 0 ? (
              <EmptyState label="loops" />
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 16 }}>
                {profileLoops.map((loop) => (
                  <LoopCard key={loop._id} loop={loop} />
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

/* ── Loop card ── */
const LoopCard = ({ loop }) => (
  <div className="g-card loop-card" style={{ borderRadius: 20, overflow: "hidden" }}>
    <div style={{ position: "relative" }}>
      <video src={loop.media} controls style={{ width: "100%", height: 220, objectFit: "cover", display: "block" }} />
      <div className="loop-overlay" style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.7), transparent)", display: "flex", alignItems: "flex-end", padding: 12 }}>
        <div style={{ display: "flex", gap: 4, alignItems: "center", color: "var(--gold)" }}>
          <Play size={14} fill="currentColor" /><span style={{ fontSize: ".75rem", fontWeight: 600 }}>Play</span>
        </div>
      </div>
    </div>
    <div style={{ padding: "14px 16px" }}>
      {loop.caption && (
        <p style={{ color: "var(--text)", fontSize: ".88rem", margin: "0 0 12px", lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          {loop.caption}
        </p>
      )}
      <div style={{ display: "flex", gap: 16 }}>
        <span style={{ display: "flex", alignItems: "center", gap: 5, color: "var(--muted)", fontSize: ".78rem" }}>
          <Heart size={13} style={{ color: "var(--rose)" }} /> {loop.like?.length ?? 0}
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: 5, color: "var(--muted)", fontSize: ".78rem" }}>
          <MessageSquare size={13} /> {loop.comments?.length ?? 0}
        </span>
      </div>
    </div>
  </div>
);

/* ── Empty state ── */
const EmptyState = ({ label }) => (
  <div className="g-card" style={{ borderRadius: 20, padding: "48px 24px", textAlign: "center" }}>
    <div style={{ width: 56, height: 56, borderRadius: 18, background: "rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
      <Film size={24} style={{ color: "var(--muted)" }} />
    </div>
    <p style={{ color: "var(--muted)", margin: 0, fontFamily: "DM Sans,sans-serif" }}>No {label} yet</p>
  </div>
);

export default ProfilePage;
