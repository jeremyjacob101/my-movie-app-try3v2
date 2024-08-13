import React from 'react';

const TequeList = (props) => {
    return (
        <>
            {props.movies.map((movie, index) => (
                <div key={movie.imdbID || index} className="each-film-icon-t">
                    <p className="under-title-t">{movie.date} - {movie.time}</p>
                    <div className="hovering-film-t">
                        <img src={movie.poster !== "N/A" ? movie.poster : "/defposter.jpeg"} alt={movie.title} />
                        <p className="under-title-t">{movie.title}</p>
                        <br />
                        <p className="under-title-t">({movie.year})</p>
                    </div>
                    <div className="under-t">
                        <br />
                    </div>
                </div>
            ))}
        </>
    );
}

export default TequeList;