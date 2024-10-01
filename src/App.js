import React, { useState } from "react";
import MovieCarousel from "./components/MovieCarousel";
import CinemaColorKey from "./components/CinemaColorKey";
import SnifFilter from "./components/SnifFilter"; // Import SnifFilter

const App = () => {
  const [selectedSnifs, setSelectedSnifs] = useState([]); // Track selected snifs

  return (
    <>
      <div className="main-carousel-holder">
        <CinemaColorKey />
        <SnifFilter
          selectedSnifs={selectedSnifs}
          setSelectedSnifs={setSelectedSnifs}
        />{" "}
        {/* Add SnifFilter */}
        <MovieCarousel selectedSnifs={selectedSnifs} />{" "}
        {/* Pass selectedSnifs */}
      </div>
    </>
  );
};

export default App;
