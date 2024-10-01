import React from "react";
import "../BigChainFilmAvatar.css";

// Grouping the showtimes by title
const groupShowtimesByTitle = (movies) => {
  const groupedMovies = {};

  movies.forEach((movie) => {
    if (!groupedMovies[movie.title]) {
      groupedMovies[movie.title] = [];
    }
    groupedMovies[movie.title].push({
      time: movie.time,
      cinema: movie.cinema,
      snif: movie.snif,
    });
  });

  return groupedMovies;
};

// Helper to get the CSS class based on the cinema
const getCinemaClass = (cinema) => {
  switch (cinema) {
    case "Yes Planet":
      return "yes-planet";
    case "Cinema City":
      return "cinema-city";
    case "Lev Cinema":
      return "lev-cinema";
    default:
      return "";
  }
};

const BigChainFilmAvatar = ({ movies }) => {
  const groupedMovies = groupShowtimesByTitle(movies);

  return (
    <div className="movie-list">
      {Object.keys(groupedMovies).map((title) => (
        <div className="movie-block" key={title}>
          <div className="movie-title">{title}</div>
          <div className="movie-showtimes">
            {groupedMovies[title].map((showtime, index) => (
              <div className="each-showtime" key={index}>
                {/* Conditionally apply the cinema class */}
                <div
                  className={`showtime-time ${getCinemaClass(showtime.cinema)}`}
                >
                  {showtime.time}
                </div>
                <div className="showtime-cinema">({showtime.snif})</div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default BigChainFilmAvatar;
