import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import "../componentsCSS/MovieCarousel.css";
import BigChainFilmAvatar from "./BigChainFilmAvatar.js";

const showtimes_csv = "/CSVs/30-09-24-showtimes.csv";

const getFormattedDate = (dayOffset) => {
  const today = new Date();
  today.setDate(today.getDate() + dayOffset);
  return `${String(today.getDate()).padStart(2, "0")}/${String(
    today.getMonth() + 1
  ).padStart(2, "0")}/${today.getFullYear()}`;
};

const MovieCarousel = ({ selectedSnifs }) => {
  const [movies, setMovies] = useState([]);
  const [dayOffset, setDayOffset] = useState(0);

  const offsatDay = getFormattedDate(dayOffset);

  useEffect(() => {
    const loadMovieData = async () => {
      const showtimes_result = await (await fetch(showtimes_csv)).body
        .getReader()
        .read();
      const showtimesData = new TextDecoder("utf-8").decode(
        showtimes_result.value
      );

      Papa.parse(showtimesData, {
        header: true,
        dynamicTyping: true,
        complete: (results) => {
          const filteredMovies = results.data.filter(
            (movie) =>
              movie.date === offsatDay &&
              (selectedSnifs.length === 0 || selectedSnifs.includes(movie.snif))
          );
          setMovies(filteredMovies);
        },
      });
    };

    loadMovieData();
  }, [offsatDay, selectedSnifs]); // Re-fetch when the day or snif selection changes

  const handleNextDay = () => {
    setDayOffset(dayOffset + 1);
  };
  const handlePrevDay = () => {
    if (dayOffset > 0) {
      setDayOffset(dayOffset - 1);
    }
  };

  return (
    <div className="main-carousel">
      <div className="carousel-controls">
        <button onClick={handlePrevDay} disabled={dayOffset === 0}>
          Previous
        </button>
        <div className="carousel-current-date">{offsatDay}</div>
        <button onClick={handleNextDay}>Next</button>
      </div>

      <div className="carousel-movie-list-area">
        <BigChainFilmAvatar movies={movies} />
      </div>
    </div>
  );
};

export default MovieCarousel;
