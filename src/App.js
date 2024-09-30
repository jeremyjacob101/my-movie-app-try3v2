import React, { useState, useEffect } from 'react';

import MainHeading from './components/MainHeading';
// import CSVMovieList from './components/CSVMovieList';
// import CSVSoonList from './components/CSVSoonList';
// import MoviePace from './components/MoviePace';

import MovieCarousel from './components/MovieCarousel';

const App = () => {
  return (
    <>
      <div className="home-header">
        <div className="picnic-border">
          <MainHeading heading="Kartiseret" />
        </div>
        {/* <div className="movie-pace-holder">
          <MoviePace />
        </div> */}
      </div>
      <MovieCarousel />
      {/* <CSVMovieList heading="Jerusalem Cinemateque" />
      <CSVMovieList heading="Tel Aviv Cinemateque" />
      <CSVMovieList heading="Herziliya Cinemateque" />
      <CSVMovieList heading="Kolnoa Kanada" />
      <CSVMovieList heading="Haifa Cinemateque" />
      <CSVMovieList heading="Jaffa Cinema" />
      <CSVSoonList heading="Coming Soon" /> */}
    </>
  );
}

export default App;