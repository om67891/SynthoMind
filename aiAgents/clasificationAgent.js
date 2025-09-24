require('dotenv').config(); // load .env variables
const { GoogleGenerativeAI } = require("@google/generative-ai");
const {options} = require('../database/myLevels.js');
// Load API key from environment variable
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Pick a model (flash = cheaper/faster, pro = higher quality)
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });


async function classifyJournalEntry(journalEntry) {
  const prompt = `
    You are a mental health classification assistant.

    Here are the classification categories:
    OptionA: ${options.Level_1}
    OptionB: ${options.Level_2}
    OptionC: ${options.Level_3}

    Task:
    - Analyze the following journal entry.
    - Estimate the probability (0-100%) for each option.
    - Do NOT reveal option names or category details to the user.
    - Return ONLY valid JSON with no code block formatting in this format:
      {"OptionA": 0, "OptionB": 0, "OptionC": 0}

    Journal Entry: "${journalEntry}"
  `;

  try {
    const result = await model.generateContent(prompt);
    let message = result.response.text().trim();

    // 🧹 Strip markdown if Gemini adds ```json ... ```
    message = message.replace(/```json\s*/i, "").replace(/```/g, "").trim();

    console.log("Raw response:", message);

    const probabilities = JSON.parse(message);
    return probabilities;
  } catch (err) {
    console.error("Gemini API Error:", err);
    return null;
  }
}

async function getFollowUpQuestion(previousAnswers) {
  const prompt = `
    You are a mental health assistant.
    Based on the user's previous responses: ${JSON.stringify(previousAnswers)},
    ask ONE follow-up question that will help improve classification accuracy.
    Return only the question as plain text.
  `;

  try {
    const result = await model.generateContent(prompt);
    const question = result.response.text().trim();

    console.log(question);
    return question;
  } catch (err) {
    console.error("Gemini API Error:", err);
    return null;
  }
}

module.exports = { classifyJournalEntry, getFollowUpQuestion };
