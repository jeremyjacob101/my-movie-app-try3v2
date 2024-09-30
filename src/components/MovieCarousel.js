import React, { useState, useEffect } from "react";
import Papa from "papaparse";
const showtimes_csv = "/CSVs/30-09-24-showtimes.csv";

const getFormattedDate = () => {
  const today = new Date();
  return `${String(today.getDate()).padStart(2, "0")}/${String(
    today.getMonth() + 1
  ).padStart(2, "0")}/${today.getFullYear()}`;
};

const MovieCarousel = () => {
  const [movies, setMovies] = useState([]);
  const formattedDate = getFormattedDate();

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
            (movie) => movie.date === formattedDate
          );
          setMovies(filteredMovies);
        },
      });
    };

    loadMovieData();
  }, [formattedDate]);

  return (
    <div className="main-carousel">
      <div className="carousel-current-date">
        <h2>Movies Playing on {formattedDate}</h2>
      </div>
      <div>
        {movies.map((movie, index) => (
          <div key={index}>
            {movie.title} - {movie.time} at {movie.cinema} ({movie.snif})
          </div>
        ))}
      </div>
    </div>
  );
};

export default MovieCarousel;
