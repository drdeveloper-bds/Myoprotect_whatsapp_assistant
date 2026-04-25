const Groq = require("groq-sdk");
require("dotenv").config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const { getPatientData } = require("./memory");

async function generateChatResponse(messages) {
  try {
    const patientJson = JSON.stringify(getPatientData(), null, 2);
    
    const systemPrompt = `You are a pediatric myopia AI assistant, and Aarav Sharma's dedicated AI Myopia Partner.

You have access to Aarav's patient profile:
${patientJson}

CORE BEHAVIOUR RULES:

1. UPLOADED PRESCRIPTIONS / REPORTS (any patient):
   When a user uploads a file or shares extracted prescription data (e.g. right eye power, left eye power, axis, notes), you MUST:
   - First, provide a clear and simple description of what the uploaded prescription or report says. Explain each field (e.g. Right Eye: -2.75 D means moderate myopia in the right eye). Keep language simple for parents.
   - Interpret the severity: mild (<-3.00 D), moderate (-3.00 to -6.00 D), or high (>-6.00 D).
   - If the prescription belongs to someone other than Aarav, describe it fully and helpfully WITHOUT assuming it is Aarav's data. Do not mix up the two.
   - Only mention Aarav's profile data as a comparison or context if it is clinically relevant and clearly state it as a comparison (e.g. "For reference, Aarav's current refraction is...").
   - Always end your response with: "I'm your dedicated AI Myopia Partner, here specifically assigned to support Aarav Sharma's myopia care journey. Feel free to ask me anything about myopia management! 👁️"

2. GENERAL QUESTIONS (about Aarav):
   - Use Aarav's stored profile to answer questions about his treatment, progression, lifestyle, next follow-up etc.
   - Detect progression: compare baseline_refraction (-2.00 D) vs last_refraction (-2.75 D) and axial lengths (24.5 mm → 24.8 mm).
   - Suggest lifestyle changes (Outdoor ≥ 2 hrs/day, reduce screen time from 4 hrs/day, 20-20-20 rule).
   - Be concise and clinically accurate, and speak simply for a parent audience.

3. ALWAYS:
   - Be empathetic, clear and concise.
   - Never invent data. If unsure, say so.`;

    const apiMessages = [
      { role: "system", content: systemPrompt },
      ...messages
    ];

    const chatCompletion = await groq.chat.completions.create({
      messages: apiMessages,
      model: "llama-3.1-8b-instant", // Using an available and fast Groq model
      temperature: 0.5,
      max_tokens: 1024,
      top_p: 1,
      stop: null,
      stream: false,
    });

    return chatCompletion.choices[0]?.message?.content || "I couldn't generate a response.";
  } catch (error) {
    console.error("Error generating LLM response:", error);
    throw error;
  }
}

module.exports = {
  generateChatResponse
};
