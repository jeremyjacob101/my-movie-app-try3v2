import React, { useState, useEffect } from 'react';
import MovieList from './components/MovieList';
import VerticalFavorites from './components/VerticalFavorites';
import SearchBox from './components/SearchBox';
import AddFavorites from './components/AddFavorites';
import RemoveFavorites from './components/RemoveFavorites';
import MovieListHeading from './components/MovieListHeading';
import CSVMovieList from './components/CSVMovieList';

const App = () => {
  const [movies, setMovies] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [favorites, setFavorites] = useState([]);

  const getMovieRequest = async (searchValue) => {
    const url = `http://www.omdbapi.com/?s=${searchValue}&apikey=6311a1a9`;
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
    setFavorites(movieFavorites);
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
        <MovieListHeading heading="Picnic" />
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
      <CSVMovieList csvFilePath="/kanada1.csv" heading="Kolnoa Kanada" />
      <CSVMovieList csvFilePath="/herz1.csv" heading="Herziliya Cinemateque" />
      <CSVMovieList csvFilePath="/jlem1.csv" heading="Jerusalem Cinemateque" />
      <CSVMovieList csvFilePath="/haifa1.csv" heading="Haifa Cinemateque" />
      <CSVMovieList csvFilePath="/tlv1.csv" heading="Tel Aviv Cinemateque" />
      <div className="movie-row-1">
        <div className="vertical-row-1">
          <h1>Your Favorites</h1>
          <VerticalFavorites
            movies={favorites}
            handleFavoritesClick={removeFavoriteMovie}
            favoriteComponent={RemoveFavorites} />
        </div>
      </div>
    </>
  );
}

export default App;