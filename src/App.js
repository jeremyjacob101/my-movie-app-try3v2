import React, { useState } from "react";
import MovieCarousel from "./components/MovieCarousel";
import CinemaColorKey from "./components/CinemaColorKey";
import SnifFilter from "./components/SnifFilter";

const App = () => {
  const [selectedSnifs, setSelectedSnifs] = useState([]);

  return (
    <>
      <div className="main-carousel-holder">
        <img src="/images/rtLogo.png" alt="dsfsdfsdf" />
        <img src="/images/imdbLogo.png" alt="dsfsdfsdf" />
        <div className="pre-carousel">
          {" "}
          <CinemaColorKey />
          <SnifFilter
            selectedSnifs={selectedSnifs}
            setSelectedSnifs={setSelectedSnifs}
          />{" "}
        </div>
        <MovieCarousel selectedSnifs={selectedSnifs} />{" "}
      </div>
    </>
  );
};

export default App;
