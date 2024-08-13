import React from 'react';

const TequeList = (props) => {

    return (
        <>
            {props.movies.map((movie, index) => <div className="each-film-icon-t">
                <div className="hovering-film-t">
                    <img src={movie.poster !== "N/A" ? movie.poster : "/defposter.jpeg"} alt={movie.title} />
                    <p className="under-title-t">{movie.title}</p>
                    <br></br>
                    <p className="under-title-t">({movie.year})</p>
                </div>
                <div className="under-t">
                    <br></br>
                    <p className="under-title-year-t">{movie.date}</p>
                    <p className="under-title-year-t">{movie.time}</p>
                </div>
            </div>)}
        </>
    );
}

export default TequeList;