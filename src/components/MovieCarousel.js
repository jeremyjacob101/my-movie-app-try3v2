import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import "../MovieCarousel.css";

const showtimes_csv = "/CSVs/30-09-24-showtimes.csv";

// Helper to format a date as dd/mm/yyyy
const formatDate = (date) => {
  return `${String(date.getDate()).padStart(2, "0")}/${String(
    date.getMonth() + 1
  ).padStart(2, "0")}/${date.getFullYear()}`;
};

const MovieCarousel = () => {
  const [movies, setMovies] = useState([]);
  const [dayOffset, setDayOffset] = useState(0); // Track day offset (0 = today)

  // Calculate the current displayed date based on the offset from today
  const getDisplayedDate = () => {
    const today = new Date();
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + dayOffset);
    return targetDate;
  };

  const displayedDate = getDisplayedDate();

  // Conditional title for today, tomorrow, and yesterday
  const getFormattedTitle = () => {
    if (dayOffset === 0) return "Today";
    if (dayOffset === 1) return "Tomorrow";
    return formatDate(displayedDate); // Default formatted date for other days
  };

  const formattedTitle = getFormattedTitle();

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
            (movie) => movie.date === formatDate(displayedDate)
          );
          setMovies(filteredMovies);
        },
      });
    };

    loadMovieData();
  }, [displayedDate]);

  // Handlers for navigating to the next or previous day
  const handleNextDay = () => {
    setDayOffset(dayOffset + 1); // Go to the next day
  };

  const handlePrevDay = () => {
    if (dayOffset > 0) {
      setDayOffset(dayOffset - 1); // Go back to the previous day, but not past today
    }
  };

  return (
    <div className="main-carousel">
      <div className="carousel-controls">
        <button
          onClick={handlePrevDay}
          disabled={dayOffset === 0} // Disable back button if we're at today
        >
          Previous Day
        </button>
        <div className="carousel-current-date">{formattedTitle}</div>
        <button onClick={handleNextDay}>Next Day</button>
      </div>

      <div className="carousel-movie-list-area">
        {movies.map((movie, index) => (
          <div className="movie-item" key={index}>
            {movie.title} - {movie.time} at {movie.cinema} ({movie.snif})
          </div>
        ))}
      </div>
    </div>
  );
};

export default MovieCarousel;
