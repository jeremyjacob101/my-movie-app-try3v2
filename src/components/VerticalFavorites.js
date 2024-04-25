import React from 'react';

const VerticalFavorites = (props) => {
    const FavoriteComponent = props.favoriteComponent;

    return (
        <>
            {props.movies.map((movie, index) => <div className="each-vertical-icon-1">
                <div className="hovering-film-1">
                    <img src={movie.Poster} alt="movie"></img>
                    <div onClick={() => props.handleFavoritesClick(movie)} className="overlay-1">
                        <FavoriteComponent />
                    </div>
                </div>
                <p className="vertical-title-1">{movie.Title}</p>
                <p className="vertical-title-year-1">({movie.Year})</p>
            </div>)}
        </>
    );
}

export default VerticalFavorites;