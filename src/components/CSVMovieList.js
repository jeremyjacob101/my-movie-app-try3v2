import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import TequeList from './TequeList';
import MovieListHeading from './MovieListHeading';

const CSVMovieList = ({ csvFilePath, heading }) => {
    const [csvMovies, setCsvMovies] = useState([]);

    const fetchMovieDataFromCSV = async () => {
        try {
            const response = await fetch(csvFilePath);
            const responseText = await response.text();

            if (responseText.includes('<!DOCTYPE html>')) {
                throw new Error('The CSV file path might be incorrect or the file is not being served correctly.');
            }

            Papa.parse(responseText, {
                header: true,
                skipEmptyLines: true,
                complete: (results) => {
                    const movieRequests = results.data.map(async (row) => {
                        if (row.title && row.title.trim()) {
                            const title = row.title.trim();

                            // Manually parse the date assuming format is DD/MM/YYYY
                            const [day, month, year] = row.date.split('/');
                            const rowDate = new Date(`${year}-${month}-${day}`);

                            // Get today's date and set the time to 00:00:00 for accurate comparison
                            const today = new Date();
                            today.setHours(0, 0, 0, 0);

                            // Skip the entry if its date is before today's date
                            if (rowDate < today) {
                                console.warn(`Skipping title "${title}" because its date (${row.date}) is before today.`);
                                return null;
                            }

                            const movieUrl = `http://www.omdbapi.com/?s=${encodeURIComponent(title)}&apikey=6311a1a9`;

                            try {
                                const movieResponse = await fetch(movieUrl);
                                if (!movieResponse.ok) {
                                    throw new Error(`Failed to fetch movie data: ${movieResponse.statusText}`);
                                }
                                const movieData = await movieResponse.json();

                                if (movieData && movieData.Response === "True" && movieData.Search && movieData.Search.length > 0) {
                                    const firstMovie = movieData.Search.find(result => result.Type === "movie");

                                    if (firstMovie) {
                                        return {
                                            title: firstMovie.Title,
                                            year: firstMovie.Year,
                                            poster: firstMovie.Poster,
                                            date: row.date,
                                            time: row.time,
                                            theater: row.cinema,
                                        };
                                    } else {
                                        console.error(`No movie found for title: "${title}"`);
                                    }
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

                    Promise.all(movieRequests).then((movies) => {
                        const validMovies = movies.filter(movie => movie); // Filter out null results
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
        fetchMovieDataFromCSV();
    }, [csvFilePath]);

    return (
        <div className="movie-row-t">
            <MovieListHeading heading={heading} />
            <div className="pre-row-t">
                <TequeList
                    movies={csvMovies}
                />
            </div>
        </div>
    );
};

export default CSVMovieList;