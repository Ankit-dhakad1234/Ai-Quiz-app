import React from 'react';

const Question = ({ questionData, userAnswer, onSelectAnswer }) => {
  return (
    <div className="question-container">

      {/* Question */}
      <h2
        className="question-text"
        dangerouslySetInnerHTML={{ __html: questionData.question }}
      />

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
              dangerouslySetInnerHTML={{ __html: option }}
            />
          );
        })}
      </div>

    </div>
  );
};

export default Question;
