AI-Assisted Knowledge Quiz
This project is a dynamic, multi-screen quiz application that leverages a Generative AI (Google's Gemini) to create questions and personalized feedback in real-time. 
It is built using the MERN stack (Node.js/Express backend and a React frontend).

1. Project Setup & Demo
This project consists of a server (backend) and a client (frontend). Both must be running simultaneously in separate terminals for the application to work.

A. Start the Backend Server:
# Navigate to the server directory
cd server

# Install dependencies
npm install

# Add a .env file in the project root containing your Gemini API key:
# GEMINI_API_KEY=your_gemini_api_key

# Start the server (runs on http://localhost:5000)
npm start

B. Start the Frontend Client:
# Open a new terminal and navigate to the client directory
cd client

# Install dependencies
npm install

# Start the client (opens in browser at http://localhost:5173)
npm run dev

For local testing, the client uses `http://localhost:5000/api/generate`. Before deploying
the client to Vercel, comment out that URL and uncomment the Vercel URL in
`client/src/services/QuizServices.js`.

Demo
The working demo is available by running the project on your local machine using the instructions above.

Of course. Here is a complete README.md file for your project, tailored to the structure you requested and focused on running it locally.

AI-Assisted Knowledge Quiz
This project is a dynamic, multi-screen quiz application that leverages a Generative AI (Google's Gemini) to create questions and personalized feedback in real-time. It is built using the MERN stack (Node.js/Express backend and a React frontend).

1. Project Setup & Demo
This project consists of a server (backend) and a client (frontend). Both must be running simultaneously in separate terminals for the application to work.

A. Start the Backend Server:

Bash

# Navigate to the server directory
cd server

# Install dependencies
npm install

# Start the server (runs on http://localhost:5000)
npm start
B. Start the Frontend Client:

Bash

# Open a new terminal and navigate to the client directory
cd client

# Install dependencies
npm install

# Start the client (opens in browser at http://localhost:5173)
npm run dev
Demo
The working demo is available by running the project on your local machine using the instructions above.

2. Problem Understanding
The core task was to build an interactive quiz where the questions and the final feedback are not static but are generated on-demand by an AI. This creates a unique and replayable experience for the user. The application needed to handle a multi-screen flow: topic selection, loading state, the quiz itself, and a final results screen.

Assumptions Made:

The user has a stable internet connection to communicate with the AI service.

A valid Google Gemini API key is required and is stored securely in a .env file on the server.

The AI is capable of consistently returning data in the requested JSON format after proper prompt engineering.

3. AI Prompts & Iterations
Getting reliable, structured data from the AI was the main challenge. This required refining the prompts from a simple request to a detailed set of instructions.

Quiz Question Generation
Initial Prompt:

"Generate 5 multiple choice questions about Technology. Format as JSON."

Issues Faced: This prompt was too simple. The AI would often return inconsistent JSON, include conversational text like "Here are your questions:", or wrap the JSON in markdown code blocks, which caused parsing errors on the server.

Refined & Final Prompt:
The final prompt is highly specific, providing a clear structure and strict rules to ensure reliable JSON output every time.

  You are a helpful quiz generator. Create 5 multiple-choice questions on the topic "${topic}". 
Return ONLY valid JSON array format:
[
  {"question": "", "options": ["A","B","C","D"], "correctAnswer": ""}
]

Personalized Feedback Generation
Prompt: For the feedback, a single, well-defined prompt was effective. It sets a persona for the AI ("friendly tutor") and gives it the necessary context (the user's score and the quiz topic) to generate a relevant and encouraging message.

You are a friendly tutor. A student scored ${score}/5 on a quiz about "${topic}".
Write a short, encouraging feedback paragraph.

4. Architecture & Code Structure
The application follows a modern MERN-style architecture, emphasizing modularity and clear separation of concerns.

App.jsx manages navigation. It acts as a router by conditionally rendering the different screen components (TopicScreen, QuizScreen, ResultsScreen) based on the global state of the quiz.

Separate components/screens for each step. The project is highly modularized. The src/screens directory holds the top-level views for each part of the user flow, while src/components holds reusable UI elements like Question, ProgressBar, and Loader.

client/src/services/QuizService.js handles AI calls. This file is the dedicated API layer for the frontend. It makes fetch requests to our local Express backend. The backend then securely adds the API key and forwards the request to the Google Gemini API, ensuring the key is never exposed to the browser.

React Context is used for state management. The QuizContext.jsx file, combined with a useReducer hook, creates a central "store" for all quiz-related data (questions, user answers, score, loading/error states). This allows any component in the app to access or modify the state without passing props down through many levels.
