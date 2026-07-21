import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Lazy initialize GoogleGenAI client to prevent startup crashes if GEMINI_API_KEY is missing
let aiInstance: GoogleGenAI | null = null;
function getGemini() {
  if (!aiInstance) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY is not set. Please add it in the Secrets panel in AI Studio Settings.");
    }
    aiInstance = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiInstance;
}

// Ensure the server has a basic health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// AI Chat Endpoint
app.post("/api/gemini/chat", async (req, res) => {
  try {
    const { messages, systemInstruction } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "messages array is required" });
    }

    const ai = getGemini();

    // Reconstruct conversation content
    // The @google/genai chat API or direct generateContent
    // Let's use direct generateContent with standard systemInstruction and previous messages
    const formattedContents = messages.map((msg: any) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    }));

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: formattedContents,
      config: {
        systemInstruction: systemInstruction || "You are AlphaThink AI, an intelligent, helpful platform assistant for students, researchers, and professionals.",
        temperature: 0.7,
      },
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Error in /api/gemini/chat:", error);
    res.status(500).json({ error: error.message || "An error occurred with the Gemini API" });
  }
});

// Text Summarizer Endpoint
app.post("/api/gemini/summarize", async (req, res) => {
  try {
    const { text, format, targetLength } = req.body;
    if (!text) {
      return res.status(400).json({ error: "Text is required" });
    }

    const ai = getGemini();
    const prompt = `Please summarize the following text.
Format preference: ${format || "bullet points"}
Target length: ${targetLength || "medium"}

Text to summarize:
${text}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are an expert technical summarizer. Extract key concepts, critical arguments, and action items clearly. Avoid fluff.",
        temperature: 0.3,
      },
    });

    res.json({ summary: response.text });
  } catch (error: any) {
    console.error("Error in /api/gemini/summarize:", error);
    res.status(500).json({ error: error.message || "An error occurred during summarization" });
  }
});

// Code Generator Endpoint
app.post("/api/gemini/generate-code", async (req, res) => {
  try {
    const { prompt, language, context } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const ai = getGemini();
    const finalPrompt = `Generate clean, documented, and production-ready code in ${language || "TypeScript/JavaScript"} based on this request:
"${prompt}"

${context ? `Additional context: ${context}` : ""}

Return the code and a brief explanation. Use standard markdown code blocks.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: finalPrompt,
      config: {
        systemInstruction: "You are a Senior Software Engineer. Generate highly optimized, clean, safe, and well-commented code. Always follow best practices.",
        temperature: 0.4,
      },
    });

    res.json({ result: response.text });
  } catch (error: any) {
    console.error("Error in /api/gemini/generate-code:", error);
    res.status(500).json({ error: error.message || "An error occurred during code generation" });
  }
});

// Resume Analyzer Endpoint
app.post("/api/gemini/analyze-resume", async (req, res) => {
  try {
    const { resumeText, targetRole } = req.body;
    if (!resumeText) {
      return res.status(400).json({ error: "Resume text is required" });
    }

    const ai = getGemini();
    const prompt = `Analyze the following resume details ${targetRole ? `for the target role: "${targetRole}"` : "for general engineering, product, and developer roles"}.

Resume details:
${resumeText}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are an expert ATS (Applicant Tracking System) optimizer and professional recruiter. Analyze the resume text and return a detailed response in JSON format.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["atsScore", "feedback", "strengths", "improvements", "keywordsMatched", "keywordsMissing", "suggestedRoles"],
          properties: {
            atsScore: {
              type: Type.INTEGER,
              description: "ATS compatibility score from 0 to 100",
            },
            feedback: {
              type: Type.STRING,
              description: "General summary and feedback of the resume",
            },
            strengths: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Key strengths found in the resume",
            },
            improvements: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Actionable points for improvement",
            },
            keywordsMatched: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Important industry keywords present",
            },
            keywordsMissing: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Important industry keywords missing or weak",
            },
            suggestedRoles: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Suitable job roles based on skills shown",
            },
          },
        },
      },
    });

    const resultObj = JSON.parse(response.text || "{}");
    res.json(resultObj);
  } catch (error: any) {
    console.error("Error in /api/gemini/analyze-resume:", error);
    res.status(500).json({ error: error.message || "An error occurred during resume analysis" });
  }
});

// Interview Preparation Endpoint
app.post("/api/gemini/interview-prep", async (req, res) => {
  try {
    const { role, stage, answerHistory } = req.body;
    if (!role) {
      return res.status(400).json({ error: "Role is required" });
    }

    const ai = getGemini();
    const prompt = `Role: ${role}
Stage/Level: ${stage || "mid-level"}
${answerHistory && answerHistory.length > 0 ? `Conversation history so far:\n${JSON.stringify(answerHistory)}` : "No history. This is the first question."}

Generate the next highly realistic interview question (or provide feedback on the user's response if they just answered a question).`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are an elite Tech Interviewer at a top tier company (Google, Netflix). Conduct a mock interview. If the user answered a question, provide professional constructive feedback (scores out of 10, strengths, ways to improve) and then ask the NEXT logical interview question. If starting, greet them and ask a highly relevant technical/situational question.",
        temperature: 0.7,
      },
    });

    res.json({ response: response.text });
  } catch (error: any) {
    console.error("Error in /api/gemini/interview-prep:", error);
    res.status(500).json({ error: error.message || "An error occurred during interview preparation" });
  }
});

// AI Recommendation Engine Endpoint (Gamified quiz or learning path generator)
app.post("/api/gemini/recommend", async (req, res) => {
  try {
    const { skills, interests, careerGoal } = req.body;
    if (!skills || !interests) {
      return res.status(400).json({ error: "Skills and interests are required" });
    }

    const ai = getGemini();
    const prompt = `Create a customized step-by-step learning path, recommended projects, and career guidance based on this user profile:
- Skills: ${skills}
- Interests: ${interests}
- Career Goal: ${careerGoal || "Software/AI Engineer"}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are a professional Career Advisor and Learning Path Architect. Generate structured recommendations including key topics to study, custom hands-on project ideas, and career action items.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["learningPath", "projects", "careerAdvice"],
          properties: {
            learningPath: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                required: ["phase", "topic", "duration", "resources"],
                properties: {
                  phase: { type: Type.STRING },
                  topic: { type: Type.STRING },
                  duration: { type: Type.STRING },
                  resources: { type: Type.ARRAY, items: { type: Type.STRING } },
                },
              },
            },
            projects: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                required: ["title", "description", "difficulty", "techStack"],
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  difficulty: { type: Type.STRING },
                  techStack: { type: Type.ARRAY, items: { type: Type.STRING } },
                },
              },
            },
            careerAdvice: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
        },
      },
    });

    const resultObj = JSON.parse(response.text || "{}");
    res.json(resultObj);
  } catch (error: any) {
    console.error("Error in /api/gemini/recommend:", error);
    res.status(500).json({ error: error.message || "An error occurred with the Recommendation Engine" });
  }
});

// Setup Vite Dev Middleware / Static Build Routing
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[AlphaThink Server] Running on http://localhost:${PORT} in ${process.env.NODE_ENV || "development"} mode`);
  });
}

startServer();
