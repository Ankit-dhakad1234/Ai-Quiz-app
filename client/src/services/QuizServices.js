// const API_URL = 'http://localhost:5000/api/generate';
// const API_URL = '/api/generate';
// const API_URL = 'http://localhost:5000/api/generate';
const API_URL = 'https://quiz-app-ozkx.vercel.app/api/generate';

export const fetchQuizQuestions = async (topic) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type: 'quiz', payload: { topic } }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to fetch quiz questions.');
  }
  return response.json();
};

export const fetchFeedback = async (topic, score) => {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'feedback', payload: { topic, score } }),
    });

    if (!response.ok) {
        throw new Error('Failed to fetch feedback.');
    }
    const data = await response.json();
    return data.feedback;
};