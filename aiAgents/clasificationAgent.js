require('dotenv').config(); // load .env variables
const { GoogleGenerativeAI } = require("@google/generative-ai");
// const {options} = require('../database/myLevels.js');
// Load API key from environment variable
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Pick a model (flash = cheaper/faster, pro = higher quality)
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });



// Options dictionary
const options = {
  Level_1: `Common Emotional & Mood Disorders
    Depression (MDD): Persistent sadness, fatigue, and loss of interest in daily life. Can severely impact motivation and emotional well-being.
    Bipolar Disorder: Extreme mood shifts between mania (high energy) and depression (low mood). Disrupts stability in work, sleep, and relationships.
    Anxiety Disorders: Excessive worry, panic, or fear across different situations. Includes generalized anxiety, phobias, and social anxiety.
    Stress Disorders (PTSD/ASD): Intense stress response after trauma. Symptoms include flashbacks, avoidance, and heightened arousal.`,
  
  Level_2: `Behavioral & Personality-Related Disorders
    Obsessive-Compulsive Disorder (OCD): Recurrent intrusive thoughts and repetitive behaviors. Often interferes with daily routines and peace of mind.
    Eating Disorders: Distorted relationship with food and body image. Can lead to dangerous weight changes and serious health issues.
    Personality Disorders: Rigid, unhealthy patterns of thinking and behavior. Affects identity, emotions, and relationships.
    ADHD: Difficulty focusing, controlling impulses, and sitting still. Affects performance in school, work, and social life.
    Impulse Control Disorders: Inability to resist harmful urges (e.g., stealing, aggression). Leads to regret and social/financial problems.
    Sleep-Wake Disorders: Trouble with sleep patterns (insomnia, narcolepsy, etc.). Impacts energy, concentration, and health.`,
  
  Level_3: `Severe Cognitive & Psychotic Disorders
    Schizophrenia & Schizoaffective Disorder: Distorted reality with hallucinations, delusions, and disorganized thought. Severely impairs functioning and independence.
    Delusional Disorder: Persistent false beliefs not grounded in reality. May seem convincing but resist correction despite evidence.
    Dementia (Alzheimer’s, etc.): Progressive memory loss and cognitive decline. Interferes with daily living and independence.
    Substance Use Disorders: Compulsive use of drugs or alcohol despite harm. Damages physical health, relationships, and work life.
    Neurocognitive Disorders (TBI, Parkinson’s, etc.): Decline in thinking, memory, and decision-making. Linked to brain injury or neurodegenerative diseases.`
};


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
