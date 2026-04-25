const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const Groq = require("groq-sdk");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

// Root check
app.get("/", (req, res) => {
  res.send("Backend running 🚀");
});

// ✅ CHAT ONLY (clean)
app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a pediatric myopia assistant."
        },
        {
          role: "user",
          content: message
        }
      ],
      model: "llama3-70b-8192"
    });

    const reply = completion.choices[0].message.content;

    res.json({ reply });

  } catch (err) {
    console.error("LLM ERROR:", err);
    res.status(500).json({ error: "LLM failed" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});