// const API_URL = 'http://localhost:5000/api/generate';
// const PDF_API_URL = 'http://localhost:5000/api/pdf';

// For Vercel deployment, comment out the local URL above and uncomment this URL.
// const API_URL = 'https://ai-quiz-app-smoky-ten.vercel.app/api/generate';

const BASE_URL = 'https://ai-quiz-app-smoky-ten.vercel.app';
const API_URL = `${BASE_URL}/api/generate`;
const PDF_API_URL = `${BASE_URL}/api/pdf`;

export const uploadPdf = async (file) => {
  const formData = new FormData();
  formData.append('pdf', file);

  const response = await fetch(`${PDF_API_URL}/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to process this PDF.');
  }
  return response.json();
};

export const askPdfQuestion = async (documentId, question) => {
  const response = await fetch(`${PDF_API_URL}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ documentId, question }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to answer this question.');
  }
  const data = await response.json();
  return data.answer;
};

export const generatePdfQuiz = async (documentId, questionCount, difficulty) => {
  const response = await fetch(`${PDF_API_URL}/quiz`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ documentId, questionCount, difficulty }),
  });

  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    if (!response.ok) {
      throw new Error(`PDF quiz API returned HTTP ${response.status}. Make sure the updated backend is deployed.`);
    }
    throw new Error('PDF quiz API returned an unexpected response.');
  }

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to generate a quiz from this PDF.');
  }
  return data.questions;
};

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

export const fetchFeedback = async (topic, score, totalQuestions) => {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'feedback', payload: { topic, score, totalQuestions } }),
    });

    if (!response.ok) {
        throw new Error('Failed to fetch feedback.');
    }
    const data = await response.json();
    return data.feedback;
};