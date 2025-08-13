const OpenAI = require('openai');
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const MODEL = process.env.MODEL || "gpt-3.5-turbo";

function studentGeneratorPrompt({grade, subject}){
    return `You are to produce a JSON object describing a student who is being tutored in a specific subject at a specific grade level. 
    The student should have the following traits:
    - Grade Level: ${grade}
    - Subject being tutored in: ${subject}
    - System Prompt: one string usable as a system message. Include all relevant information about the student in the JSON object.
    - Include the student's age, interests, and any specific challenges they face in this subject, as well as their learning style.
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
        `;
}


export async function generateStudent(req, res) {
  try {
    const {grade, subject, seed} = req.body || {}; 
    const completion = await client.chat.completions.create({
        model: MODEL,
        messages: [{
                role: 'user',
                content: studentGeneratorPrompt({grade, subject})
        }],
        temperature: 1,
        seed: seed || undefined,
    });

    let persona;

    try{
        persona = JSON.parse(completion.choices[0].message.content);
    } catch {
        persona = { system_prompt: completion.choices[0].message.content };
    }

    if(!persona || !persona.system_prompt) {
      res.status(400).json({ error: 'Invalid response from AI' });
      return;
    }

    persona.subject = persona.tutor_subject || subject || "general";
    res.json(persona);
    
  } catch (error) {
    console.error('Error generating student:', error);
    res.status(500).json({ error: 'Failed to generate student' });
    return;
  }
}
