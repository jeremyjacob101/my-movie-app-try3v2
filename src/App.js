import React, { useState, useEffect } from 'react';
import MovieList from './components/MovieList';
import VerticalFavorites from './components/VerticalFavorites';
import SearchBox from './components/SearchBox';
import AddFavorites from './components/AddFavorites';
import RemoveFavorites from './components/RemoveFavorites';
import MovieListHeading from './components/MovieListHeading';
import MainHeading from './components/MainHeading';
import CSVMovieList from './components/CSVMovieList';
import MoviePace from './components/MoviePace';
import { Analytics } from "node_modules/@vercel/analytics/dist/react";

const App = () => {
  const [movies, setMovies] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [favorites, setFavorites] = useState([]);

  const getMovieRequest = async (searchValue) => {
    const url = `https://www.omdbapi.com/?s=${searchValue}&apikey=8e1cae8c`;
    const response = await fetch(url);
    const responseJson = await response.json();
    if (responseJson.Search)
      setMovies(responseJson.Search);
  };

  useEffect(() => {
    getMovieRequest(searchValue);
  }, [searchValue]);

  useEffect(() => {
    const movieFavorites = JSON.parse(localStorage.getItem('react-movie-app-favorites-1'));
    setFavorites(movieFavorites || []); // Provides an empty array fallback if null
  }, []);

  const saveToLocalStorage = (items) => {
    localStorage.setItem('react-movie-app-favorites-1', JSON.stringify(items))
  }

  const addFavoriteMovie = (movie) => {
    const isAlreadyFavorite = favorites.some(favorite => favorite.imdbID === movie.imdbID);
    if (!isAlreadyFavorite) {
      const newFavoriteList = [...favorites, movie];
      setFavorites(newFavoriteList);
      saveToLocalStorage(newFavoriteList);
    }
  }

  const removeFavoriteMovie = (movie) => {
    const newFavoriteList = favorites.filter((favorite) => favorite.imdbID !== movie.imdbID);
    setFavorites(newFavoriteList);
    saveToLocalStorage(newFavoriteList);
  }

  return (
    <>
      <div className="home-header">
        <div className="picnic-border">
          <MainHeading heading="Picnic" />
        </div>
        <div className="movie-pace-holder">
          <MoviePace />
        </div>
      </div>
      <CSVMovieList heading="Jerusalem Cinemateque" />
      <CSVMovieList heading="Tel Aviv Cinemateque" />
      <CSVMovieList heading="Herziliya Cinemateque" />
      <CSVMovieList heading="Kolnoa Kanada" />
      <CSVMovieList heading="Haifa Cinemateque" />
      <CSVMovieList heading="Jaffa Cinema" />
      <div className="home-header">
        <MovieListHeading heading="Search" />
        <SearchBox searchValue={searchValue} setSearchValue={setSearchValue} />
      </div>
      <div className="movie-row-1">
        <div className="pre-row">
          <MovieList
            movies={movies}
            handleFavoritesClick={addFavoriteMovie}
            favoriteComponent={AddFavorites} />
        </div>
      </div>
      <div className="home-header">
        <MovieListHeading heading="Favorites" />
      </div>
      <div className="movie-row-1">
        <div className="pre-row">
          <MovieList
            movies={favorites}
            handleFavoritesClick={removeFavoriteMovie}
            favoriteComponent={RemoveFavorites} />
        </div>
      </div>
      <div className="movie-row-1">
        <div className="vertical-row-1">
          <h1>Your Favorites</h1>
          <br></br>
          <VerticalFavorites
            movies={favorites}
            handleFavoritesClick={removeFavoriteMovie}
            favoriteComponent={RemoveFavorites} />
        </div>
      </div>
      <Analytics />
    </>
  );
}

export default App;