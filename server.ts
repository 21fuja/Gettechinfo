import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini client (Lazy initialization to prevent crashes if key is missing during startup)
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is required to generate custom AI lessons.");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// API endpoint to generate custom AI lesson animations
app.post("/api/generate-lesson", async (req, res) => {
  try {
    const { topic } = req.body;
    if (!topic || typeof topic !== "string" || topic.trim().length === 0) {
      return res.status(400).json({ error: "Topic is required and must be a string." });
    }

    const ai = getGeminiClient();

    const systemPrompt = `You are an expert AI professor and educational content animator.
Your goal is to create a highly informative, step-by-step animated slideshow video script teaching students about a specific AI concept: "${topic}".
Generate exactly 4 slides that explain this concept progressively, from core definition to how it works, use cases, and challenges/implications.
Each slide must specify a friendly narrator script (for Voice Synthesis) and a suitable visual simulation type.`;

    const responseSchema = {
      type: Type.OBJECT,
      properties: {
        topic: { type: Type.STRING },
        overview: { type: Type.STRING },
        slides: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              script: {
                type: Type.STRING,
                description: "Spoken narration for this slide (1-2 sentences). Speak in a clear, friendly, and engaging teacher's voice. Explain the concept simply so students can grasp it immediately."
              },
              content: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "2 to 3 concise bullets summarizing the key lesson points on the slide."
              },
              visualType: {
                type: Type.STRING,
                description: "The visualization component that best animates this slide. Must be exactly one of: 'neural_network', 'graph_plot', 'block_diagram', 'grid_scanner', 'comparison_matrix'"
              },
              visualConfig: {
                type: Type.OBJECT,
                description: "Custom configuration for this visual module. For 'neural_network': { layers: [number, number, number], animateWeights: true }. For 'graph_plot': { title: string, xAxis: string, yAxis: string, curve: 'downward' | 'upward' | 'wave' | 'scatter' }. For 'block_diagram': { blocks: [string], highlightIndex: number }. For 'grid_scanner': { label: string, size: number }. For 'comparison_matrix': { headers: [string], rows: [[string]] }.",
                properties: {
                  layers: { type: Type.ARRAY, items: { type: Type.INTEGER } },
                  animateWeights: { type: Type.BOOLEAN },
                  title: { type: Type.STRING },
                  xAxis: { type: Type.STRING },
                  yAxis: { type: Type.STRING },
                  curve: { type: Type.STRING },
                  blocks: { type: Type.ARRAY, items: { type: Type.STRING } },
                  highlightIndex: { type: Type.INTEGER },
                  label: { type: Type.STRING },
                  size: { type: Type.INTEGER },
                  headers: { type: Type.ARRAY, items: { type: Type.STRING } },
                  rows: { type: Type.ARRAY, items: { type: Type.ARRAY, items: { type: Type.STRING } } }
                }
              }
            },
            required: ["title", "script", "content", "visualType", "visualConfig"]
          }
        }
      },
      required: ["topic", "overview", "slides"]
    };

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Create an animated visual lesson script with 4 slides on the AI concept: "${topic}".`,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response content from Gemini API.");
    }

    const lessonData = JSON.parse(text);
    res.json(lessonData);
  } catch (error: any) {
    console.error("Gemini lesson generation error:", error);
    res.status(500).json({
      error: error.message || "Failed to generate AI lesson animation data.",
    });
  }
});

// Setup Vite dev server or serve static production build files
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
    console.log(`Server running on http://0.0.0.0:${PORT} (Production: ${process.env.NODE_ENV === "production"})`);
  });
}

startServer();
