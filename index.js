const express = require("express");
const cors = require("cors");
const multer = require("multer");
const dotenv = require("dotenv");
const { generateChatResponse } = require("./services/llm");
const { getPatientData } = require("./services/memory");

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Mock in-memory chat history per session
const sessions = {};

// Setup multer for file upload
const upload = multer({ storage: multer.memoryStorage() });

app.post("/api/chat", async (req, res) => {
  try {
    const { message, sessionId } = req.body;
    
    if (!sessionId) {
      return res.status(400).json({ error: "sessionId is required" });
    }

    if (!sessions[sessionId]) {
      sessions[sessionId] = [];
    }

    // Add user message
    sessions[sessionId].push({ role: "user", content: message });

    // Call LLM
    const assistantMessage = await generateChatResponse(sessions[sessionId]);

    // Add assistant response to history
    sessions[sessionId].push({ role: "assistant", content: assistantMessage });

    res.json({ reply: assistantMessage });
  } catch (error) {
    console.error("Error in /api/chat:", error);
    res.status(500).json({ error: "Failed to generate response" });
  }
});

app.post("/api/upload", upload.single("file"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Simulate OCR delay
    setTimeout(() => {
      const mockOcrResult = {
        "right_eye": "-2.75 D",
        "left_eye": "-2.50 D",
        "axis": "180",
        "note": "Progressive myopia"
      };
      res.json({ 
        message: "File processed successfully", 
        data: mockOcrResult,
        fileName: req.file.originalname 
      });
    }, 1500);
  } catch (error) {
    console.error("Error in /api/upload:", error);
    res.status(500).json({ error: "Failed to process file" });
  }
});

app.get("/api/patient", (req, res) => {
  res.json(getPatientData());
});

app.get("/api/history/:sessionId", (req, res) => {
  const { sessionId } = req.params;
  res.json(sessions[sessionId] || []);
});

app.listen(port, () => {
  console.log(`Backend server running on http://localhost:${port}`);
});
