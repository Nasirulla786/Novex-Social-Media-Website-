import React from "react";
import useGetAllLoops from "../hooks/useGetLoops";
import { useSelector } from "react-redux";
import LoopCard from "../components/LoopCard";

const Loop = () => {
  useGetAllLoops();
  const { loopData } = useSelector((state) => state.loop);

  return (
    <div
      className="h-screen w-full overflow-y-scroll snap-y snap-mandatory scrollbar-hide"
      style={{
        scrollSnapType: "y mandatory",
        scrollBehavior: "smooth",
      }}
    >
      {loopData &&
        loopData.map((e, i) => (
          <div
            key={i}
            className="h-screen w-full flex items-center justify-center snap-start"
          >
            <LoopCard video={e} />
          </div>
        ))}
    </div>
  );
};

export default Loop;
