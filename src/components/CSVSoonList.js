import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import MovieListHeading from './MovieListHeading';
import ComingSoonList from './ComingSoonList';

const CSVMovieList = ({ heading }) => {
    const [csvMovies, setCsvMovies] = useState([]);
    const csvFilePath = "/cs1.csv";

    useEffect(() => {
        const fetchMovieDataFromCSV = async () => {
            const response = await fetch(csvFilePath);
            const responseText = await response.text();

            Papa.parse(responseText, {
                header: true,
                skipEmptyLines: true,
                complete: (results) => {
                    const validMovies = results.data
                        .filter(row => row.cinema === heading && row.valid === "yes" && row.title && row.title.trim())
                        .map(row => {
                            const [day, month, year] = row.date.split('/');
                            const rowDate = new Date(`${year}-${month}-${day}`);
                            const now = new Date();

                            now.setHours(0, 0, 0, 0);
                            rowDate.setHours(0, 0, 0, 0);
                            if (rowDate <= now) {
                                return null;
                            }

                            return {
                                title: row.title,
                                year: row.year,
                                poster: row.poster,
                                date: row.date,
                                time: row.time,
                                theater: row.cinema,
                                url: row.href
                            };
                        })
                        .filter(movie => movie); // Filter out null results
                    setCsvMovies(validMovies);
                }
            });
        };

        fetchMovieDataFromCSV();
    }, [heading]); // Use heading as the only dependency

    return (
        <div className="movie-row-t">
            <MovieListHeading heading={heading} />
            <div className="pre-row-t">
                <ComingSoonList movies={csvMovies} />
            </div>
        </div>
    );
};

export default CSVMovieList;