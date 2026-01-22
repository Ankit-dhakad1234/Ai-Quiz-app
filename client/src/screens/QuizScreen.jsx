import React, { useState, useEffect } from 'react';
import { useQuiz } from '../hooks/useQuiz';
import Question from '../components/Question';
import ProgressBar from '../components/ProgressBar';

const QuizScreen = () => {
  // Access quiz state and dispatch function from context
  const { quizState, dispatch } = useQuiz();

  // Destructure required values from quiz state
  const { questions, currentQuestionIndex, userAnswers } = quizState;

  // Local state to track whether the current question has been answered
  // NOTE: This is now ONLY for UI purposes (highlighting), not for blocking changes
  const [isAnswered, setIsAnswered] = useState(false);

  // Get current question based on index
  const currentQuestion = questions[currentQuestionIndex];

  // Get the user's answer for the current question (can be null or a value)
  const userAnswer = userAnswers[currentQuestionIndex];

  /**
   * Runs whenever the question changes OR when the stored answer changes
   * Used to keep UI in sync (for example, highlighting selected option)
   */
  useEffect(() => {
    setIsAnswered(userAnswer !== null);
  }, [currentQuestionIndex, userAnswer]);

  /**
   * Handles option selection
   * - Allows user to change answer freely
   * - Dispatches ANSWER_QUESTION every time
   */
  const handleAnswerSelect = (answer) => {
    setIsAnswered(true); // Mark as answered for UI feedback

    // Store / overwrite answer in global quiz state
    dispatch({
      type: 'ANSWER_QUESTION',
      payload: { answer }
    });
  };

  return (
    <div className="quiz-container">
      
      {/* Quiz header showing current progress */}
      <div className="quiz-header">
        <span>
          Question {currentQuestionIndex + 1} of {questions.length}
        </span>
      </div>

      {/* Progress bar indicating quiz completion */}
      <ProgressBar
        current={currentQuestionIndex + 1}
        total={questions.length}
      />

      {/* Question component */}
      <Question
        questionData={currentQuestion}     // Question text & options
        userAnswer={userAnswer}             // Currently selected answer
        onSelectAnswer={handleAnswerSelect} // Click handler
        isAnswered={isAnswered}             // Used only for styling/feedback
      />

      {/* Navigation buttons */}
      <div className="navigation">
        <button
          className="btn btn-secondary"
          onClick={() => dispatch({ type: 'PREV_QUESTION' })}
          disabled={currentQuestionIndex === 0}
        >
          Previous
        </button>

        <button
          className="btn"
          onClick={() => dispatch({ type: 'NEXT_QUESTION' })}
        >
          {currentQuestionIndex === questions.length - 1
            ? 'Finish'
            : 'Next'}
        </button>
      </div>

    </div>
  );
};

export default QuizScreen;
