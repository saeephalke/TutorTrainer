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
    - System Prompt: one string usable as a system message. Include all relevant information about the student in the JSON object.
    - Include the student's age, interests, as well as their learning style.
    - The JSON object should have the following structure:
        {
            "name": "string",
            "grade": "string",
            "age": "number",
            "tutor_subject": "string",
            "quirks": "string",
            "learning_style": "string"
            "system_prompt": "string"
        }
        RETURN ONLY the JSON object, no other text.`;
}

async function generateStudent(req, res) {
  try {
    const {grade, subject, seed} = req.body || {}; 
    const completion = await client.chat.completions.create({
        model: "gpt-3.5-turbo",
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

    if(!student || !student.system_prompt) {
      res.status(400).json({ error: 'Invalid response from AI' });
      return;
    }

    student.subject = student.tutor_subject || subject || "general";
    student.name = student.name || "Timmy";
    student.grade = student.grade || "5th Grade";
    return res.json(persona);
    
  } catch (error) {
    console.error('Error generating student:', error);
    res.status(500).json({ error: 'Failed to generate student' });
    return;
  }
}

app.post('/generatestudent', generateStudent);

//Endpoints for API
app.get('/', (req, res)=> res.json("hello"));

//on connect, send a listening message
app.listen(4000, ()=> {
    console.log("listening");
});
