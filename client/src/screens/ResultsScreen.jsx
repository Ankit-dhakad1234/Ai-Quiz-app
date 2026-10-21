import React, { useEffect, useState } from 'react';
import Confetti from 'react-confetti'; // --- NEW: Import confetti ---
import { useQuiz } from '../hooks/useQuiz';
import { fetchFeedback } from '../services/QuizServices.js';
import Loader from '../components/Loader';



// import React, { useEffect, useState } from 'react';
// import Confetti from 'react-confetti';
// import { useQuiz } from '../hooks/useQuiz';
// import { fetchFeedback } from '../services/QuizService';
// import Loader from '../components/Loader';

const ResultsScreen = () => {
  const { quizState, dispatch } = useQuiz();
  const { score, questions, topic } = quizState;
  const [feedback, setFeedback] = useState('');
  const [loadingFeedback, setLoadingFeedback] = useState(true);

  useEffect(() => {
    if (topic && score !== null) {
      // Save high score to localStorage
      const currentHighScore = localStorage.getItem(`highScore_${topic}`) || 0;
      if (score > currentHighScore) {
        localStorage.setItem(`highScore_${topic}`, score);
      }

      // Fetch AI feedback
      const getFeedback = async () => {
        try {
          setLoadingFeedback(true);
          const aiFeedback = await fetchFeedback(topic, score, questions.length);
          setFeedback(aiFeedback);
        } catch (error) {
          setFeedback("We couldn't generate feedback, but great job on completing the quiz!");
        } finally {
          setLoadingFeedback(false);
        }
      };
      getFeedback();
    }
  }, [score, topic, questions.length]);

  const percentage = Math.round((score / questions.length) * 100);

  return (
    <div className="results-container">
      {/* Show confetti on perfect score */}
      {score === questions.length && <Confetti />}
      
      <h2>Quiz Complete!</h2>
      <p>You scored</p>
      
      <div className="score-circle">
        {score} / {questions.length}
      </div>
      
      <p className="percentage">({percentage}%)</p>
      
      <div className="feedback-box">
        <h3>Personalized Feedback</h3>
        {loadingFeedback ? (
          <Loader message="Generating feedback..." />
        ) : (
          <p>{feedback}</p>
        )}
      </div>

      <div className="results-actions">
        <button className="btn btn-secondary" onClick={() => dispatch({ type: 'RESET_QUIZ' })}>
          Back to Topics
        </button>
        {/* <button className="btn" onClick={() => dispatch({ type: 'RESET_QUIZ' })}>
          Play Again
        </button> */}
      </div>
    </div>
  );
};

export default ResultsScreen;