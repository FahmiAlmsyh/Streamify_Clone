import React, { useRef } from "react";
const ScrollButton = ({ children }) => {
  const scrollRef = useRef();

  const scrollLeft = () => {
    scrollRef.current.scrollBy({
      left: -300,
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    scrollRef.current.scrollBy({
      left: 300,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative">
      <button
        onClick={scrollLeft}
        className="absolute left-[-1rem] top-1/2 transform -translate-y-1/2 bg-red-800 text-white p-2 rounded-full z-10"
      >
        &larr;
      </button>

      <div
        style={{ scrollbarWidth: "none" }}
        ref={scrollRef}
        className="flex overflow-x-auto gap-3 scrollbar-hidden shrink-0 whitespace-nowrap"
      >
        {children}
      </div>

      <button
        onClick={scrollRight}
        className="absolute right-[-1rem] top-1/2 transform -translate-y-1/2 bg-red-800 text-white p-2 rounded-full z-10"
      >
        &rarr;
      </button>
    </div>
  );
};

export default ScrollButton;
