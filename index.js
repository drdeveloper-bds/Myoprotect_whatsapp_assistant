const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// ✅ Root check
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// ✅ Chat API
app.post("/api/chat", async (req, res) => {
  try {
    const { message, sessionId } = req.body;

    console.log("Incoming:", message, sessionId);

    if (!sessionId) {
      return res.status(400).json({ error: "sessionId required" });
    }

    // Simple test response (no Groq yet)
    const reply = `You said: ${message}`;

    res.json({ reply });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});