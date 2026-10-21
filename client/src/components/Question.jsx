import React from 'react';

const Question = ({ questionData, userAnswer, onSelectAnswer }) => {
  return (
    <div className="question-container">

      {/* Question */}
      <h2 className="question-text">{questionData.question}</h2>

      {/* Options */}
      <div className="options-grid">
        {questionData.options.map((option, index) => {

          // Base button class
          let buttonClass = 'option-button';
          
          // Highlight only the selected option
          if (option === userAnswer) {
            buttonClass += ' selected';
          }

          return (
            <button
              key={index}
              className={buttonClass}
              onClick={() => onSelectAnswer(option)}
            >
              {option}
            </button>
          );
        })}
      </div>

    </div>
  );
};

export default Question;
