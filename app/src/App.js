import React, { useState } from 'react';
import axios from 'axios';

function App() {
    const [keyword, setKeyword] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [results, setResults] = useState([]);

    const handleInputChange = async (event) => {
        const { value } = event.target;
        setKeyword(value);

        try {
            const response = await axios.get(`http://localhost:3000/search/suggestions?prefix=${value}`);
            setSuggestions(response.data);
        } catch (error) {
            console.error('Error fetching suggestions:', error);
        }
    };

    const handleSuggestionClick = async (word) => {
        setKeyword(word);
        try {
            const response = await axios.get(`http://localhost:3000/search?keyword=${word}`);
            setResults(response.data);
        } catch (error) {
            console.error('Error fetching search results:', error);
        }
    };

    return (
        <div className="App">
            <h1>Search Questions</h1>
            <input
                type="text"
                value={keyword}
                onChange={handleInputChange}
                placeholder="Enter keyword"
            />
            <button onClick={() => handleSuggestionClick(keyword)}>Search</button>
            <div>
                <h2>Suggestions</h2>
                <ul>
                    {suggestions.map((suggestion, index) => (
                        <li key={index} onClick={() => handleSuggestionClick(suggestion)}>
                            {suggestion}
                        </li>
                    ))}
                </ul>
            </div>
            <div>
                <h2>Results</h2>
                {results.map((result) => (
                    <div key={result._id}>
                        <h3>{result.body}</h3>
                        <p>Author: {result.authorID.name}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default App;
