import React from 'react';
import { useQuiz } from "../hooks/useQuiz";
// CORRECT
import { fetchQuizQuestions } from "../services/QuizServices.js";
import { useState } from 'react';

const TopicScreen = () => {
  const { dispatch } = useQuiz();

  const handleTopicSelect = async (topic) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const questions = await fetchQuizQuestions(topic);
      if (questions && questions.length > 0) {
        dispatch({ type: 'START_QUIZ', payload: { questions, topic } });
      } else {
        throw new Error("Received no questions from the AI.");
      }
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err.message || 'An unknown error occurred.' });
    }
  };

  const topics = [
    { name: 'Technology', svg: <svg className="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M20 18c1.1 0 1.99-.9 1.99-2L22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2H0v2h24v-2h-4zM4 6h16v10H4V6z"/></svg> },
    { name: 'World History', svg: <svg className="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg> },
    { name: 'Science', svg: <svg className="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M20.5 11H19V7c0-1.1-.9-2-2-2h-4V3.5C13 2.12 11.88 1 10.5 1S8 2.12 8 3.5V5H4c-1.1 0-2 .9-2 2v4H1.5C.67 11 0 11.67 0 12.5v1C0 14.33.67 15 1.5 15H3v4c0 1.1.9 2 2 2h4v1.5c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5V21h4c1.1 0 2-.9 2-2v-4h1.5c.83 0 1.5-.67 1.5-1.5v-1c0-.83-.67-1.5-1.5-1.5z"/></svg> },
    { name: 'Wellness', svg: <svg className="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-2.48 14.45c-.29.29-.77.29-1.06 0L4.2 12.2a.754.754 0 0 1 0-1.06c.29-.29.77-.29 1.06 0l3.71 3.71-1.06 1.06zm5.8-5.79c.29-.29.77-.29 1.06 0l4.25 4.25c.29.29.29.77 0 1.06-.29.29-.77.29-1.06 0l-3.71-3.71 1.06-1.06zM12.54 9.3l-1.06 1.06c-.29.29-.77.29-1.06 0l-.71-.71c-.29-.29-.29-.77 0-1.06.29-.29.77-.29 1.06 0l.71.71c.29.29.29.77 0 1.06zm-1.06-2.12c-.29-.29-.77-.29-1.06 0l-.71.71c-.29.29-.29-.77 0-1.06.29-.29.77-.29 1.06 0l.71.71c.29.29.29.77 0 1.06z"/></svg> },
  ];

  const [input, setInput] = useState('');
  return (
    <div>
      <h1 className='title'>AI Knowledge Quiz</h1>

      <p>Select a topic to start your quiz!</p>
      <input 
      type="text"
      className="input-field"
      onChange={(e) => setInput(e.target.value)} 
      placeholder='Enter Topic Name'
      ></input>
      <button className="btn" onClick={() => handleTopicSelect(input)}>Start Quiz</button>

      <div className="topic-grid">
        {topics.map(topic => {
          const highScore = localStorage.getItem(`highScore_${topic.name}`);
          return (
            <button key={topic.name} className="topic-btn" onClick={() => handleTopicSelect(topic.name)}>
              {topic.svg}
              <div className="topic-text-container">
                <span>{topic.name}</span>
                {highScore && <span className="high-score">High Score: {highScore}/5</span>}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  );
};

export default TopicScreen;