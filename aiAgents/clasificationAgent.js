
require('dotenv').config(); // load .env variables
const { OpenAI } = require('openai');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});



async function classifyJournalEntry(journalEntry) {
    const prompt = `
            You are a mental health classification assistant. 
            Analyze this journal entry and estimate the probability (0-100%) for three mental health levels (Level 1: Mood/Emotional, Level 2: Behavioral/Personality, Level 3: Severe/Psychotic). 
            Do NOT reveal the level names. Return JSON in this format:
            {"OptionA": 0, "OptionB": 0, "OptionC": 0}

            Journal Entry: "${journalEntry}"
        `;

    try {
        const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            { role: "system", content: "You are an AI mental health assistant." },
            { role: "user", content: prompt }
        ],
        temperature: 0 // deterministic output
        });

        const message = response.choices[0].message.content;
        console.log(message);
        const probabilities = JSON.parse(message); // OptionA, OptionB, OptionC
        console.log(probabilities);
        return probabilities;

    } catch (err) {
        console.error("OpenAI API Error:", err);
        return null;
    }
}


async function getFollowUpQuestion(previousAnswers) {
  const prompt = `
        You are a mental health assistant. 
        Based on the user's previous responses: ${JSON.stringify(previousAnswers)}, 
        ask one follow-up question that will help improve classification accuracy.
        Return only the question as plain text.
    `;

    const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            { role: "system", content: "You are an AI mental health assistant." },
            { role: "user", content: prompt }
        ],
        temperature: 0.7
    });
    console.log(response.choices[0].message);
    console.log(response.choices[0].message.content.trim());

    return response.choices[0].message.content.trim();
}

module.exports = { classifyJournalEntry, getFollowUpQuestion };