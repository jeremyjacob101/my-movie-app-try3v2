import React from 'react';
const MovieList = (props) => {
    const FavoriteComponent = props.favoriteComponent;
    return (
        <>
            {props.movies.map((movie, index) => (
                <div key={movie.imdbID} className="each-film-icon-1"> {/* Use a unique key */}
                    <div className="hovering-film-1">
                        <img src={movie.Poster !== "N/A" ? movie.Poster : "/defposter.jpeg"} alt={movie.Title} />
                        <div onClick={() => props.handleFavoritesClick(movie)} className="overlay-1">
                            <FavoriteComponent />
                        </div>
                    </div>
                    <p className="under-title-1">{movie.Title}</p>
                    <br />
                    <p className="under-title-year-1">({movie.Year})</p>
                </div>
            ))}
        </>
    );
}
export default MovieList;