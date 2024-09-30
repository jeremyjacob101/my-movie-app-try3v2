import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';

const MovieCarousel = () => {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);

    // Simulate today's date for now
    const today = '30/09/2024';

    useEffect(() => {
        // Function to load the CSV data
        const loadMovieData = async () => {
            try {
                const response = await fetch('/path-to-your-showtimes.csv');
                const reader = response.body.getReader();
                const result = await reader.read();
                const decoder = new TextDecoder('utf-8');
                const csvData = decoder.decode(result.value);

                // Parse CSV data using PapaParse
                Papa.parse(csvData, {
                    header: true,
                    complete: (results) => {
                        const filteredMovies = results.data.filter((movie) => movie.date === today);
                        setMovies(filteredMovies);
                        setLoading(false);
                    }
                });
            } catch (error) {
                console.error("Error loading movie data:", error);
                setLoading(false);
            }
        };

        loadMovieData();
    }, [today]);

    if (loading) {
        return <div>Loading movies...</div>;
    }

    return (
        <div>
            <h2>Movies Playing on {today}</h2>
            <ul>
                {movies.map((movie, index) => (
                    <li key={index}>
                        <strong>{movie.title}</strong> - {movie.time} at {movie.cinema} ({movie.snif})
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default MovieCarousel;