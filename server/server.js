import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const API_KEY = process.env.GEMINI_API_KEY;

// Initialize Gemini
const genAI = new GoogleGenerativeAI(API_KEY);

app.post("/api/generate", async (req, res) => {
  try {
    const { type, payload } = req.body;

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const generationConfig = { temperature: 0.9 };

    let prompt = "";

    if (type === "quiz") {
      const { topic } = payload;
      prompt = `You are a helpful quiz generator. Your task is to generate a new and unique set of 5 multiple-choice questions on the topic "${topic}".
      Return ONLY valid JSON array format:
      [
        {"question": "", "options": ["A","B","C","D"], "correctAnswer": ""}
      ]`;
    } else if (type === "feedback") {
      const { topic, score } = payload;
      prompt = `You are a friendly tutor. A student scored ${score}/5 on a quiz about "${topic}".
      Write a short, encouraging feedback paragraph.`;
    } else {
      return res.status(400).json({ error: "Invalid request type" });
    }

    const result = await model.generateContent(prompt, generationConfig);
    const text = result.response.text();

    if (type === "quiz") {
      const cleanText = text.replace(/```json|```/g, "").trim();
      const quizData = JSON.parse(cleanText);
      res.json(quizData);
    } else {
      res.json({ feedback: text });
    }
  } catch (error) {
    console.error("API Error:", error);
    res.status(500).json({ error: "Failed to generate content from Gemini API." });
  }
});

//Important: Export the app instead of listening (Vercel handles this)
export default app;
