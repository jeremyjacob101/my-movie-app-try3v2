import React from 'react';

const ComingSoonList = (props) => {
    return (
        <>
            {props.movies.map((movie, index) => (
                <div key={movie.imdbID || index} className="each-film-icon-t">
                    <div className="hovering-film-t">
                        <p className="under-title-t">{movie.date}</p>
                        <img src={movie.poster !== "N/A" ? movie.poster : "/defposter.jpeg"} alt={movie.title}/>
                        <p className="under-title-t">{movie.title}</p>
                    </div>
                    <div className="under-t">
                        <br />
                    </div>
                </div>
            ))}
        </>
    );
}

export default ComingSoonList;