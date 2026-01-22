import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post("/api/generate", async (req, res) => {
  try {
    const { type, payload } = req.body;

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    let prompt = "";

    if (type === "quiz") {
      prompt = `Generate 5 MCQs on "${payload.topic}".
Return ONLY valid JSON:
[
  {"question":"","options":["A","B","C","D"],"correctAnswer":""}
]`;
    } else if (type === "feedback") {
      prompt = `Student scored ${payload.score}/5 on "${payload.topic}". Give encouraging feedback.`;
    } else {
      return res.status(400).json({ error: "Invalid request type" });
    }

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    if (type === "quiz") {
      const clean = text.replace(/```json|```/g, "").trim();
      return res.json(JSON.parse(clean));
    }

    return res.json({ feedback: text });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to generate content" });
  }
});

export default app;
