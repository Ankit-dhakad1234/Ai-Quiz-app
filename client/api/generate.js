import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { type, payload } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: "API key not configured" });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    let prompt = "";

    if (type === "quiz") {
      prompt = `Generate 5 multiple-choice questions on "${payload.topic}".
Return ONLY valid JSON:
[
  {"question":"","options":["A","B","C","D"],"correctAnswer":""}
]`;
    } else if (type === "feedback") {
      prompt = `A student scored ${payload.score}/5 on "${payload.topic}".
Write a short encouraging feedback.`;
    } else {
      return res.status(400).json({ error: "Invalid request type" });
    }

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    if (type === "quiz") {
      const clean = text.replace(/```json|```/g, "").trim();
      return res.status(200).json(JSON.parse(clean));
    }

    return res.status(200).json({ feedback: text });
  } catch (err) {
    console.error("API error:", err);
    return res.status(500).json({ error: "Failed to generate content" });
  }
}
