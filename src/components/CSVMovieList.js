import React, { useState, useEffect, useRef } from 'react';
import Papa from 'papaparse';
import TequeList from './TequeList';
import MovieListHeading from './MovieListHeading';

const CSVMovieList = ({ heading }) => {
    const [csvMovies, setCsvMovies] = useState([]);
    const useEffectCounter = useRef(0); // Initialize a counter with useRef

    // Declare the CSV file path directly in the component
    const csvFilePath = "/allTest1.csv";

    useEffect(() => {

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
                            // Filter rows based on the provided heading (column value)
                            if (row.cinema === heading && row.title && row.title.trim()) {
                                const title = row.title.trim();

                                const [day, month, year] = row.date.split('/');
                                const rowDate = new Date(`${year}-${month}-${day}T${row.time}`);
                                const now = new Date();
                                now.setHours(now.getHours() - 3);
                                // Skip the entry if its date and time are before the current date and time
                                if (rowDate < now) {
                                    return null;
                                }

                                const movieUrl = `https://www.omdbapi.com/?s=${encodeURIComponent(title)}&apikey=8e1cae8c`;
                                useEffectCounter.current += 1; // Increment the counter each time useEffect runs
                                console.log(`API key has been run ${useEffectCounter.current} times`);

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
                                console.warn('Skipping row with missing or empty title or wrong cinema:', row);
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

        fetchMovieDataFromCSV();
    }, [heading]); // Use heading as the only dependency

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