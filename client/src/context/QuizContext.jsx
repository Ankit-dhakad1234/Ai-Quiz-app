import React, { createContext, useReducer } from 'react';

const initialState = {
  questions: [],
  userAnswers: [],
  currentQuestionIndex: 0,
  score: 0,
  isLoading: false,
  error: null,
  topic: '',
};

const QuizReducer = (state, action) => {
  // Reducer logic remains the same
  switch (action.type) {
    case 'SET_LOADING': return { ...state, isLoading: action.payload };
    case 'SET_ERROR': return { ...state, isLoading: false, error: action.payload };
    case 'START_QUIZ': return { ...initialState, questions: action.payload.questions, topic: action.payload.topic, userAnswers: new Array(action.payload.questions.length).fill(null), };
    case 'ANSWER_QUESTION': {
      const newUserAnswers = [...state.userAnswers];
      newUserAnswers[state.currentQuestionIndex] = action.payload.answer;
      return { ...state, userAnswers: newUserAnswers };
    }
    case 'NEXT_QUESTION': {
      let newIndex = state.currentQuestionIndex + 1;
      if (newIndex === state.questions.length) {
        const finalScore = state.userAnswers.reduce((acc, answer, index) => (answer === state.questions[index].correctAnswer ? acc + 1 : acc), 0);
        return { ...state, currentQuestionIndex: newIndex, score: finalScore };
      }
      return { ...state, currentQuestionIndex: newIndex };
    }
    
    case 'PREV_QUESTION': return { ...state, currentQuestionIndex: Math.max(0, state.currentQuestionIndex - 1), };
    case 'RESET_QUIZ': return initialState;
    default: return state;
  }
};

export const QuizContext = createContext({
  quizState: initialState,
  dispatch: () => null,
});

export const QuizProvider = ({ children }) => {
  const [quizState, dispatch] = useReducer(QuizReducer, initialState);
  return (
    <QuizContext.Provider value={{ quizState, dispatch }}>
      {children}
    </QuizContext.Provider>
  );
};