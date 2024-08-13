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
                            const rowDate = new Date(`${year}-${month}-${day}T${row.time}`); // Combine date and time

                            // Get today's date and current time minus three hours for accurate comparison
                            const now = new Date();
                            now.setHours(now.getHours() - 3); // Set time to current time minus three hours

                            // Skip the entry if its date and time are before the current date and time
                            if (rowDate < now) {
                                console.warn(`Skipping title "${title}" because its date and time (${row.date} ${row.time}) are before now.`);
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
                                        // Transform the date format
                                        const transformedDate = `${parseInt(day, 10)}.${parseInt(month, 10)}`;

                                        return {
                                            title: firstMovie.Title,
                                            year: firstMovie.Year,
                                            poster: firstMovie.Poster,
                                            date: transformedDate,
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