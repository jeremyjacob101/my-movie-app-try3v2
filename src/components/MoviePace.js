import React, { useState } from 'react';

const MoviePace = () => {
    const [value, setValue] = useState(0);  // Movies watched so far
    const [goal, setGoal] = useState(200);  // Goal for the year
    const [result, setResult] = useState('');

    const handleValueChange = (e) => {
        const newValue = e.target.value;
        setValue(newValue === '' ? '' : Number(newValue)); // Handle empty input and number conversion
    };

    const handleGoalChange = (e) => {
        const newGoal = e.target.value;
        setGoal(newGoal === '' ? '' : Number(newGoal)); // Handle empty input and number conversion
    };

    const calculateMovieStats = () => {
        const currentDate = new Date();
        const startOfYear = new Date(currentDate.getFullYear(), 0, 1);
        const daysPassed = Math.floor((currentDate - startOfYear) / (1000 * 60 * 60 * 24)) + 1;

        const avgMonthLength = 30.44;
        const monthsPassed = daysPassed / avgMonthLength;
        const moviesPerMonth = (value / monthsPassed).toFixed(1);

        const pace = Math.round(value * 365.25 / daysPassed);

        const moviesLeft = goal - value;
        let resultText = `On pace for this many movies: ${pace} (${moviesPerMonth}/month)\n`;

        if (moviesLeft <= 0) {
            resultText += `Movie goal already reached!\n`;
        } else {
            const endOfYear = new Date(currentDate.getFullYear(), 11, 31);
            const daysLeft = Math.floor((endOfYear - currentDate) / (1000 * 60 * 60 * 24)) + 1;
            const moviesPerDay = (moviesLeft / daysLeft);
            resultText += `To reach ${goal}, watch ${(moviesPerDay * avgMonthLength).toFixed(1)}/month for the rest of ${currentDate.getFullYear()}.\n`;
        }

        setResult(resultText);
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            calculateMovieStats();
        }
    };

    return (
        <div className="pace-box">
            <h1>Movie Pace</h1>
            <label>
                Movies Watched:
                <input
                    type="number"
                    value={value}
                    onChange={handleValueChange}
                    onKeyDown={handleKeyDown} // Trigger calculation on Enter key
                    onFocus={(e) => e.target.select()} // Select all text on focus
                />
            </label>
            <br />
            <label>
                Goal for the Year:
                <input
                    type="number"
                    value={goal}
                    onChange={handleGoalChange}
                    onKeyDown={handleKeyDown} // Trigger calculation on Enter key
                    onFocus={(e) => e.target.select()} // Select all text on focus
                />
            </label>
            <br />
            <button onClick={calculateMovieStats}>Calculate</button>
            <pre className="print-result-calc">{result}</pre>
        </div>
    );
}

export default MoviePace;