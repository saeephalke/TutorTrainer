require('dotenv').config();
const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');

const app = express();
app.use(cors());
app.use(express.json());

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

//functions
function studentGeneratorPrompt({grade, subject}){
    return `You are to produce a JSON object describing a student who is being tutored in a specific subject at a specific grade level. 
    The student should have the following traits:
    - Grade Level: ${grade}
    - Subject being tutored in: ${subject}
    - Switch up the background of the student, they can be from any country, have any interests, and have any quirks, be any gender, have different educational backgrounds
    - The JSON object should have the following structure:
        {
            "name": "string",
            "grade": "string",
            "age": "number",
            "tutor_subject": "string",
            "quirks": "string",
        }
        RETURN ONLY the JSON object, no other text.`;
}

async function generateStudent(req, res) {
  try {
    const {grade, subject, seed} = req.body || {}; 
    const completion = await client.chat.completions.create({
        model: "gpt-4.1-mini",
        messages: [{
                role: 'user',
                content: studentGeneratorPrompt({grade, subject})
        }],
        response_format: { type: "json_object" },
        temperature: 1,
        seed: seed || undefined,
    });
    let student;

    try{
        student = JSON.parse(completion.choices[0].message.content);
    } catch {
        student = { system_prompt: completion.choices[0].message.content };
    }

    student.tutor_subject = student.tutor_subject || subject || "general";
    student.name = student.name || "Timmy";
    student.grade = student.grade || "5th Grade";
    return res.json(student);
    
  } catch (error) {
    console.error('Error generating student:', error);
    res.status(500).json({ error: 'Failed to generate student' });
    return;
  }
}

async function generateAIMessage(req, res) {
    const student = req.body.student || {};
    const history = Array.isArray(req.body.messages) ? req.body.messages : [];
    
    const prompt = `You are roleplaying as a student in a tutoring chat. Your job is to respond to the user as if they were your tutor. 
    You must act as the Persona, and do not act as if you are tutoring this person. YOU ASK FOR HELP, DO NOT OFFER HELP. YOU MUST STAY IN CHARACTER AS THE STUDENT (IMPORTANT).

            # Persona
            Name: ${student.name || "Sofia"}
            Age: ${student.age || "12"}
            Grade: ${student.grade || "7th Grade"}
            Subject: ${student.tutor_subject || "Art"}

            # Voice & Style
            - Warm, curious, a bit unsure at times; use contractions (“I’m”, “it’s”).
            - 1–3 sentences per reply, natural and specific; no lists unless the tutor asks.
            - Must talk like the given age and grade level, no complex words or phrases if they're not appropriate for the age.
            - Acknowledge the tutor’s last message directly; answer any question first.
            - Volunteer a small struggle or misconception each time (one concrete thing).
            - End with exactly one short follow-up question that moves the lesson forward.

            # Boundaries
            - Stay in character as the student (never say you’re an AI).
            - Do not invent complex facts; talk about your understanding and feelings.
            - No preambles like “As an AI…”; just reply as the student.
            - Do not offer help; ask for it if you need it.
            The most important context is the last message from the user, so always refer to that first.
            - Do not repeat the user’s last message; just respond to it directly.
            `.trim();

        const mappedHistory = history.map(m => {
            const role =
            m.sender === "assistant" || m.sender === "student"
                ? "assistant"
                : "user";
            return { role, content: m.message };
        });

        const messages = [
            { role: "system", content: prompt },
            ...mappedHistory
        ];
    
    try{
        const completion = await client.chat.completions.create({
                model: "gpt-4.1-mini",
                messages,
                max_tokens: 220,
                temperature: 0.8,           
                top_p: 0.95,
                presence_penalty: 0.3,      
                frequency_penalty: 0.2,     
                stop: ["\n\n\n"]           
        });
        return res.json({
            message: String(completion.choices[0].message.content).trim()
        });
    } catch (error) {
        console.error('Error generating AI message:', error);
        throw error;   
    }
}   

async function generateFeedback(req, res){
    const messages = Array.isArray(req.body.messages) ? req.body.messages : [];
    const prompt = `The given messages are a chat between a tutor and a student. The user is the tutor, and the assistant is the student.
    Your job is to analyze the chat and provide feedback on the tutor's performance. Giving them specific feedback on what they did well, and what they could improve on.
    Your feedback should be specific, constructive, and actionable.
    The feedback should be in the form of a string with no other text. 
    Here are the messages:
    ${messages.map(m => `${m.sender}: ${m.message}`).join("\n")}
    If the messages are not enough to generate feedback, return "Not enough information to generate feedback."`;

    const completion = await client.chat.completions.create({
        model: "gpt-4.1-mini",
        messages: [{
            role: "user",
            content: prompt
        }], 
        response_format: { type: "text" },
        temperature: 1,
        max_tokens: 500,
    });
    let feedback;

    try{
        feedback = String(completion.choices[0].message.content).trim();
    } catch {
        feedback = "Failed to generate feedback";
    }
    return res.json({
        message: feedback
    });
}


app.post('/generatestudent', generateStudent);

app.post('/generateaimessage', generateAIMessage);

app.post('/generatefeedback', generateFeedback);
//Endpoints for API
app.get('/', (req, res)=> res.json("hello"));

//on connect, send a listening message
app.listen(4000, ()=> {
    console.log("listening");
});

