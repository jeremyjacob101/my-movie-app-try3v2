import React from "react";
import MovieCarousel from "./components/MovieCarousel";
import CinemaColorKey from "./components/CinemaColorKey";

const App = () => {
  return (
    <>
      <div className="main-carousel-holder">
        <CinemaColorKey />
        <MovieCarousel />
      </div>
    </>
  );
};

export default App;
