import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Signup from "./pages/Signup.jsx";
import Login from "./pages/Login.jsx";
import ForgetPassword from "./pages/ForgetPassword.jsx";
import GetCureentUserData from "./hooks/GetCureentUserData.jsx";
import { useSelector } from "react-redux";
import Home from "./pages/Home.jsx";
import SuggestedUsers from "./hooks/SuggestedUsers.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import EditProfile from "./pages/EditProfile.jsx";
import UplaodPage from "./pages/UplaodPage.jsx";
import useGetAllFollowersStory from "./hooks/useGetAllFollowersStory.jsx";
import Loop from "./pages/Loop.jsx";
import StoryPage from "./pages/StoryPage.jsx";
import Search from "./pages/Search.jsx";

export const ServelURL = "http://localhost:8000";

// ✅ Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { userData } = useSelector((state) => state.user);
  if (!userData) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const App = () => {
  GetCureentUserData();
  SuggestedUsers();
  useGetAllFollowersStory();

  const { userData } = useSelector((state) => state.user);

  return (
    <Routes>
      {/* ✅ Protect home route */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />

      <Route
        path="/signup"
        element={!userData ? <Signup /> : <Navigate to="/" />}
      />
      <Route
        path="/login"
        element={!userData ? <Login /> : <Navigate to="/" />}
      />
      <Route path="/forget-password" element={<ForgetPassword />} />

      <Route
        path="/profile/:username"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/editprofile"
        element={
          <ProtectedRoute>
            <EditProfile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/uploadpost"
        element={
          <ProtectedRoute>
            <UplaodPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/loop"
        element={
          <ProtectedRoute>
            <Loop />
          </ProtectedRoute>
        }
      />
      <Route
        path="/story/:username"
        element={
          <ProtectedRoute>
            <StoryPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/search"
        element={
          <ProtectedRoute>
            <Search />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default App;
