import React from 'react';
const VerticalFavorites = (props) => {
    const FavoriteComponent = props.favoriteComponent;
    return (
        <>
            {props.movies.map((movie, index) => (
                <div key={movie.imdbID} className="each-favorite-item"> {/* Use a unique key */}
                    <div className="favorite-item-content">
                        <img src={movie.Poster !== "N/A" ? movie.Poster : "/defposter.jpeg"} alt={movie.Title} />
                        <div onClick={() => props.handleFavoritesClick(movie)} className="overlay">
                            <FavoriteComponent />
                        </div>
                    </div>
                    <p>{movie.Title}</p>
                    <p>({movie.Year})</p>
                </div>
            ))}
        </>
    );
}

export default VerticalFavorites;