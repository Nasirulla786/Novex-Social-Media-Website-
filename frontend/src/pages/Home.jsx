import React from "react";
import LeftHome from "../components/LeftHome";
import FeedHome from "../components/FeedHome";
import RightHome from "../components/RightHome";

const Home = () => {
  return (
    <>
   <div className="flex">
       <LeftHome />
      <FeedHome />
      {/* <RightHome /> */}
   </div>
    </>
  );
};

export default Home;
