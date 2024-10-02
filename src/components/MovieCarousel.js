import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import "../componentsCSS/MovieCarousel.css";
import BigChainFilmAvatar from "./BigChainFilmAvatar.js";

const showtimes_csv = "/CSVs/01-10-24-showtimes.csv";
const movies_csv = "/CSVs/01-10-24-movies.csv"; // The new CSV file for posters and titles

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
      // Load showtimes CSV
      const showtimes_result = await (await fetch(showtimes_csv)).body
        .getReader()
        .read();
      const showtimesData = new TextDecoder("utf-8").decode(
        showtimes_result.value
      );

      // Load movies CSV
      const movies_result = await (await fetch(movies_csv)).body
        .getReader()
        .read();
      const moviesData = new TextDecoder("utf-8").decode(movies_result.value);

      // Parse the movies CSV to create a set of valid movie titles and poster/runtimes
      let validMovieTitles = new Set();
      let movieInfoMap = {};
      Papa.parse(moviesData, {
        header: true,
        dynamicTyping: true,
        complete: (results) => {
          results.data.forEach((movie) => {
            validMovieTitles.add(movie.title); // Add valid titles to the set
            movieInfoMap[movie.title] = {
              poster: movie.poster,
              runtime: movie.runtime,
            }; // Store poster and runtime information
          });
        },
      });

      // Parse the showtimes CSV and filter by selected snifs, date, and valid title
      Papa.parse(showtimesData, {
        header: true,
        dynamicTyping: true,
        complete: (results) => {
          const filteredMovies = results.data
            .filter(
              (movie) =>
                movie.date === offsatDay &&
                (selectedSnifs.length === 0 ||
                  selectedSnifs.includes(movie.snif)) &&
                validMovieTitles.has(movie.title) // Check if the title exists in validMovieTitles set
            )
            .map((movie) => ({
              ...movie,
              poster: movieInfoMap[movie.title]?.poster || null, // Add the poster URL or null if none exists
              runtime: movieInfoMap[movie.title]?.runtime || null, // Add runtime or null if not found
            }));
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
