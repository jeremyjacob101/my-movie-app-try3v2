import React, { useState, useEffect } from 'react';
import MovieList from './components/MovieList';
import TequeList from './components/TequeList';
import MovieListHeading from './components/MovieListHeading';
import SearchBox from './components/SearchBox';
import AddFavorites from './components/AddFavorites';
import RemoveFavorites from './components/RemoveFavorites';
import VerticalFavorites from './components/VerticalFavorites';
import Papa from 'papaparse';

const App = () => {

  const [movies, setMovies] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [favorites, setFavorites] = useState([]);
  const [csvMovies, setCsvMovies] = useState([]);

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

  const fetchMovieDataFromCSV = async () => {
    const csvFilePath = '/kanada1.csv'; // Update with the actual CSV file path
    try {
      const response = await fetch(csvFilePath);
      const responseText = await response.text();

      console.log('Fetched response:', responseText.slice(0, 500)); // Log the first 500 characters of the response to see if it's correct

      // Check if the response is HTML (which means the file path might be incorrect)
      if (responseText.includes('<!DOCTYPE html>')) {
        throw new Error('The CSV file path might be incorrect or the file is not being served correctly.');
      }

      Papa.parse(responseText, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const movieRequests = results.data.map(async (row) => {
            // Check if the title field exists and is not empty
            if (row.title && row.title.trim()) {
              const title = row.title.trim();
              const movieUrl = `http://www.omdbapi.com/?t=${encodeURIComponent(title)}&apikey=6311a1a9`;
              console.log(`Fetching data for title: "${title}" with URL: ${movieUrl}`);

              try {
                const movieResponse = await fetch(movieUrl);
                if (!movieResponse.ok) {
                  throw new Error(`Failed to fetch movie data: ${movieResponse.statusText}`);
                }
                const movieData = await movieResponse.json();

                if (movieData && movieData.Response === "True") {
                  return {
                    title: movieData.Title,
                    year: movieData.Year,
                    poster: movieData.Poster,
                    date: row.date,
                    time: row.time,
                    theater: row.cinema,
                    // details: `${row.date} - ${row.time} - ${row.cinema}`,
                  };
                } else {
                  console.error(`No valid response for title: "${title}"`);
                }
              } catch (error) {
                console.error(`Error fetching data for title "${title}":`, error);
              }
            } else {
              console.warn('Skipping row with missing or empty title:', row);
            }
          });

          // Wait for all movie requests to complete
          Promise.all(movieRequests).then((movies) => {
            const validMovies = movies.filter(movie => movie); // Filter out undefined results
            console.log('Valid movies fetched from CSV:', validMovies);
            setCsvMovies(validMovies);
          }).catch(error => {
            console.error('Error processing movie requests:', error);
          });
        }
      });
    } catch (error) {
      console.error('Error fetching CSV file:', error);
    }
  };

  useEffect(() => {
    // Delay the fetchMovieDataFromCSV call to ensure the app is fully loaded
    const timeoutId = setTimeout(() => {
      fetchMovieDataFromCSV();
    }, 1000); // Wait 3 seconds before making the API calls

    return () => clearTimeout(timeoutId); // Clean up the timeout if the component unmounts
  }, []);


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
      <div className="home-header">
        <MovieListHeading heading="Kolnoa Kanada" />
      </div>
      <div className="movie-row-t">
        <div className="pre-row-t">
          <TequeList
            movies={csvMovies}
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
    </>
  );
}

export default App;