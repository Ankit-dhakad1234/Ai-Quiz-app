const API_URL = 'http://localhost:5000/api/generate';
const PDF_API_URL = 'http://localhost:5000/api/pdf';
// For Vercel deployment, comment out the local URL above and uncomment this URL.
// const API_URL = 'https://ai-quiz-app-smoky-ten.vercel.app/api/generate';

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