import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import TequeList from './TequeList';
import MovieListHeading from './MovieListHeading';

const CSVMovieList = ({ heading }) => {
    const [csvMovies, setCsvMovies] = useState([]);
    const csvFilePath = "/postNPY1.csv";

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
                                const rowDate = new Date(`${year}-${month}-${day}T${row.time}`);
                                const now = new Date();
                                now.setHours(now.getHours() - 3);

                                if (rowDate < now) {
                                    return null;
                                }

                                const transformedDate = `${parseInt(day, 10)}.${parseInt(month, 10)}`;

                                return {
                                    title: row.title,
                                    year: row.year,
                                    poster: row.poster,
                                    date: transformedDate,
                                    time: row.time,
                                    theater: row.cinema,
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
                <TequeList
                    movies={csvMovies}
                />
            </div>
        </div>
    );
};

export default CSVMovieList;