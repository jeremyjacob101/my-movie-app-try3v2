import React from 'react';

const MovieList = (props) => {
    const FavoriteComponent = props.favoriteComponent;

    return (
        <>
            {props.movies && props.movies.map((movie, index) => ( // Check if movies exists
                <div key={movie.imdbID} className="each-film-icon-1">
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