import React from "react";
import "../componentsCSS/BigChainFilmAvatar.css";

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
      type: movie.type,
      poster: movie.poster,
      runtime: movie.runtime,
    });
  });

  Object.keys(groupedMovies).forEach((title) => {
    groupedMovies[title].sort((a, b) => {
      const timeA = parseTime(a.time);
      const timeB = parseTime(b.time);
      return timeA - timeB; // Sort in ascending order
    });
  });

  return groupedMovies;
};

const parseTime = (timeString) => {
  const [hours, minutes] = timeString.split(":").map(Number);
  return hours * 60 + minutes; // Return time in minutes since midnight
};

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
          <div className="movie-poster-sub-block">
            <img src={groupedMovies[title][0].poster} alt={`${title} poster`} />
          </div>
          <div className="movie-info-sub-block">
            <div className="movie-title">{title}</div>
            <div className="movie-runtime">
              {groupedMovies[title][0].runtime} minutes
            </div>
          </div>
          <div className="movie-times-sub-block">
            {groupedMovies[title].map((showtime, index) => (
              <div className="each-showtime" key={index}>
                <div
                  className={`showtime-time ${getCinemaClass(showtime.cinema)}`}
                >
                  {showtime.time}
                </div>
                {showtime.type !== "Regular" && (
                  <div className="showtime-type">({showtime.type})</div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default BigChainFilmAvatar;
