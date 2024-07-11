import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
    const [keyword, setKeyword] = useState('');
    const [suggestions, setSuggestions] = useState(new Map());
    const [results, setResults] = useState([]);
    const [questionCache, setQuestionCache] = useState(new Map());

    useEffect(() => {
        //initializing the cache from localStorage if needed
        // const cachedData = localStorage.getItem('questionCache');
        // if (cachedData) {
        //     setQuestionCache(new Map(JSON.parse(cachedData)));
        // }
        // const questionIds = suggestions.get(keyword);
        
    }, []);

    const handleInputChange = async(event) => {
        const { value } = event.target;
        setKeyword(value);

        try {
            const response = await axios.get(`http://localhost:3000/search?prefix=${value}`);
            const suggestionMap = new Map(Object.entries(response.data));
            setSuggestions(suggestionMap);
        } catch (error) {
            console.error('Error fetching suggestions:', error);
        }
    };

    const fetchQuestionsByIds = async (questionIds) => {
        const idsToFetch = questionIds.filter(id => !questionCache.has(id));
        if (idsToFetch.length === 0) {
            return; // All questions are in cache, no need to fetch
        }

        try {

            let fetchedQuestions = [];
            for (let id of idsToFetch){
                const response = await axios.get(`http://localhost:3000/questions/${id}`);
                fetchedQuestions.push(response.data);
            }
            const updatedCache = new Map(questionCache);
            fetchedQuestions.forEach(question => {
                updatedCache.set(question._id, question);
            });
            setQuestionCache(updatedCache);
        } catch (error) {
            console.error('Error fetching questions:', error);
        }
    };

    const handleSuggestionClick = async (word) => {
        setKeyword(word);
        try {
            const questionIds = suggestions.get(word);
            const cachedQuestions = questionIds.map(id => questionCache.get(id)).filter(Boolean);
            if (questionIds.length === cachedQuestions.length) {
                setResults(cachedQuestions);
            } 
            else {
                fetchQuestionsByIds(questionIds);
                const cachedQuestions_ = questionIds.map(id => questionCache.get(id)).filter(Boolean);
                setResults(cachedQuestions_);
                
            }
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
                    {[...suggestions.keys()].map((suggestion, index) => (
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
